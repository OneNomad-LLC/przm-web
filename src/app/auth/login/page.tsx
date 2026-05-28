/**
 * Login page — /auth/login
 *
 * Two sign-in paths:
 *   1. Magic-link (Resend email) — no password to forget.
 *   2. GitHub OAuth — one click for developers.
 *
 * Passkey sign-in is available via the browser's native prompt once
 * the user has registered a passkey on the signup flow.
 */

import type { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Sign in | przm',
}

export default function LoginPage() {
  return (
    <>
      <h1
        className="mb-2 text-xl font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Sign in to przm
      </h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Enter your email for a magic link, or sign in with GitHub.
      </p>
      <LoginForm />
    </>
  )
}
