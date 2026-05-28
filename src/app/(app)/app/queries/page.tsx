/**
 * Queries page — /app/queries
 *
 * Query observability surface: shows the last N MCP searches made by
 * users in this org (query text, ranked results, agent, user, timestamp).
 *
 * The query log is written by the MCP kb_search hook in cortex (a separate
 * service). Until that hook writes to a shared log endpoint, this page
 * renders an informational empty state. The cortex-side route
 * (dashboard-queries.ts) already exists; this page will wire to it
 * once the hook is live.
 */

import type { Metadata } from 'next'
import { requireUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Queries | przm',
}

export default async function QueriesPage() {
  await requireUser()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Queries
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Query log.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Recent MCP searches — query text, ranked results, agent, user.
        </p>
      </div>

      {/* Empty state */}
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          No queries yet.
        </h2>
        <p
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Every{' '}
          <code
            className="rounded px-1 py-0.5 font-mono text-xs"
            style={{
              background: 'var(--color-bg-raised)',
              color: 'var(--color-knowledge)',
            }}
          >
            kb_search
          </code>{' '}
          call your team&apos;s agents make against Cortex will appear here once
          your agents are connected. Connect Claude Code, Claude Desktop, or
          any MCP-aware agent to start populating this view.
        </p>
      </div>
    </div>
  )
}
