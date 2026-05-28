/**
 * Magic-link verification landing — /auth/magic-link-verify
 *
 * better-auth redirects here after the user clicks the magic-link in
 * their email. The actual token exchange happens automatically on the
 * /api/auth/* route; this page shows the interim loading state and
 * then redirects to /app/dashboard once the session cookie is set.
 *
 * better-auth handles the redirect itself via the callbackURL set in
 * the signIn.magicLink() call — this page only exists as a fallback
 * landing if the browser drops the redirect.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signing in… | przm',
}

export default function MagicLinkVerifyPage() {
  return (
    <>
      <h1
        className="mb-2 text-xl font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Signing you in…
      </h1>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Verifying your magic link. You will be redirected to your dashboard shortly.
      </p>
      <p className="mt-6 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        If nothing happens,{' '}
        <a
          href="/auth/login"
          className="underline underline-offset-2"
          style={{ color: 'var(--color-bench)' }}
        >
          return to sign in
        </a>
        .
      </p>
    </>
  )
}
