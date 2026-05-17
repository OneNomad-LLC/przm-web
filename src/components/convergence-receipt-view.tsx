import Link from 'next/link'

interface ConvergenceReceipt {
  receiptId: string
  benchmark: string
  benchVersion: string
  ranAt: string
  adapter: { name: string; version: string; llmModel: string }
  configuration: { nAgents: number; nRounds: number }
  fixtureSet: { n: number; setSha256: string }
  environment: {
    node: string
    platform: string
    git: { commit: string; dirty: boolean }
  }
  scores: {
    correct_final_answer_rate: number
    collapse_rate: number
    sycophancy_ratio: number
    tokens_per_correct_answer: number
    position_flips_per_agent_per_round: number
  }
  perScenario: Array<{
    scenarioId: string
    scenarioSha256: string
    finalConsensus: string | null
    correct: boolean
    collapsed: boolean
    sycophancyOccurred: boolean | null
    positionFlipsByAgent: number[]
    totalOutputTokens: number
  }>
  signature?: {
    algorithm: 'Ed25519'
    publicKeyFingerprint: string
    value: string
  }
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%'
}

function fmtTimestamp(iso: string): string {
  return new Date(iso).toISOString().slice(0, 19).replace('T', ' ') + ' UTC'
}

interface Props {
  receipt: ConvergenceReceipt
  rawJsonHref: string
}

