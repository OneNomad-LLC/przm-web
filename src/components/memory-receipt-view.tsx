import Link from 'next/link'

interface MemoryReceipt {
  receiptId: string
  benchVersion: string
  ranAt: string
  adapter: { name: string; version: string }
  fixture: { id: string; sha256: string; n: number }
  environment: {
    node: string
    platform: string
    git: { commit: string; dirty: boolean }
  }
  scores: {
    recall_at_5: number
    recall_at_10: number
    ndcg_at_10: number
    latency_p50_ms: number
    latency_p95_ms: number
    ingest_throughput_items_per_sec: number
  }
  perQuery: Array<{
    queryId: string
    retrieved: string[]
    hit: boolean
    rank: number | null
    latencyMs: number
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

function fmtMs(n: number): string {
  if (n < 1000) return n.toFixed(0) + 'ms'
  return (n / 1000).toFixed(2) + 's'
}

function fmtTimestamp(iso: string): string {
  return new Date(iso).toISOString().slice(0, 19).replace('T', ' ') + ' UTC'
}

interface Props {
  receipt: MemoryReceipt
  rawJsonHref: string
}

export function MemoryReceiptView({ receipt, rawJsonHref }: Props) {
  const r = receipt
  const hitCount = r.perQuery.filter((q) => q.hit).length
  const missCount = r.perQuery.length - hitCount

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 font-mono text-[11px]">
        <Link
          href="/leaderboard"
          className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-memory)]"
        >
          ← leaderboard
        </Link>
        <span className="text-[color:var(--color-text-disabled)]">
          {r.fixture.id} · receipt {r.receiptId.slice(0, 8)}
        </span>
      </div>

      <header className="mb-10">
        <h1 className="font-mono text-3xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          {r.adapter.name}{' '}
          <span className="text-[color:var(--color-text-muted)]">/</span>{' '}
          <span style={{ color: 'var(--color-memory)' }}>{r.fixture.id}</span>
        </h1>
        <p className="mt-3 font-mono text-sm text-[color:var(--color-text-secondary)]">
          Run {fmtTimestamp(r.ranAt)} · {r.fixture.n.toLocaleString()} items ingested · {r.perQuery.length} queries
        </p>
        {r.signature ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-memory)]/30 bg-[color:var(--color-memory)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-memory)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-memory)]"
              style={{ boxShadow: '0 0 8px var(--color-memory)' }}
            />
            Ed25519-signed
          </div>
        ) : null}
      </header>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
          // scores
        </h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Stat
            label="Recall @ 5"
            value={pct(r.scores.recall_at_5)}
            tone="primary"
            note={`${hitCount}/${r.perQuery.length} hits @ K=10`}
          />
          <Stat
            label="Recall @ 10"
            value={pct(r.scores.recall_at_10)}
            tone="primary"
            note="higher better"
          />
          <Stat
            label="NDCG @ 10"
            value={pct(r.scores.ndcg_at_10)}
            tone="muted"
            note="rank quality"
          />
          <Stat
            label="p50 latency"
            value={fmtMs(r.scores.latency_p50_ms)}
            tone="muted"
            note="median search"
          />
          <Stat
            label="p95 latency"
            value={fmtMs(r.scores.latency_p95_ms)}
            tone="muted"
            note="tail search"
          />
          <Stat
            label="Ingest"
            value={r.scores.ingest_throughput_items_per_sec.toFixed(1)}
            tone="muted"
            note="items / sec"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
          <span>// per-query results</span>
          <span className="font-normal normal-case text-[color:var(--color-text-disabled)]">
            {hitCount} hit · {missCount} miss
          </span>
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30">
          <table className="w-full font-mono text-xs">
            <thead className="border-b border-[color:var(--color-border-subtle)] text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-2 text-left">Query</th>
                <th className="px-4 py-2 text-center">Hit</th>
                <th className="px-4 py-2 text-right">Rank</th>
                <th className="px-4 py-2 text-right">Latency</th>
              </tr>
            </thead>
            <tbody>
              {r.perQuery.map((q) => (
                <tr
                  key={q.queryId}
                  className="border-b border-[color:var(--color-border-subtle)] last:border-b-0"
                >
                  <td className="px-4 py-2 text-[color:var(--color-text-secondary)]">
                    {q.queryId}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {q.hit ? (
                      <span style={{ color: 'var(--color-bench)' }}>✓</span>
                    ) : (
                      <span style={{ color: 'var(--color-memory)' }}>✗</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right text-[color:var(--color-text-muted)]">
                    {q.rank ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-right text-[color:var(--color-text-muted)]">
                    {fmtMs(q.latencyMs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
            <Row term="Fixture SHA-256" value={r.fixture.sha256.slice(0, 24) + '…'} title={r.fixture.sha256} />
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

      <section className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border-subtle)] pt-8">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-memory)' }}
        >
          Verify this receipt →
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={rawJsonHref}
            download
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-memory)] hover:text-[color:var(--color-memory)]"
          >
            Download JSON
          </a>
          <Link
            href="/methodology#memory"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-memory)] hover:text-[color:var(--color-memory)]"
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
  tone: 'primary' | 'muted'
  note?: string
}) {
  const colorMap = {
    primary: 'var(--color-memory)',
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
