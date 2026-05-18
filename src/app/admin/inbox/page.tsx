import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { listSubmissions, type SubmissionStatus, type Submission } from '@/lib/submissions'
import { isDbConfigured } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Inbox' }

function fmtAgo(iso: string): string {
  const t = new Date(iso).getTime()
  const sec = Math.max(0, Math.floor((Date.now() - t) / 1000))
  if (sec < 60) return sec + 's ago'
  if (sec < 3600) return Math.floor(sec / 60) + 'm ago'
  if (sec < 86400) return Math.floor(sec / 3600) + 'h ago'
  return Math.floor(sec / 86400) + 'd ago'
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: 'new',
  replied: 'replied',
  meeting_scheduled: 'meeting',
  closed_won: 'won',
  closed_lost: 'lost',
  archived: 'archived',
}

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  new: 'var(--color-bench)',
  replied: 'var(--color-text-secondary)',
  meeting_scheduled: 'var(--color-voice)',
  closed_won: 'var(--color-bench)',
  closed_lost: 'var(--color-text-muted)',
  archived: 'var(--color-text-disabled)',
}

const TIER_COLORS: Record<string, string> = {
  charter: 'var(--color-bench)',
  standard: 'var(--color-text-primary)',
  extended: 'var(--color-voice)',
  enterprise: 'var(--color-memory)',
}

export default async function AdminInboxPage() {
  if (!isDbConfigured()) {
    return (
      <>
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
          <div className="rounded-lg border border-[color:var(--color-memory)]/40 bg-[color:var(--color-memory)]/10 p-6">
            <h1 className="font-mono text-lg font-semibold text-[color:var(--color-memory)]">
              Database not configured
            </h1>
            <p className="mt-2 font-mono text-sm text-[color:var(--color-text-secondary)]">
              Connect Neon via Vercel marketplace, then this page populates.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  let submissions: Submission[] = []
  let dbError: string | null = null
  try {
    submissions = await listSubmissions()
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e)
  }

  const newCount = submissions.filter((s) => s.status === 'new').length

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // admin · inbox
            {newCount > 0 ? (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  background: 'var(--color-bench)',
                  color: 'var(--color-charcoal)',
                }}
              >
                {newCount} new
              </span>
            ) : null}
          </div>
          <h1 className="font-mono text-3xl font-semibold text-[color:var(--color-text-primary)]">
            Inbox
          </h1>
          <p className="mt-2 font-mono text-xs text-[color:var(--color-text-muted)]">
            {submissions.length} submission{submissions.length === 1 ? '' : 's'} ·{' '}
            <a
              href="/admin/inbox"
              className="underline-offset-4 hover:underline"
            >
              refresh
            </a>
          </p>
        </div>

        {dbError ? (
          <div className="mb-6 rounded-lg border border-[color:var(--color-memory)]/40 bg-[color:var(--color-memory)]/10 p-4">
            <p className="font-mono text-xs text-[color:var(--color-memory)]">
              Database query failed: {dbError}
            </p>
          </div>
        ) : null}

        {submissions.length === 0 && !dbError ? (
          <div className="rounded-lg border border-dashed border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/20 p-12 text-center">
            <p className="font-mono text-sm text-[color:var(--color-text-muted)]">
              No submissions yet.
            </p>
            <p className="mt-2 font-mono text-xs text-[color:var(--color-text-disabled)]">
              When a vendor fills out the form on{' '}
              <Link
                href="/vendor-cert"
                className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
              >
                /vendor-cert
              </Link>
              , they show up here.
            </p>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/30">
            {submissions.map((s, i) => (
              <li
                key={s.id}
                className={
                  i > 0
                    ? 'border-t border-[color:var(--color-border-subtle)]'
                    : ''
                }
              >
                <Link
                  href={`/admin/inbox/${s.id}`}
                  className="grid grid-cols-12 gap-4 px-5 py-4 transition-colors hover:bg-[color:var(--color-bg-elevated)]/40"
                >
                  <div className="col-span-12 flex items-center gap-3 sm:col-span-3">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: STATUS_COLORS[s.status] }}
                    />
                    <span className="truncate font-mono text-sm text-[color:var(--color-text-primary)]">
                      {s.company}
                    </span>
                  </div>
                  <div className="col-span-7 sm:col-span-3">
                    <span className="truncate font-mono text-xs text-[color:var(--color-text-secondary)]">
                      {s.framework}
                    </span>
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    <span
                      className="font-mono text-[11px] uppercase tracking-widest"
                      style={{ color: TIER_COLORS[s.tier] }}
                    >
                      {s.tier}
                    </span>
                  </div>
                  <div className="col-span-7 sm:col-span-2">
                    <span className="truncate font-mono text-[11px] text-[color:var(--color-text-muted)]">
                      {STATUS_LABELS[s.status]}
                    </span>
                  </div>
                  <div className="col-span-5 text-right sm:col-span-2">
                    <span className="font-mono text-[11px] text-[color:var(--color-text-muted)]">
                      {fmtAgo(s.createdAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}
