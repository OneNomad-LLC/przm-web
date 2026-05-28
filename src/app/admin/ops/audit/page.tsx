/**
 * Cross-org audit — /admin/ops/audit
 *
 * Operator-level audit log. No org filter imposed. Supports action
 * and orgId filters + cursor pagination.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type AccessAuditEvent } from '@/lib/access-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Audit | Operator | przm',
}

const LIMIT = 50

interface PageProps {
  searchParams: Promise<{
    cursor?: string
    since?: string
    action?: string
    orgId?: string
  }>
}

function actionColor(action: string): string {
  if (action.includes('delete') || action.includes('remove')) return 'var(--color-red)'
  if (action.includes('create') || action.includes('invite')) return 'var(--color-bench)'
  if (action.includes('update') || action.includes('change') || action.includes('patch'))
    return 'var(--color-gold)'
  return 'var(--color-text-secondary)'
}

export default async function OpsAuditPage({ searchParams }: PageProps) {
  await requireOperator()

  const { cursor, since, action, orgId } = await searchParams

  let events: AccessAuditEvent[] = []
  let nextCursor: string | null = null
  let fetchError: string | null = null

  try {
    const res = await accessAdmin.audit.list({
      limit: LIMIT,
      ...(cursor ? { cursor } : {}),
      ...(since ? { since } : {}),
      ...(action ? { action } : {}),
      ...(orgId ? { orgId } : {}),
    })
    events = res.events
    nextCursor = res.nextCursor
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

  // Build pagination URLs preserving active filters.
  function buildUrl(overrides: Record<string, string | undefined>): string {
    const params = new URLSearchParams()
    const merged: Record<string, string | undefined> = {
      ...(since ? { since } : {}),
      ...(action ? { action } : {}),
      ...(orgId ? { orgId } : {}),
      ...overrides,
    }
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v)
    }
    const qs = params.toString()
    return `/admin/ops/audit${qs ? `?${qs}` : ''}`
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
          Operator console
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Audit log.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          System-wide event feed across all organizations.
        </p>
      </div>

      {/* Filters */}
      <form method="get" className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          name="action"
          defaultValue={action ?? ''}
          placeholder="Filter by action..."
          className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-sm"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
        <input
          type="text"
          name="orgId"
          defaultValue={orgId ?? ''}
          placeholder="Filter by org ID..."
          className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-sm font-mono"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
        <button
          type="submit"
          className="rounded-md border px-3 py-1.5 text-sm font-medium"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Filter
        </button>
        {(action || orgId) ? (
          <Link
            href="/admin/ops/audit"
            className="rounded-md px-3 py-1.5 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Clear
          </Link>
        ) : null}
      </form>

      {/* Table */}
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
            No events found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {['Action', 'Org', 'Actor', 'Target', 'Tenant', 'When'].map((col) => (
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
              href={buildUrl({ cursor: undefined })}
              className="rounded-md border px-4 py-1.5 text-sm font-medium"
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
              href={buildUrl({ cursor: nextCursor! })}
              className="rounded-md border px-4 py-1.5 text-sm font-medium"
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
      <td className="px-5 py-3 align-middle">
        {event.organizationId ? (
          <Link
            href={`/admin/ops/orgs/${event.organizationId}`}
            className="font-mono text-xs underline-offset-2 hover:underline"
            style={{ color: 'var(--color-knowledge)' }}
          >
            {event.organizationId.slice(0, 8)}…
          </Link>
        ) : (
          <span className="font-mono text-xs" style={{ color: 'var(--color-text-disabled)' }}>
            —
          </span>
        )}
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
        {event.target ? event.target.slice(0, 14) + '…' : '—'}
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
