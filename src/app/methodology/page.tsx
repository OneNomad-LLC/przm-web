import type { Metadata } from 'next'
import { readFile } from 'fs/promises'
import path from 'path'
import { marked } from 'marked'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Methodology | przm',
  description:
    'How przm scores AI reliability. Deterministic scoring, Ed25519-signed receipts, SHA-pinned fixtures, adversarial holdouts. Methodology specs for every benchmark we publish.',
}

interface BenchmarkDoc {
  slug: string
  title: string
  status: 'headline' | 'live' | 'next'
  /** One-line summary shown in the TOC. */
  description: string
  /** Path relative to the przm-web repo root. */
  sourcePath: string
  html: string
}

const BENCHMARK_DOCS: Omit<BenchmarkDoc, 'html'>[] = [
  {
    slug: 'convergence',
    title: 'Multi-agent convergence',
    status: 'headline',
    description:
      'How fast a multi-agent debate collapses to a confidently-stated wrong answer when one agent is confederate-injected.',
    sourcePath: 'content/methodology-convergence.md',
  },
  {
    slug: 'memory',
    title: 'AI memory recall',
    status: 'next',
    description:
      'Deterministic R@K and NDCG on LongMemEval temporal-inference and LoCoMo, with seen + 20% holdout splits. Spec finalized; signed receipts publish on the v0.2 cycle.',
    sourcePath: 'content/methodology-memory.md',
  },
]

async function loadDoc(sourcePath: string): Promise<string> {
  try {
    const mdPath = path.join(process.cwd(), sourcePath)
    const md = await readFile(mdPath, 'utf-8')
    return await marked(md, { gfm: true })
  } catch {
    return `<p><em>${sourcePath} not found.</em></p>`
  }
}

async function loadAllDocs(): Promise<BenchmarkDoc[]> {
  return Promise.all(
    BENCHMARK_DOCS.map(async (d) => ({ ...d, html: await loadDoc(d.sourcePath) })),
  )
}

function StatusPill({ status }: { status: BenchmarkDoc['status'] }) {
  const config = {
    headline: { label: 'v0.1 · headline', color: 'var(--color-bench)' },
    live: { label: 'live', color: 'var(--color-memory)' },
    next: { label: 'next', color: 'var(--color-text-disabled)' },
  } as const
  const { label, color } = config[status]
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: status === 'headline' ? `0 0 8px ${color}` : undefined }}
      />
      {label}
    </span>
  )
}

export default async function MethodologyPage() {
  const docs = await loadAllDocs()

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Header */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Methodology
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
              How we measure.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
              Every przm benchmark follows the same four rules: deterministic scoring (no LLM judge
              in the grading loop), Ed25519-signed receipts, SHA-pinned fixtures, adversarial holdout
              splits. Per-benchmark specs below document what gets measured and how.
            </p>
          </div>
        </section>

        {/* Cross-cutting principles — card grid */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Principles
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
              Rules that apply to every benchmark.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Deterministic scoring',
                body: (
                  <>
                    Two runs of the same fixture against the same adapter version produce
                    byte-identical scores. No LLM judge anywhere in the grading loop. Scoring is
                    pure-function math on recorded state.
                  </>
                ),
                accent: 'var(--color-bench)',
              },
              {
                title: 'Signed',
                body: (
                  <>
                    Every receipt is signed with Ed25519. Public key in the repo at{' '}
                    <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[11px]">
                      keys/receipt-signing.pub
                    </code>
                    . The private key lives only in a GitHub Actions secret.
                  </>
                ),
                accent: 'var(--color-runtime)',
              },
              {
                title: 'Reproducible',
                body: (
                  <>
                    Container image hash, fixture SHA-256, model versions, and adapter versions all
                    pinned in the receipt. Anyone can re-run and verify byte-for-byte.
                  </>
                ),
                accent: 'var(--color-knowledge)',
              },
              {
                title: 'Adversarially constructed',
                body: (
                  <>
                    Holdout subsets reserved from anyone vendor-side. Blind re-implementations
                    published alongside primary adapters. Fixtures designed to break things, not to
                    flatter them.
                  </>
                ),
                accent: 'var(--color-memory)',
              },
              {
                title: 'Public audit log',
                body: (
                  <>
                    Every receipt committed to{' '}
                    <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[11px]">
                      results/published/
                    </code>
                    . Once committed, never edited. Superseded only by a new receipt with a new ID.
                  </>
                ),
                accent: 'var(--color-voice)',
              },
            ].map((p) => (
              <div
                key={p.title}
                className="relative rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-5"
              >
                <div
                  className="absolute left-0 top-5 h-6 w-0.5 rounded-r-full"
                  style={{ background: p.accent }}
                />
                <h3 className="text-base font-semibold text-[color:var(--color-text-primary)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* TOC */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Benchmarks
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
              Specs by axis.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {docs.map((doc) => (
              <a
                key={doc.slug}
                href={`#${doc.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-5 transition-colors hover:border-[color:var(--color-bench)]/40 hover:bg-[color:var(--color-bg-surface)]/60"
              >
                <div className="flex items-center justify-between">
                  <StatusPill status={doc.status} />
                  <span className="text-xs font-medium text-[color:var(--color-text-muted)] transition-colors group-hover:text-[color:var(--color-bench)]">
                    Read ↓
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[color:var(--color-text-primary)]">
                  {doc.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[color:var(--color-text-secondary)]">
                  {doc.description}
                </p>
              </a>
            ))}
          </div>
          </div>
        </section>

        {/* Each benchmark's full methodology */}
        {docs.map((doc) => (
          <section
            key={doc.slug}
            id={doc.slug}
            className="scroll-mt-24 border-t border-[color:var(--color-border-subtle)] px-6 py-16"
          >
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex items-center justify-between">
                <StatusPill status={doc.status} />
                <a
                  href={`https://github.com/OneNomad-LLC/przm-web/blob/main/${doc.sourcePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-bench)]"
                >
                  {doc.sourcePath} →
                </a>
              </div>
              <div
                className="prose-bench"
                dangerouslySetInnerHTML={{ __html: doc.html }}
              />
            </div>
          </section>
        ))}

        {/* Footer CTAs */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Methodology specs live in{' '}
              <a
                href="https://github.com/OneNomad-LLC/przm-web/tree/main/content"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[color:var(--color-bench)] transition-colors hover:underline"
              >
                przm-web
              </a>
              . Reference implementations in{' '}
              <a
                href="https://github.com/OneNomad-LLC/przm-bench"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[color:var(--color-bench)] transition-colors hover:underline"
              >
                przm-bench
              </a>
              . Both Apache-2.0.
            </p>
            <a
              href="/verify"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
            >
              Verify a receipt →
            </a>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
