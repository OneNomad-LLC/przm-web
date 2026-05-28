/**
 * Billing page — /app/billing
 *
 * Placeholder. Real Stripe integration ships in Task #09.
 * This page establishes the route and shows the user their
 * account email; wiring to Stripe customer portal is Task #09.
 */

import type { Metadata } from 'next'
import { requireUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Billing | przm',
}

export default async function BillingPage() {
  const { user } = await requireUser()

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Billing
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Billing &amp; subscription.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Account: <span className="font-mono">{user.email}</span>
        </p>
      </div>

      {/* Placeholder content */}
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <div
          className="mb-3 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--color-text-disabled)' }}
        >
          Coming in Task #09
        </div>
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Stripe integration pending.
        </h2>
        <p
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Subscription management, invoices, and the Stripe customer portal
          will be available after Task #09 ships. Your billing details are
          securely stored in Stripe.
        </p>
      </div>
    </div>
  )
}
