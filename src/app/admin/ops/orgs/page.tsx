/**
 * Orgs list — /admin/ops/orgs
 *
 * Table of all organizations. Search by slug/name, filter by plan.
 * Interactive filters are handled via searchParams (no client state needed).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type AccessOrg } from '@/lib/access-admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Orgs | Operator | przm',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    plan?: string
  }>
}

export default async function OpsOrgsPage({ searchParams }: PageProps) {
  await requireOperator()

  const { q, plan } = await searchParams

  let orgs: AccessOrg[] = []
  let fetchError: string | null = null
  try {
    orgs = await accessAdmin.orgs.list()
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

  // Client-side filter (data is fully in-memory after the fetch).
  const filtered = orgs.filter((org) => {
    if (plan && plan !== 'all' && org.plan !== plan) return false
    if (q) {
      const lower = q.toLowerCase()
      return org.slug.toLowerCase().includes(lower) || org.name.toLowerCase().includes(lower)
    }
    return true
  })

  const uniquePlans = [...new Set(orgs.map((o) => o.plan))].sort()

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
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
            Organizations.
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {orgs.length} total
            {filtered.length !== orgs.length ? `, ${filtered.length} shown` : ''}
          </p>
        </div>
        <Link
          href="/admin/ops/orgs/new"
          className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          style={{
            borderColor: 'var(--color-knowledge)',
            color: 'var(--color-knowledge)',
          }}
        >
          + New org
        </Link>
      </div>

      {/* Filters */}
      <form method="get" className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search slug or name..."
          className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-sm"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
        <select
          name="plan"
          defaultValue={plan ?? 'all'}
          className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <option value="all">All plans</option>
          {uniquePlans.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
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
            Failed to load orgs: {fetchError}
          </p>
        ) : filtered.length === 0 ? (
          <p
            className="p-8 text-center text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No organizations found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {['Slug', 'Name', 'Plan', 'Seats', 'Created'].map((col) => (
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
                {filtered.map((org) => (
                  <tr
                    key={org.id}
                    style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                  >
                    <td className="px-5 py-3 align-middle">
                      <Link
                        href={`/admin/ops/orgs/${org.id}`}
                        className="font-mono text-sm underline-offset-2 hover:underline"
                        style={{ color: 'var(--color-knowledge)' }}
                      >
                        {org.slug}
                      </Link>
                    </td>
                    <td
                      className="px-5 py-3 align-middle text-sm"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {org.name}
                    </td>
                    <td className="px-5 py-3 align-middle">
                      <span
                        className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                        style={{
                          background: 'var(--color-bg-raised)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {org.plan}
                      </span>
                    </td>
                    <td
                      className="px-5 py-3 align-middle font-mono text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {org.seatCount ?? '—'}
                    </td>
                    <td
                      className="px-5 py-3 align-middle text-xs"
                      style={{ color: 'var(--color-text-disabled)' }}
                    >
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
