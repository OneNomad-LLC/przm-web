/**
 * Route protection middleware.
 *
 * Two concerns:
 *
 * 1. HTTP Basic Auth for /admin/* and /api/admin/* routes.
 *    Username is fixed at "admin"; password comes from ADMIN_PASSWORD.
 *    No sessions — browser stores the cred for the tab lifetime.
 *
 * 2. Session gate for /app/* routes (the authenticated customer shell).
 *    Reads the better-auth session cookie WITHOUT a DB round-trip using
 *    getSessionCookie (reads the signed cookie payload, no query).
 *    Redirects unauthenticated requests to /auth/login, preserving the
 *    intended destination in a `next` query param.
 *
 * Public routes: /, /auth/*, /api/auth/*, /leaderboard, /blog, /verify,
 * /methodology, /vendor-cert, /receipts, etc. No gate needed.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export const config = {
  matcher: [
    // Match everything except Next internals and static assets.
    '/((?!_next/static|_next/image|favicon\\.svg|favicon\\.ico|.*\\.png$|.*\\.svg$|.*\\.pub$).*)',
  ],
}

const REALM = 'przm admin'
const ADMIN_USERNAME = 'admin'

function basicChallenge(): Response {
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

function checkBasicAuth(request: NextRequest): Response | null {
  const expected = process.env['ADMIN_PASSWORD']
  if (!expected) {
    return new Response('Admin not configured', { status: 503 })
  }
  const authHeader = request.headers.get('authorization') ?? ''
  if (!authHeader.toLowerCase().startsWith('basic ')) {
    return basicChallenge()
  }
  const credPart = authHeader.slice(6).trim()
  let decoded: string
  try {
    decoded = atob(credPart)
  } catch {
    return basicChallenge()
  }
  const idx = decoded.indexOf(':')
  if (idx === -1) return basicChallenge()
  const username = decoded.slice(0, idx)
  const password = decoded.slice(idx + 1)
  if (!constantTimeEquals(username, ADMIN_USERNAME) || !constantTimeEquals(password, expected)) {
    return basicChallenge()
  }
  return null // auth OK
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Admin basic auth ───────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authResponse = checkBasicAuth(request)
    if (authResponse) return authResponse
    return NextResponse.next()
  }

  // ── 2. App session gate ───────────────────────────────────────────
  if (pathname.startsWith('/app')) {
    // Cookie-only check — no DB round-trip. The cookie prefix 'przm'
    // must match the cookiePrefix in src/lib/auth.ts.
    const sessionCookie = getSessionCookie(request, { cookiePrefix: 'przm' })
    if (!sessionCookie) {
      const loginUrl = new URL('/auth/login', request.url)
      // Preserve the intended destination so the login page can redirect
      // back after authentication.
      loginUrl.searchParams.set('next', pathname + request.nextUrl.search)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}
