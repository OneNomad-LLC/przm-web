/**
 * Deployments list — /admin/ops/deployments
 *
 * Table of all registered cloud stacks (shared multi-tenant + per-enterprise
 * dedicated). v1 is record-only — the operator runs `terraform apply` manually
 * and registers the endpoint here. Each row has an on-demand "Ping" button
 * that probes the deployment's /health endpoint and updates the status.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireOperator } from '@/lib/operator'
import { accessAdmin, type AccessDeployment, type DeploymentStatus } from '@/lib/access-admin'
import { pingDeploymentAction } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Deployments | Operator | przm',
}

const STATUS_COLOR: Record<DeploymentStatus, string> = {
  live: 'var(--color-green, #16a34a)',
  pending: 'var(--color-text-muted)',
  degraded: 'var(--color-yellow, #ca8a04)',
  down: 'var(--color-red, #dc2626)',
}

function statusLabel(s: DeploymentStatus): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function fmtDate(iso: string): string {
  return new Date(iso).toISOString().replace('T', ' ').slice(0, 16)
}

export default async function DeploymentsPage() {
  await requireOperator()

  let deployments: AccessDeployment[] = []
  let fetchError: string | null = null
  try {
    deployments = await accessAdmin.deployments.list()
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

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
            Deployments.
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Shared multi-tenant clouds + per-enterprise dedicated stacks.
            Record-only in v1 — provision with terraform, then register the endpoint here.
          </p>
        </div>
        <Link
          href="/admin/ops/deployments/new"
          className="rounded-md border px-4 py-2 text-sm font-medium"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
          }}
        >
          Register deployment
        </Link>
      </div>

      {fetchError ? (
        <div
          className="rounded-lg border p-4 text-sm"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-red)',
            background: 'color-mix(in srgb, var(--color-red) 8%, transparent)',
          }}
        >
          Failed to load deployments: {fetchError}
        </div>
      ) : deployments.length === 0 ? (
        <div
          className="rounded-xl border p-10 text-center text-sm"
          style={{
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-muted)',
            background: 'var(--color-bg-surface)',
          }}
        >
          No deployments registered yet.
          {' '}
          <Link
            href="/admin/ops/deployments/new"
            style={{ color: 'var(--color-text-primary)' }}
            className="underline"
          >
            Register the first one →
          </Link>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--color-border-default)', background: 'var(--color-bg-surface)' }}
        >
          <table className="w-full text-left text-sm">
            <thead
              className="border-b"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-muted)',
              }}
            >
              <tr>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest">Label</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest">Region</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest">Endpoint</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr
                  key={d.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: 'var(--color-border-default)' }}
                >
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>
                    <div className="font-medium">{d.label}</div>
                    {d.orgId ? (
                      <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                        Dedicated · org {d.orgId.slice(0, 8)}…
                      </div>
                    ) : (
                      <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                        Shared multi-tenant
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                    {d.region ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={d.endpointUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {d.endpointUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        background: 'color-mix(in srgb, currentColor 12%, transparent)',
                        color: STATUS_COLOR[d.status],
                      }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: 'currentColor' }}
                      />
                      {statusLabel(d.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                    {fmtDate(d.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={pingDeploymentAction} className="inline">
                      <input type="hidden" name="id" value={d.id} />
                      <button
                        type="submit"
                        className="rounded-md border px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest"
                        style={{
                          borderColor: 'var(--color-border-default)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        Ping
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
