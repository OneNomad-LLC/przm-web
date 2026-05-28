/**
 * Stripe Customer Portal session factory.
 *
 * SERVER-SIDE ONLY — never import from a client component.
 *
 * The portal is configured in the Stripe dashboard to allow:
 *   - Cancel (at period end, not immediately)
 *   - Plan change (tier upgrade/downgrade)
 *   - Seat quantity change
 *   - Invoice download
 *
 * Configure at: https://dashboard.stripe.com/test/settings/billing/portal
 */

import 'server-only'

import { getStripe } from '@/lib/stripe'

export interface PortalParams {
  stripeCustomerId: string
  returnUrl: string
}

export async function createPortalSession(params: PortalParams): Promise<{ url: string }> {
  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: params.stripeCustomerId,
    return_url: params.returnUrl,
  })
  return { url: session.url }
}
