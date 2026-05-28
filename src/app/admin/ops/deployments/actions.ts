'use server'

import { revalidatePath } from 'next/cache'
import { requireOperator } from '@/lib/operator'
import { accessAdmin } from '@/lib/access-admin'

export async function pingDeploymentAction(formData: FormData) {
  await requireOperator()
  const id = (formData.get('id') as string | null)?.trim()
  if (!id) return
  try {
    await accessAdmin.deployments.ping(id)
  } catch {
    // Probe-failure is reflected as status='down' in the row already; the
    // list page re-fetches on revalidate and shows the updated state.
  }
  revalidatePath('/admin/ops/deployments')
}
