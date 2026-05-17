'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  'new',
  'replied',
  'meeting_scheduled',
  'closed_won',
  'closed_lost',
  'archived',
] as const

type Status = (typeof STATUSES)[number]

const LABEL: Record<Status, string> = {
  new: 'New',
  replied: 'Replied',
  meeting_scheduled: 'Meeting scheduled',
  closed_won: 'Closed (won)',
  closed_lost: 'Closed (lost)',
  archived: 'Archived',
}

interface StatusPickerProps {
  submissionId: string
  current: Status
}

export function StatusPicker({ submissionId, current }: StatusPickerProps) {
  const [value, setValue] = useState<Status>(current)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleChange(next: Status) {
    if (next === value || pending) return
    const prev = value
    setValue(next)
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId, status: next }),
        })
        const json = (await res.json()) as { ok?: boolean; reason?: string }
        if (!res.ok || !json.ok) {
          setValue(prev)
          setError(json.reason ?? `Server returned ${res.status}.`)
          return
        }
        router.refresh()
      } catch (err) {
        setValue(prev)
        setError(err instanceof Error ? err.message : 'Network error.')
      }
    })
  }

  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
        Status
      </label>
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value as Status)}
        disabled={pending}
        className="rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-base)]/60 px-3 py-2 font-mono text-xs text-[color:var(--color-text-primary)] outline-none transition-colors focus:border-[color:var(--color-bench)]/60 disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {LABEL[s]}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 font-mono text-xs text-[color:var(--color-memory)]">{error}</p>
      ) : null}
    </div>
  )
}
