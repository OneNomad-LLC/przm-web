'use client'

import { useState } from 'react'

export interface FaqItem {
  q: string
  a: React.ReactNode
}

// ─── Bench FAQ (shown on /bench) ────────────────────────────────────────────
export const BENCH_FAQS: FaqItem[] = [
  {
    q: 'How is this different from Patronus, Braintrust, or LangSmith?',
    a: (
      <>
        They sell eval SaaS to the same AI app builders whose frameworks you&apos;d
        want benchmarked. That&apos;s a structural conflict: publishing &quot;this
        framework&apos;s agents collapse to wrong answers&quot; antagonizes their customer
        base. przm doesn&apos;t sell into the framework market; we publish numbers and
        sell third-party certification on top. Different revenue model, different
        incentive shape, vendor-neutral by construction.
      </>
    ),
  },
  {
    q: 'How do you handle adapter fairness — what if your CrewAI adapter handicaps CrewAI?',
    a: (
      <>
        Every adapter lives in the public repo at{' '}
        <a
          href="https://github.com/OneNomad-LLC/przm-bench/tree/main/src/adapters/multiagent"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
        >
          przm-bench/src/adapters/multiagent
        </a>
        . Framework maintainers can PR changes (parser leniency, prompt
        structure, default agent count). We publish both runs side-by-side when
        an adapter PR materially changes a score. Adapter authorship is named in
        every receipt, and the receipt schema pins the adapter version + git
        commit.
      </>
    ),
  },
  {
    q: 'You use AI to build the bench. Why should I trust an AI-built benchmark?',
    a: (
      <>
        Two reasons. First, no LLM is in the grading loop. Scoring is
        pure-function math on recorded state. The bench code can be wrong, but
        the wrongness is testable on a clone, not hidden in a judge model&apos;s
        opinion. Second, every receipt is Ed25519-signed against a clean source
        commit. If we got something wrong, the open source means you find it
        faster than we could hide it. That&apos;s the credibility chain — methodology
        published, code published, receipts signed, signatures verifiable in
        your browser.
      </>
    ),
  },
  {
    q: 'What does a charter cert get me?',
    a: (
      <>
        Free signed receipt + public leaderboard placement on launch day, in
        exchange for permission to cite your company by name and a 1-2 sentence
        quote we can use. First 3-5 framework vendors only. After that, $999 per
        release for standard cert, $2,499 for extended (includes holdout subset
        run), $9,999 for enterprise (custom fixture set, private receipt
        option). Full tier breakdown at{' '}
        <a
          href="/vendor-cert"
          className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
        >
          /vendor-cert
        </a>
        .
      </>
    ),
  },
  {
    q: 'How small is the v0.1 sample, and could the headline gap close?',
    a: (
      <>
        v0.1 ships 30 hand-curated convergence scenarios across 5 categories.
        That&apos;s a small N and the headline (73% baseline collapse vs 10% AutoGen
        on combined; 5/6 vs 0/6 on holdout) could narrow as fixtures expand.
        The 20% sealed holdout is the partial defense (split committed before
        any signed receipts published), but we&apos;d rather take fixture PRs than
        claim final-ranking authority on n=30. v0.2 expands the set and adds
        adapters for CrewAI, LangGraph, OpenAI Agents SDK.
      </>
    ),
  },
  {
    q: 'Can I verify a receipt without trusting your server?',
    a: (
      <>
        Yes. Every receipt is an Ed25519-signed JSON document; the public key is
        committed in the repo at{' '}
        <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-[11px]">
          keys/convergence-preview.pub
        </code>
        . You can verify in your browser via SubtleCrypto at{' '}
        <a
          href="/verify"
          className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
        >
          /verify
        </a>{' '}
        — no data leaves your machine — or in Node by calling{' '}
        <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-[11px]">
          verifyConvergenceReceipt
        </code>{' '}
        from the published harness. Tampering any field invalidates the
        signature.
      </>
    ),
  },
]