export function ConvergenceReceiptView({ receipt, rawJsonHref }: Props) {
  const r = receipt
  const correctCount = r.perScenario.filter((s) => s.correct).length
  const wrongCount = r.perScenario.length - correctCount

  return (
    <>
      {/* Top: nav + receipt id badge */}
      <div className="mb-6 flex items-center justify-between gap-4 font-mono text-[11px]">
        <Link
          href="/leaderboard"
          className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-bench)]"
        >
          ← leaderboard
        </Link>
        <span className="text-[color:var(--color-text-disabled)]">
          {r.benchmark} · receipt {r.receiptId.slice(0, 8)}
        </span>
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="font-mono text-3xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          {r.adapter.name}{' '}
          <span className="text-[color:var(--color-text-muted)]">/</span>{' '}
          <span style={{ color: 'var(--color-bench)' }}>{r.adapter.llmModel}</span>
        </h1>
        <p className="mt-3 font-mono text-sm text-[color:var(--color-text-secondary)]">
          Run {fmtTimestamp(r.ranAt)} · {r.configuration.nAgents} agents ×{' '}
          {r.configuration.nRounds} rounds · {r.fixtureSet.n} scenarios
        </p>
        {r.signature ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bench)]/30 bg-[color:var(--color-bench)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-bench)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-bench)]"
              style={{ boxShadow: '0 0 8px var(--color-bench)' }}
            />
            Ed25519-signed
          </div>
        ) : null}
      </header>

      {/* Scores */}
      <section className="mb-12">
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
          // scores
        </h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Stat
            label="Correct rate"
            value={pct(r.scores.correct_final_answer_rate)}
            tone="primary"
            note={`${correctCount} of ${r.perScenario.length}`}
          />
          <Stat
            label="Collapse rate"
            value={pct(r.scores.collapse_rate)}
            tone="warning"
            note="lower = more diverse outputs"
          />
          <Stat
            label="Sycophancy"
            value={pct(r.scores.sycophancy_ratio)}
            tone="warning"
            note="lower better"
          />
          <Stat
            label="Tokens / correct"
            value={r.scores.tokens_per_correct_answer.toLocaleString()}
            tone="muted"
            note="output tokens"
          />
          <Stat
            label="Position flips"
            value={r.scores.position_flips_per_agent_per_round.toFixed(3)}
            tone="muted"
            note="per agent per round"
          />
        </div>
      </section>

      {/* Per-scenario detail */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
          <span>// per-scenario results</span>
          <span className="font-normal normal-case text-[color:var(--color-text-disabled)]">
            {correctCount} correct · {wrongCount} wrong
          </span>
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30">
          <table className="w-full font-mono text-xs">
            <thead className="border-b border-[color:var(--color-border-subtle)] text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-2 text-left">Scenario</th>
                <th className="px-4 py-2 text-left">Consensus</th>
                <th className="px-4 py-2 text-center">Correct</th>
                <th className="px-4 py-2 text-center">Collapsed</th>
                <th className="px-4 py-2 text-center">Sycophancy</th>
                <th className="px-4 py-2 text-right">Output tokens</th>
              </tr>
            </thead>
            <tbody>
              {r.perScenario.map((s) => (
                <tr
                  key={s.scenarioId}
                  className="border-b border-[color:var(--color-border-subtle)] last:border-b-0"
                >
                  <td className="px-4 py-2 text-[color:var(--color-text-secondary)]">
                    {s.scenarioId}
                  </td>
                  <td className="max-w-xs truncate px-4 py-2 text-[color:var(--color-text-primary)]">
                    {s.finalConsensus ?? '(tie)'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.correct ? (
                      <span style={{ color: 'var(--color-bench)' }}>✓</span>
                    ) : (
                      <span style={{ color: 'var(--color-memory)' }}>✗</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-[color:var(--color-text-muted)]">
                    {s.collapsed ? '●' : '○'}
                  </td>
                  <td className="px-4 py-2 text-center text-[color:var(--color-text-muted)]">
                    {s.sycophancyOccurred === true
                      ? '●'
                      : s.sycophancyOccurred === false
                        ? '○'
                        : '—'}
                  </td>
                  <td className="px-4 py-2 text-right text-[color:var(--color-text-muted)]">
                    {s.totalOutputTokens.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Environment + signature */}
      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-5 font-mono text-xs">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // environment
          </div>
          <dl className="space-y-1.5">
            <Row term="Adapter version" value={r.adapter.version} />
            <Row term="Node" value={r.environment.node} />
            <Row term="Platform" value={r.environment.platform} />
            <Row
              term="Git commit"
              value={r.environment.git.commit.slice(0, 12) + (r.environment.git.dirty ? ' (dirty)' : '')}
            />
            <Row term="Bench version" value={r.benchVersion} />
          </dl>
        </div>
        <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-5 font-mono text-xs">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // integrity
          </div>
          <dl className="space-y-1.5">
            <Row term="Fixture-set SHA-256" value={r.fixtureSet.setSha256.slice(0, 24) + '…'} title={r.fixtureSet.setSha256} />
            {r.signature ? (
              <>
                <Row term="Signature algorithm" value={r.signature.algorithm} />
                <Row term="Pub key fingerprint" value={r.signature.publicKeyFingerprint.slice(7, 31) + '…'} title={r.signature.publicKeyFingerprint} />
              </>
            ) : (
              <Row term="Signature" value="(unsigned)" />
            )}
          </dl>
        </div>
      </section>

      {/* CTAs */}
      <section className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border-subtle)] pt-8">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-bench)' }}
        >
          Verify this receipt →
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={rawJsonHref}
            download
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
          >
            Download JSON
          </a>
          <Link
            href="/methodology#convergence"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
          >
            Methodology
          </Link>
        </div>
      </section>
    </>
  )
}

function Stat({
  label,
  value,
  tone,
  note,
}: {
  label: string
  value: string
  tone: 'primary' | 'warning' | 'muted'
  note?: string
}) {
  const colorMap = {
    primary: 'var(--color-bench)',
    warning: 'var(--color-memory)',
    muted: 'var(--color-text-primary)',
  } as const
  return (
    <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-4">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
        {label}
      </div>
      <div
        className="font-mono text-2xl font-semibold"
        style={{ color: colorMap[tone] }}
      >
        {value}
      </div>
      {note ? (
        <div className="mt-1 font-mono text-[10px] text-[color:var(--color-text-muted)]">
          {note}
        </div>
      ) : null}
    </div>
  )
}

function Row({ term, value, title }: { term: string; value: string; title?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[color:var(--color-text-muted)]">{term}</dt>
      <dd
        className="break-all text-right text-[color:var(--color-text-primary)]"
        title={title}
      >
        {value}
      </dd>
    </div>
  )
}
