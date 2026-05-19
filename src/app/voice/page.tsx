import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'przm Voice. Adaptive personality MCP for AI agents',
  description:
    'przm Voice (persona) is the voice surface of przm. Behavioral signals, Big Five traits, soul-role-journal personality layers. Apache 2.0, runs locally, no API keys.',
  alternates: { canonical: '/voice' },
  openGraph: {
    title: 'przm Voice. Adaptive personality MCP for AI agents',
    description:
      'Personality from real interactions. Behavioral signals, Big Five, soul-role-journal. Apache 2.0.',
    url: 'https://przm.sh/voice',
  },
}

const ACCENT = 'var(--color-voice)'
const NPM = '@onenomad/przm-voice'
const REPO = 'https://github.com/OneNomad-LLC/przm-voice'

export default function VoicePage() {
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
              przm / voice
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
              Voice
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-1 inset-y-1 -z-10 rounded-md blur-xl"
                style={{ background: 'rgba(245,149,32,0.10)' }}
              />
            </span>
          </h1>

          <p className="mt-3 font-mono text-sm text-[color:var(--color-text-muted)]">
            Technical handle:{' '}
            <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-[color:var(--color-text-primary)]">
              persona
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
            Every AI you talk to starts with the same personality. Same "I'd be
            happy to help!" opener. Same trailing summaries. przm Voice changes
            that. It watches how you interact and builds a personality from{' '}
            <span style={{ color: ACCENT }}>real signals</span> like
            corrections, approvals, frustration, praise. They feed a behavioral profile that
            shapes how the agent talks to you. No API key, no cloud, two
            runtime dependencies. Personality grows out of the relationship
            instead of being hardcoded in a prompt.
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
              href={`${REPO}#how-it-works`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-5 py-2.5 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-text-primary)] hover:text-[color:var(--color-text-primary)]"
            >
              How it works
            </a>
          </div>
        </section>

        {/* Stats / quick facts */}
        <section className="mb-16">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // by the numbers
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Stat label="Signal types" value="12" note="Correction, praise, frustration, ..." accent={ACCENT} />
            <Stat label="Personality dimensions" value="Big Five" note="Plus Plutchik emotions" accent={ACCENT} />
            <Stat label="Soul presets" value="9" note="Bundled (default, coach, mentor, ...)" accent={ACCENT} />
            <Stat label="Role presets" value="10" note="Bundled domain overlays" accent={ACCENT} />
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // what's in the box
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              title="Behavioral signals"
              body="12 signal types fire on real interaction: corrections, approvals, frustration, code accepted/rejected, regen requests, style corrections, praise, abandonment. Each becomes input to the personality."
              accent={ACCENT}
            />
            <FeatureCard
              title="Soul, Role, Journal"
              body="Three ownership-boundaried personality layers. Soul is user territory (you edit). Role is a domain overlay. Journal is Voice's territory (applied proposals land here). Composed at prompt-build time."
              accent={ACCENT}
            />
            <FeatureCard
              title="Evolution proposals"
              body="Every 12 signals, the engine generates concrete soul-file edits with rationale, confidence score, and signal evidence. Nothing auto-applies; you review and accept or reject."
              accent={ACCENT}
            />
            <FeatureCard
              title="Anti-sycophancy"
              body="Built-in mechanisms prevent the personality drift toward yes-man behavior that has plagued every prior adaptive AI personality system at scale. Core principles around honesty are immutable."
              accent={ACCENT}
            />
            <FeatureCard
              title="Procedural bridge"
              body="Voice's applied evolution proposals and Memory's learned procedural rules sync through a shared file. Frustration spikes get encoded as high-importance memories. Applied proposals become learned rules."
              accent={ACCENT}
            />
            <FeatureCard
              title="No API, no cloud, no LLM"
              body="The whole signal-to-personality pipeline runs on heuristics and clean data flow. Two runtime dependencies. Personality files are markdown you can open in any editor."
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
              code={`claude mcp add persona -- npx ${NPM}`}
              accent={ACCENT}
            />
            <InstallBlock
              title="Claude Desktop, Cursor, Windsurf, Cline (any MCP client)"
              code={`{
  "mcpServers": {
    "persona": {
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
cd przm-voice
pnpm install
pnpm run build`}
              accent={ACCENT}
            />
          </div>
          <p className="mt-4 font-mono text-xs text-[color:var(--color-text-muted)]">
            Full installation docs including hooks, slash commands, and the 9
            bundled soul presets at{' '}
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
            If przm Voice is the personality,{' '}
            <Link
              href="/memory"
              className="underline-offset-4 hover:underline"
              style={{ color: 'var(--color-memory)' }}
            >
              przm Memory
            </Link>{' '}
            (engram) is the brain. Voice handles <em>how</em> the agent talks
            to you. Memory handles <em>what</em> it remembers. They sync via a
            procedural bridge so corrections become both new memories and new
            personality rules.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/memory"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors"
              style={{
                borderColor: 'color-mix(in srgb, var(--color-memory) 35%, transparent)',
                color: 'var(--color-memory)',
              }}
            >
              See przm Memory &rarr;
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
          <Link href="/memory" className="hover:underline" style={{ color: 'var(--color-memory)' }}>
            Memory
          </Link>
          <span className="mx-2 text-[color:var(--color-text-disabled)]">·</span>
          <span style={{ color: ACCENT }}>Voice</span>
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
      <h3 className="mb-2 font-mono text-sm font-semibold" style={{ color: accent }}>
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
