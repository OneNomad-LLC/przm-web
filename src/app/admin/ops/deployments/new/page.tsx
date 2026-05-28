import type { Metadata } from 'next'
import { requireOperator } from '@/lib/operator'
import { CreateDeploymentForm } from './form'

export const metadata: Metadata = {
  title: 'Register deployment | Operator | przm',
}

export default async function NewDeploymentPage() {
  await requireOperator()

  return (
    <div>
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Operator console / Deployments
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Register a deployment.
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Provision the stack with the existing terraform module first; paste the
          resulting endpoint here. Shared clouds: leave Organization blank.
          Dedicated clouds: paste the owning org's UUID.
        </p>
      </div>

      <div
        className="max-w-2xl rounded-xl border p-6"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <CreateDeploymentForm />
      </div>
    </div>
  )
}
