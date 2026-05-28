/**
 * Operator dashboard — /admin/ops
 *
 * Summary counts + latest signups + latest system audit events.
 * All fetches are wrapped in try/catch so the page renders even
 * before the backend endpoints are live.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type AccessOrg, type AccessAuditEvent } from '@/lib/access-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Operator Dashboard | przm',
}

// Plan-to-MRR lookup (simple monthly estimate per seat).
// Adjust when pricing is confirmed.
const PLAN_SEAT_PRICE: Record<string, number> = {
  solo: 19,
  team: 15,
  business: 12,
  business_pilot: 0,
  'self_hosted_departmental': 25,
  division: 20,
  enterprise: 0,
}

function estimateMrr(orgs: AccessOrg[]): number {
  return orgs.reduce((sum, org) => {
    const pricePerSeat = PLAN_SEAT_PRICE[org.plan] ?? 0
    const seats = org.seatCount ?? 1
    return sum + pricePerSeat * seats
  }, 0)
}

function actionColor(action: string): string {
  if (action.includes('delete') || action.includes('remove')) return 'var(--color-red)'
  if (action.includes('create') || action.includes('invite')) return 'var(--color-bench)'
  if (action.includes('update') || action.includes('change') || action.includes('patch'))
    return 'var(--color-gold)'
  return 'var(--color-text-secondary)'
}

export default async function OpsDashboardPage() {
  await requireOperator()

  let orgs: AccessOrg[] = []
  let orgsError: string | null = null
  try {
    orgs = await accessAdmin.orgs.list()
  } catch (err) {
    orgsError = err instanceof Error ? err.message : 'Unknown error'
  }

  let latestAudit: AccessAuditEvent[] = []
  let auditError: string | null = null
  try {
    const res = await accessAdmin.audit.list({ limit: 5 })
    latestAudit = res.events
  } catch (err) {
    auditError = err instanceof Error ? err.message : 'Unknown error'
  }

  // Derive counts from org list (tenant breakdown requires per-org fetch; skip for dashboard perf).
  const totalOrgs = orgs.length
  const activeOrgs = orgs.filter((o) => o.plan !== '' && o.plan !== 'free').length
  const mrr = estimateMrr(orgs)

  // Latest 5 signups sorted by createdAt desc.
  const latestSignups = [...orgs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

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
          Dashboard.
        </h1>
      </div>

      {orgsError ? (
        <div
          className="mb-6 rounded-xl border p-4"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'color-mix(in srgb, var(--color-red) 8%, transparent)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--color-red)' }}>
            Failed to load org data: {orgsError}
          </p>
        </div>
      ) : null}

      {/* Stat grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Total orgs', value: String(totalOrgs) },
          { label: 'Active orgs', value: String(activeOrgs) },
          { label: 'MRR est.', value: `$${mrr.toLocaleString()}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-5"
            style={{
              borderColor: 'var(--color-border-default)',
              background: 'var(--color-bg-surface)',
            }}
          >
            <p
              className="text-[10px] font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-text-disabled)' }}
            >
              {stat.label}
            </p>
            <p
              className="mt-2 font-mono text-2xl font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Two-column lower section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest signups */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[11px] font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Latest signups
            </h2>
            <Link
              href="/admin/ops/orgs"
              className="text-xs"
              style={{ color: 'var(--color-knowledge)' }}
            >
              View all
            </Link>
          </div>
          <div
            className="rounded-xl border"
            style={{
              borderColor: 'var(--color-border-default)',
              background: 'var(--color-bg-surface)',
            }}
          >
            {orgsError ? (
              <p className="p-5 text-sm" style={{ color: 'var(--color-red)' }}>
                {orgsError}
              </p>
            ) : latestSignups.length === 0 ? (
              <p
                className="p-8 text-center text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                No orgs yet.
              </p>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
                {latestSignups.map((org) => (
                  <li key={org.id}>
                    <Link
                      href={`/admin/ops/orgs/${org.id}`}
                      className="flex items-center justify-between px-5 py-3 transition-colors"
                      style={{ color: 'inherit' }}
                    >
                      <div>
                        <span
                          className="font-mono text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {org.slug}
                        </span>
                        <span
                          className="ml-3 text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {org.name}
                        </span>
                      </div>
                      <span
                        className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                        style={{
                          background: 'var(--color-bg-raised)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {org.plan}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Latest audit events */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[11px] font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Recent system events
            </h2>
            <Link
              href="/admin/ops/audit"
              className="text-xs"
              style={{ color: 'var(--color-knowledge)' }}
            >
              View all
            </Link>
          </div>
          <div
            className="rounded-xl border"
            style={{
              borderColor: 'var(--color-border-default)',
              background: 'var(--color-bg-surface)',
            }}
          >
            {auditError ? (
              <p className="p-5 text-sm" style={{ color: 'var(--color-red)' }}>
                {auditError}
              </p>
            ) : latestAudit.length === 0 ? (
              <p
                className="p-8 text-center text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                No events.
              </p>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
                {latestAudit.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span
                      className="rounded px-2 py-0.5 font-mono text-xs"
                      style={{
                        background: 'var(--color-bg-raised)',
                        color: actionColor(ev.action),
                      }}
                    >
                      {ev.action}
                    </span>
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: 'var(--color-text-disabled)' }}
                    >
                      {new Date(ev.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
