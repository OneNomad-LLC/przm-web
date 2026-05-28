import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FaqAccordion } from '@/components/faq-accordion'

export const metadata: Metadata = {
  title: 'przm Bench — Vendor-neutral AI reliability benchmarks',
  description:
    'Signed, reproducible, adversarial benchmarks for AI failure modes that do not have standards yet. Multi-agent convergence. Memory recall. Code review reliability.',
}

export default async function BenchPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Hero — Atomist-style polished split layout */}
        <section className="relative px-6 py-20 md:py-24">
          {/* Radial glow backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-20 -top-20 -z-10 h-[600px] opacity-60"
            style={{
              background:
                'radial-gradient(60% 50% at 30% 30%, rgba(59,158,255,0.10), transparent 70%), radial-gradient(50% 50% at 80% 20%, rgba(232,64,64,0.08), transparent 70%)',
            }}
          />

          <div className="grid gap-12 md:grid-cols-[1.15fr_1fr] md:items-center">
            {/* Left column: copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bench)]/[0.06] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-bench)]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-bench)]"
                  style={{ boxShadow: '0 0 8px var(--color-bench)' }}
                />
                v0.1 signed receipts live
              </div>

              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-[color:var(--color-text-primary)] md:text-7xl">
                AI{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(135deg, var(--color-memory), var(--color-voice) 60%, var(--color-knowledge))',
                  }}
                >
                  reliability,
                </span>
                <br />
                measured.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
                Vendor-neutral benchmarks for AI failure modes that don&apos;t have standards yet.
                Deterministic scoring,{' '}
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  no LLM judge anywhere
                </span>
                , and every result is an Ed25519-signed receipt anyone can verify.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="/leaderboard"
                  className="group inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-[color:var(--color-charcoal)] shadow-lg transition-all hover:shadow-xl hover:brightness-110"
                  style={{ background: 'var(--color-bench)', boxShadow: '0 8px 24px -8px rgba(59,158,255,0.5)' }}
                >
                  See the leaderboard
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <a
                  href="/vendor-cert"
                  className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-6 py-3.5 text-sm font-semibold text-[color:var(--color-text-primary)] backdrop-blur transition-colors hover:border-[color:var(--color-bench)]/60 hover:bg-[color:var(--color-bg-surface)]"
                >
                  Get certified
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[color:var(--color-text-muted)]">
                <a
                  href="/methodology"
                  className="transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  Methodology
                </a>
                <a
                  href="https://github.com/OneNomad-LLC/przm-bench"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  GitHub
                </a>
                <a
                  href="/verify"
                  className="transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  Verify a receipt
                </a>
                <span className="rounded-full bg-[color:var(--color-bg-surface)]/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                  Apache 2.0 core
                </span>
              </div>
            </div>

            {/* Right column: polished leaderboard card */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-1 rounded-2xl opacity-30 blur-xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-bench), var(--color-runtime) 50%, var(--color-memory))',
                }}
              />
              <div className="relative rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/80 p-6 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="relative flex h-2.5 w-2.5"
                    >
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
                        style={{ background: 'var(--color-bench)' }}
                      />
                      <span
                        className="relative inline-flex h-2.5 w-2.5 rounded-full"
                        style={{ background: 'var(--color-bench)' }}
                      />
                    </span>
                    <span className="text-xs font-semibold text-[color:var(--color-text-primary)]">
                      Live · convergence v0.1
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-disabled)]">
                    holdout · n=6
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between border-b border-[color:var(--color-border-subtle)] pb-2 text-[10px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                    <span>Adapter / Model</span>
                    <span>Collapse ↓</span>
                  </div>
                  {[
                    { label: 'autogen', model: 'gpt-4o-mini', value: '0.0%', winner: true },
                    { label: 'baseline-seq', model: 'haiku-4.5', value: '66.7%' },
                    { label: 'baseline', model: 'haiku-4.5', value: '66.7%' },
                    { label: 'baseline', model: 'gpt-4o-mini', value: '83.3%' },
                    { label: 'baseline-seq', model: 'gpt-4o-mini', value: '83.3%' },
                    { label: 'baseline', model: 'gpt-5-mini', value: '100.0%' },
                  ].map((row) => (
                    <div
                      key={row.label + row.model}
                      className={`flex items-center justify-between rounded-md px-2 py-2 text-sm transition-colors ${
                        row.winner
                          ? 'bg-[color:var(--color-bench)]/10'
                          : 'hover:bg-[color:var(--color-bg-elevated)]/40'
                      }`}
                    >
                      <span className="flex items-baseline gap-2">
                        <span
                          className={`font-medium ${
                            row.winner
                              ? 'text-[color:var(--color-bench)]'
                              : 'text-[color:var(--color-text-primary)]'
                          }`}
                        >
                          {row.label}
                        </span>
                        <span className="font-mono text-[11px] text-[color:var(--color-text-muted)]">
                          {row.model}
                        </span>
                      </span>
                      <span
                        className={`font-mono text-sm tabular-nums ${
                          row.winner
                            ? 'font-bold text-[color:var(--color-bench)]'
                            : 'text-[color:var(--color-text-secondary)]'
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="/leaderboard"
                  className="mt-5 block rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]/40 py-2 text-center text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-bench)]/40 hover:text-[color:var(--color-text-primary)]"
                >
                  Full leaderboard →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Frameworks strip + metrics */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
            Six adapter configurations on the v0.1 leaderboard
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-base font-medium">
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
                    <span className="ml-1.5 rounded-full bg-[color:var(--color-bg-surface)]/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[color:var(--color-text-disabled)]">
                      v0.2
                    </span>
                  ) : null}
                </span>
              )
            })}
          </div>

          {/* Trusted-by-metrics strip */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {[
              { value: '30', label: 'hand-curated fixtures' },
              { value: '12', label: 'Ed25519-signed receipts' },
              { value: '0', label: 'LLM judges anywhere', accent: true },
              { value: '20%', label: 'sealed holdout' },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className="text-3xl font-bold tabular-nums"
                  style={{
                    color: m.accent ? 'var(--color-bench)' : 'var(--color-text-primary)',
                  }}
                >
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Convergence headline finding */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Latest finding · Convergence v0.1
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              Same model, different framework,{' '}
              <span style={{ color: 'var(--color-bench)' }}>10× the reliability gap.</span>
            </h2>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(59,158,255,0.15), transparent 70%)' }}
            />
            <div className="rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 p-8 backdrop-blur">
              <p className="text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
                On the sealed 6-fixture holdout, AutoGen RoundRobinGroupChat collapsed{' '}
                <span className="font-semibold text-[color:var(--color-bench)]">
                  0 of 6 scenarios
                </span>{' '}
                while the hand-rolled baseline collapsed{' '}
                <span className="font-semibold text-[color:var(--color-memory)]">5 of 6</span>, same
                model (
                <code className="rounded bg-[color:var(--color-bg-elevated)] px-2 py-0.5 font-mono text-sm">
                  gpt-4o-mini
                </code>
                ). The gap holds after controlling for reveal protocol — the sequential baseline
                still collapses at 87% on the same fixtures.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {[
                  { label: 'baseline', model: 'haiku-4.5', correct: '96.7%', collapse: '56.7%' },
                  { label: 'baseline', model: 'gpt-5-mini', correct: '96.7%', collapse: '96.7%' },
                  { label: 'baseline', model: 'gpt-4o-mini', correct: '76.7%', collapse: '73.3%' },
                  {
                    label: 'autogen',
                    model: 'gpt-4o-mini',
                    correct: '93.3%',
                    collapse: '10.0%',
                    winner: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label + row.model}
                    className={`rounded-xl border p-4 transition-colors ${
                      row.winner
                        ? 'border-[color:var(--color-bench)]/40 bg-[color:var(--color-bench)]/[0.06]'
                        : 'border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]/40'
                    }`}
                  >
                    <div className="mb-3 flex items-baseline gap-1.5">
                      <span
                        className={`text-sm font-semibold ${
                          row.winner
                            ? 'text-[color:var(--color-bench)]'
                            : 'text-[color:var(--color-text-primary)]'
                        }`}
                      >
                        {row.label}
                      </span>
                      <span className="font-mono text-[10px] text-[color:var(--color-text-muted)]">
                        {row.model}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="uppercase tracking-widest text-[color:var(--color-text-muted)]">
                        correct
                      </span>
                      <span className="font-mono font-medium text-[color:var(--color-text-primary)]">
                        {row.correct}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between text-[11px]">
                      <span className="uppercase tracking-widest text-[color:var(--color-text-muted)]">
                        collapse
                      </span>
                      <span
                        className="font-mono font-semibold"
                        style={{
                          color: row.winner ? 'var(--color-bench)' : 'var(--color-memory)',
                        }}
                      >
                        {row.collapse}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[color:var(--color-border-subtle)] pt-4">
                <p className="text-[11px] text-[color:var(--color-text-muted)]">
                  Signed run · 30 fixtures · 3 agents × 3 rounds · every row backed by an
                  Ed25519-signed receipt
                </p>
                <a
                  href="/leaderboard"
                  className="text-xs font-medium text-[color:var(--color-bench)] transition-opacity hover:opacity-80"
                >
                  Full leaderboard →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Memory bench pointer */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="overflow-hidden rounded-2xl border border-[color:var(--color-memory)]/20 bg-[color:var(--color-bg-surface)]/40 p-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-memory)]/30 bg-[color:var(--color-memory)]/10 px-3 py-1 text-[11px] font-medium text-[color:var(--color-memory)]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--color-memory)' }}
                />
                Second axis · AI memory recall
              </div>
              <p className="text-base leading-relaxed text-[color:var(--color-text-secondary)]">
                Deterministic R@K and NDCG scoring on LongMemEval temporal-inference and LoCoMo.
                Methodology published, runner + Engram and Mem0 adapters committed. Signed memory
                receipts publish on the v0.2 cycle alongside Letta, Zep, MemPalace, and HippoRAG
                adapters.
              </p>
            </div>
            <a
              href="/methodology#memory"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-[color:var(--color-memory)]/40 bg-[color:var(--color-memory)]/10 px-5 py-2.5 text-sm font-semibold text-[color:var(--color-memory)] transition-colors hover:bg-[color:var(--color-memory)]/20"
            >
              Memory methodology →
            </a>
          </div>
          </div>
        </section>

        {/* How it works — 3-step */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              How przm works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              Three steps from adapter to signed receipt.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Build the adapter',
                body: 'Implement the MultiAgentAdapter contract for your framework, or PR the existing reference adapters in przm-bench. About 30 lines of TypeScript.',
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
                body: 'Receipts are Ed25519-signed against the public key committed in the repo. Anyone can re-run, verify the signature in their browser, and compare.',
                accent: 'var(--color-memory)',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="group relative rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-7 transition-all hover:border-[color:var(--color-border-default)]/80 hover:bg-[color:var(--color-bg-surface)]/60"
              >
                <div
                  className="absolute -top-4 left-7 inline-flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold text-[color:var(--color-charcoal)]"
                  style={{ background: s.accent }}
                >
                  {s.step}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[color:var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* For vendors — CTA panel */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-bench)]/20 bg-gradient-to-br from-[color:var(--color-bg-surface)]/80 to-[color:var(--color-bg-elevated)]/40 p-10 backdrop-blur">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
              style={{ background: 'var(--color-bench)' }}
            />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  For vendors
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
                  Certify your release against przm.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
                  A signed receipt is a third-party performance attestation you can put on your own
                  website. We don&apos;t sell the harness — we run the test. First 3-5 framework
                  vendors get a free charter cert in exchange for case-study rights.
                </p>
              </div>
              <a
                href="/vendor-cert"
                className="inline-flex w-fit items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-[color:var(--color-charcoal)] shadow-lg transition-all hover:brightness-110"
                style={{ background: 'var(--color-bench)', boxShadow: '0 8px 24px -8px rgba(59,158,255,0.5)' }}
              >
                See certification tiers →
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              The questions you&apos;d ask first.
            </h2>
          </div>
          <FaqAccordion />
        </section>
      </main>
      <Footer />
    </>
  )
}
