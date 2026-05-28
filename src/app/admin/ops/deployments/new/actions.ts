'use server'

import { redirect } from 'next/navigation'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type DeploymentStatus } from '@/lib/access-admin'

const VALID_STATUSES: readonly DeploymentStatus[] = [
  'pending',
  'live',
  'degraded',
  'down',
]

function isStatus(v: unknown): v is DeploymentStatus {
  return VALID_STATUSES.includes(v as DeploymentStatus)
}

function isUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export interface CreateDeploymentState {
  error: string | null
}

export async function createDeploymentAction(
  _prev: CreateDeploymentState,
  formData: FormData,
): Promise<CreateDeploymentState> {
  await requireOperator()

  const label = (formData.get('label') as string | null)?.trim() ?? ''
  const endpointUrl = (formData.get('endpointUrl') as string | null)?.trim() ?? ''
  const orgIdRaw = (formData.get('orgId') as string | null)?.trim() ?? ''
  const regionRaw = (formData.get('region') as string | null)?.trim() ?? ''
  const status = formData.get('status') as string | null
  const notesRaw = (formData.get('notes') as string | null)?.trim() ?? ''

  if (!label) return { error: 'Label is required.' }
  if (!endpointUrl) return { error: 'Endpoint URL is required.' }
  if (!isUrl(endpointUrl)) return { error: 'Endpoint URL must be http(s).' }
  if (status !== null && status !== '' && !isStatus(status)) {
    return { error: 'Invalid status.' }
  }

  try {
    await accessAdmin.deployments.create({
      label,
      endpointUrl,
      ...(orgIdRaw ? { orgId: orgIdRaw } : {}),
      ...(regionRaw ? { region: regionRaw } : {}),
      ...(isStatus(status) ? { status } : {}),
      ...(notesRaw ? { notes: notesRaw } : {}),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }

  redirect('/admin/ops/deployments')
}
