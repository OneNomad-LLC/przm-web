# Changelog

All notable changes to przm-web (the marketing site + customer dashboard +
billing surface for the przm platform).

przm-web is a private Next.js app, not published. Versions live with the
Vercel deployment, not on npm.

## Unreleased — Wave 3 platform commercialization

**Rebuild on better-auth + Drizzle + Stripe (Task #10):**
- feat(auth): better-auth wired with email magic-link + GitHub OAuth +
  passkeys. (No email/password — passkeys + magic-link cover everything
  with lower support load.)
- feat(db): drizzle-orm + Postgres schema for users, sessions, accounts,
  organizations (bridge to przm-access `organization_id`),
  `stripe_customer_id` mapping.
- feat(routes): `app/(marketing)/*` (no auth, server-rendered, fast)
  and `app/(app)/*` (signed-in shell, full React + Zustand).
- feat(middleware): `/app/*` redirects unauthed to `/auth/login`.
- feat(server): `lib/access-admin.ts` — typed server-side client wrapping
  przm-access admin API. Never reaches the browser.
- feat(email): Resend for transactional sending (magic-links, invites,
  payment failures).
- shipped: `1a4054e`.

**Admin dashboard pages (Task #05):**
- feat(dashboard): `/app/dashboard`, `/app/members`, `/app/projects`,
  `/app/queries`, `/app/audit` — full admin surface for org owners.
- feat(invite): invite-accept flow with 7-day-expiry token; bridges to
  przm-access membership creation.
- feat(api): server actions for protected mutations; no auth tokens shipped
  to the browser.
- shipped: `e721e6f`.

**Stripe integration (Task #09):**
- feat(stripe): `lib/stripe/products.ts` — Solo, Crew, Business, Pilot,
  Self-Hosted SKUs + annual variants + overage meters. Price IDs read from
  env. `planFromPriceId()` resolves Stripe → przm plan for webhook bridge.
- feat(stripe): `lib/stripe/checkout.ts` — `createCheckoutSession()` for
  subscriptions (with trial) and one-time payments (Pilot). Stripe
  customer created on first purchase. Annual = 2-months-free via separate
  Price.
- feat(stripe): `lib/stripe/portal.ts` — `createPortalSession()` for
  self-service billing (cancel at period end, plan change, seat qty,
  invoice download).
- feat(billing): `lib/billing/bridge.ts` — webhook bridge to przm-access:
  subscription created/updated/deleted, invoice paid/failed. Pilot →
  Business Annual conversion logic (90-day window, $2,070 coupon).
  3-strike payment failure → drop to free tier.
- feat(webhook): `/api/stripe/webhook` — Stripe-signature-verified,
  idempotent via `stripe_webhook_event` table, dispatches to bridge.
- feat(db): `stripe_webhook_event` (idempotency log) + `stripe_billing_state`
  (per-org payment failure tracking) tables added.
- feat(ui): `/app/billing` (plan card + Manage Billing + Upgrade link +
  past-due warning), `/app/billing/upgrade` (tier picker with monthly/annual
  toggle + seat qty), `/app/billing/success` (post-checkout confirmation).
- shipped: `ac8d4ae`.
