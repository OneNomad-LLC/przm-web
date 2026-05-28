/**
 * Accept-invite page — /auth/accept-invite?token=...
 *
 * Flow (from the brief §Design notes):
 *   1. Admin clicks "Invite" → przm-access generates a token + sends email.
 *   2. Email links here with ?token=...
 *   3. This page validates the token (server-side, calls przm-access admin API).
 *   4. Shows org name + sign-in options (magic-link / GitHub).
 *   5. After sign-in, a server action calls przm-access POST /admin/invitations/<token>/accept.
 *
 * This page covers step 3-4. Step 5 happens in accept-invite-form.tsx
 * after better-auth sets the session.
 *
 * The actual integration (calling accessAdmin) is stubbed here because
 * the przm-access admin API is wired in Task #01. The page renders
 * gracefully when the integration isn't live yet.
 */

import type { Metadata } from 'next'
import { AcceptInviteForm } from './accept-invite-form'

export const metadata: Metadata = {
  title: 'Accept invitation | przm',
}

interface AcceptInvitePageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <>
        <h1
          className="mb-2 text-xl font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Invalid invitation
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          This invitation link is missing a token. Please use the link from your invitation email.
        </p>
        <a
          href="/auth/login"
          className="mt-6 inline-block text-xs underline underline-offset-2"
          style={{ color: 'var(--color-bench)' }}
        >
          Sign in instead
        </a>
      </>
    )
  }

  // Stub: in production this would call accessAdmin.invitations.get(token)
  // and pass the org name down. Task #01 wires the real API.
  // For now, render the form with the token and a placeholder org.
  return (
    <>
      <h1
        className="mb-2 text-xl font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        You have been invited.
      </h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Sign in to claim your invitation. You will be added to your organization automatically.
      </p>
      <AcceptInviteForm token={token} />
    </>
  )
}
