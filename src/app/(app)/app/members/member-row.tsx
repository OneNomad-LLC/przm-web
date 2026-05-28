'use client'

import { useTransition } from 'react'
import type { AccessMemberWithUser } from '@/lib/access-admin'
import { setMemberRole, toggleSeat } from './actions'

const ROLES = ['viewer', 'editor', 'admin', 'owner'] as const

interface MemberRowProps {
  member: AccessMemberWithUser
  orgId: string
  tenantId: string
  seatsConfigured: boolean
}

export function MemberRow({ member, orgId, tenantId, seatsConfigured }: MemberRowProps) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(role: string) {
    startTransition(async () => {
      const result = await setMemberRole(tenantId, member.userId, role)
      if (result.error) {
        // Surface inline; in production wire up a toast system.
        console.error('[member-row] role update failed:', result.error)
      }
    })
  }

  function handleSeatToggle() {
    startTransition(async () => {
      const result = await toggleSeat(orgId, member.userId, !member.active)
      if (result.error) {
        console.error('[member-row] seat toggle failed:', result.error)
      }
    })
  }

  const email = member.user?.email ?? null
  const name = member.user?.name ?? null

  return (
    <tr
      style={{
        borderTop: '1px solid var(--color-border-subtle)',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {/* Email / ID */}
      <td
        className="py-3 pr-4 align-middle text-sm font-mono"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {email ?? member.userId.slice(0, 12) + '…'}
      </td>

      {/* Name */}
      <td
        className="py-3 pr-4 align-middle text-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {name ?? '—'}
      </td>

      {/* Role (inline select) */}
      <td className="py-3 pr-4 align-middle">
        <select
          value={member.role}
          onChange={(e) => handleRoleChange(e.target.value)}
          disabled={isPending}
          className="rounded border px-2 py-1 text-xs"
          style={{
            background: 'var(--color-bg-raised)',
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </td>

      {/* Seat toggle (Business+ only) */}
      {seatsConfigured ? (
        <td className="py-3 pr-4 align-middle">
          <button
            type="button"
            onClick={handleSeatToggle}
            disabled={isPending}
            aria-label={member.active ? 'Deactivate seat' : 'Activate seat'}
            className="relative h-5 w-9 rounded-full transition-colors disabled:opacity-50"
            style={{
              background: member.active
                ? 'var(--color-bench)'
                : 'var(--color-border-default)',
            }}
          >
            <span
              className="absolute top-0.5 h-4 w-4 rounded-full transition-transform"
              style={{
                left: '2px',
                background: 'var(--color-bg-base)',
                transform: member.active ? 'translateX(16px)' : 'translateX(0)',
              }}
            />
          </button>
        </td>
      ) : null}

      {/* Joined */}
      <td
        className="py-3 align-middle text-xs"
        style={{ color: 'var(--color-text-disabled)' }}
      >
        {new Date(member.createdAt).toLocaleDateString()}
      </td>
    </tr>
  )
}
