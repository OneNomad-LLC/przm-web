/**
 * Org detail — /admin/ops/orgs/[id]
 *
 * Tenants by deployment mode, members, recent audit. Each section
 * fetches independently so a single failed endpoint doesn't blank
 * the whole page.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import {
  accessAdmin,
  type AccessTenant,
  type AccessMemberWithUser,
  type AccessAuditEvent,
} from '@/lib/access-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Org Detail | Operator | przm',
}

interface PageProps {
  params: Promise<{ id: string }>
}

function actionColor(action: string): string {
  if (action.includes('delete') || action.includes('remove')) return 'var(--color-red)'
  if (action.includes('create') || action.includes('invite')) return 'var(--color-bench)'
  if (action.includes('update') || action.includes('change') || action.includes('patch'))
    return 'var(--color-gold)'
  return 'var(--color-text-secondary)'
}

function TenantGroup({
  label,
  tenants,
}: {
  label: string
  tenants: AccessTenant[]
}) {
  if (tenants.length === 0) return null
  return (
    <div className="mb-4">
      <p
        className="mb-2 text-[10px] font-medium uppercase tracking-widest"
        style={{ color: 'var(--color-text-disabled)' }}
      >
        {label}
      </p>
      <ul className="space-y-2">
        {tenants.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between rounded-lg border px-4 py-2.5"
            style={{
              borderColor: 'var(--color-border-subtle)',
              background: 'var(--color-bg-raised)',
            }}
          >
            <div>
              <span
                className="font-mono text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t.slug}
              </span>
              <span
                className="ml-3 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t.name}
              </span>
            </div>
            <span
              className="font-mono text-[10px]"
              style={{ color: 'var(--color-text-disabled)' }}
            >
              {t.id.slice(0, 8)}…
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function OrgDetailPage({ params }: PageProps) {
  await requireOperator()
  const { id } = await params

  // Fire org + seats + audit concurrently; members needs a tenant id from the org.
  const [orgRes, seatsRes, auditRes] = await Promise.allSettled([
    accessAdmin.orgs.get(id),
    accessAdmin.orgs.seats(id),
    accessAdmin.orgs.audit(id, { limit: 20 }),
  ])

  const org = orgRes.status === 'fulfilled' ? orgRes.value : null
  const orgError =
    orgRes.status === 'rejected'
      ? (orgRes.reason instanceof Error ? orgRes.reason.message : String(orgRes.reason))
      : null

  const seats = seatsRes.status === 'fulfilled' ? seatsRes.value : null

  let members: AccessMemberWithUser[] = []
  let membersError: string | null = null
  if (org) {
    const primaryTenantId =
      org.tenants.cloud[0]?.id ?? org.tenants.self_hosted[0]?.id
    if (primaryTenantId) {
      try {
        const res = await accessAdmin.members.list(primaryTenantId)
        members = res.members
      } catch (err) {
        membersError = err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }

  const auditEvents: AccessAuditEvent[] =
    auditRes.status === 'fulfilled' ? auditRes.value.events : []
  const auditError =
    auditRes.status === 'rejected'
      ? (auditRes.reason instanceof Error ? auditRes.reason.message : String(auditRes.reason))
      : null

  if (orgError) {
    return (
      <div>
        <div className="mb-8">
          <p
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Operator console / Orgs
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--color-red)' }}
          >
            Error loading org.
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-red)' }}>
          {orgError}
        </p>
      </div>
    )
  }

  if (!org) return null

  const cloudTenants = org.tenants.cloud ?? []
  const selfHostedTenants = org.tenants.self_hosted ?? []

  return (
    <div>
      {/* Breadcrumb */}
      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-widest"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <Link href="/admin/ops/orgs" style={{ color: 'var(--color-knowledge)' }}>
          Orgs
        </Link>{' '}
        / {org.slug}
      </p>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="mt-1 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {org.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className="font-mono text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {org.slug}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
              style={{
                background: 'var(--color-bg-raised)',
                color: 'var(--color-text-muted)',
              }}
            >
              {org.plan}
            </span>
            {seats ? (
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--color-bench)' }}
              >
                {seats.seatsUsed}
                {seats.seatCount !== null ? ` / ${seats.seatCount}` : ''} seats
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/ops/orgs/${id}/tenants/new`}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              borderColor: 'var(--color-knowledge)',
              color: 'var(--color-knowledge)',
            }}
          >
            + New tenant
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tenants */}
        <section
          className="rounded-xl border p-5"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <h2
            className="mb-4 text-sm font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Tenants
          </h2>
          {cloudTenants.length === 0 && selfHostedTenants.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No tenants provisioned yet.
            </p>
          ) : (
            <>
              <TenantGroup label="Cloud" tenants={cloudTenants} />
              <TenantGroup label="Self-hosted" tenants={selfHostedTenants} />
            </>
          )}
        </section>

        {/* Members */}
        <section
          className="rounded-xl border"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div className="px-5 py-4">
            <h2
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Members ({members.length})
            </h2>
          </div>
          {membersError ? (
            <p className="px-5 pb-5 text-sm" style={{ color: 'var(--color-red)' }}>
              {membersError}
            </p>
          ) : members.length === 0 ? (
            <p
              className="px-5 pb-5 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              No members.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    {['Email', 'Name', 'Role', 'Joined'].map((col) => (
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
                  {members.map((m) => (
                    <tr
                      key={m.id}
                      style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                    >
                      <td
                        className="px-5 py-3 align-middle font-mono text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {m.user?.email ?? m.userId.slice(0, 8) + '…'}
                      </td>
                      <td
                        className="px-5 py-3 align-middle text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {m.user?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            background: 'var(--color-bg-raised)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3 align-middle text-xs"
                        style={{ color: 'var(--color-text-disabled)' }}
                      >
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent audit */}
        <section
          className="rounded-xl border"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div className="px-5 py-4">
            <h2
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Recent audit (last 20)
            </h2>
          </div>
          {auditError ? (
            <p className="px-5 pb-5 text-sm" style={{ color: 'var(--color-red)' }}>
              {auditError}
            </p>
          ) : auditEvents.length === 0 ? (
            <p
              className="px-5 pb-5 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              No events.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    {['Action', 'Actor', 'Target', 'When'].map((col) => (
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
                  {auditEvents.map((ev) => (
                    <tr
                      key={ev.id}
                      style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                    >
                      <td className="px-5 py-3 align-middle">
                        <span
                          className="rounded px-2 py-0.5 font-mono text-xs"
                          style={{
                            background: 'var(--color-bg-raised)',
                            color: actionColor(ev.action),
                          }}
                        >
                          {ev.action}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3 align-middle font-mono text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {ev.userId ? ev.userId.slice(0, 8) + '…' : 'system'}
                      </td>
                      <td
                        className="px-5 py-3 align-middle font-mono text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {ev.target ? ev.target.slice(0, 16) + '…' : '—'}
                      </td>
                      <td
                        className="px-5 py-3 align-middle text-xs"
                        style={{ color: 'var(--color-text-disabled)' }}
                      >
                        {new Date(ev.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
