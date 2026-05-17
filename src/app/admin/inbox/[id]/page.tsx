import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSubmission, getReplies } from '@/lib/submissions'
import { ReplyComposer } from '@/components/reply-composer'
import { StatusPicker } from '@/components/status-picker'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Submission' }

function fmtTimestamp(iso: string): string {
  return new Date(iso).toISOString().slice(0, 19).replace('T', ' ') + ' UTC'
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params
  const submission = await getSubmission(id)
  if (!submission) notFound()
  const replies = await getReplies(id)

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-28">
        {/* Back link */}
        <Link
          href="/admin/inbox"
          className="mb-6 inline-flex font-mono text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-bench)]"
        >
          ← inbox
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            <span>{submission.tier}</span>
            <span>·</span>
            <span>{fmtTimestamp(submission.createdAt)}</span>
          </div>
          <h1 className="font-mono text-2xl font-semibold text-[color:var(--color-text-primary)]">
            {submission.company}{' '}
            <span className="text-[color:var(--color-text-muted)]">/</span>{' '}
            <span className="text-[color:var(--color-text-secondary)]">
              {submission.framework}
            </span>
          </h1>
          <p className="mt-1 font-mono text-sm text-[color:var(--color-text-secondary)]">
            <a
              href={`mailto:${submission.email}`}
              className="text-[color:var(--color-bench)] underline-offset-4 hover:underline"
            >
              {submission.email}
            </a>
            {submission.releaseVersion ? (
              <>
                {' · '}
                <code className="rounded bg-[color:var(--color-bg-elevated)] px-1.5 py-0.5 text-xs">
                  {submission.releaseVersion}
                </code>
              </>
            ) : null}
          </p>
        </div>

        {/* Status picker */}
        <div className="mb-8">
          <StatusPicker submissionId={submission.id} current={submission.status} />
        </div>

        {/* Submission body */}
        <section className="mb-8 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // their note
          </div>
          {submission.context ? (
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[color:var(--color-text-primary)]">
              {submission.context}
            </p>
          ) : (
            <p className="font-mono text-sm italic text-[color:var(--color-text-disabled)]">
              No additional context provided.
            </p>
          )}
        </section>

        {/* Reply thread */}
        {replies.length > 0 ? (
          <section className="mb-8">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
              // thread ({replies.length} {replies.length === 1 ? 'message' : 'messages'})
            </div>
            <ul className="space-y-4">
              {replies.map((r) => (
                <li
                  key={r.id}
                  className="rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/30 p-4"
                >
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                    <span>
                      {r.direction === 'outbound' ? 'you →' : '← them'}
                    </span>
                    <span>{fmtTimestamp(r.sentAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                    {r.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Reply composer */}
        <section>
          <ReplyComposer submissionId={submission.id} prospectEmail={submission.email} />
        </section>
      </main>
      <Footer />
    </>
  )
}
