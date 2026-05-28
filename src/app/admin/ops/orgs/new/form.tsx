'use client'

import { useActionState } from 'react'
import { createOrgAction, type CreateOrgState } from './actions'

const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'solo', label: 'Solo' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
]

const INITIAL: CreateOrgState = { error: null }

export function CreateOrgForm() {
  const [state, action, pending] = useActionState(createOrgAction, INITIAL)

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
            placeholder="acme-corp"
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
            placeholder="Acme Corp"
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="plan"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Plan
          </label>
          <select
            id="plan"
            name="plan"
            required
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-surface)',
            }}
          >
            {PLANS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="seatCount"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Seat count (optional)
          </label>
          <input
            id="seatCount"
            name="seatCount"
            type="number"
            min={1}
            placeholder="1"
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>
      </div>

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
          {pending ? 'Creating...' : 'Create org'}
        </button>
        <a
          href="/admin/ops/orgs"
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
