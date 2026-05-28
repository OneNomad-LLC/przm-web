'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { requireUser } from '@/lib/session'
import { db } from '@/lib/db/index'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { createPortalSession } from '@/lib/stripe/portal'
import type { Plan, BillingInterval } from '@/lib/stripe/products'

function getAppUrl(): string {
  // Prefer the explicit public URL env var; fall back to the request origin.
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
}

/**
 * Redirect the signed-in user to the Stripe Customer Portal.
 * Requires that the user already has a stripeCustomerId.
 */
export async function redirectToPortal(): Promise<never> {
  const { user } = await requireUser()

  const rows = await db
    .select({ stripeCustomerId: userTable.stripeCustomerId })
    .from(userTable)
    .where(eq(userTable.id, user.id))
    .limit(1)

  const stripeCustomerId = rows[0]?.stripeCustomerId
  if (!stripeCustomerId) {
    redirect('/app/billing/upgrade')
  }

  const { url } = await createPortalSession({
    stripeCustomerId,
    returnUrl: `${getAppUrl()}/app/billing`,
  })

  redirect(url)
}

/**
 * Start a Stripe Checkout session for the given plan + interval.
 * Saves the new stripeCustomerId to the DB if this is the user's first purchase.
 */
export async function redirectToCheckout(
  plan: Exclude<Plan, 'free'>,
  billingInterval: BillingInterval,
  seats?: number,
): Promise<never> {
  const { user } = await requireUser()

  const rows = await db
    .select({ stripeCustomerId: userTable.stripeCustomerId })
    .from(userTable)
    .where(eq(userTable.id, user.id))
    .limit(1)

  const existing = rows[0]?.stripeCustomerId ?? null

  const appUrl = getAppUrl()
  const { url, customerId } = await createCheckoutSession({
    userId: user.id,
    email: user.email,
    stripeCustomerId: existing,
    plan,
    billingInterval,
    seats,
    appUrl,
  })

  // Persist the Stripe customer ID if it's new.
  if (!existing && customerId) {
    await db
      .update(userTable)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(userTable.id, user.id))
  }

  redirect(url)
}

// Thin wrappers so the upgrade page form actions stay typed without
// passing plan/interval through hidden inputs.

export async function checkoutSolo(interval: BillingInterval): Promise<never> {
  return redirectToCheckout('solo', interval, 1)
}

export async function checkoutTeam(interval: BillingInterval, seats: number): Promise<never> {
  return redirectToCheckout('team', interval, seats)
}

export async function checkoutBusiness(interval: BillingInterval, seats: number): Promise<never> {
  return redirectToCheckout('business', interval, seats)
}

export async function checkoutPilot(): Promise<never> {
  return redirectToCheckout('pilot', 'month', 10)
}

export async function checkoutSelfHostedDepartmental(): Promise<never> {
  return redirectToCheckout('self_hosted_departmental', 'year', 1)
}
