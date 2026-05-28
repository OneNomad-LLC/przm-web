'use server'

import { requireOperator } from '@/lib/operator'
import { accessAdmin, type IssueLicenseResult } from '@/lib/access-admin'

export interface IssueLicenseState {
  error: string | null
  result: IssueLicenseResult | null
}

export async function issueLicenseAction(
  _prev: IssueLicenseState,
  formData: FormData,
): Promise<IssueLicenseState> {
  await requireOperator()

  const orgId = (formData.get('orgId') as string | null) ?? ''
  const mode = formData.get('mode') as string | null
  const expiresAfterDaysRaw = formData.get('expiresAfterDays') as string | null
  const seatCapRaw = formData.get('seatCap') as string | null
  const tenantCapRaw = formData.get('tenantCap') as string | null
  const customerName = (formData.get('customerName') as string | null)?.trim() ?? ''

  if (mode !== 'annual' && mode !== 'perpetual') return { error: 'Invalid mode.', result: null }

  const expiresAfterDays = Number(expiresAfterDaysRaw)
  const seatCap = Number(seatCapRaw)
  const tenantCap = Number(tenantCapRaw)

  if (!Number.isFinite(expiresAfterDays) || expiresAfterDays < 1)
    return { error: 'expiresAfterDays must be a positive integer.', result: null }
  if (!Number.isFinite(seatCap) || seatCap < 1)
    return { error: 'seatCap must be a positive integer.', result: null }
  if (!Number.isFinite(tenantCap) || tenantCap < 1)
    return { error: 'tenantCap must be a positive integer.', result: null }
  if (!customerName) return { error: 'Customer name is required.', result: null }

  try {
    const result = await accessAdmin.licenses.issue({
      orgId,
      mode,
      expiresAfterDays,
      seatCap,
      tenantCap,
      customerName,
    })
    return { error: null, result }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error', result: null }
  }
}
