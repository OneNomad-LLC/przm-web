/**
 * Stripe Checkout session factory.
 *
 * SERVER-SIDE ONLY — never import from a client component.
 *
 * Handles three modes:
 *   1. Recurring subscription (Solo, Team, Business, Self-Hosted)
 *   2. One-time payment (Pilot SKU)
 *   3. With or without an existing Stripe customer
 *
 * The caller is responsible for persisting the stripeCustomerId
 * returned in the Checkout session if the user is new to Stripe.
 * Use `persistStripeCustomer()` from this module after session creation.
 */

import 'server-only'

import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getPriceId, PLAN_META, type Plan, type BillingInterval } from './products'

export interface CheckoutParams {
  /** better-auth user.id — stored as client_reference_id for webhook reconciliation. */
  userId: string
  email: string
  /** Existing Stripe customer ID, or null if first purchase. */
  stripeCustomerId: string | null
  plan: Exclude<Plan, 'free'>
  billingInterval: BillingInterval
  /** Number of seats. Defaults to plan minimum. */
  seats?: number
  /** Base URL of the app (e.g. https://przm.sh). Used to build return URLs. */
  appUrl: string
}

export interface CheckoutResult {
  url: string
  /** Stripe customer ID — persist this on the user record. */
  customerId: string
}

export async function createCheckoutSession(params: CheckoutParams): Promise<CheckoutResult> {
  const stripe = getStripe()
  const meta = PLAN_META[params.plan]

  const seats = Math.max(params.seats ?? meta.minSeats, meta.minSeats)

  // ── Resolve or create Stripe customer ──────────────────────────────
  let customerId = params.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: params.email,
      metadata: { przm_user_id: params.userId },
    })
    customerId = customer.id
  }

  const successUrl = `${params.appUrl}/app/billing/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${params.appUrl}/app/billing/upgrade`

  // ── One-time payment (Pilot SKU) ───────────────────────────────────
  if (meta.oneTime) {
    const priceId = getPriceId(params.plan, 'month') // interval irrelevant for one-time
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      client_reference_id: params.userId,
      line_items: [{ price: priceId, quantity: seats }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        metadata: {
          przm_user_id: params.userId,
          przm_plan: params.plan,
          is_pilot: 'true',
          pilot_seats: String(seats),
        },
      },
    })
    return { url: session.url!, customerId }
  }

  // ── Recurring subscription ─────────────────────────────────────────
  const priceId = getPriceId(params.plan, params.billingInterval)

  const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: {
      przm_user_id: params.userId,
      przm_plan: params.plan,
    },
  }

  // Trial period (Solo: 14d, Team: 30d)
  if (meta.trialDays > 0) {
    subscriptionData.trial_period_days = meta.trialDays
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: params.userId,
    line_items: [{ price: priceId, quantity: seats }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: subscriptionData,
    // Collect billing address for tax purposes (required if Stripe Tax enabled later).
    billing_address_collection: 'auto',
  })

  return { url: session.url!, customerId }
}

/**
 * Retrieve the Checkout session and extract the customer ID.
 * Use on the success page to confirm completion.
 */
export async function getCheckoutSession(sessionId: string): Promise<{
  customerId: string
  subscriptionId: string | null
  paymentIntentId: string | null
  status: Stripe.Checkout.Session.Status | null
}> {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription', 'payment_intent'],
  })

  return {
    customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? '',
    subscriptionId:
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id ?? null,
    paymentIntentId:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    status: session.status,
  }
}
