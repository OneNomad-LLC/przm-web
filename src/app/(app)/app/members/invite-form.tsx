'use client'

import { useActionState, useRef } from 'react'
import { inviteMember } from './actions'

const ROLES = ['viewer', 'editor', 'admin', 'owner'] as const

export function InviteForm() {
  const [error, dispatch, isPending] = useActionState(inviteMember, null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        const result = await dispatch(fd)
        // useActionState returns the next state; `result` is the new `error`
        // value, not the stale closure capture. Reset only on null (success).
        if (result == null) formRef.current?.reset()
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="invite-email"
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Email
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          required
          placeholder="user@example.com"
          className="rounded-md border px-3 py-1.5 text-sm font-mono outline-none transition-colors focus:border-[var(--color-bench)]"
          style={{
            background: 'var(--color-bg-raised)',
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="invite-role"
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Role
        </label>
        <select
          id="invite-role"
          name="role"
          defaultValue="viewer"
          className="rounded-md border px-3 py-1.5 text-sm outline-none"
          style={{
            background: 'var(--color-bg-raised)',
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          borderColor: 'var(--color-bench)',
          color: 'var(--color-bench)',
          background: 'color-mix(in srgb, var(--color-bench) 8%, transparent)',
        }}
      >
        {isPending ? 'Adding…' : 'Add member'}
      </button>

      {error ? (
        <p className="text-sm" style={{ color: 'var(--color-red)' }}>
          {error}
        </p>
      ) : null}
    </form>
  )
}
