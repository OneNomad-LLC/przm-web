'use client'

import { useActionState, useState } from 'react'
import { provisionTenantAction, type ProvisionTenantState } from './actions'

const DEPLOYMENT_MODES = [
  { value: 'cloud', label: 'Cloud (shared cortex)' },
  { value: 'self_hosted', label: 'Self-hosted' },
]

const INITIAL: ProvisionTenantState = { error: null }

interface ProvisionTenantFormProps {
  orgId: string
}

export function ProvisionTenantForm({ orgId }: ProvisionTenantFormProps) {
  const [state, action, pending] = useActionState(provisionTenantAction, INITIAL)
  const [mode, setMode] = useState<string>('cloud')

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
          {DEPLOYMENT_MODES.map((m) => (
            <label
              key={m.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
              style={{
                borderColor: 'var(--color-border-default)',
                background: 'var(--color-bg-raised)',
              }}
            >
              <input
                type="radio"
                name="deploymentMode"
                value={m.value}
                checked={mode === m.value}
                onChange={(e) => setMode(e.target.value)}
                className="accent-[var(--color-knowledge)]"
              />
              <span
                className="text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {m.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {mode === 'self_hosted' ? (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="licenseId"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            License ID (required)
          </label>
          <input
            id="licenseId"
            name="licenseId"
            type="text"
            placeholder="JWT jti from scripts/issue-license.ts"
            className="rounded-md border bg-transparent px-3 py-2 font-mono text-xs outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
          <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            Issue a license first via the CLI in the przm-access repo:
            <code
              className="ml-1 rounded px-1 py-0.5 font-mono text-[10px]"
              style={{ background: 'var(--color-bg-raised)' }}
            >
              pnpm tsx scripts/issue-license.ts
            </code>
          </p>
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
