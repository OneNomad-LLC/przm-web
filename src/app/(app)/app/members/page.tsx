/**
 * Members page — /app/members
 *
 * Shows all members of the current user's tenant. Admins can:
 *   - Invite by email (Server Action → przm-access POST /admin/tenants/:id/members)
 *   - Change roles inline (Server Action → PATCH /admin/tenants/:id/members/:userId)
 *   - Toggle active-seat status (Business+ only, Server Action)
 *
 * Server Component: fetches data at request time. Interactive bits
 * (invite form, role select, seat toggle) are Client Components.
 */

import type { Metadata } from 'next'
import { requireUser } from '@/lib/session'
import { getAccessContext } from '@/lib/access-context'
import { accessAdmin } from '@/lib/access-admin'
import { InviteForm } from './invite-form'
import { MemberRow } from './member-row'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Members | przm',
}

export default async function MembersPage() {
  const { user } = await requireUser()
  const ctx = await getAccessContext(user.id)

  if (!ctx) {
    return (
      <NotConfigured
        title="Members"
        reason="Your account isn't linked to a przm-access organization yet. Accept an invitation or contact your administrator."
      />
    )
  }

  const [membersResult, seatsResult] = await Promise.allSettled([
    accessAdmin.members.list(ctx.tenantId),
    accessAdmin.orgs.seats(ctx.orgId),
  ])

  const members =
    membersResult.status === 'fulfilled' ? membersResult.value.members : []
  const seats =
    seatsResult.status === 'fulfilled' ? seatsResult.value : null
  const membersError =
    membersResult.status === 'rejected'
      ? String(membersResult.reason instanceof Error
          ? membersResult.reason.message
          : membersResult.reason)
      : null

  const seatsConfigured = seats !== null

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Members
          </p>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Team members.
          </h1>
          {seatsConfigured && seats ? (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span
                className="font-semibold"
                style={{ color: 'var(--color-bench)' }}
              >
                {seats.seatsUsed}
              </span>
              {seats.seatCount !== null ? ` / ${seats.seatCount}` : ''} active seats
            </p>
          ) : null}
        </div>
      </div>

      {/* Invite form */}
      <div
        className="mb-6 rounded-xl border p-5"
        style={{
          borderColor: 'var(--color-border-default)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <h2
          className="mb-4 text-sm font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Invite a member
        </h2>
        <InviteForm />
      </div>

      {/* Members table */}
      <div
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
            Tenant members ({members.length})
          </h2>
        </div>

        {membersError ? (
          <p className="px-5 pb-5 text-sm" style={{ color: 'var(--color-red)' }}>
            Failed to load members: {membersError}
          </p>
        ) : members.length === 0 ? (
          <p
            className="px-5 pb-5 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            No members yet. Invite someone above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                >
                  {['Email / ID', 'Name', 'Role', ...(seatsConfigured ? ['Active seat'] : []), 'Joined'].map(
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
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {members.map((m) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    orgId={ctx.orgId}
                    tenantId={ctx.tenantId}
                    seatsConfigured={seatsConfigured}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function NotConfigured({
  title,
  reason,
}: {
  title: string
  reason: string
}) {
  return (
    <div>
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {title}
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
          {reason}
        </p>
      </div>
    </div>
  )
}
