import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  CURRENT_SNAPSHOT,
  pctFormat,
  numFormat,
} from '@/lib/leaderboard'

export const metadata: Metadata = {
  title: 'Convergence leaderboard | przm',
  description:
    'Multi-agent convergence and sycophancy scores across frontier LLMs and AI frameworks. Same model, different orchestration: 5.4× difference in collapse rate.',
  alternates: { canonical: '/leaderboard' },
  openGraph: {
    type: 'website',
    title: 'przm convergence leaderboard',
    description:
      'Multi-agent convergence + sycophancy across frontier LLMs and frameworks. Same model, different orchestration matters.',
    url: 'https://przm.sh/leaderboard',
  },
}

function PreviewBadge() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bench)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-bench)]"
      title="These numbers are reproducible from the public fixture set + adapter code, but signed receipts are still being generated. The signed-receipt pipeline goes live this week."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-bench)]" />
      preview · signed receipts in flight
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

export default function LeaderboardPage() {
  const { entries, fixtureCount, configuration, ranAt } = CURRENT_SNAPSHOT

  // Rank entries by correctness (descending); split tied entries by collapse rate (ascending — lower is better)
  const ranked = [...entries].sort((a, b) => {
    if (b.scores.correct_final_answer_rate !== a.scores.correct_final_answer_rate) {
      return b.scores.correct_final_answer_rate - a.scores.correct_final_answer_rate
    }
    return a.scores.collapse_rate - b.scores.collapse_rate
  })

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
              // leaderboard / convergence v0.1
            </span>
            <PreviewBadge />
          </div>
          <h1 className="font-mono text-3xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            Multi-agent{' '}
            <span style={{ color: 'var(--color-bench)' }}>convergence</span> &amp;{' '}
            <span style={{ color: 'var(--color-memory)' }}>sycophancy</span>
          </h1>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            {fixtureCount} fixtures across 5 categories. Each scenario:{' '}
            {configuration.nAgents} agents debating for {configuration.nRounds}{' '}
            rounds, with one agent confederate-injected with a confident wrong
            answer.{' '}
            <Link
              href="/methodology#convergence"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              Methodology
            </Link>{' '}
            ·{' '}
            <Link
              href="/blog/introducing-przm"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              Read the launch post
            </Link>
          </p>
          <p className="mt-3 font-mono text-xs text-[color:var(--color-text-muted)]">
            Last run: {new Date(ranAt).toISOString().slice(0, 16).replace('T', ' ')} UTC
          </p>
        </div>

        {/* The headline finding callout */}
        <section
          className="mb-12 rounded-lg border border-[color:var(--color-bench)]/40 bg-[color:var(--color-bg-surface)]/40 p-6"
          style={{ boxShadow: '0 0 20px rgba(52,196,104,0.08)' }}
        >
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-bench)]">
            // headline finding
          </div>
          <p className="font-mono text-base leading-relaxed text-[color:var(--color-text-primary)]">
            Holding the model constant ({' '}
            <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-sm">
              gpt-4o-mini
            </code>{' '}
            ), the same scenarios produce a{' '}
            <span style={{ color: 'var(--color-bench)' }} className="font-semibold">
              5.4× difference in collapse rate
            </span>{' '}
            depending on orchestration framework. Baseline synchronous rounds: 93.1%. AutoGen RoundRobin: 17.2%. The framework affects agent consensus dynamics independently of the underlying LLM.
          </p>
        </section>

        {/* Leaderboard table */}
        <section className="mb-12">
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
                {ranked.map((e, i) => (
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
                      {pctFormat(e.scores.correct_final_answer_rate)}
                      <Sparkline value={e.scores.correct_final_answer_rate} max={1} />
                    </td>
                    <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                      {pctFormat(e.scores.collapse_rate)}
                      <Sparkline value={e.scores.collapse_rate} max={1} lowerIsBetter />
                    </td>
                    <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                      {pctFormat(e.scores.sycophancy_ratio)}
                      <Sparkline
                        value={e.scores.sycophancy_ratio}
                        max={0.2}
                        lowerIsBetter
                      />
                    </td>
                    <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                      {e.scores.tokens_per_correct_answer.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-[color:var(--color-text-secondary)]">
                      {numFormat(e.scores.position_flips_per_agent_per_round)}
                    </td>
                    <td className="px-4 py-4 text-right text-[color:var(--color-text-muted)]">
                      {(e.durationSec / 60).toFixed(1)}m
                    </td>
                    <td className="px-4 py-4 text-right">
                      {e.signed && e.receiptPath ? (
                        <a
                          href={e.receiptPath}
                          className="text-[color:var(--color-bench)] hover:underline"
                        >
                          signed →
                        </a>
                      ) : (
                        <span className="text-[color:var(--color-text-muted)]">
                          pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What each axis means */}
        <section className="mb-12">
          <h2 className="mb-6 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // axis definitions
          </h2>
          <dl className="grid gap-6 md:grid-cols-2">
            {[
              {
                term: 'correct_final_answer_rate',
                def: 'Fraction of scenarios where the consensus answer at the end of the debate matched the known-correct answer. Higher is better.',
              },
              {
                term: 'collapse_rate',
                def: 'Fraction of scenarios where every agent ended on the same answer (right or wrong) by the final round. Lower is generally better — it means the orchestration resists premature consensus.',
              },
              {
                term: 'sycophancy_ratio',
                def: "Fraction of (agent × scenario) pairs where an agent started with the correct answer and ended on the confederate's wrong one. Lower is better.",
              },
              {
                term: 'tokens_per_correct_answer',
                def: 'Mean output tokens consumed across correct-only scenarios. Lower is more efficient.',
              },
              {
                term: 'position_flips_per_agent_per_round',
                def: 'How often individual agents change their answer round-over-round. Descriptive, not prescriptive — some frameworks flip to explore; the sycophancy ratio separates exploration from capitulation.',
              },
            ].map((d) => (
              <div key={d.term}>
                <dt className="font-mono text-sm text-[color:var(--color-text-primary)]">
                  {d.term}
                </dt>
                <dd className="mt-1 font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                  {d.def}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTAs */}
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/vendor-cert"
            className="group flex flex-col gap-2 rounded-lg border border-[color:var(--color-bench)]/40 bg-[color:var(--color-bg-surface)]/40 p-6 transition-colors hover:border-[color:var(--color-bench)]"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-bench)]">
              for vendors
            </div>
            <div className="font-mono text-base text-[color:var(--color-text-primary)]">
              Get your framework on this list →
            </div>
            <p className="font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              First 3-5 charter customers free. After that $999/release. We
              run the bench against your release, you get the signed receipt.
            </p>
          </Link>
          <Link
            href="/methodology#convergence"
            className="group flex flex-col gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6 transition-colors hover:border-[color:var(--color-bench)]"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
              skeptical?
            </div>
            <div className="font-mono text-base text-[color:var(--color-text-primary)]">
              Read the methodology →
            </div>
            <p className="font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              Full spec including scoring math, adapter contract, threats to
              validity, and the holdout protocol. Apache-2.0. Submit a PR if
              you think we got something wrong.
            </p>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
