'use client'

/**
 * App shell — the authenticated layout chrome.
 *
 * Client Component so it can read the session reactively and use
 * client-side navigation (active link highlighting, etc.).
 *
 * The shell is deliberately minimal. Dashboard pages (Members,
 * Projects, Queries, Audit) are Task #05; this shell is the mount
 * point they plug into.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-client'

interface NavItem {
  href: string
  label: string
}

const NAV: NavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/members', label: 'Members' },
  { href: '/app/projects', label: 'Projects' },
  { href: '/app/queries', label: 'Queries' },
  { href: '/app/audit', label: 'Audit' },
  { href: '/app/billing', label: 'Billing' },
]

interface AppShellProps {
  user: { email: string; name: string }
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-base font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            przm
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    color: isActive
                      ? 'var(--color-bench)'
                      : 'var(--color-text-secondary)',
                    background: isActive
                      ? 'color-mix(in srgb, var(--color-bench) 10%, transparent)'
                      : undefined,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User info + sign out */}
          <div className="flex items-center gap-4">
            <span
              className="hidden text-sm sm:block"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {user.email}
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>

      {/* Footer */}
      <footer
        className="border-t py-6 text-center font-mono text-[11px]"
        style={{
          borderColor: 'var(--color-border-subtle)',
          color: 'var(--color-text-disabled)',
        }}
      >
        przm &nbsp;·&nbsp; <a href="/leaderboard" style={{ color: 'var(--color-text-muted)' }}>leaderboard</a>
        &nbsp;·&nbsp; <a href="/methodology" style={{ color: 'var(--color-text-muted)' }}>methodology</a>
      </footer>
    </div>
  )
}
