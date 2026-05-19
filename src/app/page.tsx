import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FaqAccordion } from '@/components/faq-accordion'

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
        {/* Hero — split layout (Atomist-style) */}
        <section className="relative mb-20 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          {/* Terminal grid bg */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Left column: copy */}
          <div>
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
            </div>

            <h1 className="mt-6 font-mono text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)] md:text-6xl">
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
            </h1>

            <p className="mt-6 max-w-xl font-mono text-base leading-relaxed text-[color:var(--color-text-secondary)]">
              Vendor-neutral benchmarks for AI failure modes that don't have standards yet.
              Deterministic scoring,{' '}
              <span style={{ color: 'var(--color-bench)' }}>no LLM judge anywhere</span>, and every
              result is an Ed25519-signed receipt that anyone can verify.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-bench)' }}
              >
                See the leaderboard &rarr;
              </a>
              <a
                href="/vendor-cert"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bench)]/40 px-6 py-3 font-mono text-sm text-[color:var(--color-bench)] transition-colors hover:border-[color:var(--color-bench)] hover:bg-[color:var(--color-bench)]/10"
              >
                Get certified
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[11px] text-[color:var(--color-text-muted)]">
              <a
                href="/methodology"
                className="underline-offset-4 hover:text-[color:var(--color-bench)] hover:underline"
              >
                Methodology
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://github.com/OneNomad-LLC/przm-bench"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-[color:var(--color-bench)] hover:underline"
              >
                GitHub
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/verify"
                className="underline-offset-4 hover:text-[color:var(--color-bench)] hover:underline"
              >
                Verify a receipt
              </a>
            </div>
          </div>

          {/* Right column: leaderboard preview card */}
          <div
            className="rounded-xl border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bg-surface)]/60 p-5 shadow-2xl shadow-black/40"
            style={{ boxShadow: '0 0 40px rgba(52,196,104,0.08)' }}
          >
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className="flex items-center gap-2 text-[color:var(--color-text-muted)]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: 'var(--color-bench)',
                    boxShadow: '0 0 8px var(--color-bench)',
                  }}
                />
                v0.1 signed run
              </span>
              <span className="text-[color:var(--color-text-disabled)]">2026-05-19</span>
            </div>
            <div className="font-mono text-xs text-[color:var(--color-text-secondary)]">
              <div className="mb-2 flex justify-between border-b border-[color:var(--color-border-subtle)] pb-2 text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                <span>adapter / model</span>
                <span>holdout collapse</span>
              </div>
              {[
                { label: 'autogen / gpt-4o-mini', value: '0.0%', winner: true },
                { label: 'baseline-seq / claude-haiku-4.5', value: '66.7%' },
                { label: 'baseline / claude-haiku-4.5', value: '66.7%' },
                { label: 'baseline / gpt-4o-mini', value: '83.3%' },
                { label: 'baseline-seq / gpt-4o-mini', value: '83.3%' },
                { label: 'baseline / gpt-5-mini', value: '100.0%' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between border-b border-[color:var(--color-border-subtle)]/60 py-2 last:border-b-0"
                >
                  <span className="truncate text-[color:var(--color-text-primary)]">{row.label}</span>
                  <span
                    style={{ color: row.winner ? 'var(--color-bench)' : 'var(--color-text-secondary)' }}
                    className={row.winner ? 'font-semibold' : ''}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="/leaderboard"
              className="mt-4 block text-center font-mono text-[11px] text-[color:var(--color-text-muted)] underline-offset-4 hover:text-[color:var(--color-bench)] hover:underline"
            >
              Full leaderboard &rarr;
            </a>
          </div>
        </section>

        {/* Frameworks tested — social-proof strip */}
        <section className="mb-20">
          <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            Adapters on the v0.1 leaderboard
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm">
            {[
              'baseline-Anthropic',
              'baseline-Azure',
              'AutoGen',
              { label: 'CrewAI', soon: true },
              { label: 'LangGraph', soon: true },
              { label: 'OpenAI Agents SDK', soon: true },
              { label: 'AG2', soon: true },
              { label: 'Agno', soon: true },
            ].map((item, i) => {
              const label = typeof item === 'string' ? item : item.label
              const soon = typeof item === 'object' && item.soon
              return (
                <span
                  key={i}
                  className={
                    soon
                      ? 'text-[color:var(--color-text-disabled)]'
                      : 'text-[color:var(--color-text-secondary)]'
                  }
                >
                  {label}
                  {soon ? (
                    <span className="ml-1 text-[10px] uppercase tracking-widest">v0.2</span>
                  ) : null}
                </span>
              )
            })}
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

        {/* How it works — 3-step */}
        <section className="mt-20">
          <div className="mb-10 text-center">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
              // How przm works
            </h2>
            <p className="mt-3 font-mono text-2xl leading-tight text-[color:var(--color-text-primary)] md:text-3xl">
              Three steps from adapter to signed receipt.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Build the adapter',
                body: 'Implement the MultiAgentAdapter contract for your framework, or PR the existing reference adapters in przm-bench. ~30 lines of TypeScript.',
                accent: 'var(--color-bench)',
              },
              {
                step: '02',
                title: 'Run the bench',
                body: 'Run the harness against the fixture set. Deterministic scoring on recorded state. No LLM in the grading loop. Receipts publish to disk.',
                accent: 'var(--color-knowledge)',
              },
              {
                step: '03',
                title: 'Sign and verify',
                body: 'Receipts are Ed25519-signed against the public key committed in the repo. Anyone can re-run, verify the signature in their browser, and compare to other adapters.',
                accent: 'var(--color-memory)',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6"
              >
                <div
                  className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs"
                  style={{ borderColor: s.accent, color: s.accent }}
                >
                  {s.step}
                </div>
                <h3 className="font-mono text-base font-semibold text-[color:var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="mt-2 font-mono text-[13px] leading-relaxed text-[color:var(--color-text-secondary)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
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

        {/* FAQ */}
        <section className="mt-20">
          <div className="mb-8 text-center">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
              // FAQ
            </h2>
            <p className="mt-3 font-mono text-2xl leading-tight text-[color:var(--color-text-primary)] md:text-3xl">
              The questions you'd ask first.
            </p>
          </div>
          <FaqAccordion />
        </section>
      </main>
      <Footer />
    </>
  )
}
