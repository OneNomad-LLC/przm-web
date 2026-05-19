import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'przm. Vendor-neutral AI reliability benchmarks',
  description:
    'Signed, reproducible, adversarial benchmarks for AI failure modes that do not have standards yet. Multi-agent convergence. Memory recall. Code review reliability.',
}

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
        {/* Hero */}
        <section className="relative mb-16">
          {/* Terminal grid bg */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-3 py-1 text-[color:var(--color-text-secondary)]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-bench)]"
                style={{ boxShadow: '0 0 8px var(--color-bench)' }}
              />
              Ed25519-signed receipts
            </span>
            <span className="rounded-full border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bench)]/10 px-3 py-1 text-[color:var(--color-bench)]">
              Apache 2.0
            </span>
            <span className="rounded-full border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-3 py-1 text-[color:var(--color-text-secondary)]">
              No LLM judge
            </span>
            <span className="rounded-full border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-3 py-1 text-[color:var(--color-text-secondary)]">
              Deterministic scoring
            </span>
          </div>

          <h1 className="mt-6 font-mono text-4xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            AI{' '}
            <span className="relative" style={{ color: 'var(--color-memory)' }}>
              reliability
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-1 inset-y-1 -z-10 rounded-md blur-xl"
                style={{ background: 'rgba(232,64,64,0.10)' }}
              />
            </span>
            , measured.
            <br />
            Signed. Reproducible. Adversarial.
          </h1>

          <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            We publish vendor-neutral benchmarks for AI failure modes that don't have standards
            yet. Multi-agent debates that collapse to confidently wrong answers. Memory systems
            that forget the things you need. Code review tools that miss what they should catch.
            Deterministic scoring with{' '}
            <span style={{ color: 'var(--color-bench)' }}>no LLM judge anywhere</span>,
            and every result is an Ed25519-signed receipt that anyone can verify.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-bench)' }}
            >
              See the leaderboard &rarr;
            </a>
            <a
              href="/vendor-cert"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bench)]/40 px-5 py-2.5 font-mono text-xs text-[color:var(--color-bench)] transition-colors hover:border-[color:var(--color-bench)] hover:bg-[color:var(--color-bench)]/10"
            >
              Get your framework certified
            </a>
            <a
              href="/methodology"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-5 py-2.5 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
            >
              Methodology
            </a>
            <a
              href="https://github.com/OneNomad-LLC/przm-bench"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-5 py-2.5 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
            >
              GitHub
            </a>
          </div>

          {/* Benchmark family tracker */}
          <div className="mt-8 grid max-w-3xl gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-4 font-mono text-xs">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: 'var(--color-bench)',
                    boxShadow: '0 0 8px var(--color-bench)',
                  }}
                />
                <span className="uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  v0.1 &middot; signed
                </span>
              </div>
              <div className="mb-1 text-[color:var(--color-text-primary)]">
                Multi-agent convergence
              </div>
              <div className="text-[color:var(--color-text-secondary)]">
                baseline &middot; AutoGen <span className="text-[color:var(--color-text-disabled)]">&middot; CrewAI · LangGraph · OpenAI Agents SDK (v0.2)</span>
              </div>
            </div>
            <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-4 font-mono text-xs">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--color-memory)' }}
                />
                <span className="uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  v0.2 &middot; adapters built
                </span>
              </div>
              <div className="mb-1 text-[color:var(--color-text-primary)]">AI memory recall</div>
              <div className="text-[color:var(--color-text-secondary)]">
                Engram &middot; Mem0 <span className="text-[color:var(--color-text-disabled)]">&middot; Letta · Zep · MemPalace · HippoRAG (v0.2)</span>
              </div>
            </div>
            <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-4 font-mono text-xs">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--color-text-disabled)' }}
                />
                <span className="uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  next
                </span>
              </div>
              <div className="mb-1 text-[color:var(--color-text-primary)]">
                AI code review reliability
              </div>
              <div className="text-[color:var(--color-text-secondary)]">
                Snyk &middot; Semgrep &middot; CodeRabbit &middot; Cursor Security Reviewer
              </div>
            </div>
          </div>
        </section>

        {/* Convergence headline finding */}
        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
              // Latest finding · convergence v0.1
            </h2>
            <a
              href="/leaderboard"
              className="font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-bench)]"
            >
              Full leaderboard &rarr;
            </a>
          </div>
          <div
            className="rounded-lg border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bg-surface)]/40 p-6"
            style={{ boxShadow: '0 0 20px rgba(52,196,104,0.06)' }}
          >
            <p className="font-mono text-base leading-relaxed text-[color:var(--color-text-primary)]">
              On the sealed 6-fixture holdout, AutoGen RoundRobinGroupChat
              collapsed{' '}
              <span style={{ color: 'var(--color-bench)' }} className="font-semibold">
                0 of 6 scenarios
              </span>{' '}
              while the hand-rolled baseline collapsed 5 of 6, same model
              (
              <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-sm">
                gpt-4o-mini
              </code>
              ). On the 30-fixture combined set: AutoGen 10%, baseline 73%.
              Holds even when we control for reveal protocol. The sequential
              baseline still hits 87% collapse on the same fixtures.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                { label: 'baseline / claude-haiku-4.5', correct: '96.7%', collapse: '56.7%' },
                { label: 'baseline / gpt-5-mini', correct: '96.7%', collapse: '96.7%' },
                { label: 'baseline / gpt-4o-mini', correct: '76.7%', collapse: '73.3%' },
                { label: 'autogen / gpt-4o-mini', correct: '93.3%', collapse: '10.0%' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]/40 p-3 font-mono text-[11px]"
                >
                  <div className="mb-1 truncate text-[color:var(--color-text-secondary)]">
                    {row.label}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[color:var(--color-text-muted)]">correct</span>
                    <span className="text-[color:var(--color-text-primary)]">{row.correct}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[color:var(--color-text-muted)]">collapse</span>
                    <span style={{ color: 'var(--color-memory)' }}>{row.collapse}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] text-[color:var(--color-text-muted)]">
              Signed run, 2026-05-18 · 30 fixtures · 3 agents &times; 3 rounds · every row backed by an
              Ed25519-signed receipt (click through to verify)
            </p>
          </div>
        </section>

        {/* Memory bench — pointer to the second axis */}
        <section className="mt-16 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-6">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-memory)' }}
            />
            second axis · AI memory recall
          </div>
          <p className="font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            The second benchmark axis is{' '}
            <a
              href="/methodology#memory"
              className="text-[color:var(--color-memory)] underline-offset-4 hover:underline"
            >
              AI memory recall
            </a>
            : deterministic R@K and NDCG scoring on LongMemEval temporal-inference and LoCoMo. The methodology is published. The runner and adapters for Engram and Mem0 are committed in the{' '}
            <a
              href="https://github.com/OneNomad-LLC/przm-bench/tree/main/src/adapters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              przm-bench repo
            </a>
            . Signed memory receipts publish on the v0.2 cycle alongside Letta, Zep, MemPalace, and HippoRAG adapters. The convergence axis above is the v0.1 wedge; multi-axis follows when each axis ships with its own signed receipt, not before.
          </p>
        </section>

        {/* For vendors */}
        <section className="mt-20 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // For vendors
          </h2>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            If you ship an AI framework, memory system, or code-review product,
            certify your release against przm. A signed receipt is a third-party
            performance attestation you can put on your own website. We do not
            sell the harness; we run the test.{' '}
            <a
              href="/vendor-cert"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              See certification tiers and start a charter request &rarr;
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
