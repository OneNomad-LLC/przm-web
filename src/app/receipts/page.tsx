import type { Metadata } from 'next'
import Link from 'next/link'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Receipts | przm',
  description:
    'Every signed benchmark receipt published by przm. Click any to see the full per-scenario breakdown + Ed25519 signature.',
  alternates: { canonical: '/receipts' },
}

type ReceiptKind = 'convergence' | 'memory'

interface ConvergenceEntry {
  kind: 'convergence'
  receiptId: string
  ranAt: string
  adapter: { name: string; version: string; llmModel: string }
  fixtureCount: number
  subset: string
  correctRate: number
  collapseRate: number
  sycophancyRatio: number
  signed: boolean
}

interface MemoryEntry {
  kind: 'memory'
  receiptId: string
  ranAt: string
  adapter: { name: string; version: string }
  fixtureId: string
  fixtureCount: number
  recallAt5: number
  recallAt10: number
  ndcgAt10: number
  p50Ms: number
  signed: boolean
}

type AnyEntry = ConvergenceEntry | MemoryEntry

const CONVERGENCE_DIR = path.join(
  process.cwd(),
  'public',
  'receipts',
  'convergence',
)

const MEMORY_DIR = path.join(
  process.cwd(),
  'public',
  'receipts',
  'memory',
)

async function loadAllConvergenceReceipts(): Promise<ConvergenceEntry[]> {
  if (!existsSync(CONVERGENCE_DIR)) return []
  const files = (await readdir(CONVERGENCE_DIR)).filter((f) => f.endsWith('.json'))
  const out: ConvergenceEntry[] = []
  for (const file of files) {
    try {
      const raw = await readFile(path.join(CONVERGENCE_DIR, file), 'utf-8')
      const r = JSON.parse(raw)
      out.push({
        kind: 'convergence',
        receiptId: r.receiptId,
        ranAt: r.ranAt,
        adapter: r.adapter,
        fixtureCount: r.fixtureSet?.n ?? 0,
        subset: r.fixtureSet?.subset ?? 'all',
        correctRate: r.scores?.correct_final_answer_rate ?? 0,
        collapseRate: r.scores?.collapse_rate ?? 0,
        sycophancyRatio: r.scores?.sycophancy_ratio ?? 0,
        signed: !!r.signature?.value,
      })
    } catch {
      // skip malformed
    }
  }
  return out
}

async function loadAllMemoryReceipts(): Promise<MemoryEntry[]> {
  if (!existsSync(MEMORY_DIR)) return []
  const files = (await readdir(MEMORY_DIR)).filter((f) => f.endsWith('.json'))
  const out: MemoryEntry[] = []
  for (const file of files) {
    try {
      const raw = await readFile(path.join(MEMORY_DIR, file), 'utf-8')
      const r = JSON.parse(raw)
      out.push({
        kind: 'memory',
        receiptId: r.receiptId,
        ranAt: r.ranAt,
        adapter: r.adapter,
        fixtureId: r.fixture?.id ?? 'unknown',
        fixtureCount: r.fixture?.n ?? 0,
        recallAt5: r.scores?.recall_at_5 ?? 0,
        recallAt10: r.scores?.recall_at_10 ?? 0,
        ndcgAt10: r.scores?.ndcg_at_10 ?? 0,
        p50Ms: r.scores?.latency_p50_ms ?? 0,
        signed: !!r.signature?.value,
      })
    } catch {
      // skip malformed
    }
  }
  return out
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%'
}

function fmtMs(n: number): string {
  if (n < 1000) return n.toFixed(0) + 'ms'
  return (n / 1000).toFixed(2) + 's'
}

function fmtDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace('T', ' ') + 'Z'
}

const SUBSET_COLOR: Record<string, string> = {
  seen: 'var(--color-bench)',
  holdout: 'var(--color-memory)',
  all: 'var(--color-voice)',
}

