/**
 * POST /api/stripe/webhook
 *
 * Validates the Stripe-Signature header, deduplicates against the
 * stripe_webhook_event table, then dispatches to the billing bridge.
 *
 * All bridge actions are idempotent: Stripe may replay events on
 * failure; the event-ID check in this handler is the outer guard.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY       — Stripe secret key (sk_test_…)
 *   STRIPE_WEBHOOK_SECRET   — Webhook signing secret (whsec_…)
 *
 * Register this URL in the Stripe dashboard under Developers → Webhooks.
 * Events to subscribe:
 *   customer.subscription.created
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   invoice.paid
 *   invoice.payment_failed
 */

import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db/index'
import { stripeWebhookEvent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from '@/lib/billing/bridge'

export const runtime = 'nodejs' // Required: crypto + node-postgres

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Read raw body (required for signature verification) ──────────
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe-Signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // ── 2. Verify signature ─────────────────────────────────────────────
  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid signature'
    console.warn(`[stripe/webhook] Signature verification failed: ${msg}`)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  // ── 3. Idempotency check ────────────────────────────────────────────
  const existing = await db
    .select({ id: stripeWebhookEvent.id })
    .from(stripeWebhookEvent)
    .where(eq(stripeWebhookEvent.id, event.id))
    .limit(1)

  if (existing.length > 0) {
    // Already processed — return 200 so Stripe stops retrying.
    return NextResponse.json({ received: true, duplicate: true })
  }

  // ── 4. Dispatch to bridge ───────────────────────────────────────────
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event)
        break
      case 'invoice.paid':
        await handleInvoicePaid(event)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event)
        break
      default:
        // Unhandled event type — log and acknowledge.
        console.info(`[stripe/webhook] Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    // Bridge error — return 500 so Stripe retries.
    // The event is NOT marked as processed so we'll try again.
    console.error(`[stripe/webhook] Bridge error for event ${event.id}:`, err)
    return NextResponse.json(
      { error: 'Bridge error — will retry' },
      { status: 500 },
    )
  }

  // ── 5. Mark as processed ────────────────────────────────────────────
  await db.insert(stripeWebhookEvent).values({
    id: event.id,
    type: event.type,
    processedAt: new Date(),
  })

  return NextResponse.json({ received: true })
}
