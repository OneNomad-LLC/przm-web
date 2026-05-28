'use server'

import { redirect } from 'next/navigation'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type AccessOrgPlanSlug } from '@/lib/access-admin'

const VALID_PLANS: readonly AccessOrgPlanSlug[] = ['free', 'solo', 'team', 'business']

export interface CreateOrgState {
  error: string | null
}

function isPlan(value: unknown): value is AccessOrgPlanSlug {
  return VALID_PLANS.includes(value as AccessOrgPlanSlug)
}

export async function createOrgAction(
  _prev: CreateOrgState,
  formData: FormData,
): Promise<CreateOrgState> {
  await requireOperator()

  const slug = (formData.get('slug') as string | null)?.trim() ?? ''
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const plan = formData.get('plan') as string | null
  const seatCountRaw = (formData.get('seatCount') as string | null)?.trim() ?? ''

  if (!slug) return { error: 'Slug is required.' }
  if (!name) return { error: 'Name is required.' }
  if (!isPlan(plan)) return { error: 'Invalid plan.' }

  const seatCount = seatCountRaw ? Number(seatCountRaw) : undefined
  if (seatCount !== undefined && (!Number.isInteger(seatCount) || seatCount < 1)) {
    return { error: 'Seat count must be a positive integer.' }
  }

  try {
    const org = await accessAdmin.orgs.create({
      slug,
      name,
      plan,
      ...(seatCount !== undefined ? { seatCount } : {}),
    })
    redirect(`/admin/ops/orgs/${org.id}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
