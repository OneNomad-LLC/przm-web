'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ReplyComposerProps {
  submissionId: string
  prospectEmail: string
}

type FormState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

export function ReplyComposer({ submissionId, prospectEmail }: ReplyComposerProps) {
  const [body, setBody] = useState('')
  const [state, setState] = useState<FormState>({ kind: 'idle' })
  const router = useRouter()

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!body.trim() || state.kind === 'sending') return
    setState({ kind: 'sending' })

    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, body: body.trim() }),
      })
      const json = (await res.json()) as { ok?: boolean; reason?: string }
      if (res.ok && json.ok) {
        setState({ kind: 'sent' })
        setBody('')
        router.refresh()
        // Reset state after a moment so the form is composable again
        setTimeout(() => setState({ kind: 'idle' }), 2500)
      } else {
        setState({
          kind: 'error',
          message: json.reason ?? `Server returned ${res.status}.`,
        })
      }
    } catch (err) {
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Network error.',
      })
    }
  }

  return (
    <form
      onSubmit={send}
      className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-5"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
        <span>// reply to {prospectEmail}</span>
        <span className="text-[color:var(--color-text-disabled)]">
          sent from hello@send.przm.sh
        </span>
      </div>
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value)
          if (state.kind === 'error') setState({ kind: 'idle' })
        }}
        rows={8}
        spellCheck
        placeholder={"Hi,\n\nQuick question on your submission — ...\n\n— Matt"}
        className="w-full rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-base)]/60 p-3 font-mono text-sm leading-relaxed text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-disabled)] outline-none transition-colors focus:border-[color:var(--color-bench)]/60"
      />

      {state.kind === 'error' ? (
        <div className="mt-3 rounded-md border border-[color:var(--color-memory)]/40 bg-[color:var(--color-memory)]/10 p-2 font-mono text-xs text-[color:var(--color-memory)]">
          {state.message}
        </div>
      ) : null}
      {state.kind === 'sent' ? (
        <div className="mt-3 rounded-md border border-[color:var(--color-bench)]/40 bg-[color:var(--color-bench)]/10 p-2 font-mono text-xs text-[color:var(--color-bench)]">
          Sent. Status auto-updated to &quot;replied&quot;.
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] text-[color:var(--color-text-muted)]">
          Reply-To set to your email so a one-tap reply works.
        </p>
        <button
          type="submit"
          disabled={!body.trim() || state.kind === 'sending'}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold transition-opacity',
            body.trim() && state.kind !== 'sending'
              ? 'text-[color:var(--color-charcoal)] hover:opacity-90'
              : 'cursor-not-allowed bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-disabled)]',
          )}
          style={
            body.trim() && state.kind !== 'sending'
              ? { background: 'var(--color-bench)' }
              : undefined
          }
        >
          {state.kind === 'sending' ? 'Sending…' : 'Send reply →'}
        </button>
      </div>
    </form>
  )
}
