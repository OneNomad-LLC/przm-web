/**
 * HTTP Basic Auth for /admin/* routes.
 *
 * One user (Matt). Password comes from ADMIN_PASSWORD env var.
 * No DB lookup, no sessions — the browser stores the cred for the
 * session after the first prompt.
 *
 * Username is fixed at "admin"; only the password matters. If we
 * ever add a second admin, swap this for proper auth.
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

const REALM = 'przm admin'
const USERNAME = 'admin'

function challenge(): Response {
  return new Response('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
  })
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export function middleware(request: NextRequest) {
  const expected = process.env['ADMIN_PASSWORD']
  if (!expected) {
    // Fail closed if the password env isn't configured — better to
    // 503 than to expose the inbox accidentally.
    return new Response('Admin not configured', { status: 503 })
  }

  const auth = request.headers.get('authorization') ?? ''
  if (!auth.toLowerCase().startsWith('basic ')) {
    return challenge()
  }
  const credPart = auth.slice(6).trim()
  let decoded: string
  try {
    decoded = atob(credPart)
  } catch {
    return challenge()
  }
  const idx = decoded.indexOf(':')
  if (idx === -1) return challenge()
  const user = decoded.slice(0, idx)
  const pass = decoded.slice(idx + 1)

  if (!constantTimeEquals(user, USERNAME) || !constantTimeEquals(pass, expected)) {
    return challenge()
  }

  return NextResponse.next()
}
