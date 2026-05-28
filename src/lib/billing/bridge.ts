/**
 * Stripe webhook → przm-access bridge.
 *
 * SERVER-SIDE ONLY — never import from a client component.
 *
 * Each handler receives a fully-typed Stripe event object (already
 * verified by the webhook route) and performs the appropriate
 * przm-access admin API call. All handlers are idempotency-safe —
 * the webhook route guards duplicate event IDs before calling here.
 *
 * Error strategy: throw on access API errors (the webhook route catches
 * and returns 500 so Stripe retries). Log warnings for non-fatal issues
 * (e.g. customer not yet provisioned in przm-access).
 */

import 'server-only'

import type Stripe from 'stripe'
import { db } from '@/lib/db/index'
import { stripeBillingState, user } from '@/lib/db/schema'
import { accessAdmin } from '@/lib/access-admin'
import { eq } from 'drizzle-orm'
import { getStripe } from '@/lib/stripe'
import { planFromPriceId } from '@/lib/stripe/products'

// ── Customer → org ID resolution ─────────────────────────────────────

/**
 * Resolve a Stripe customer ID to a przm-access org ID by looking up
 * the web user record. Returns null if not found (customer not yet
 * provisioned on the web side).
 */
async function orgIdFromCustomer(customerId: string): Promise<string | null> {
  const rows = await db
    .select({ accessOrgId: user.accessOrgId })
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1)

  return rows[0]?.accessOrgId ?? null
}

// ── Billing state helpers ─────────────────────────────────────────────

async function getBillingState(orgId: string) {
  const rows = await db
    .select()
    .from(stripeBillingState)
    .where(eq(stripeBillingState.orgId, orgId))
    .limit(1)
  return rows[0] ?? null
}

async function upsertBillingState(
  orgId: string,
  patch: Partial<typeof stripeBillingState.$inferInsert>,
) {
  await db
    .insert(stripeBillingState)
    .values({ orgId, ...patch })
    .onConflictDoUpdate({
      target: stripeBillingState.orgId,
      set: { ...patch, updatedAt: new Date() },
    })
}

// ── Pilot conversion ──────────────────────────────────────────────────

const PILOT_CREDIT_CENTS = 207000 // $2,070

/**
 * Check if the customer paid for a Pilot SKU within the last 90 days.
 * The Pilot PaymentIntent has metadata.is_pilot = "true".
 */
async function hasPilotWithin90Days(customerId: string): Promise<boolean> {
  const stripe = getStripe()
  const ninetyDaysAgo = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60

  // List recent payment intents for the customer.
  const intents = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 10,
    created: { gte: ninetyDaysAgo },
  })

  return intents.data.some(
    (pi) => pi.metadata.is_pilot === 'true' && pi.status === 'succeeded',
  )
}

/**
 * Apply the $2,070 pilot conversion credit to a new Business Annual
 * subscription as a one-time coupon on the first invoice.
 */
async function applyPilotCredit(
  stripe: Stripe,
  subscriptionId: string,
  customerId: string,
): Promise<void> {
  const coupon = await stripe.coupons.create({
    amount_off: PILOT_CREDIT_CENTS,
    currency: 'usd',
    duration: 'once',
    name: 'Business Pilot Credit — 90-day conversion',
    metadata: { przm_type: 'pilot_conversion', customer: customerId },
  })

  await stripe.subscriptions.update(subscriptionId, {
    discounts: [{ coupon: coupon.id }],
  })
}

// ── Subscription event handlers ───────────────────────────────────────

export async function handleSubscriptionCreated(event: Stripe.Event): Promise<void> {
  const sub = event.data.object as Stripe.Subscription
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  const orgId = await orgIdFromCustomer(customerId)
  if (!orgId) {
    console.warn(`[stripe/bridge] subscription.created: no org for customer ${customerId}`)
    return
  }

  const priceId = sub.items.data[0]?.price?.id ?? ''
  const plan = planFromPriceId(priceId) ?? 'solo'
  const seatCount = sub.items.data[0]?.quantity ?? 1

  // POST /admin/orgs/:id/plan for a new subscription.
  await accessAdmin.orgs.updatePlan(
    orgId,
    { plan, seatCount, stripeSubscriptionId: sub.id },
    'POST',
  )

  // Persist subscription ID in local billing state.
  await upsertBillingState(orgId, {
    stripeSubscriptionId: sub.id,
    failedPaymentCount: 0,
    pastDue: false,
  })

  // Pilot conversion: if this is a Business Annual and the customer had
  // a paid Pilot within 90 days, credit $2,070 off the first invoice.
  const interval = sub.items.data[0]?.price?.recurring?.interval
  if (plan === 'business' && interval === 'year') {
    const eligible = await hasPilotWithin90Days(customerId)
    if (eligible) {
      const stripe = getStripe()
      await applyPilotCredit(stripe, sub.id, customerId)
      console.info(`[stripe/bridge] Pilot credit applied to subscription ${sub.id}`)
    }
  }
}

export async function handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
  const sub = event.data.object as Stripe.Subscription
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  const orgId = await orgIdFromCustomer(customerId)
  if (!orgId) {
    console.warn(`[stripe/bridge] subscription.updated: no org for customer ${customerId}`)
    return
  }

  const priceId = sub.items.data[0]?.price?.id ?? ''
  const plan = planFromPriceId(priceId) ?? 'solo'
  const seatCount = sub.items.data[0]?.quantity ?? 1

  await accessAdmin.orgs.updatePlan(orgId, { plan, seatCount, stripeSubscriptionId: sub.id })

  await upsertBillingState(orgId, { stripeSubscriptionId: sub.id })
}

export async function handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const sub = event.data.object as Stripe.Subscription
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  const orgId = await orgIdFromCustomer(customerId)
  if (!orgId) {
    console.warn(`[stripe/bridge] subscription.deleted: no org for customer ${customerId}`)
    return
  }

  await accessAdmin.orgs.updatePlan(orgId, {
    plan: 'free',
    seatCount: 0,
    stripeSubscriptionId: null,
    reason: 'subscription_deleted',
  })

  await upsertBillingState(orgId, {
    stripeSubscriptionId: null,
    failedPaymentCount: 0,
    pastDue: false,
  })
}

// ── Invoice event handlers ────────────────────────────────────────────

export async function handleInvoicePaid(event: Stripe.Event): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const orgId = await orgIdFromCustomer(customerId)
  if (!orgId) return

  // Successful payment clears any past-due flag and resets failure count.
  await upsertBillingState(orgId, { failedPaymentCount: 0, pastDue: false })
  await accessAdmin.orgs.updateBillingStatus(orgId, { pastDue: false })
}

export async function handleInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const orgId = await orgIdFromCustomer(customerId)
  if (!orgId) return

  // Increment local failure count.
  const state = await getBillingState(orgId)
  const newCount = (state?.failedPaymentCount ?? 0) + 1

  await upsertBillingState(orgId, { failedPaymentCount: newCount, pastDue: true })
  await accessAdmin.orgs.updateBillingStatus(orgId, { pastDue: true })

  if (newCount >= 3) {
    // Three consecutive failures → drop to free.
    await accessAdmin.orgs.updatePlan(orgId, {
      plan: 'free',
      seatCount: 0,
      stripeSubscriptionId: null,
      reason: 'payment_failed_3x',
    })
    console.warn(`[stripe/bridge] Org ${orgId} dropped to free after 3 payment failures.`)
  }
}
