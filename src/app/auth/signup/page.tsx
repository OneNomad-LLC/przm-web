/**
 * Signup page — /auth/signup
 *
 * Same methods as login (magic-link + GitHub). better-auth creates
 * the user row on first successful sign-in, so there's no distinct
 * "register" step — this page just re-uses the login flow with
 * different copy.
 */

import type { Metadata } from 'next'
import { LoginForm } from '../login/login-form'

export const metadata: Metadata = {
  title: 'Create account | przm',
}

export default function SignupPage() {
  return (
    <>
      <h1
        className="mb-2 text-xl font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Create your account
      </h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Sign up with your email or GitHub. No password required.
      </p>
      {/* Re-use the login form — better-auth upserts the user row on first
          successful authentication, so login and signup are the same flow. */}
      <LoginForm />
    </>
  )
}
