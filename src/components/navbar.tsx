'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: 'https://github.com/OneNomad-LLC/cortex#readme', label: 'Cortex', external: true },
  { href: '/memory', label: 'Memory' },
  { href: '/voice', label: 'Voice' },
  { href: '/bench', label: 'Bench' },
  { href: '/security', label: 'Security' },
  { href: '/app/billing/upgrade', label: 'Pricing' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [mobileOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-[color:var(--color-bg-base)]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 border-x border-b border-[color:var(--color-border-subtle)] px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-mono text-sm font-semibold tracking-tight text-[color:var(--color-text-primary)]"
          onClick={() => setMobileOpen(false)}
        >
          <Logo size={18} />
          <span className="text-[color:var(--color-text-primary)]">przm</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-5 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)] sm:flex">
          {navLinks.map((l) =>
            l.external ? (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[color:var(--color-knowledge)]"
                >
                  {l.label}
                </a>
              </li>
            ) : (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                  className={cn(
                    'transition-colors hover:text-[color:var(--color-knowledge)]',
                    isActive(pathname, l.href) && 'text-[color:var(--color-knowledge)]',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ),
          )}
          <li>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--color-charcoal)] transition-all hover:brightness-110"
              style={{ background: 'var(--color-knowledge)' }}
            >
              Start free
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--color-border-default)] text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-knowledge)] hover:text-[color:var(--color-knowledge)] sm:hidden"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'overflow-hidden border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]/95 backdrop-blur-md transition-[max-height,opacity] duration-200 ease-out sm:hidden',
          mobileOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mx-auto max-w-6xl space-y-1 border-x border-[color:var(--color-border-subtle)] px-6 py-6">
          {navLinks.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-mono text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-knowledge)]"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block py-2 font-mono text-sm uppercase tracking-widest transition-colors',
                  isActive(pathname, l.href)
                    ? 'text-[color:var(--color-knowledge)]'
                    : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-knowledge)]',
                )}
              >
                {l.label}
              </Link>
            ),
          )}
          <Link
            href="/auth/signup"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-mono text-sm font-semibold uppercase tracking-widest text-[color:var(--color-charcoal)] transition-all hover:brightness-110"
            style={{ background: 'var(--color-knowledge)' }}
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  )
}