// ─── Platform FAQ (shown on / homepage) ─────────────────────────────────────
export const PLATFORM_FAQS: FaqItem[] = [
  {
    q: 'What’s the relationship between Cortex, Memory, Voice, and Bench?',
    a: (
      <>
        <strong className="text-[color:var(--color-text-primary)]">Cortex</strong>{' '}
        is the multi-tenant knowledge plane — the primary commercial product —
        where your team&apos;s AI agents pull shared, verified knowledge from
        GitHub, Confluence, Slack, Notion, and more.{' '}
        <strong className="text-[color:var(--color-text-primary)]">Memory</strong>{' '}
        is per-agent recall (each agent remembers its own conversations and
        decisions).{' '}
        <strong className="text-[color:var(--color-text-primary)]">Voice</strong>{' '}
        is the consistent persona/style layer.{' '}
        <strong className="text-[color:var(--color-text-primary)]">Bench</strong>{' '}
        is the vendor-neutral reliability benchmark we publish to back the
        product&apos;s claims. All four share the same MCP contract.
      </>
    ),
  },
  {
    q: 'Is the core open source? What’s the difference between OSS and the paid platform?',
    a: (
      <>
        Yes — Cortex and the access-service core are Apache-2.0 on public
        GitHub. The paid platform layer adds: multi-tenant Cloud hosting,
        Stripe-based billing, SCIM provisioning, audit-log export to SIEM,
        active-seat designation at Business tier, SOC&nbsp;2 attestation
        (in&nbsp;progress), and an EU region. Every feature paid customers
        get also works in the OSS self-hosted install — there are no
        license-gated features. See{' '}
        <a
          href="/security"
          className="text-[color:var(--color-knowledge)] underline-offset-4 hover:underline"
        >
          /security
        </a>{' '}
        for the open-core contract.
      </>
    ),
  },
  {
    q: 'Can my data stay in the EU? On-prem? Air-gapped?',
    a: (
      <>
        Yes to all three. Cloud has US-East and EU (Frankfurt) regions; tenants
        are region-pinned and the access-service refuses to route an EU tenant
        to a US cortex. Self-hosted runs the same Docker image on your
        infrastructure (Hetzner, Fly, DO, your k8s). Air-gap uses a perpetual
        license JWT and a telemetry kill-switch — no outbound network calls
        beyond your LLM endpoint (cloud or local model). One organization can
        mix all three deployments on one unified Stripe invoice.
      </>
    ),
  },
  {
    q: 'What’s the SOC 2 status?',
    a: (
      <>
        Type 2 in progress. Vanta is the platform, Prescient Assurance is the
        CPA. Type 1 audit targets Q3 2026; Type 2 attestation targets Q1 2027.
        For workloads that can&apos;t wait, self-hosted or air-gap deployment
        runs entirely inside your existing SOC 2 boundary. Full status,
        sub-processor list, supply-chain artifacts (SBOM, cosign signatures,
        SLSA provenance), and runbooks are published at{' '}
        <a
          href="/security"
          className="text-[color:var(--color-knowledge)] underline-offset-4 hover:underline"
        >
          /security
        </a>
        .
      </>
    ),
  },
  {
    q: 'How does pricing actually work? What’s the metered overage?',
    a: (
      <>
        Per-seat base + small metered overage on cortex queries. Solo
        $19/seat/mo, Crew $25 (5-seat min), Business $59 (25-seat min). Annual
        billing gets 2 months free. Overage on cortex_queries is $0.50 per
        1,000 queries beyond your plan&apos;s included quota. First 1,000 GB-equiv
        of ingest is free per organization (Linear-style "no surprise bill"
        ramp). Self-hosted tiers are flat annual.
      </>
    ),
  },
  {
    q: 'How is this different from Mem0, Zep, or LangSmith?',
    a: (
      <>
        Mem0 and Zep are per-agent memory libraries (overlap with our{' '}
        <a
          href="/memory"
          className="text-[color:var(--color-memory)] underline-offset-4 hover:underline"
        >
          Memory
        </a>{' '}
        product but neither offers a multi-tenant knowledge plane). LangSmith is
        observability + eval for LangChain-built apps. przm is the data plane —
        the shared knowledge surface your agents pull FROM — plus the per-agent
        memory and voice. We back it with a public benchmark (
        <a
          href="/bench"
          className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
        >
          /bench
        </a>
        ) so the reliability claims are verifiable. Different layer of the
        stack; complementary not competitive with eval tools.
      </>
    ),
  },
]

interface FaqAccordionProps {
  /** Which FAQ list to render. Defaults to bench (back-compat). */
  items?: FaqItem[]
}

export function FaqAccordion({ items = BENCH_FAQS }: FaqAccordionProps = {}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-[color:var(--color-border-subtle)] overflow-hidden rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 backdrop-blur">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[color:var(--color-bg-elevated)]/40"
            >
              <span className="text-base font-semibold text-[color:var(--color-text-primary)]">
                {item.q}
              </span>
              <span
                className={`mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[color:var(--color-border-default)] text-sm font-light text-[color:var(--color-text-muted)] transition-transform ${
                  isOpen ? 'rotate-45' : ''
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen ? (
              <div className="px-6 pb-6 text-[15px] leading-relaxed text-[color:var(--color-text-secondary)]">
                {item.a}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
