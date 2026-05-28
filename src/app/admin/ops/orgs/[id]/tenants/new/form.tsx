'use client'

import { useActionState } from 'react'
import { provisionTenantAction, type ProvisionTenantState } from './actions'
import type { License } from '@/lib/access-admin'

const DEPLOYMENT_MODES = [
  { value: 'cloud:us-east', label: 'Cloud — US East' },
  { value: 'cloud:eu', label: 'Cloud — EU' },
  { value: 'self_hosted', label: 'Self-hosted' },
  { value: 'air_gap', label: 'Air-gap' },
]

const INITIAL: ProvisionTenantState = { error: null }

interface ProvisionTenantFormProps {
  orgId: string
  licenses: License[]
}

export function ProvisionTenantForm({ orgId, licenses }: ProvisionTenantFormProps) {
  const [state, action, pending] = useActionState(provisionTenantAction, INITIAL)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="orgId" value={orgId} />

      {state.error ? (
        <div
          className="rounded-lg border p-4 text-sm"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'color-mix(in srgb, var(--color-red) 8%, transparent)',
            color: 'var(--color-red)',
          }}
        >
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="slug"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="acme-prod"
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Acme Production"
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Deployment mode
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {DEPLOYMENT_MODES.map((mode) => (
            <label
              key={mode.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
              style={{
                borderColor: 'var(--color-border-default)',
                background: 'var(--color-bg-raised)',
              }}
            >
              <input
                type="radio"
                name="deploymentMode"
                value={mode.value}
                defaultChecked={mode.value === 'cloud:us-east'}
                className="accent-[var(--color-knowledge)]"
              />
              <span
                className="text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {mode.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {licenses.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="licenseId"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            License (required for self-hosted / air-gap)
          </label>
          <select
            id="licenseId"
            name="licenseId"
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-surface)',
            }}
          >
            <option value="">— none —</option>
            {licenses.map((lic) => (
              <option key={lic.id} value={lic.id}>
                {lic.customerName} ({lic.mode}, {lic.status}, exp{' '}
                {new Date(lic.expiresAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          style={{
            borderColor: 'var(--color-knowledge)',
            color: 'var(--color-knowledge)',
          }}
        >
          {pending ? 'Provisioning...' : 'Provision tenant'}
        </button>
        <a
          href={`/admin/ops/orgs/${orgId}`}
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
