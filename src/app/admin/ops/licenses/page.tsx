/**
 * All licenses — /admin/ops/licenses
 *
 * Cross-org license list. Filterable by status, mode, and expiry window.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type License } from '@/lib/access-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Licenses | Operator | przm',
}

interface PageProps {
  searchParams: Promise<{
    status?: string
    mode?: string
    expiring?: string
  }>
}

function isExpiringSoon(expiresAt: string): boolean {
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
  return new Date(expiresAt).getTime() - Date.now() < THIRTY_DAYS
}

function statusColor(status: License['status']): string {
  if (status === 'active') return 'var(--color-knowledge)'
  if (status === 'revoked') return 'var(--color-red)'
  return 'var(--color-text-disabled)'
}

export default async function LicensesPage({ searchParams }: PageProps) {
  await requireOperator()

  const { status, mode, expiring } = await searchParams

  let licenses: License[] = []
  let fetchError: string | null = null
  try {
    const filter =
      status && status !== 'all'
        ? { status: status as 'active' | 'expired' | 'all' }
        : { status: 'all' as const }
    const res = await accessAdmin.licenses.list(filter)
    licenses = res.licenses
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

  const filtered = licenses.filter((lic) => {
    if (mode && mode !== 'all' && lic.mode !== mode) return false
    if (expiring === '1' && !isExpiringSoon(lic.expiresAt)) return false
    return true
  })

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
          Licenses.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {licenses.length} total
          {filtered.length !== licenses.length ? `, ${filtered.length} shown` : ''}
        </p>
      </div>

      {/* Filters */}
      <form method="get" className="mb-5 flex flex-wrap gap-3">
        <select
          name="status"
          defaultValue={status ?? 'all'}
          className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        <select
          name="mode"
          defaultValue={mode ?? 'all'}
          className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <option value="all">All modes</option>
          <option value="annual">Annual</option>
          <option value="perpetual">Perpetual</option>
        </select>
        <label
          className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <input
            type="checkbox"
            name="expiring"
            value="1"
            defaultChecked={expiring === '1'}
            className="accent-[var(--color-gold)]"
          />
          Expiring within 30 days
        </label>
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
            Failed to load licenses: {fetchError}
          </p>
        ) : filtered.length === 0 ? (
          <p
            className="p-8 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No licenses found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {['Customer', 'Org', 'Mode', 'Status', 'Seats', 'Tenants', 'Expires'].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-5 py-2 text-left text-[10px] font-medium uppercase tracking-widest"
                        style={{ color: 'var(--color-text-disabled)' }}
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lic) => {
                  const expiring30 = isExpiringSoon(lic.expiresAt) && lic.status === 'active'
                  return (
                    <tr
                      key={lic.id}
                      style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                    >
                      <td className="px-5 py-3 align-middle">
                        <span
                          className="text-sm"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {lic.customerName}
                        </span>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <Link
                          href={`/admin/ops/orgs/${lic.orgId}`}
                          className="font-mono text-xs underline-offset-2 hover:underline"
                          style={{ color: 'var(--color-knowledge)' }}
                        >
                          {lic.orgId.slice(0, 8)}…
                        </Link>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            background: 'var(--color-bg-raised)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {lic.mode}
                        </span>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                          style={{
                            background:
                              lic.status === 'active'
                                ? 'color-mix(in srgb, var(--color-knowledge) 12%, transparent)'
                                : 'var(--color-bg-raised)',
                            color: statusColor(lic.status),
                          }}
                        >
                          {lic.status}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3 align-middle font-mono text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {lic.seatCap}
                      </td>
                      <td
                        className="px-5 py-3 align-middle font-mono text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {lic.tenantCap}
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <span
                          className="text-xs"
                          style={{
                            color: expiring30
                              ? 'var(--color-gold)'
                              : 'var(--color-text-disabled)',
                          }}
                        >
                          {new Date(lic.expiresAt).toLocaleDateString()}
                          {expiring30 ? ' !' : ''}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
