/**
 * Stripe SDK initialization.
 *
 * SERVER-SIDE ONLY. Never import from a client component.
 * The secret key must never reach the browser.
 *
 * Lazy-init: build doesn't crash if STRIPE_SECRET_KEY is absent
 * (e.g. during local dev before Stripe is wired). The first actual
 * API call will throw a clear error.
 *
 * Real Stripe integration logic ships in Task #09. This file is the
 * stub that wires the SDK instance.
 */

import 'server-only'

import Stripe from 'stripe'

let _stripe: Stripe | null = null

/**
 * Returns the shared Stripe client. Lazy-initialized on first call.
 * Throws if STRIPE_SECRET_KEY is not set.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY must be set')
  }
  _stripe = new Stripe(key, {
    // Pin the API version. Update deliberately — each version bumps
    // the TypeScript types and may require code changes.
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  })
  return _stripe
}
