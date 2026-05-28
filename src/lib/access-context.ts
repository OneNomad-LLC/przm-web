/**
 * Server-side helper: resolve the przm-access org and primary tenant
 * for the signed-in user.
 *
 * SERVER-SIDE ONLY — imports 'server-only' and the DB.
 *
 * Why: better-auth's session object only carries standard fields (id,
 * email, name). The bridge fields `accessOrgId` and `accessUserId` live
 * on the Drizzle `user` table and must be fetched from Postgres.
 *
 * Usage:
 *   const ctx = await getAccessContext(session.user.id)
 *   if (!ctx) { /* user not provisioned yet *\/ }
 *   const { orgId, tenantId } = ctx
 */

import 'server-only'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/index'
import { user as userTable } from '@/lib/db/schema'
import { accessAdmin, AccessApiError } from '@/lib/access-admin'

export interface AccessContext {
  orgId: string
  /** Primary cloud tenant ID (first entry in org.tenants.cloud). */
  tenantId: string
  accessUserId: string
  seatCount: number | null
}

/**
 * Load org + tenant context for a user. Returns `null` when:
 *   - user doesn't exist in the DB (shouldn't happen in practice)
 *   - user has no `accessOrgId` (not yet provisioned into przm-access)
 *   - the PRZM_ACCESS_* env vars are not configured
 *   - the org has no cloud tenants
 */
export async function getAccessContext(
  webUserId: string,
): Promise<AccessContext | null> {
  // 1. Load the bridge fields from the local DB.
  const rows = await db
    .select({
      accessOrgId: userTable.accessOrgId,
      accessUserId: userTable.accessUserId,
    })
    .from(userTable)
    .where(eq(userTable.id, webUserId))
    .limit(1)

  const row = rows[0]
  if (!row?.accessOrgId || !row?.accessUserId) return null

  const orgId = row.accessOrgId
  const accessUserId = row.accessUserId

  // 2. Fetch the org + tenants from przm-access.
  let org: Awaited<ReturnType<typeof accessAdmin.orgs.get>>
  try {
    org = await accessAdmin.orgs.get(orgId)
  } catch (err) {
    // Surface env-config issues as null rather than crashing the page.
    if (err instanceof AccessApiError || err instanceof Error) {
      console.warn('[access-context] org fetch failed:', err.message)
    }
    return null
  }

  const primaryTenant = org.tenants.cloud[0]
  if (!primaryTenant) return null

  return {
    orgId,
    tenantId: primaryTenant.id,
    accessUserId,
    seatCount: org.seatCount,
  }
}
