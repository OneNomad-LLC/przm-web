import type { Metadata } from 'next'
import { requireOperator } from '@/lib/operator'
import { CreateOrgForm } from './form'

export const metadata: Metadata = {
  title: 'New Org | Operator | przm',
}

export default async function NewOrgPage() {
  await requireOperator()

  return (
    <div>
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Operator console / Orgs
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Create organization.
        </h1>
      </div>

      <div
        className="max-w-2xl rounded-xl border p-6"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <CreateOrgForm />
      </div>
    </div>
  )
}
