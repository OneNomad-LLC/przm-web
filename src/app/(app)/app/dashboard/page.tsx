/**
 * Dashboard landing page — /app/dashboard
 *
 * The authenticated home. Shows the signed-in user's email and
 * placeholder cards for the subsections that land in Task #05
 * (Members, Projects, Queries, Audit).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard | przm',
}

const SECTION_CARDS = [
  {
    title: 'Members',
    description: 'Manage your organization members and seat assignments.',
    href: '/app/members',
  },
  {
    title: 'Projects',
    description: 'View your benchmarked projects and their signed receipts.',
    href: '/app/projects',
  },
  {
    title: 'Queries',
    description: 'Browse MCP query logs and reliability metrics.',
    href: '/app/queries',
  },
  {
    title: 'Audit log',
    description: 'Full audit trail for your organization.',
    href: '/app/audit',
  },
]

export default async function DashboardPage() {
  const { user } = await requireUser()

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Dashboard
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Welcome back.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Signed in as <span className="font-mono">{user.email}</span>
        </p>
      </div>

      {/* Section cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTION_CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border p-5 transition-colors"
            style={{
              borderColor: 'var(--color-border-default)',
              background: 'var(--color-bg-surface)',
            }}
          >
            <h2
              className="mb-2 text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {card.title}
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Billing quick-link */}
      <div
        className="mt-8 rounded-xl border p-5"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Billing
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Manage your subscription and payment methods.
            </p>
          </div>
          <a
            href="/app/billing"
            className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Manage billing →
          </a>
        </div>
      </div>
    </div>
  )
}
