'use client'

/**
 * Operator console shell — /admin/ops/*
 *
 * Client Component for active-link highlighting and signout handler.
 * The layout.tsx (Server Component) wraps this after gate-checking the role.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-client'

interface NavItem {
  href: string
  label: string
}

const NAV: NavItem[] = [
  { href: '/admin/ops', label: 'Dashboard' },
  { href: '/admin/ops/orgs', label: 'Orgs' },
  { href: '/admin/ops/deployments', label: 'Deployments' },
  { href: '/admin/ops/licenses', label: 'Licenses' },
  { href: '/admin/ops/audit', label: 'Audit' },
]

interface OpsShellProps {
  email: string
  children: React.ReactNode
}

export function OpsShell({ email, children }: OpsShellProps) {
  const pathname = usePathname()

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/' } } })
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--color-bg-base)' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          {/* Logo + badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/ops"
              className="font-mono text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              przm
            </Link>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: 'color-mix(in srgb, var(--color-knowledge) 15%, transparent)',
                color: 'var(--color-knowledge)',
              }}
            >
              operator
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const isActive =
                item.href === '/admin/ops'
                  ? pathname === '/admin/ops'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    color: isActive
                      ? 'var(--color-knowledge)'
                      : 'var(--color-text-secondary)',
                    background: isActive
                      ? 'color-mix(in srgb, var(--color-knowledge) 10%, transparent)'
                      : undefined,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Identity + signout */}
          <div className="flex items-center gap-4">
            <span
              className="hidden text-sm sm:block"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {email}{' '}
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--color-knowledge)' }}
              >
                (operator)
              </span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">{children}</main>
    </div>
  )
}
