/**
 * Audit log — /app/audit
 *
 * Paginated feed of `audit_event` rows for the org. Proxied from
 * przm-access via the accessAdmin client. Cursor-based pagination.
 *
 * Server Component — reads the cursor from searchParams so each page
 * is shareable and browser-back works.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { getAccessContext } from '@/lib/access-context'
import { accessAdmin, type AccessAuditEvent } from '@/lib/access-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Audit log | przm',
}

const LIMIT = 50

interface AuditPageProps {
  searchParams: Promise<{
    cursor?: string
    since?: string
  }>
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const { user } = await requireUser()
  const ctx = await getAccessContext(user.id)
  const { cursor, since } = await searchParams

  if (!ctx) {
    return (
      <div>
        <div className="mb-8">
          <p
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Audit log
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Not available.
          </h1>
        </div>
        <div
          className="rounded-xl border p-8"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Your account isn&apos;t linked to an organization yet.
          </p>
        </div>
      </div>
    )
  }

  let events: AccessAuditEvent[] = []
  let nextCursor: string | null = null
  let fetchError: string | null = null

  try {
    const res = await accessAdmin.orgs.audit(ctx.orgId, {
      limit: LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(since ? { since } : {}),
    })
    events = res.events
    nextCursor = res.nextCursor
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

  const hasPrev = Boolean(cursor)
  const hasNext = Boolean(nextCursor)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Audit log
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Audit log.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Read-only event feed for your organization. Every admin action — invites,
          role changes, seat toggles, project creations — is recorded here and
          available for SIEM export.
        </p>
      </div>

      {/* Events table */}
      <div
        className="rounded-xl border"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        {fetchError ? (
          <p className="p-5 text-sm" style={{ color: 'var(--color-red)' }}>
            Failed to load audit log: {fetchError}
          </p>
        ) : events.length === 0 ? (
          <p
            className="p-8 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No events found{since ? ' for the selected date range' : ''}.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {['Action', 'Actor', 'Target', 'Tenant', 'When'].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-2 text-left text-[10px] font-medium uppercase tracking-widest"
                      style={{ color: 'var(--color-text-disabled)' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <AuditRow key={ev.id} event={ev} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(hasPrev || hasNext) && (
        <div className="mt-4 flex items-center justify-between">
          {hasPrev ? (
            <Link
              href="/app/audit"
              className="rounded-md border px-4 py-1.5 text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              ← Newest
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              href={`/app/audit?cursor=${encodeURIComponent(nextCursor!)}${since ? `&since=${encodeURIComponent(since)}` : ''}`}
              className="rounded-md border px-4 py-1.5 text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Next page →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  )
}

function actionColor(action: string): string {
  if (action.includes('delete') || action.includes('remove')) return 'var(--color-red)'
  if (action.includes('create') || action.includes('invite')) return 'var(--color-bench)'
  if (action.includes('update') || action.includes('change') || action.includes('patch'))
    return 'var(--color-gold)'
  return 'var(--color-text-secondary)'
}

function AuditRow({ event }: { event: AccessAuditEvent }) {
  return (
    <tr style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
      <td className="px-5 py-3 align-middle">
        <span
          className="rounded px-2 py-0.5 font-mono text-xs"
          style={{
            background: 'var(--color-bg-raised)',
            color: actionColor(event.action),
          }}
        >
          {event.action}
        </span>
      </td>
      <td
        className="px-5 py-3 align-middle font-mono text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {event.userId ? event.userId.slice(0, 8) + '…' : 'system'}
      </td>
      <td
        className="px-5 py-3 align-middle font-mono text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {event.target ? event.target.slice(0, 12) + '…' : '—'}
      </td>
      <td
        className="px-5 py-3 align-middle font-mono text-xs"
        style={{ color: 'var(--color-text-disabled)' }}
      >
        {event.tenantId ? event.tenantId.slice(0, 8) + '…' : '—'}
      </td>
      <td
        className="px-5 py-3 align-middle text-xs"
        style={{ color: 'var(--color-text-disabled)' }}
      >
        {new Date(event.createdAt).toLocaleString()}
      </td>
    </tr>
  )
}
