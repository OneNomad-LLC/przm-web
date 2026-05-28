import 'server-only'

import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/session'

/**
 * Require that the current session user has the better-auth admin role.
 * Non-admins are redirected to /app/dashboard.
 *
 * The role lives on the better-auth user table (via the admin plugin).
 * Set it by SQL: UPDATE "user" SET role='admin' WHERE email='…'.
 * Sign-up never grants admin — defaultRole='user' in auth.ts.
 */
export async function requireOperator(): Promise<{
  user: Awaited<ReturnType<typeof requireUser>>['user']
}> {
  const { user } = await requireUser()

  // The admin plugin augments the User type with `role`. Cast covers
  // the case where the better-auth type inference doesn't pick it up
  // through the plugin re-export — the column is real, defined in
  // src/lib/db/schema.ts user.role.
  const role = (user as { role?: string | null }).role
  if (role !== 'admin') {
    redirect('/app/dashboard')
  }

  return { user }
}