export default async function ReceiptsIndexPage() {
  const [convergence, memory] = await Promise.all([
    loadAllConvergenceReceipts(),
    loadAllMemoryReceipts(),
  ])

  // Group convergence by run for clustering
  const convByRun = new Map<string, ConvergenceEntry[]>()
  for (const r of convergence) {
    const key = r.ranAt
    if (!convByRun.has(key)) convByRun.set(key, [])
    convByRun.get(key)!.push(r)
  }
  const convRuns = Array.from(convByRun.entries()).sort((a, b) =>
    b[0].localeCompare(a[0]),
  )

  const memSorted = memory.sort((a, b) => b.ranAt.localeCompare(a.ranAt))

  const total = convergence.length + memory.length

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
        <div className="mb-10">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // receipts
          </div>
          <h1 className="font-mono text-3xl font-semibold text-[color:var(--color-text-primary)] md:text-4xl">
            Signed receipt ledger
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            Every benchmark run produces an Ed25519-signed JSON receipt with
            the full per-scenario or per-query record pinned. Click any
            receipt to see scores, environment, and the signature. Verify any
            of them in your browser at{' '}
            <Link
              href="/verify"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              /verify
            </Link>
            .
          </p>
        </div>

        {total === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-12 text-center">
            <p className="font-mono text-sm text-[color:var(--color-text-muted)]">
              No receipts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {memSorted.length > 0 ? (
              <section>
                <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                  <span style={{ color: 'var(--color-memory)' }}>// memory recall</span>
                  <span>{memSorted.length} receipt{memSorted.length === 1 ? '' : 's'}</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30">
                  <table className="w-full font-mono text-xs">
                    <thead className="border-b border-[color:var(--color-border-subtle)] text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                      <tr>
                        <th className="px-4 py-3 text-left">Adapter / Fixture</th>
                        <th className="px-4 py-3 text-right">Items</th>
                        <th className="px-4 py-3 text-right">R@5</th>
                        <th className="px-4 py-3 text-right">R@10</th>
                        <th className="px-4 py-3 text-right">NDCG@10</th>
                        <th className="px-4 py-3 text-right">p50</th>
                        <th className="px-4 py-3 text-right">Run</th>
                        <th className="px-4 py-3 text-right">Signed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memSorted.map((e) => (
                        <tr
                          key={e.receiptId}
                          className="border-b border-[color:var(--color-border-subtle)] last:border-b-0 hover:bg-[color:var(--color-bg-elevated)]/40"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/receipts/${e.receiptId}`}
                              className="text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-memory)]"
                            >
                              {e.adapter.name}{' '}
                              <span className="text-[color:var(--color-text-muted)]">/</span>{' '}
                              <span className="text-[color:var(--color-text-secondary)]">
                                {e.fixtureId}
                              </span>
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right text-[color:var(--color-text-muted)]">
                            {e.fixtureCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-[color:var(--color-text-primary)]">
                            {pct(e.recallAt5)}
                          </td>
                          <td className="px-4 py-3 text-right text-[color:var(--color-text-primary)]">
                            {pct(e.recallAt10)}
                          </td>
                          <td className="px-4 py-3 text-right text-[color:var(--color-text-secondary)]">
                            {pct(e.ndcgAt10)}
                          </td>
                          <td className="px-4 py-3 text-right text-[color:var(--color-text-secondary)]">
                            {fmtMs(e.p50Ms)}
                          </td>
                          <td className="px-4 py-3 text-right text-[color:var(--color-text-muted)]">
                            {fmtDate(e.ranAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {e.signed ? (
                              <span style={{ color: 'var(--color-bench)' }}>✓</span>
                            ) : (
                              <span className="text-[color:var(--color-text-disabled)]">·</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {convRuns.length > 0 ? (
              <div className="space-y-12">
                <div className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]" style={{ color: 'var(--color-bench)' }}>
                  // multi-agent convergence
                </div>
                {convRuns.map(([ranAt, entries]) => (
                  <section key={ranAt}>
                    <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                      <span>// run {fmtDate(ranAt)}</span>
                      <span>{entries.length} receipt{entries.length === 1 ? '' : 's'}</span>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30">
                      <table className="w-full font-mono text-xs">
                        <thead className="border-b border-[color:var(--color-border-subtle)] text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                          <tr>
                            <th className="px-4 py-3 text-left">Adapter / Model</th>
                            <th className="px-4 py-3 text-left">Subset</th>
                            <th className="px-4 py-3 text-right">Fixtures</th>
                            <th className="px-4 py-3 text-right">Correct</th>
                            <th className="px-4 py-3 text-right">Collapse</th>
                            <th className="px-4 py-3 text-right">Sycophancy</th>
                            <th className="px-4 py-3 text-right">Signed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((e) => (
                            <tr
                              key={e.receiptId}
                              className="border-b border-[color:var(--color-border-subtle)] last:border-b-0 hover:bg-[color:var(--color-bg-elevated)]/40"
                            >
                              <td className="px-4 py-3">
                                <Link
                                  href={`/receipts/${e.receiptId}`}
                                  className="text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-bench)]"
                                >
                                  {e.adapter.name}{' '}
                                  <span className="text-[color:var(--color-text-muted)]">/</span>{' '}
                                  <span className="text-[color:var(--color-text-secondary)]">
                                    {e.adapter.llmModel}
                                  </span>
                                </Link>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest"
                                  style={{ color: SUBSET_COLOR[e.subset] ?? 'var(--color-text-muted)' }}
                                >
                                  <span
                                    className="h-1 w-1 rounded-full"
                                    style={{ background: SUBSET_COLOR[e.subset] ?? 'var(--color-text-muted)' }}
                                  />
                                  {e.subset}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-[color:var(--color-text-muted)]">
                                {e.fixtureCount}
                              </td>
                              <td className="px-4 py-3 text-right text-[color:var(--color-text-primary)]">
                                {pct(e.correctRate)}
                              </td>
                              <td className="px-4 py-3 text-right text-[color:var(--color-text-secondary)]">
                                {pct(e.collapseRate)}
                              </td>
                              <td className="px-4 py-3 text-right text-[color:var(--color-text-secondary)]">
                                {pct(e.sycophancyRatio)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {e.signed ? (
                                  <span style={{ color: 'var(--color-bench)' }}>✓</span>
                                ) : (
                                  <span className="text-[color:var(--color-text-disabled)]">·</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-16 border-t border-[color:var(--color-border-subtle)] pt-8">
          <p className="font-mono text-xs text-[color:var(--color-text-muted)]">
            Receipts are also available raw at{' '}
            <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5">
              /receipts/&lt;benchmark&gt;/&lt;filename&gt;.json
            </code>{' '}
            for direct download. The implementation lives in{' '}
            <a
              href="https://github.com/OneNomad-LLC/przm-bench/tree/main/results/published"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              przm-bench/results/published
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
