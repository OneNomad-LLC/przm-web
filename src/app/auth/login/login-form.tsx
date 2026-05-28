'use client'

import { useState, useTransition } from 'react'
import { authClient } from '@/lib/auth-client'

type Step = 'idle' | 'pending' | 'sent' | 'error'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    startTransition(async () => {
      setStep('pending')
      const { error } = await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL: '/app/dashboard',
      })
      if (error) {
        setStep('error')
        setErrorMsg(error.message ?? 'Failed to send magic link. Please try again.')
      } else {
        setStep('sent')
      }
    })
  }

  function handleGitHub() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/app/dashboard',
      })
    })
  }

  if (step === 'sent') {
    return (
      <div
        className="rounded-lg border p-4 text-sm"
        style={{
          borderColor: 'var(--color-bench)',
          background: 'color-mix(in srgb, var(--color-bench) 8%, transparent)',
          color: 'var(--color-text-primary)',
        }}
      >
        <p className="font-semibold">Check your email.</p>
        <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          We sent a sign-in link to <span className="font-mono">{email}</span>. It expires in 10 minutes.
        </p>
        <button
          type="button"
          onClick={() => { setStep('idle'); setEmail('') }}
          className="mt-4 text-xs underline underline-offset-2"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Magic-link form */}
      <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Email address
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isPending}
            className="rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
            style={{
              background: 'var(--color-bg-base)',
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
        </label>

        {step === 'error' && (
          <p className="text-xs" style={{ color: 'var(--color-memory)' }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !email.trim()}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
          style={{
            background: 'var(--color-bench)',
            color: 'var(--color-charcoal)',
          }}
        >
          {isPending && step === 'pending' ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t" style={{ borderColor: 'var(--color-border-subtle)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-disabled)' }}>or</span>
        <div className="flex-1 border-t" style={{ borderColor: 'var(--color-border-subtle)' }} />
      </div>

      {/* GitHub OAuth */}
      <button
        type="button"
        onClick={handleGitHub}
        disabled={isPending}
        className="flex items-center justify-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          borderColor: 'var(--color-border-default)',
          color: 'var(--color-text-primary)',
        }}
      >
        <GitHubIcon />
        Continue with GitHub
      </button>

      {/* Link to signup */}
      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        New to przm?{' '}
        <a
          href="/auth/signup"
          className="underline underline-offset-2"
          style={{ color: 'var(--color-bench)' }}
        >
          Create an account
        </a>
      </p>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
    </svg>
  )
}
