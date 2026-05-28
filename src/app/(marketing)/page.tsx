import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FaqAccordion, PLATFORM_FAQS } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'przm. One source of truth for every AI agent your team runs.',
  description:
    'Cortex shares knowledge across your team\'s AI agents. Memory remembers what you told them last sprint. Voice keeps them consistent. Open-source core, multi-tenant cloud, or air-gap install — same MCP contract everywhere.',
}

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* ─── Hero ───────────────────────────────────────────────────── */}
        <section className="relative px-6 py-20 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-20 -top-20 -z-10 h-[600px] opacity-60"
            style={{
              background:
                'radial-gradient(60% 50% at 30% 30%, rgba(59,158,255,0.10), transparent 70%), radial-gradient(50% 50% at 80% 20%, rgba(102,85,221,0.08), transparent 70%)',
            }}
          />

          <div className="grid gap-12 md:grid-cols-[1.15fr_1fr] md:items-center">
            {/* Left: copy + CTAs */}
            <div>
              <a
                href="/security"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-knowledge)]/30 bg-[color:var(--color-knowledge)]/[0.06] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-knowledge)] transition-colors hover:bg-[color:var(--color-knowledge)]/[0.12]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-knowledge)]"
                  style={{ boxShadow: '0 0 8px var(--color-knowledge)' }}
                />
                v0.7 · multi-tenant · SOC 2 in progress →
              </a>

              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
                One{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, var(--color-knowledge), var(--color-memory) 50%, var(--color-voice))',
                  }}
                >
                  source of truth
                </span>
                <br />
                for every AI agent.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
                Your team is running AI coding agents that don&apos;t share context, forget
                what you told them last sprint, and contradict each other across sessions.{' '}
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  Cortex
                </span>{' '}
                shares knowledge across them.{' '}
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  Memory
                </span>{' '}
                remembers.{' '}
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  Voice
                </span>{' '}
                keeps the style consistent.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="/auth/signup"
                  className="group inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-[color:var(--color-charcoal)] shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                  style={{
                    background: 'var(--color-knowledge)',
                    boxShadow: '0 8px 24px -8px rgba(52,196,104,0.5)',
                  }}
                >
                  Start free
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <a
                  href="https://github.com/OneNomad-LLC/cortex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-6 py-3.5 text-sm font-semibold text-[color:var(--color-text-primary)] backdrop-blur transition-colors hover:border-[color:var(--color-knowledge)]/60 hover:bg-[color:var(--color-bg-surface)]"
                >
                  View on GitHub →
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[color:var(--color-text-muted)]">
                <a
                  href="/bench"
                  className="transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  Benchmarks
                </a>
                <a
                  href="/app/billing/upgrade"
                  className="transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  Pricing
                </a>
                <a
                  href="https://github.com/OneNomad-LLC/cortex#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  Docs
                </a>
                <span className="rounded-full bg-[color:var(--color-bg-surface)]/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                  Apache 2.0 core
                </span>
              </div>
            </div>

            {/* Right: terminal-style quickstart card */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-2xl opacity-30 blur-xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-knowledge), var(--color-memory) 50%, var(--color-voice))',
                }}
              />
              <div className="relative rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/80 p-6 font-mono text-sm backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-memory)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-runtime)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bench)]/70" />
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-disabled)]">
                    quickstart
                  </span>
                </div>

                <div className="space-y-1.5 text-[13px] leading-relaxed">
                  <div className="text-[color:var(--color-text-muted)]"># 1. install</div>
                  <div className="text-[color:var(--color-text-primary)]">
                    <span className="text-[color:var(--color-knowledge)]">$</span>{' '}
                    npm i -g{' '}
                    <span className="text-[color:var(--color-memory)]">@onenomad/przm-cortex</span>
                  </div>
                  <div className="pt-2 text-[color:var(--color-text-muted)]"># 2. configure</div>
                  <div className="text-[color:var(--color-text-primary)]">
                    <span className="text-[color:var(--color-knowledge)]">$</span> cortex init
                  </div>
                  <div className="pt-2 text-[color:var(--color-text-muted)]"># 3. add to MCP client</div>
                  <div className="rounded-md bg-[color:var(--color-bg-elevated)]/60 p-3 text-[12px] leading-snug text-[color:var(--color-text-secondary)]">
                    <div className="text-[color:var(--color-text-muted)]">
                      ~/.claude/mcp.json
                    </div>
                    <div className="mt-1 text-[color:var(--color-text-primary)]">
                      {`{ "cortex": { "command": "cortex" } }`}
                    </div>
                  </div>
                </div>

                <a
                  href="https://github.com/OneNomad-LLC/cortex#quickstart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]/40 py-2 text-center text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-knowledge)]/40 hover:text-[color:var(--color-text-primary)]"
                >
                  Full quickstart →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Three planes ───────────────────────────────────────────── */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Three composable planes
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              Memory, knowledge, voice. One MCP contract.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                slug: 'cortex',
                color: 'var(--color-knowledge)',
                title: 'Cortex',
                tagline: 'Multi-tenant knowledge plane',
                body: 'Every agent on your team pulls from the same verified knowledge — no stale context, no hallucinated docs, no version drift between engineers.',
                bullets: [
                  'Postgres RLS multi-tenancy',
                  'Adapters for 10+ source systems',
                  'Cloud, self-hosted, or air-gap',
                ],
                href: 'https://github.com/OneNomad-LLC/cortex#readme',
                cta: 'See how Cortex works',
              },
              {
                slug: 'memory',
                color: 'var(--color-memory)',
                title: 'Memory',
                tagline: 'Per-agent recall',
                body: 'Agents remember what you told them last sprint, not just last turn. Local-first PGlite or scale to Postgres + pgvector when you grow.',
                bullets: [
                  'Local-first by default',
                  'pgvector when you need scale',
                  'Time-aware retrieval',
                ],
                href: '/memory',
                cta: 'How Memory works',
              },
              {
                slug: 'voice',
                color: 'var(--color-voice)',
                title: 'Voice',
                tagline: 'Consistent persona + style',
                body: 'Learns your correction patterns and synthesizes a style profile — every agent writes like you, not like a template that ignored your last three "shorter, please" comments.',
                bullets: [
                  'Privacy-first signal capture',
                  'Synthesizes from corrections',
                  'No PII in profiles',
                ],
                href: '/voice',
                cta: 'How Voice works',
              },
            ].map((p) => (
              <div
                key={p.slug}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-7 transition-all hover:border-[color:var(--color-border-default)]/80 hover:bg-[color:var(--color-bg-surface)]/60"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
                  style={{ background: p.color }}
                />
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl font-mono text-base font-bold text-[color:var(--color-charcoal)]"
                  style={{ background: p.color }}
                >
                  {p.title[0]}
                </div>
                <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                  {p.title}
                </h3>
                <p
                  className="mt-1 text-[11px] font-medium uppercase tracking-widest"
                  style={{ color: p.color }}
                >
                  {p.tagline}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {p.body}
                </p>
                <ul className="mt-5 space-y-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-baseline gap-2">
                      <span
                        className="font-mono text-xs"
                        style={{ color: p.color }}
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: p.color }}
                >
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Deploy options ─────────────────────────────────────────── */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Deploy your way
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              Cloud, self-hosted, air-gap —{' '}
              <span style={{ color: 'var(--color-bench)' }}>or all three on one bill.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[color:var(--color-text-secondary)]">
              The same Apache-2.0 core runs in every mode. One organization can have a
              regulated tenant self-hosted, a US tenant on Cloud, and a federal tenant
              fully air-gapped — counted as one company, one seat-pool, one invoice.
              Built for agencies and enterprises with mixed deployments.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Cloud',
                tagline: 'Managed by us',
                color: 'var(--color-bench)',
                body: 'US-East today, EU (Frankfurt) for GDPR. Stripe billing, SOC 2 in progress, SCIM provisioning, audit-log export to your SIEM.',
                cta: 'Start free',
                href: '/auth/signup',
              },
              {
                title: 'Self-hosted',
                tagline: 'Your infrastructure',
                color: 'var(--color-knowledge)',
                body: 'One-binary install on Hetzner, Fly, DO, or your own k8s. HA Postgres + S3-compatible blob, daily backups, quarterly upgrade train. Annual license, no metered overage.',
                cta: 'Read the deploy guide',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/deploy/SELF-HOSTED.md',
              },
              {
                title: 'Air-gap',
                tagline: 'Zero outbound',
                color: 'var(--color-runtime)',
                body: 'Regulated workloads — healthcare, fintech, government. Perpetual license JWT, telemetry kill-switch, single-key install. No network beyond your LLM endpoint (cloud or local model).',
                cta: 'See the air-gap guide',
                href: 'https://github.com/OneNomad-LLC/cortex/blob/main/docs/AIR-GAP-DEPLOY.md',
              },
            ].map((d) => (
              <div
                key={d.title}
                className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-7"
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-widest"
                  style={{ color: d.color }}
                >
                  {d.tagline}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[color:var(--color-text-primary)]">
                  {d.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {d.body}
                </p>
                <a
                  href={d.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: d.color }}
                >
                  {d.cta} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Bench credibility (reframed: we benchmark the category) ── */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-bench)]/20 bg-gradient-to-br from-[color:var(--color-bg-surface)]/80 to-[color:var(--color-bg-elevated)]/40 p-8 backdrop-blur">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-20 blur-3xl"
              style={{ background: 'var(--color-bench)' }}
            />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  Where we&apos;re coming from
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
                  We benchmark our own category.{' '}
                  <span style={{ color: 'var(--color-bench)' }}>Publicly.</span>
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
                  Before we built a product, we built the bench: vendor-neutral, deterministic,
                  Ed25519-signed receipts on a sealed holdout. No LLM judges. Anyone can re-run
                  it. The discipline that goes into shipping signed receipts every release
                  is the same discipline that goes into the product.
                </p>
              </div>
              <a
                href="/bench"
                className="inline-flex w-fit items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-[color:var(--color-charcoal)] shadow-lg transition-all hover:brightness-110"
                style={{
                  background: 'var(--color-bench)',
                  boxShadow: '0 8px 24px -8px rgba(59,158,255,0.5)',
                }}
              >
                Explore the bench →
              </a>
            </div>
          </div>
        </section>

        {/* ─── Pricing teaser ─────────────────────────────────────────── */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              Per-seat + metered overage. No surprise bills.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[color:var(--color-text-secondary)]">
              Linear-style pricing — seat base + small overage on cortex queries.
              Annual = 2 months free. Self-hosted is flat.
            </p>
          </div>

          {/* Pilot strip — risk-free trial SKU above the tier grid */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-[color:var(--color-voice)]/30 bg-gradient-to-br from-[color:var(--color-voice)]/[0.08] to-[color:var(--color-memory)]/[0.04] p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-voice)]/40 bg-[color:var(--color-voice)]/10 px-3 py-1 text-[11px] font-medium text-[color:var(--color-voice)]">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-voice)]"
                    style={{ boxShadow: '0 0 8px var(--color-voice)' }}
                  />
                  Pilot · prove it on a real workload
                </div>
                <h3 className="mt-3 text-xl font-semibold text-[color:var(--color-text-primary)]">
                  <span className="text-[color:var(--color-voice)]">$1,000</span>{' '}
                  one-time · 10 seats · 90 days
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  Full Business-tier features with no card on file. Convert to annual
                  within 90 days and the $1K applies as credit. Built for agencies
                  running a client pilot or teams running a department POC.
                </p>
              </div>
              <a
                href="/app/billing/upgrade?plan=pilot"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-[color:var(--color-voice)]/60 bg-[color:var(--color-voice)]/10 px-5 py-3 text-sm font-semibold text-[color:var(--color-voice)] transition-colors hover:bg-[color:var(--color-voice)]/20"
              >
                Start a Pilot →
              </a>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                name: 'Solo',
                price: '$19',
                cadence: '/seat/mo',
                fit: 'evaluating or building solo',
                blurb: 'Full features. Single seat. No SSO.',
                cta: 'Start free',
              },
              {
                name: 'Crew',
                price: '$25',
                cadence: '/seat/mo',
                fit: 'shipping with a team',
                blurb: '5-seat min · SSO · audit log · webhook export',
                cta: 'Start free',
                highlight: true,
              },
              {
                name: 'Business',
                price: '$59',
                cadence: '/seat/mo',
                fit: 'company-wide rollout',
                blurb: '25-seat min · SCIM · active-seat · SLA · DPA',
                cta: 'Start free',
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                cadence: '',
                fit: 'air-gap, perpetual key, custom DPA',
                blurb: 'Annual contract. Dedicated CSM. Mixed-deploy supported.',
                cta: 'Contact sales',
              },
            ].map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-6 transition-colors ${
                  t.highlight
                    ? 'border-[color:var(--color-knowledge)]/40 bg-[color:var(--color-knowledge)]/[0.06]'
                    : 'border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40'
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    t.highlight
                      ? 'text-[color:var(--color-knowledge)]'
                      : 'text-[color:var(--color-text-primary)]'
                  }`}
                >
                  {t.name}
                </h3>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  {t.fit}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[color:var(--color-text-primary)]">
                    {t.price}
                  </span>
                  {t.cadence ? (
                    <span className="text-sm text-[color:var(--color-text-muted)]">
                      {t.cadence}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {t.blurb}
                </p>
                <a
                  href="/app/billing/upgrade"
                  className={`mt-6 inline-block rounded-md border px-4 py-2 text-xs font-semibold transition-colors ${
                    t.highlight
                      ? 'border-[color:var(--color-knowledge)] bg-[color:var(--color-knowledge)] text-[color:var(--color-charcoal)] hover:brightness-110'
                      : 'border-[color:var(--color-border-default)] text-[color:var(--color-text-primary)] hover:border-[color:var(--color-knowledge)]/60'
                  }`}
                >
                  {t.cta} →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
            <a
              href="/app/billing/upgrade"
              className="font-medium text-[color:var(--color-knowledge)] transition-opacity hover:opacity-80"
            >
              See all plans, overage rates, and mixed-deployment billing →
            </a>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────────────────────── */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              The questions you&apos;d ask first.
            </h2>
          </div>
          <FaqAccordion items={PLATFORM_FAQS} />
        </section>
      </main>
      <Footer />
    </>
  )
}
