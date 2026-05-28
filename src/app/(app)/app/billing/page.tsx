/**
 * Billing page — /app/billing
 *
 * Shows the org's current plan, seat usage, and billing controls:
 *   - "Manage Billing" → Stripe Customer Portal (cancel, change plan, invoices)
 *   - "Upgrade" / "Change plan" → /app/billing/upgrade (tier picker → Checkout)
 *
 * Server Component. All Stripe redirects are server-side via Server Actions.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { getAccessContext } from '@/lib/access-context'
import { db } from '@/lib/db/index'
import { user as userTable, stripeBillingState } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirectToPortal } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Billing | przm',
}

const PLAN_DISPLAY: [string, string, string][] = [
  ['Solo', '$19/seat/mo', '14-day trial'],
  ['Team', '$25/seat/mo · 5-seat min', '30-day trial'],
  ['Business', '$59/seat/mo · 25-seat min', 'No trial'],
  ['Business Pilot', '$2,070 one-time · 10 seats · 90 days', 'One-time'],
  ['Self-Hosted Departmental', '$25K/yr', 'Annual'],
]

export default async function BillingPage() {
  const { user } = await requireUser()

  // Load access context (org + seat info).
  const ctx = await getAccessContext(user.id)

  // Load Stripe customer ID + local billing state.
  const userRows = await db
    .select({ stripeCustomerId: userTable.stripeCustomerId })
    .from(userTable)
    .where(eq(userTable.id, user.id))
    .limit(1)
  const stripeCustomerId = userRows[0]?.stripeCustomerId ?? null

  let billingState: { failedPaymentCount: number; pastDue: boolean } | null = null
  if (ctx?.orgId) {
    const stateRows = await db
      .select()
      .from(stripeBillingState)
      .where(eq(stripeBillingState.orgId, ctx.orgId))
      .limit(1)
    if (stateRows[0]) {
      billingState = {
        failedPaymentCount: stateRows[0].failedPaymentCount,
        pastDue: stateRows[0].pastDue,
      }
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
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

      {/* Past-due warning */}
      {billingState?.pastDue ? (
        <div
          className="mb-6 rounded-xl border p-4"
          style={{
            borderColor: 'var(--color-red)',
            background: 'color-mix(in srgb, var(--color-red) 8%, transparent)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--color-red)' }}>
            {billingState.failedPaymentCount >= 3
              ? 'Your account has been downgraded to Free after 3 failed payment attempts.'
              : `Your account has a past-due invoice. ${3 - billingState.failedPaymentCount} attempt(s) remaining before downgrade.`}
          </p>
        </div>
      ) : null}

      {/* Current subscription card */}
      <div
        className="mb-6 rounded-xl border p-6"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              className="text-[11px] font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Current plan
            </p>
            {ctx ? (
              <>
                <p
                  className="mt-1 text-xl font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Active subscription
                </p>
                {ctx.seatCount !== null ? (
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {ctx.seatCount} seat{ctx.seatCount !== 1 ? 's' : ''} provisioned
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p
                  className="mt-1 text-xl font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Free
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  No active subscription.
                </p>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {stripeCustomerId ? (
              <form action={redirectToPortal}>
                <button
                  type="submit"
                  className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: 'var(--color-border-default)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Manage billing →
                </button>
              </form>
            ) : null}
            <Link
              href="/app/billing/upgrade"
              className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--color-bench)',
                color: 'var(--color-bench)',
                background: 'color-mix(in srgb, var(--color-bench) 8%, transparent)',
              }}
            >
              {ctx ? 'Change plan' : 'Upgrade →'}
            </Link>
          </div>
        </div>
      </div>

      {/* Available plans reference */}
      <div
        className="rounded-xl border"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <div
          className="px-5 py-3"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          <p
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-disabled)' }}
          >
            Available plans
          </p>
        </div>
        {PLAN_DISPLAY.map(([name, price, note]) => (
          <div
            key={name}
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid var(--color-border-subtle)' }}
          >
            <div>
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {name}
              </span>
              <span className="ml-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {price}
              </span>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--color-text-disabled)' }}
            >
              {note}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
