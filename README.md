# przm-web

The website at [przm.sh](https://przm.sh). Multi-axis AI reliability leaderboard + authenticated customer dashboard.

This repo owns the user-facing surface: marketing pages, the receipt ledger, the verify-a-receipt page, the canonical methodology specifications, and the authenticated app shell where customers manage their organizations.

Reference implementations of the benchmarks live in [OneNomad-LLC/przm-bench](https://github.com/OneNomad-LLC/przm-bench).

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Components) |
| Auth | better-auth 1.x — magic-link + GitHub OAuth + passkeys |
| Database | Postgres via Drizzle ORM (node-postgres driver) |
| Email | Resend |
| Billing | Stripe (SDK scaffolded; integration ships in Task #09) |
| Styling | Tailwind CSS 4 (Gruvbox dark theme) |
| Deploy | Vercel |

## Route groups

```
src/app/
  (marketing)/      — public pages: /, /leaderboard, /blog, /methodology, /vendor-cert, /verify, /receipts
  (app)/            — authenticated shell: /app/dashboard, /app/billing
  auth/             — sign-in flows: /auth/login, /auth/signup, /auth/accept-invite, /auth/magic-link-verify
  api/
    auth/[...all]   — better-auth catch-all handler
    admin/          — internal admin API routes (basic-auth protected)
  admin/            — internal admin inbox UI (basic-auth protected)
```

Marketing pages require no auth. App pages require a session (enforced by `src/middleware.ts`).

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in all values — see .env.example for documentation on each var
```

Required environment variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Random 32+ byte secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Canonical URL of this deployment (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same as above, exposed to the browser |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` for dev) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `PRZM_ACCESS_BASE_URL` | przm-access service base URL |
| `PRZM_ACCESS_ADMIN_KEY` | Operator key for the przm-access admin API |
| `ADMIN_PASSWORD` | Password for the internal admin UI (`/admin/*`) |

### 3. Run database migrations

```bash
pnpm db:migrate
```

This applies Drizzle migrations from the `drizzle/` directory. Run `pnpm db:generate` after changing `src/lib/db/schema.ts` to generate new migrations.

### 4. Start dev server

```bash
pnpm dev       # http://localhost:3000
```

### 5. Set up GitHub OAuth (for local dev)

1. Go to https://github.com/settings/applications/new
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the client ID and secret to `.env.local`

## Database commands

```bash
pnpm db:generate   # generate SQL migrations from schema changes
pnpm db:migrate    # apply migrations to DATABASE_URL
pnpm db:push       # push schema directly (dev only — skips migrations)
pnpm db:studio     # open Drizzle Studio (browser DB inspector)
```

## Build + lint

```bash
pnpm build         # production build
pnpm lint          # next lint
pnpm typecheck     # tsc --noEmit
```

## Methodology docs

Per-benchmark specifications live in [`content/`](content/) as plain markdown. The methodology page at [`/methodology`](https://przm.sh/methodology) reads them at build time and renders them under per-benchmark sections with anchored URLs.

To add a new benchmark methodology:

1. Drop the spec at `content/methodology-<slug>.md`.
2. Add an entry to `BENCHMARK_DOCS` in `src/app/(marketing)/methodology/page.tsx`.

## Auth architecture

- **Magic-link**: user enters email → Resend delivers a single-use link → better-auth verifies the token and sets a 30-day session cookie.
- **GitHub OAuth**: standard OAuth2 flow via better-auth's social provider plugin.
- **Passkeys**: WebAuthn registration via better-auth's passkey plugin (available after initial sign-in).
- **Invite flow**: Admin invites a user via przm-access → email links to `/auth/accept-invite?token=...` → user signs in → server action calls przm-access to accept the invitation and link the web identity to the runtime identity.

## License

Apache-2.0.
