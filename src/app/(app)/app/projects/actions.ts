'use server'

import { revalidatePath } from 'next/cache'
import { accessAdmin, AccessApiError } from '@/lib/access-admin'
import { getAccessContext } from '@/lib/access-context'
import { requireUser } from '@/lib/session'

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^[a-z0-9]$/

/**
 * Create a project in the user's primary tenant.
 * Returns an error string on failure, null on success.
 */
export async function createProject(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const { user } = await requireUser()
  const ctx = await getAccessContext(user.id)
  if (!ctx) return 'Your account is not linked to an organization.'

  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const slug = (formData.get('slug') as string | null)?.trim() ?? ''

  if (!name) return 'Project name is required.'
  if (!slug || !SLUG_RE.test(slug)) {
    return 'Slug must be lowercase alphanumeric with hyphens (e.g. my-project).'
  }

  try {
    await accessAdmin.projects.create(ctx.tenantId, { name, slug })
  } catch (err) {
    if (err instanceof AccessApiError) {
      if (err.status === 409) return 'A project with that slug already exists.'
      return `Failed to create project: ${err.body}`
    }
    return err instanceof Error ? err.message : 'Unknown error'
  }

  revalidatePath('/app/projects')
  return null
}
