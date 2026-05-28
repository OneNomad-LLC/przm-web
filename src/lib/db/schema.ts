import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

/**
 * better-auth schema + przm-web bridge fields.
 *
 * The four tables (user, session, account, verification) are required
 * by better-auth's Drizzle adapter. Column names and types match what
 * the library expects — don't rename them without updating auth.ts.
 *
 * IDs are nanoid (21-char URL-safe). better-auth generates them.
 *
 * Bridge fields on `user`:
 *   stripeCustomerId — maps to the Stripe customer for billing
 *   accessUserId     — maps to the przm-access app_user (web identity ↔ runtime identity)
 *   accessOrgId      — maps to the przm-access organization the user belongs to
 */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  // ── Bridge fields ──────────────────────────────────────────────────
  /** Stripe customer ID (cus_…). Set on first checkout. */
  stripeCustomerId: text('stripe_customer_id').unique(),
  /**
   * przm-access app_user UUID. Set after the user accepts an invitation
   * or is provisioned. Source of truth for runtime identity lives in
   * the access service; this is the local mirror for FK-free lookups.
   */
  accessUserId: uuid('access_user_id'),
  /**
   * przm-access organization UUID. Set alongside accessUserId.
   * Allows server-side gating without a round-trip to the access API.
   */
  accessOrgId: uuid('access_org_id'),
  // ── Timestamps ─────────────────────────────────────────────────────
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
export type Session = typeof session.$inferSelect
export type Account = typeof account.$inferSelect
