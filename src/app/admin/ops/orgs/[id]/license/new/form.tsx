'use client'

import { useActionState } from 'react'
import { issueLicenseAction, type IssueLicenseState } from './actions'

const INITIAL: IssueLicenseState = { error: null, result: null }

interface IssueLicenseFormProps {
  orgId: string
  defaultCustomerName: string
}

export function IssueLicenseForm({ orgId, defaultCustomerName }: IssueLicenseFormProps) {
  const [state, action, pending] = useActionState(issueLicenseAction, INITIAL)

  // Once we have the result, show the JWT copy panel instead of the form.
  if (state.result) {
    return <JwtPanel result={state.result} orgId={orgId} />
  }

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
            htmlFor="customerName"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Customer name
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            defaultValue={defaultCustomerName}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mode"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Mode
          </label>
          <select
            id="mode"
            name="mode"
            required
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-surface)',
            }}
          >
            <option value="annual">Annual</option>
            <option value="perpetual">Perpetual</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expiresAfterDays"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Expires after (days)
          </label>
          <input
            id="expiresAfterDays"
            name="expiresAfterDays"
            type="number"
            required
            min={1}
            defaultValue={365}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="seatCap"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Seat cap
          </label>
          <input
            id="seatCap"
            name="seatCap"
            type="number"
            required
            min={1}
            defaultValue={25}
            className="rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tenantCap"
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Tenant cap
          </label>
          <input
            id="tenantCap"
            name="tenantCap"
            type="number"
            required
            min={1}
            defaultValue={1}
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
            borderColor: 'var(--color-bench)',
            color: 'var(--color-bench)',
          }}
        >
          {pending ? 'Issuing...' : 'Issue license'}
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

function JwtPanel({ result, orgId }: { result: NonNullable<IssueLicenseState['result']>; orgId: string }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(result.jwt)
  }

  return (
    <div className="space-y-5">
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-gold) 40%, transparent)',
          background: 'color-mix(in srgb, var(--color-gold) 8%, transparent)',
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-gold)' }}
        >
          Save this token — it is shown only once
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          This JWT cannot be retrieved again. Copy it now and deliver it securely to the customer.
        </p>
      </div>

      <div>
        <p
          className="mb-2 text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          License ID
        </p>
        <span
          className="font-mono text-sm"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {result.id}
        </span>
      </div>

      <div>
        <p
          className="mb-2 text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Expires
        </p>
        <span
          className="font-mono text-sm"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {new Date(result.exp).toLocaleString()}
        </span>
      </div>

      <div>
        <p
          className="mb-2 text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          JWT
        </p>
        <div
          className="overflow-x-auto rounded-lg border p-4 font-mono text-xs"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-raised)',
            color: 'var(--color-text-secondary)',
            wordBreak: 'break-all',
          }}
        >
          {result.jwt}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border px-5 py-2 text-sm font-medium transition-colors"
          style={{
            borderColor: 'var(--color-knowledge)',
            color: 'var(--color-knowledge)',
          }}
        >
          Copy JWT
        </button>
        <a
          href={`/admin/ops/orgs/${orgId}`}
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Back to org
        </a>
      </div>
    </div>
  )
}
