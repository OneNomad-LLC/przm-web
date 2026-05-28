import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { magicLink } from 'better-auth/plugins'
import { db } from '@/lib/db/index'
import { sendMagicLink } from '@/lib/email/magic-link'

/**
 * Origins better-auth will accept requests from. Covers local dev,
 * prod, and Vercel preview URLs for this project.
 */
const trustedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://przm.sh',
  'https://www.przm.sh',
  'https://app.przm.sh',
  'https://przm-web-*.vercel.app',
]

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  // BETTER_AUTH_SECRET is validated at runtime (first request), not at
  // module load, so the build succeeds without the env var being set.
  secret: process.env.BETTER_AUTH_SECRET ?? '',
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  trustedOrigins,
  // No email/password — magic-link + GitHub OAuth cover everything with
  // lower support load. Passkeys can be added via better-auth plugins in
  // a future task once a passkey plugin ships in this version.
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // refresh once a day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: 'przm',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Defensive try/catch: if Resend rejects (bad key, unverified
        // domain, network blip) we don't want the auth flow to crash.
        try {
          await sendMagicLink({ to: email, magicUrl: url })
        } catch (err) {
          console.error(
            '[auth] magic-link email failed:',
            err instanceof Error ? err.message : err,
          )
        }
      },
    }),
  ],
})

export type Auth = typeof auth
