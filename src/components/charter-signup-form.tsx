'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type Tier = 'charter' | 'standard' | 'extended' | 'enterprise'

const TIER_OPTIONS: Array<{ value: Tier; label: string; note: string }> = [
  { value: 'charter', label: 'Charter — Free', note: 'first 3–5 vendors' },
  { value: 'standard', label: 'Standard — $999/release', note: '5-business-day turnaround' },
  { value: 'extended', label: 'Extended — $2,499/release', note: 'includes holdout subset' },
  { value: 'enterprise', label: 'Enterprise — $9,999/release', note: 'custom fixture set' },
]

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; tier: Tier; warning?: string }
  | { kind: 'error'; message: string }

export function CharterSignupForm() {
  const [tier, setTier] = useState<Tier>('charter')
  const [state, setState] = useState<FormState>({ kind: 'idle' })

  // Allow ?tier=... in URL hash to pre-select. (e.g. clicking a Standard
  // card CTA can route to /vendor-cert#claim?tier=standard.)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    const queryStart = hash.indexOf('?')
    if (queryStart === -1) return
    const params = new URLSearchParams(hash.slice(queryStart + 1))
    const t = params.get('tier')
    if (t && TIER_OPTIONS.some((o) => o.value === t)) {
      setTier(t as Tier)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state.kind === 'submitting') return
    setState({ kind: 'submitting' })

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      tier,
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      framework: String(data.get('framework') ?? ''),
      release: String(data.get('release') ?? ''),
      context: String(data.get('context') ?? ''),
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as {
        ok?: boolean
        reason?: string
        warning?: string
        tier?: Tier
      }
      if (res.ok && json.ok) {
        setState({ kind: 'success', tier, warning: json.warning })
        form.reset()
      } else {
        setState({
          kind: 'error',
          message:
            json.reason ??
            `Server returned ${res.status}. Try again, or email matt@przm.sh directly.`,
        })
      }
    } catch (err) {
      setState({
        kind: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Network error. Try again, or email matt@przm.sh directly.',
      })
    }
  }

  if (state.kind === 'success') {
    const message =
      state.tier === 'charter'
        ? "Acknowledgment + next steps just hit your inbox. Matt will follow up within one business day to schedule a 15-minute call."
        : "Acknowledgment + next steps just hit your inbox. Matt will follow up shortly to schedule a 15-minute call."
    return (
      <div className="rounded-lg border border-[color:var(--color-bench)]/40 bg-[color:var(--color-bench)]/10 p-6">
        <div className="font-mono text-sm font-semibold text-[color:var(--color-bench)]">
          Got it.
        </div>
        <p className="mt-2 font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
          {message}
        </p>
        {state.warning ? (
          <p className="mt-3 font-mono text-[10px] text-[color:var(--color-text-muted)]">
            Note: {state.warning}
          </p>
        ) : null}
      </div>
    )
  }

  const submitting = state.kind === 'submitting'
  const tierMeta = TIER_OPTIONS.find((o) => o.value === tier)!

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bg-surface)]/40 p-6"
    >
      <div className="mb-5">
        <h3 className="font-mono text-base font-semibold text-[color:var(--color-text-primary)]">
          Get certified
        </h3>
        <p className="mt-2 font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
          Pick a tier and tell us about your framework. Matt replies within one
          business day (same-day for Extended / Enterprise).
        </p>
      </div>

      {/* Tier picker */}
      <div className="mb-5">
        <label
          htmlFor="signup-tier"
          className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]"
        >
          Tier <span className="ml-1 text-[color:var(--color-bench)]">*</span>
        </label>
        <select
          id="signup-tier"
          value={tier}
          onChange={(e) => setTier(e.target.value as Tier)}
          className="w-full rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-base)]/60 p-2.5 font-mono text-xs text-[color:var(--color-text-primary)] outline-none transition-colors focus:border-[color:var(--color-bench)]/60"
        >
          {TIER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 font-mono text-[10px] text-[color:var(--color-text-muted)]">
          {tierMeta.note}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="email" label="Work email" type="email" autoComplete="email" required placeholder="you@yourcompany.com" />
        <Field name="company" label="Company" required placeholder="e.g. CrewAI, Mem0, Pinecone" />
        <Field name="framework" label="Framework or product to certify" required placeholder="e.g. CrewAI v0.95" />
        <Field name="release" label="Release version (optional)" placeholder="commit hash or version tag" />
      </div>

      <div className="mt-4">
        <label
          htmlFor="signup-context"
          className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]"
        >
          Context (optional)
        </label>
        <textarea
          id="signup-context"
          name="context"
          rows={4}
          placeholder="What do you want out of this? Any methodology questions before we run?"
          className="w-full rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-base)]/60 p-3 font-mono text-xs text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-disabled)] outline-none transition-colors focus:border-[color:var(--color-bench)]/60"
        />
      </div>

      {state.kind === 'error' ? (
        <div className="mt-4 rounded-md border border-[color:var(--color-red)]/40 bg-[color:var(--color-red)]/10 p-3 font-mono text-xs text-[color:var(--color-red)]">
          {state.message}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] text-[color:var(--color-text-muted)]">
          We&apos;ll email you. We won&apos;t add you to any list.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold transition-opacity',
            submitting
              ? 'cursor-not-allowed bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-disabled)]'
              : 'text-[color:var(--color-charcoal)] hover:opacity-90',
          )}
          style={submitting ? undefined : { background: 'var(--color-bench)' }}
        >
          {submitting ? 'Sending…' : 'Submit →'}
        </button>
      </div>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  autoComplete,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label
        htmlFor={`signup-${name}`}
        className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]"
      >
        {label}
        {required ? <span className="ml-1 text-[color:var(--color-bench)]">*</span> : null}
      </label>
      <input
        type={type}
        id={`signup-${name}`}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-base)]/60 p-2.5 font-mono text-xs text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-disabled)] outline-none transition-colors focus:border-[color:var(--color-bench)]/60"
      />
    </div>
  )
}
