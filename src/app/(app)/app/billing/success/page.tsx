/**
 * Billing success — /app/billing/success
 *
 * Landing page after a successful Stripe Checkout. Verifies the session
 * status and shows confirmation. The actual entitlement update happens
 * via the webhook (not here) — this page is display-only.
 *
 * searchParams.session_id is the Stripe Checkout session ID appended
 * by the success_url template in checkout.ts.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { db } from '@/lib/db/index'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getCheckoutSession } from '@/lib/stripe/checkout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Subscription confirmed | przm',
}

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function BillingSuccessPage({ searchParams }: SuccessPageProps) {
  const { user } = await requireUser()
  const { session_id: sessionId } = await searchParams

  let confirmed = false
  let isOneTime = false

  if (sessionId) {
    try {
      const session = await getCheckoutSession(sessionId)
      confirmed = session.status === 'complete'
      isOneTime = session.subscriptionId === null && session.paymentIntentId !== null

      // If the customer ID from Stripe is new, persist it.
      if (session.customerId) {
        const rows = await db
          .select({ stripeCustomerId: userTable.stripeCustomerId })
          .from(userTable)
          .where(eq(userTable.id, user.id))
          .limit(1)

        if (!rows[0]?.stripeCustomerId) {
          await db
            .update(userTable)
            .set({ stripeCustomerId: session.customerId, updatedAt: new Date() })
            .where(eq(userTable.id, user.id))
        }
      }
    } catch {
      // Non-fatal — just show the generic confirmation.
      confirmed = true
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
          {confirmed ? 'You&apos;re all set.' : 'Confirming…'}
        </h1>
      </div>

      <div
        className="rounded-xl border p-8 text-center"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        {confirmed ? (
          <>
            <div
              className="mb-3 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--color-bench)' }}
            >
              {isOneTime ? 'Payment confirmed' : 'Subscription active'}
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {isOneTime
                ? 'Your Pilot access is being provisioned.'
                : 'Your subscription is active.'}
            </h2>
            <p
              className="mx-auto mt-3 max-w-md text-sm leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {isOneTime
                ? 'Your 90-day Business Pilot starts now. Your seat entitlements will be active within a few seconds.'
                : 'Your seat entitlements will be active within a few seconds. You can manage your plan, seats, and invoices from the billing page.'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/app/billing"
                className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Billing
              </Link>
              <Link
                href="/app/dashboard"
                className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderColor: 'var(--color-bench)',
                  color: 'var(--color-bench)',
                  background: 'color-mix(in srgb, var(--color-bench) 8%, transparent)',
                }}
              >
                Go to dashboard →
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Waiting for payment confirmation. If this takes more than a minute, check your{' '}
            <Link href="/app/billing" style={{ color: 'var(--color-bench)' }}>
              billing page
            </Link>{' '}
            or email{' '}
            <a href="mailto:support@przm.sh" style={{ color: 'var(--color-bench)' }}>
              support@przm.sh
            </a>
            .
          </p>
        )}
      </div>
    </div>
  )
}
