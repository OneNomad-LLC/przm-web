import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin } from '@/lib/access-admin'
import { IssueLicenseForm } from './form'

export const metadata: Metadata = {
  title: 'Issue License | Operator | przm',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewLicensePage({ params }: PageProps) {
  await requireOperator()
  const { id } = await params

  // Load the org name so we can default customerName.
  let orgName = ''
  try {
    const org = await accessAdmin.orgs.get(id)
    orgName = org.name
  } catch {
    // Non-fatal — form works with an empty default.
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
          / Issue license
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Issue license.
        </h1>
      </div>

      <div
        className="max-w-2xl rounded-xl border p-6"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <IssueLicenseForm orgId={id} defaultCustomerName={orgName} />
      </div>
    </div>
  )
}
