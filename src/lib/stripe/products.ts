/**
 * Stripe Product + Price IDs.
 *
 * SERVER-SIDE ONLY — never import from a client component.
 *
 * All IDs are read from environment variables so the same codebase
 * works against Stripe test-mode and live-mode without code changes.
 * Create the products in the Stripe dashboard (or via the seed script
 * at scripts/stripe-seed.ts), then copy the IDs into your .env.local.
 *
 * Naming convention:
 *   STRIPE_PRICE_<PLAN>_<INTERVAL>   (subscriptions)
 *   STRIPE_PRICE_<PLAN>              (one-time)
 *   STRIPE_PRICE_<METER>_METER       (metered overages)
 */

import 'server-only'

export type Plan =
  | 'free'
  | 'solo'
  | 'team'
  | 'business'
  | 'pilot'
  | 'self_hosted_departmental'
  | 'self_hosted_division'
  | 'self_hosted_enterprise'

export type BillingInterval = 'month' | 'year'

export interface PlanMeta {
  name: string
  /** Whether this is a one-time payment (not a recurring subscription). */
  oneTime: boolean
  /** Minimum seat quantity enforced at checkout. 1 means no minimum. */
  minSeats: number
  /** Trial period in days. 0 means no trial. */
  trialDays: number
  /** Monthly price in USD cents, per seat (for display; Stripe is source of truth). */
  priceCentsPerSeat?: number
  /** Annual price in USD cents, per seat (for display). */
  annualPriceCentsPerSeat?: number
  /** One-time total price in USD cents (for display). */
  oneTimeCents?: number
}

export const PLAN_META: Record<Exclude<Plan, 'free'>, PlanMeta> = {
  solo: {
    name: 'Solo',
    oneTime: false,
    minSeats: 1,
    trialDays: 14,
    priceCentsPerSeat: 1900,
    annualPriceCentsPerSeat: 15833, // $190/yr = 2 months free
  },
  team: {
    name: 'Team',
    oneTime: false,
    minSeats: 5,
    trialDays: 30,
    priceCentsPerSeat: 2500,
    annualPriceCentsPerSeat: 20833, // $250/yr = 2 months free
  },
  business: {
    name: 'Business',
    oneTime: false,
    minSeats: 25,
    trialDays: 0,
    priceCentsPerSeat: 5900,
    annualPriceCentsPerSeat: 49167, // $590/yr = 2 months free
  },
  pilot: {
    name: 'Business Pilot',
    oneTime: true,
    minSeats: 10,
    trialDays: 0,
    // $69/seat/mo × 3 months × 10 seats = $2,070 total, billed once
    oneTimeCents: 207000,
  },
  self_hosted_departmental: {
    name: 'Self-Hosted Departmental',
    oneTime: false,
    minSeats: 1,
    trialDays: 0,
    annualPriceCentsPerSeat: 2500000, // $25K/yr flat
  },
  self_hosted_division: {
    name: 'Self-Hosted Division',
    oneTime: false,
    minSeats: 1,
    trialDays: 0,
    annualPriceCentsPerSeat: 6000000, // $60K/yr flat
  },
  self_hosted_enterprise: {
    name: 'Self-Hosted Enterprise',
    oneTime: false,
    minSeats: 1,
    trialDays: 0,
    annualPriceCentsPerSeat: 12000000, // $120K/yr flat (ramp option via Billing Schedule)
  },
}

/** Stripe price ID for a given plan + interval. Read from env at call time. */
export function getPriceId(plan: Exclude<Plan, 'free'>, interval: BillingInterval): string {
  const key =
    plan === 'pilot'
      ? 'STRIPE_PRICE_PILOT'
      : `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`
  const id = process.env[key]
  if (!id) {
    throw new Error(
      `Stripe price ID not configured. Set ${key} in your environment. ` +
        `Run \`pnpm stripe:seed\` to create products in your Stripe test account.`,
    )
  }
  return id
}

/** Stripe price ID for the queries overage meter. */
export function getQueriesMeterPriceId(): string {
  const id = process.env.STRIPE_PRICE_QUERIES_METER
  if (!id) throw new Error('STRIPE_PRICE_QUERIES_METER must be set')
  return id
}

/** Stripe price ID for the extractor-tokens overage meter. */
export function getExtractorTokensMeterPriceId(): string {
  const id = process.env.STRIPE_PRICE_EXTRACTOR_TOKENS_METER
  if (!id) throw new Error('STRIPE_PRICE_EXTRACTOR_TOKENS_METER must be set')
  return id
}

/**
 * Infer the Plan from a Stripe Price ID by scanning all configured
 * price env vars. Returns null if not found (e.g. unknown / legacy price).
 */
export function planFromPriceId(priceId: string): Plan | null {
  const plans: Array<Exclude<Plan, 'free'>> = [
    'solo',
    'team',
    'business',
    'pilot',
    'self_hosted_departmental',
    'self_hosted_division',
    'self_hosted_enterprise',
  ]
  const intervals: BillingInterval[] = ['month', 'year']

  for (const plan of plans) {
    if (plan === 'pilot') {
      if (process.env.STRIPE_PRICE_PILOT === priceId) return 'pilot'
      continue
    }
    for (const interval of intervals) {
      const key = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`
      if (process.env[key] === priceId) return plan
    }
  }
  return null
}

/**
 * Infer billing interval from a Stripe Subscription.
 * Reads the first item's price's recurring interval.
 */
export function intervalFromSubscription(
  sub: { items: { data: Array<{ price: { recurring: { interval: string } | null } }> } },
): BillingInterval {
  const raw = sub.items.data[0]?.price?.recurring?.interval
  return raw === 'year' ? 'year' : 'month'
}
