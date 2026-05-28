import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

/**
 * Read the active session on the server. Returns `null` for anonymous
 * requests. Hits better-auth's cookie cache when warm (5 min default),
 * falls back to a DB lookup otherwise.
 */
export async function getCurrentSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

/**
 * Require an authenticated session or redirect to /auth/login. Use at
 * the top of any Server Component or Server Action that needs a user.
 * Returns `{ user, session }` once past the gate.
 */
export async function requireUser() {
  const session = await getCurrentSession()
  if (!session?.user) {
    redirect('/auth/login')
  }
  return { user: session.user, session: session.session }
}
