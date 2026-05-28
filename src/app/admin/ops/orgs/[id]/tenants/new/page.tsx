import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type License } from '@/lib/access-admin'
import { ProvisionTenantForm } from './form'

export const metadata: Metadata = {
  title: 'New Tenant | Operator | przm',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewTenantPage({ params }: PageProps) {
  await requireOperator()
  const { id } = await params

  // Load existing licenses for this org so the form can offer them.
  let licenses: License[] = []
  try {
    const res = await accessAdmin.licenses.list({ orgId: id })
    licenses = res.licenses
  } catch {
    // Endpoint not live yet — form degrades gracefully (no license dropdown).
  }

  return (
    <div>
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Link href={`/admin/ops/orgs/${id}`} style={{ color: 'var(--color-knowledge)' }}>
            Org
          </Link>{' '}
          / New tenant
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Provision tenant.
        </h1>
      </div>

      <div
        className="max-w-2xl rounded-xl border p-6"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <ProvisionTenantForm orgId={id} licenses={licenses} />
      </div>
    </div>
  )
}
