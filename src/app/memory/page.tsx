import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'przm Memory. Open-source memory MCP for AI agents',
  description:
    'przm Memory (engram) is the memory surface of przm. 9-stage hybrid search, local-first, 98.8% R@10 on LongMemEval. Apache 2.0, runs on your machine, no API keys.',
  alternates: { canonical: '/memory' },
  openGraph: {
    title: 'przm Memory. Open-source memory MCP for AI agents',
    description:
      '98.8% R@10 on LongMemEval. 9-stage hybrid search. Local-first. Apache 2.0.',
    url: 'https://przm.sh/memory',
  },
}

const ACCENT = 'var(--color-memory)'
const NPM = '@onenomad/przm-memory'
const REPO = 'https://github.com/OneNomad-LLC/przm-memory'

export default function MemoryPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] px-6 pb-20 pt-20">
        {/* Hero */}
        <section className="relative mb-16">
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
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              przm / memory
            </span>
            <span
              className="rounded-full border px-3 py-1"
              style={{
                borderColor: `${ACCENT}55`,
                background: `${ACCENT}1A`,
                color: ACCENT,
              }}
            >
              Apache 2.0
            </span>
            <span className="rounded-full border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-3 py-1 text-[color:var(--color-text-secondary)]">
              Local-first
            </span>
            <span className="rounded-full border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 px-3 py-1 text-[color:var(--color-text-secondary)]">
              No API key
            </span>
          </div>

          <h1 className="mt-6 font-mono text-4xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            przm{' '}
            <span className="relative" style={{ color: ACCENT }}>
              Memory
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-1 inset-y-1 -z-10 rounded-md blur-xl"
                style={{ background: 'rgba(232,64,64,0.10)' }}
              />
            </span>
          </h1>

          <p className="mt-3 font-mono text-sm text-[color:var(--color-text-muted)]">
            Technical handle:{' '}
            <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-[color:var(--color-text-primary)]">
              engram
            </code>
            <span className="mx-2 text-[color:var(--color-text-disabled)]">·</span>
            npm:{' '}
            <a
              href={`https://www.npmjs.com/package/${NPM}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-text-secondary)] underline-offset-4 hover:text-[color:var(--color-text-primary)] hover:underline"
            >
              {NPM}
            </a>
          </p>

          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            A memory system for AI agents that actually works. Runs locally,
            doesn't need an API key, and scores{' '}
            <span style={{ color: ACCENT }}>
              96.8% R@5 / 98.8% R@10 on LongMemEval
            </span>{' '}
            and{' '}
            <span style={{ color: ACCENT }}>
              85.1% R@5 / 92.0% R@10 on LoCoMo
            </span>{' '}
            with a deterministic 9-stage hybrid search pipeline. No LLM in the
            retrieval loop. Methodology is reproducible from a fresh clone with
            one command.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}
            >
              GitHub repo &rarr;
            </a>
            <a
              href="#install"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-xs transition-colors"
              style={{
                borderColor: `${ACCENT}55`,
                color: ACCENT,
              }}
            >
              Install
            </a>
            <a
              href={`${REPO}/blob/main/benchmarks/results/published`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-5 py-2.5 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-text-primary)] hover:text-[color:var(--color-text-primary)]"
            >
              Benchmark receipts
            </a>
          </div>
        </section>

        {/* Numbers */}
        <section className="mb-16">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // benchmark numbers
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Stat label="LongMemEval R@10" value="98.8%" note="500 questions, no LLM rerank" accent={ACCENT} />
            <Stat label="LoCoMo R@10" value="92.0%" note="1,986 QA pairs, full set" accent={ACCENT} />
            <Stat label="p50 search latency" value="44ms" note="53-session corpus" accent={ACCENT} />
            <Stat label="Embedding model" value="MiniLM" note="23MB, runs on CPU" accent={ACCENT} />
          </div>
          <p className="mt-4 font-mono text-xs text-[color:var(--color-text-muted)]">
            Reproducible from a fresh clone with{' '}
            <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5">
              pnpm bench:locomo
            </code>
            . Committed result JSON lives in{' '}
            <a
              href={`${REPO}/tree/main/benchmarks/results/published`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
              style={{ color: ACCENT }}
            >
              benchmarks/results/published
            </a>
            .
          </p>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // what's in the box
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              title="9-stage hybrid search"
              body="Vector similarity, BM25 keyword, temporal inference, knowledge graph, spreading activation. Each stage catches what the others miss. Deterministic. No LLM in the retrieval loop."
              accent={ACCENT}
            />
            <FeatureCard
              title="Knowledge graph"
              body="Auto-extracts triples (subject, predicate, object) from ingested content. Graph-aware reranking surfaces related memories that pure embeddings miss. Persists across sessions."
              accent={ACCENT}
            />
            <FeatureCard
              title="Procedural rules"
              body="Learned 'always do X' or 'never do Y' rules from corrections. Survive sessions. Sync with przm Voice via the procedural bridge when both servers are running."
              accent={ACCENT}
            />
            <FeatureCard
              title="Handoff protocol"
              body="Pre-compact and stop hooks write structured 'where we left off' snapshots so context compaction never costs you the session. Resume by name later."
              accent={ACCENT}
            />
            <FeatureCard
              title="Cognitive layers"
              body="Episodic, semantic, procedural: same model as human memory. Each layer has its own decay rate so a one-off fact and a learned habit age differently."
              accent={ACCENT}
            />
            <FeatureCard
              title="Self-organizing"
              body="Duplicate detection, near-duplicate merging, importance decay, cross-link generation. The memory store maintains itself; you don't have to curate."
              accent={ACCENT}
            />
          </div>
        </section>

        {/* Install */}
        <section id="install" className="mb-16 scroll-mt-28">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // install
          </h2>
          <div className="space-y-6">
            <InstallBlock
              title="Claude Code"
              code={`claude mcp add engram -- npx ${NPM}`}
              accent={ACCENT}
            />
            <InstallBlock
              title="Claude Desktop, Cursor, Windsurf, Cline (any MCP client)"
              code={`{
  "mcpServers": {
    "engram": {
      "command": "npx",
      "args": ["${NPM}"]
    }
  }
}`}
              language="json"
              accent={ACCENT}
            />
            <InstallBlock
              title="From source"
              code={`git clone ${REPO}.git
cd przm-memory
npm install
npm run build`}
              accent={ACCENT}
            />
          </div>
          <p className="mt-4 font-mono text-xs text-[color:var(--color-text-muted)]">
            Full installation docs including hooks setup, slash commands, and
            cloud mode at{' '}
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
              style={{ color: ACCENT }}
            >
              the GitHub README
            </a>
            .
          </p>
        </section>

        {/* Pairs Well With */}
        <section className="mb-16 rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-8">
          <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // pairs well with
          </h2>
          <p className="max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            If przm Memory is the brain,{' '}
            <Link
              href="/voice"
              className="underline-offset-4 hover:underline"
              style={{ color: 'var(--color-voice)' }}
            >
              przm Voice
            </Link>{' '}
            (persona) is the personality. Memory handles{' '}
            <em>what</em> the agent remembers. Voice handles <em>how</em> it
            communicates. They sync via a procedural bridge so frustration
            spikes get encoded as high-importance memories and applied
            evolution proposals turn into learned rules.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/voice"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors"
              style={{
                borderColor: 'color-mix(in srgb, var(--color-voice) 35%, transparent)',
                color: 'var(--color-voice)',
              }}
            >
              See przm Voice &rarr;
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
            >
              Back to przm
            </Link>
          </div>
        </section>

        {/* Prism breadcrumb */}
        <section className="border-t border-[color:var(--color-border-subtle)] pt-8 font-mono text-xs text-[color:var(--color-text-muted)]">
          Part of the przm suite:{' '}
          <span style={{ color: ACCENT }}>Memory</span>
          <span className="mx-2 text-[color:var(--color-text-disabled)]">·</span>
          <Link href="/voice" className="hover:underline" style={{ color: 'var(--color-voice)' }}>
            Voice
          </Link>
          <span className="mx-2 text-[color:var(--color-text-disabled)]">·</span>
          <span className="text-[color:var(--color-text-disabled)]">Knowledge</span>
          <span className="mx-2 text-[color:var(--color-text-disabled)]">·</span>
          <Link href="/" className="hover:underline" style={{ color: 'var(--color-bench)' }}>
            Bench
          </Link>
          <span className="mx-2 text-[color:var(--color-text-disabled)]">·</span>
          <span className="text-[color:var(--color-text-disabled)]">Runtime</span>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Stat({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note?: string
  accent: string
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-4">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
        {label}
      </div>
      <div className="font-mono text-2xl font-semibold" style={{ color: accent }}>
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

function FeatureCard({
  title,
  body,
  accent,
}: {
  title: string
  body: string
  accent: string
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-5">
      <h3
        className="mb-2 font-mono text-sm font-semibold"
        style={{ color: accent }}
      >
        {title}
      </h3>
      <p className="font-mono text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
        {body}
      </p>
    </div>
  )
}

function InstallBlock({
  title,
  code,
  language = 'bash',
  accent,
}: {
  title: string
  code: string
  language?: string
  accent: string
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-widest" style={{ color: accent }}>
          {title}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-disabled)]">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[color:var(--color-text-primary)]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
