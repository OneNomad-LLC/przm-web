import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CharterSignupForm } from '@/components/charter-signup-form'

export const metadata: Metadata = {
  title: 'Vendor certification | przm',
  description:
    'Get your AI framework or model independently benchmarked. Signed Ed25519 receipt with per-scenario transcripts. Charter slots open.',
  alternates: { canonical: '/vendor-cert' },
  openGraph: {
    type: 'website',
    title: 'przm vendor certification',
    description:
      'Independent third-party benchmarking for AI frameworks and models. Signed, deterministic, publishable.',
    url: 'https://przm.sh/vendor-cert',
  },
}

const offerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI framework benchmarking and certification',
  provider: {
    '@type': 'Organization',
    name: 'OneNomad LLC',
    url: 'https://przm.sh',
  },
  description:
    'Independent third-party benchmarking of AI frameworks and models. Signed Ed25519 receipts with per-scenario transcripts.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Charter customer',
      price: '0',
      priceCurrency: 'USD',
      description:
        'Free signed receipt for the first 3-5 charter customers in exchange for case-study rights.',
    },
    {
      '@type': 'Offer',
      name: 'Standard certification',
      price: '999',
      priceCurrency: 'USD',
      description:
        'One full benchmark run, signed receipt, private findings brief.',
    },
    {
      '@type': 'Offer',
      name: 'Extended certification',
      price: '2499',
      priceCurrency: 'USD',
      description: 'Standard + holdout subset run + 72-hour turnaround.',
    },
    {
      '@type': 'Offer',
      name: 'Enterprise certification',
      price: '9999',
      priceCurrency: 'USD',
      description:
        'Custom fixture set authored against your domain. Private receipt.',
    },
  ],
}

interface Tier {
  badge?: string
  name: string
  price: string
  priceNote?: string
  description: string
  highlight?: boolean
  features: string[]
  cta: { label: string; href: string }
}

const tiers: Tier[] = [
  {
    badge: '5 charter slots open',
    name: 'Charter',
    price: '$0',
    priceNote: 'first 3–5 vendors only',
    description:
      'Free signed receipt for the launch leaderboard, in exchange for case-study rights and a public quote.',
    highlight: true,
    features: [
      'One full benchmark run on your release',
      'Ed25519-signed receipt with per-scenario transcripts',
      'Logo placement on the v0.1 launch leaderboard',
      'Charter-customer badge for your website / README',
      'Private findings brief before publication',
      'You provide: company name, 1-2 sentence quote, sample API key',
    ],
    cta: {
      label: 'Claim a charter slot',
      href: '#claim',
    },
  },
  {
    name: 'Standard',
    price: '$999',
    priceNote: 'per release',
    description:
      'Production cert for an individual framework or model release. 5-business-day turnaround.',
    features: [
      'One full benchmark run on your release',
      'Ed25519-signed receipt with per-scenario transcripts',
      'Public leaderboard entry',
      'Private findings brief with the scenarios where you lost points',
      '5 business day turnaround',
    ],
    cta: {
      label: 'Choose this tier',
      href: '#claim?tier=standard',
    },
  },
  {
    name: 'Extended',
    price: '$2,499',
    priceNote: 'per release',
    description:
      'Standard plus the holdout subset (your strongest defense against benchmark-gaming claims).',
    features: [
      'Everything in Standard',
      'Runs against both seen + 20% holdout fixture set',
      'Seen-vs-holdout delta published with your leaderboard entry',
      '72-hour priority turnaround',
    ],
    cta: {
      label: 'Choose this tier',
      href: '#claim?tier=extended',
    },
  },
  {
    name: 'Enterprise',
    price: '$9,999',
    priceNote: 'per release',
    description:
      'Custom fixture set authored against your stated use case. Private receipt unless you choose to publish.',
    features: [
      'Everything in Extended',
      'Custom fixture set for your domain and failure modes',
      'Private receipt by default (your choice to publish)',
      'Re-run option if you ship a patch within 30 days',
      '72-hour priority turnaround',
    ],
    cta: {
      label: 'Choose this tier',
      href: '#claim?tier=enterprise',
    },
  },
]

