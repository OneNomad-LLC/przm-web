import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  CURRENT_SNAPSHOT,
  pctFormat,
  numFormat,
  primarySubset,
} from '@/lib/leaderboard'

export const metadata: Metadata = {
  title: 'Convergence leaderboard | przm',
  description:
    'Multi-agent convergence and sycophancy scores across frontier LLMs and AI frameworks. Same model, different orchestration: AutoGen RoundRobin collapses 0 of 6 holdout scenarios where the hand-rolled baseline collapses 5 of 6.',
  alternates: { canonical: '/leaderboard' },
  openGraph: {
    type: 'website',
    title: 'przm convergence leaderboard',
    description:
      'Multi-agent convergence + sycophancy across frontier LLMs and frameworks. Same model, different orchestration matters.',
    url: 'https://przm.sh/leaderboard',
  },
}

function SignedBadge() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bench)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-bench)]"
      title="All entries Ed25519-signed. Click 'signed →' on any row to download the receipt; verify it at /verify."
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-bench)]"
        style={{ boxShadow: '0 0 8px var(--color-bench)' }}
      />
      Ed25519-signed receipts
    </span>
  )
}

function Sparkline({ value, max, lowerIsBetter }: { value: number; max: number; lowerIsBetter?: boolean }) {
  // Simple horizontal bar to give visual weight to each row's worst column
  const pct = Math.min(100, (value / max) * 100)
  const isBad = lowerIsBetter ? value > max * 0.5 : value < max * 0.5
  const color = isBad ? 'var(--color-memory)' : 'var(--color-bench)'
  return (
    <div className="mt-1 h-1 w-full rounded-full bg-[color:var(--color-bg-elevated)]">
      <div
        className="h-1 rounded-full"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

function delta(holdout: number, primary: number): React.ReactNode {
  const d = holdout - primary
  if (Math.abs(d) < 0.005) return null
  const sign = d > 0 ? '+' : ''
  const color = Math.abs(d) > 0.05 ? 'var(--color-memory)' : 'var(--color-text-muted)'
  return (
    <span style={{ color }} className="ml-1 text-[10px]">
      ({sign}
      {(d * 100).toFixed(1)}pp)
    </span>
  )
}

export default function LeaderboardPage() {
  const { entries, fixtureCount, configuration, ranAt } = CURRENT_SNAPSHOT

  // Rank entries by primary (combined-or-seen) correctness desc; tie-break by collapse rate asc
  const ranked = [...entries].sort((a, b) => {
    const pa = primarySubset(a)
    const pb = primarySubset(b)
    if (!pa || !pb) return 0
    if (pb.scores.correct_final_answer_rate !== pa.scores.correct_final_answer_rate) {
      return pb.scores.correct_final_answer_rate - pa.scores.correct_final_answer_rate
    }
    return pa.scores.collapse_rate - pb.scores.collapse_rate
  })

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Header */}
        <section className="px-6 py-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Leaderboard · Convergence v0.1
            </span>
            <SignedBadge />
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            Multi-agent{' '}
            <span style={{ color: 'var(--color-bench)' }}>convergence</span>{' '}
            <span className="text-[color:var(--color-text-muted)]">&amp;</span>{' '}
            <span style={{ color: 'var(--color-memory)' }}>sycophancy</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            {fixtureCount} fixtures across 5 categories. Each scenario:{' '}
            {configuration.nAgents} agents debating for {configuration.nRounds}{' '}
            rounds, with one agent confederate-injected with a confident wrong
            answer.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[color:var(--color-text-muted)]">
            <Link
              href="/methodology#convergence"
              className="font-medium transition-colors hover:text-[color:var(--color-bench)]"
            >
              Methodology →
            </Link>
            <span className="font-mono text-[11px] text-[color:var(--color-text-disabled)]">
              Last run: {new Date(ranAt).toISOString().slice(0, 16).replace('T', ' ')} UTC
            </span>
          </div>
        </section>

        {/* Headline finding callout */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(59,158,255,0.15), transparent 70%)' }}
            />
            <div className="rounded-2xl border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bg-surface)]/60 p-8 backdrop-blur">
              <div className="mb-3 text-[10px] font-medium uppercase tracking-widest text-[color:var(--color-bench)]">
                Headline finding
              </div>
              <p className="text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
                On the sealed 6-fixture holdout, holding the model constant (
                <code className="rounded bg-[color:var(--color-bg-elevated)] px-2 py-0.5 font-mono text-base">
                  gpt-4o-mini
                </code>
                ), AutoGen RoundRobinGroupChat collapsed{' '}
                <span className="font-semibold text-[color:var(--color-bench)]">
                  0 of 6 scenarios
                </span>{' '}
                while the hand-rolled baseline collapsed{' '}
                <span className="font-semibold text-[color:var(--color-memory)]">5 of 6</span>. On
                the 30-fixture combined set: AutoGen 10%, baseline 73%. The gap holds even when
                controlling for reveal protocol. The sequential baseline still collapses 87% on the
                same fixtures.
              </p>
            </div>
          </div>
        </section>

        {/* Leaderboard table */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
              Every signed receipt.
            </h2>
            <Link
              href="/verify"
              className="hidden text-xs font-medium text-[color:var(--color-bench)] underline-offset-4 hover:underline sm:block"
            >
              Verify any receipt →
            </Link>
          </div>
          <p className="mb-6 max-w-3xl text-sm text-[color:var(--color-text-muted)]">
            Primary score is the combined 30-fixture run. The{' '}
            <span style={{ color: 'var(--color-memory)' }}>(±Npp)</span> delta in parens is the
            holdout-set delta against the same model on 6 randomly-sealed fixtures not used during
            methodology development. Wide deltas (&gt;5pp) suggest fixture overfit and get
            highlighted.
          </p>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30">
            <table className="w-full font-mono text-xs">
              <thead className="border-b border-[color:var(--color-border-subtle)] text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Adapter / Model</th>
                  <th className="px-4 py-3 text-right">Correct ↑</th>
                  <th className="px-4 py-3 text-right">Collapse ↓</th>
                  <th className="px-4 py-3 text-right">Sycophancy ↓</th>
                  <th className="px-4 py-3 text-right">Tok / correct</th>
                  <th className="px-4 py-3 text-right">Flips/agent·round</th>
                  <th className="px-4 py-3 text-right">Wall</th>
                  <th className="px-4 py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((e, i) => {
                  const primary = primarySubset(e)
                  if (!primary) return null
                  const s = primary.scores
                  const h = e.holdout?.scores
                  return (
                    <tr
                      key={e.id}
                      className="border-b border-[color:var(--color-border-subtle)] last:border-b-0 hover:bg-[color:var(--color-bg-elevated)]/40"
                    >
                      <td className="px-4 py-4">
                        <div className="text-[color:var(--color-text-primary)]">
                          <span
                            className="mr-2 font-semibold"
                            style={{ color: 'var(--color-bench)' }}
                          >
                            #{i + 1}
                          </span>
                          {e.displayName}
                        </div>
                        <div className="mt-1 text-[10px] text-[color:var(--color-text-muted)]">
                          {e.orchestration} · {e.provider}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-[color:var(--color-text-primary)]">
                        {pctFormat(s.correct_final_answer_rate)}
                        {h ? delta(h.correct_final_answer_rate, s.correct_final_answer_rate) : null}
                        <Sparkline value={s.correct_final_answer_rate} max={1} />
                      </td>
                      <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                        {pctFormat(s.collapse_rate)}
                        {h ? delta(h.collapse_rate, s.collapse_rate) : null}
                        <Sparkline value={s.collapse_rate} max={1} lowerIsBetter />
                      </td>
                      <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                        {pctFormat(s.sycophancy_ratio)}
                        {h ? delta(h.sycophancy_ratio, s.sycophancy_ratio) : null}
                        <Sparkline
                          value={s.sycophancy_ratio}
                          max={0.2}
                          lowerIsBetter
                        />
                      </td>
                      <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                        {s.tokens_per_correct_answer.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                        {numFormat(s.position_flips_per_agent_per_round)}
                      </td>
                      <td className="px-4 py-4 text-right text-[color:var(--color-text-muted)]">
                        {(primary.durationSec / 60).toFixed(1)}m
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <a
                            href={primary.receiptPath}
                            className="text-[color:var(--color-bench)] hover:underline"
                          >
                            combined →
                          </a>
                          {e.holdout ? (
                            <a
                              href={e.holdout.receiptPath}
                              className="text-[10px] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-memory)] hover:underline"
                            >
                              holdout →
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* What each axis means */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Axis definitions
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
              What each metric measures.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                term: 'correct_final_answer_rate',
                short: 'Got the right answer',
                def: 'Fraction of scenarios where the consensus answer at the end of the debate matched the known-correct answer. Higher is better.',
                arrow: '↑',
              },
              {
                term: 'collapse_rate',
                short: 'Premature consensus',
                def: 'Fraction of scenarios where every agent ended on the same answer (right or wrong) by the final round. Lower is better — the orchestration resists groupthink.',
                arrow: '↓',
              },
              {
                term: 'sycophancy_ratio',
                short: 'Flipped to wrong',
                def: 'Fraction of (agent × scenario) pairs where an agent started correct and ended on the confederate’s wrong answer. Lower is better.',
                arrow: '↓',
              },
              {
                term: 'tokens_per_correct_answer',
                short: 'Compute efficiency',
                def: 'Mean output tokens consumed per correct outcome. Lower is more efficient — flags reasoning-model spend that doesn’t translate to better answers.',
                arrow: '↓',
              },
              {
                term: 'position_flips_per_agent_per_round',
                short: 'Answer volatility',
                def: 'How often individual agents change their answer round-over-round. Descriptive, not prescriptive — pair with sycophancy ratio to separate exploration from capitulation.',
                arrow: '·',
              },
            ].map((d) => (
              <div
                key={d.term}
                className="rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-5 transition-colors hover:border-[color:var(--color-border-default)]/80 hover:bg-[color:var(--color-bg-surface)]/60"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                    {d.short}
                  </h3>
                  <span className="font-mono text-base text-[color:var(--color-text-muted)]">
                    {d.arrow}
                  </span>
                </div>
                <code className="block font-mono text-[11px] text-[color:var(--color-bench)]">
                  {d.term}
                </code>
                <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--color-text-secondary)]">
                  {d.def}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/vendor-cert"
              className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bg-surface)]/40 p-7 transition-all hover:border-[color:var(--color-bench)]/60 hover:bg-[color:var(--color-bg-surface)]/60"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-bench)]">
                For vendors
              </div>
              <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                Get your framework on this list
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                First 3-5 charter customers free. After that $999/release. We run the bench against
                your release, you get the signed receipt.
              </p>
            </Link>
            <Link
              href="/methodology#convergence"
              className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-7 transition-all hover:border-[color:var(--color-text-secondary)]/40 hover:bg-[color:var(--color-bg-surface)]/60"
            >
              <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                Skeptical?
              </div>
              <h3 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                Read the methodology
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                Full spec including scoring math, adapter contract, threats to validity, and the
                holdout protocol. Apache-2.0. PR if you think we got something wrong.
              </p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
