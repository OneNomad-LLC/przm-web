'use server'

import { redirect } from 'next/navigation'
import { requireOperator } from '@/lib/operator'
import { accessAdmin } from '@/lib/access-admin'

const VALID_PLANS = [
  'solo',
  'team',
  'business',
  'business_pilot',
  'self_hosted_departmental',
  'division',
  'enterprise',
] as const

type Plan = (typeof VALID_PLANS)[number]

export interface CreateOrgState {
  error: string | null
}

function isPlan(value: unknown): value is Plan {
  return VALID_PLANS.includes(value as Plan)
}

export async function createOrgAction(
  _prev: CreateOrgState,
  formData: FormData,
): Promise<CreateOrgState> {
  await requireOperator()

  const slug = (formData.get('slug') as string | null)?.trim() ?? ''
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const plan = formData.get('plan') as string | null
  const primaryOwnerEmail = (formData.get('primaryOwnerEmail') as string | null)?.trim() ?? ''

  if (!slug) return { error: 'Slug is required.' }
  if (!name) return { error: 'Name is required.' }
  if (!isPlan(plan)) return { error: 'Invalid plan.' }
  if (!primaryOwnerEmail) return { error: 'Primary owner email is required.' }
  if (!/^\S+@\S+\.\S+$/.test(primaryOwnerEmail)) return { error: 'Invalid email address.' }

  try {
    const org = await accessAdmin.orgs.create({
      slug,
      name,
      plan,
      primaryOwnerEmail,
    })
    redirect(`/admin/ops/orgs/${org.id}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
