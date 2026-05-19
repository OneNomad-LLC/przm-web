'use client'

import { useState } from 'react'

interface FaqItem {
  q: string
  a: React.ReactNode
}

const FAQS: FaqItem[] = [
  {
    q: 'How is this different from Patronus, Braintrust, or LangSmith?',
    a: (
      <>
        They sell eval SaaS to the same AI app builders whose frameworks you'd
        want benchmarked. That's a structural conflict: publishing "this
        framework's agents collapse to wrong answers" antagonizes their customer
        base. przm doesn't sell into the framework market; we publish numbers and
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
        the wrongness is testable on a clone, not hidden in a judge model's
        opinion. Second, every receipt is Ed25519-signed against a clean source
        commit. If we got something wrong, the open source means you find it
        faster than we could hide it. That's the credibility chain — methodology
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
        That's a small N and the headline (73% baseline collapse vs 10% AutoGen
        on combined; 5/6 vs 0/6 on holdout) could narrow as fixtures expand.
        The 20% sealed holdout is the partial defense (split committed before
        any signed receipts published), but we'd rather take fixture PRs than
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

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-[color:var(--color-border-subtle)] overflow-hidden rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 backdrop-blur">
      {FAQS.map((item, i) => {
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