export default function VendorCertPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] px-6 pb-20 pt-20">
        {/* Hero */}
        <section className="mb-16">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // vendor certification
          </div>
          <h1 className="font-mono text-4xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            Get your framework{' '}
            <span style={{ color: 'var(--color-bench)' }}>independently</span>{' '}
            benchmarked.
          </h1>
          <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            "Our agents are reliable" is something every framework vendor says.
            A przm receipt is the thing that makes it verifiable.
          </p>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            We run the benchmark independently against your release, sign the
            receipt with our Ed25519 key, and publish it on the public
            leaderboard. You get a third-party performance attestation you can
            link from your README, your sales deck, your landing page,
            or anywhere "this is what the test said" beats "trust us."
          </p>
        </section>

        {/* Pricing tiers */}
        <section className="mb-20" id="pricing">
          <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // pricing
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={
                  tier.highlight
                    ? 'relative flex flex-col rounded-lg border-2 border-[color:var(--color-bench)] bg-[color:var(--color-bg-surface)]/60 p-6'
                    : 'relative flex flex-col rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6'
                }
                style={
                  tier.highlight
                    ? { boxShadow: '0 0 24px rgba(52,196,104,0.10)' }
                    : undefined
                }
              >
                {tier.badge ? (
                  <div
                    className="absolute -top-3 left-4 rounded-full bg-[color:var(--color-bench)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-charcoal)]"
                  >
                    {tier.badge}
                  </div>
                ) : null}
                <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  {tier.name}
                </div>
                <div className="mb-2 flex items-baseline gap-2">
                  <span
                    className="font-mono text-4xl font-semibold"
                    style={{
                      color: tier.highlight
                        ? 'var(--color-bench)'
                        : 'var(--color-text-primary)',
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.priceNote ? (
                    <span className="font-mono text-xs text-[color:var(--color-text-muted)]">
                      {tier.priceNote}
                    </span>
                  ) : null}
                </div>
                <p className="mb-5 font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                  {tier.description}
                </p>
                <ul className="mb-6 flex flex-1 flex-col gap-2 font-mono text-xs text-[color:var(--color-text-secondary)]">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span
                        className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full"
                        style={{
                          background: tier.highlight
                            ? 'var(--color-bench)'
                            : 'var(--color-text-disabled)',
                        }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.cta.href}
                  className={
                    tier.highlight
                      ? 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center font-mono text-xs font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-90'
                      : 'inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2.5 text-center font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]'
                  }
                  style={
                    tier.highlight ? { background: 'var(--color-bench)' } : undefined
                  }
                >
                  {tier.cta.label} &rarr;
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-[color:var(--color-text-muted)]">
            Volume pricing available for framework vendors who certify each
            major release.{' '}
            <a
              href="mailto:matt@przm.sh?subject=przm%20volume%20pricing"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              Get in touch.
            </a>
          </p>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // how it works
          </h2>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Fill out the form below',
                body: 'Your framework name, the release version you want certified, which LLM model your framework will run. You get an automated ack within minutes; Matt follows up within one business day.',
              },
              {
                n: '02',
                title: 'Provide a sample API key',
                body: 'Enough to run the full fixture set (~$5–15 in API costs). We use your key so the run is billed to you and you can independently audit what was called.',
              },
              {
                n: '03',
                title: 'Adapter implementation',
                body: 'If you already have a PR against the przm-bench repo, we use that. If not, we implement a baseline adapter and you review it before we run.',
              },
              {
                n: '04',
                title: 'Run the bench',
                body: 'Temperature 0, seeded where the framework supports it. For non-deterministic frameworks: 3 runs, median per-axis score.',
              },
              {
                n: '05',
                title: 'Private findings brief',
                body: 'You see the numbers privately first. 48 hours to flag any adapter-implementation errors. We will fix genuine bugs; we will not re-run because the score was low.',
              },
              {
                n: '06',
                title: 'Sign + publish',
                body: 'Ed25519-signed receipt committed to the public ledger. You get the signed file to link from your own marketing.',
              },
            ].map((step) => (
              <li
                key={step.n}
                className="flex flex-col gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-5"
              >
                <div className="font-mono text-2xl font-semibold text-[color:var(--color-bench)]">
                  {step.n}
                </div>
                <div className="font-mono text-sm text-[color:var(--color-text-primary)]">
                  {step.title}
                </div>
                <p className="font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* What it does NOT include */}
        <section className="mb-20">
          <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // what it does NOT include
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: 'You do not see the fixtures in advance.',
                body: "That's the point. If you saw the test questions, the score would be meaningless. The holdout set is sealed from everyone vendor-side, including us.",
              },
              {
                title: 'We do not tune the benchmark to your strengths.',
                body: 'The scenarios are designed to break things, not to flatter them. If your framework has a sycophancy problem, the receipt will say so.',
              },
              {
                title: 'No retakes before publishing.',
                body: 'A certification run is a certification run. If you want to improve your score, ship a better version and certify that release. Historical receipts stay in the ledger with their original scores.',
              },
              {
                title: 'Certification is not an endorsement.',
                body: '"przm recommends this product" is not what a receipt says. A receipt says "this is what we found when we ran the test." Vendors with high scores AND low scores can publish; the meaning depends on context and the comparison.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/20 p-5"
              >
                <div className="mb-2 font-mono text-sm text-[color:var(--color-text-primary)]">
                  {item.title}
                </div>
                <p className="font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // questions
          </h2>
          <div className="flex flex-col gap-6">
            {[
              {
                q: 'Can I certify a model instead of a framework?',
                a: 'Yes. LLM providers can certify a specific model version against the baseline adapter. Contact us for model-specific pricing.',
              },
              {
                q: 'What if I disagree with the methodology?',
                a: 'The methodology is open source. Submit a PR. We take adversarial feedback seriously. The spec explicitly allows competitors to submit replacement confederate prompts and we publish both runs. If your objection is substantive, it makes the benchmark better.',
              },
              {
                q: 'What if the benchmark changes between my v1 cert and my v2 cert?',
                a: 'Receipts pin the benchmark version. A convergence-v0.1 receipt is always comparable to other convergence-v0.1 receipts. When the benchmark version bumps, prior receipts stay in the ledger with their version label.',
              },
              {
                q: 'How do you make money if the harness is open source?',
                a: "We don't sell the harness; we sell being the third party that ran the test. Same way a security auditor sells their name, not their checklist. The OSS is free. The signed-by-us receipt is the product.",
              },
            ].map((item) => (
              <div key={item.q}>
                <div className="mb-2 font-mono text-sm text-[color:var(--color-text-primary)]">
                  {item.q}
                </div>
                <p className="font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Charter signup form (replaces the static mailto: CTA) */}
        <section id="claim" className="scroll-mt-24">
          <CharterSignupForm />
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
        />
      </main>
      <Footer />
    </>
  )
}
