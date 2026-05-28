'use client'

import { useActionState } from 'react'
import { createDeploymentAction, type CreateDeploymentState } from './actions'

const INITIAL: CreateDeploymentState = { error: null }

const STATUSES = [
  { value: '', label: 'Pending (default)' },
  { value: 'live', label: 'Live' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'down', label: 'Down' },
]

const labelStyle = 'text-[11px] font-medium uppercase tracking-widest'
const labelStyleProps = { color: 'var(--color-text-muted)' as const }
const inputClass =
  'rounded-md border bg-transparent px-3 py-2 text-sm outline-none'
const inputStyleProps = { borderColor: 'var(--color-border-default)' as const }

export function CreateDeploymentForm() {
  const [state, action, pending] = useActionState(createDeploymentAction, INITIAL)

  return (
    <form action={action} className="space-y-5">
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="label" className={labelStyle} style={labelStyleProps}>
          Label
        </label>
        <input
          id="label"
          name="label"
          type="text"
          required
          placeholder="shared-us-east-1 · or · acme-dedicated"
          className={inputClass}
          style={inputStyleProps}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="region" className={labelStyle} style={labelStyleProps}>
            Region (DO slug)
          </label>
          <input
            id="region"
            name="region"
            type="text"
            placeholder="nyc3 · fra1 · sfo3"
            className={inputClass}
            style={inputStyleProps}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className={labelStyle} style={labelStyleProps}>
            Initial status
          </label>
          <select
            id="status"
            name="status"
            className={inputClass}
            style={inputStyleProps}
            defaultValue=""
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="endpointUrl" className={labelStyle} style={labelStyleProps}>
          Endpoint URL
        </label>
        <input
          id="endpointUrl"
          name="endpointUrl"
          type="url"
          required
          placeholder="https://access.acme.przm.sh"
          className={inputClass}
          style={inputStyleProps}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="orgId" className={labelStyle} style={labelStyleProps}>
          Organization id (for dedicated; leave blank for shared)
        </label>
        <input
          id="orgId"
          name="orgId"
          type="text"
          placeholder="UUID — only for per-customer dedicated stacks"
          className={inputClass}
          style={inputStyleProps}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className={labelStyle} style={labelStyleProps}>
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="terraform workspace id, ticket number, anything operator-visible"
          className={inputClass}
          style={inputStyleProps}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
          }}
        >
          {pending ? 'Registering…' : 'Register deployment'}
        </button>
      </div>
    </form>
  )
}
