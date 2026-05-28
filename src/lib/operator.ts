import 'server-only'

import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/session'
import { accessAdmin, AccessApiError, type AccessUser } from '@/lib/access-admin'
import { db } from '@/lib/db/index'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Require that the current session user has the `operator` role in
 * przm-access. Non-operators are redirected to /app/dashboard.
 *
 * Uses the `accessUserId` bridge field on the local user row to look
 * up the real role from przm-access — NOT a hardcoded email check.
 *
 * Returns `{ user, accessUser }` for operator sessions.
 */
export async function requireOperator(): Promise<{
  user: Awaited<ReturnType<typeof requireUser>>['user']
  accessUser: AccessUser
}> {
  const { user } = await requireUser()

  // Resolve accessUserId from the local DB.
  const rows = await db
    .select({ accessUserId: userTable.accessUserId })
    .from(userTable)
    .where(eq(userTable.id, user.id))
    .limit(1)

  const accessUserId = rows[0]?.accessUserId
  if (!accessUserId) {
    redirect('/app/dashboard')
  }

  // Fetch the przm-access user to read the authoritative role.
  let accessUser: AccessUser
  try {
    accessUser = await accessAdmin.users.get(accessUserId)
  } catch (err) {
    if (err instanceof AccessApiError) {
      redirect('/app/dashboard')
    }
    throw err
  }

  if (accessUser.role !== 'operator') {
    redirect('/app/dashboard')
  }

  return { user, accessUser }
}
