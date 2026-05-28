'use server'

import { redirect } from 'next/navigation'
import { requireOperator } from '@/lib/operator'
import { accessAdmin } from '@/lib/access-admin'

export interface ProvisionTenantState {
  error: string | null
}

const DEPLOYMENT_MODES = ['cloud:us-east', 'cloud:eu', 'self_hosted', 'air_gap'] as const
type DeploymentMode = (typeof DEPLOYMENT_MODES)[number]

function isDeploymentMode(v: unknown): v is DeploymentMode {
  return DEPLOYMENT_MODES.includes(v as DeploymentMode)
}

export async function provisionTenantAction(
  _prev: ProvisionTenantState,
  formData: FormData,
): Promise<ProvisionTenantState> {
  await requireOperator()

  const orgId = (formData.get('orgId') as string | null) ?? ''
  const slug = (formData.get('slug') as string | null)?.trim() ?? ''
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const deploymentMode = formData.get('deploymentMode')
  const licenseId = (formData.get('licenseId') as string | null)?.trim() || undefined

  if (!slug) return { error: 'Slug is required.' }
  if (!name) return { error: 'Name is required.' }
  if (!isDeploymentMode(deploymentMode)) return { error: 'Invalid deployment mode.' }
  if ((deploymentMode === 'self_hosted' || deploymentMode === 'air_gap') && !licenseId) {
    return { error: 'A license is required for self-hosted and air-gap deployments.' }
  }

  try {
    await accessAdmin.tenants.create(orgId, { slug, name, deploymentMode, licenseId })
    redirect(`/admin/ops/orgs/${orgId}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
