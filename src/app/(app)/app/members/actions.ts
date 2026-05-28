'use server'

import { revalidatePath } from 'next/cache'
import { accessAdmin, AccessApiError } from '@/lib/access-admin'
import { getAccessContext } from '@/lib/access-context'
import { requireUser } from '@/lib/session'

const VALID_ROLES = new Set(['viewer', 'editor', 'admin', 'owner'])

function validateRole(role: unknown): string {
  if (typeof role !== 'string' || !VALID_ROLES.has(role)) {
    throw new Error('Invalid role')
  }
  return role
}

/**
 * Invite a member to the org's primary tenant by email.
 * Returns an error string on failure, null on success.
 */
export async function inviteMember(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const { user } = await requireUser()
  const ctx = await getAccessContext(user.id)
  if (!ctx) return 'Your account is not linked to an organization.'

  const email = formData.get('email')
  const role = formData.get('role')

  if (typeof email !== 'string' || !email.includes('@'))
    return 'A valid email is required.'

  let validRole: string
  try {
    validRole = validateRole(role)
  } catch {
    return 'Invalid role selection.'
  }

  try {
    await accessAdmin.members.add(ctx.tenantId, { email, role: validRole })
  } catch (err) {
    if (err instanceof AccessApiError) {
      if (err.status === 404) return 'No przm account found for that email. Ask them to sign up at przm.sh/auth/signup first.'
      if (err.status === 409) return 'This user is already a member.'
      return `Failed to add member: ${err.body}`
    }
    return err instanceof Error ? err.message : 'Unknown error'
  }

  revalidatePath('/app/members')
  return null
}

/**
 * Update a member's role.
 */
export async function setMemberRole(
  tenantId: string,
  userId: string,
  role: string,
): Promise<{ error?: string }> {
  await requireUser()
  try {
    validateRole(role)
    await accessAdmin.members.setRole(tenantId, userId, role)
  } catch (err) {
    return {
      error:
        err instanceof AccessApiError
          ? `API error ${err.status}: ${err.body}`
          : err instanceof Error
            ? err.message
            : 'Unknown error',
    }
  }
  revalidatePath('/app/members')
  return {}
}

/**
 * Toggle active-seat status for a member.
 */
export async function toggleSeat(
  orgId: string,
  accessUserId: string,
  active: boolean,
): Promise<{ error?: string }> {
  await requireUser()
  try {
    await accessAdmin.orgs.setSeatActive(orgId, accessUserId, active)
  } catch (err) {
    if (err instanceof AccessApiError && err.status === 429)
      return { error: 'Seat flip rate-limited. Try again later.' }
    return {
      error:
        err instanceof AccessApiError
          ? `API error ${err.status}: ${err.body}`
          : err instanceof Error
            ? err.message
            : 'Unknown error',
    }
  }
  revalidatePath('/app/members')
  return {}
}
