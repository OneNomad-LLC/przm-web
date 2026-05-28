import Link from 'next/link'

export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl border-x border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-surface)]/30 px-6 py-10">
        {/* Product suite */}
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-[color:var(--color-text-muted)]">
          <span className="text-[color:var(--color-text-disabled)]">przm suite:</span>
          <a
            href="https://github.com/OneNomad-LLC/cortex#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--color-knowledge)' }}
          >
            Cortex
          </a>
          <span className="text-[color:var(--color-text-disabled)]">·</span>
          <Link href="/memory" className="hover:underline" style={{ color: 'var(--color-memory)' }}>
            Memory
          </Link>
          <span className="text-[color:var(--color-text-disabled)]">·</span>
          <Link href="/voice" className="hover:underline" style={{ color: 'var(--color-voice)' }}>
            Voice
          </Link>
          <span className="text-[color:var(--color-text-disabled)]">·</span>
          <Link href="/bench" className="hover:underline" style={{ color: 'var(--color-bench)' }}>
            Bench
          </Link>
          <span className="text-[color:var(--color-text-disabled)]">·</span>
          <span className="text-[color:var(--color-text-disabled)]">Runtime (soon)</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-[color:var(--color-text-muted)] md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              built by{' '}
              <a
                href="https://onenomad.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[color:var(--color-knowledge)]"
              >
                onenomad
              </a>
              {' '}&middot; Apache-2.0 core
            </span>
            <span className="text-[color:var(--color-text-disabled)]">&middot;</span>
            <a
              href="https://github.com/OneNomad-LLC/cortex"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[color:var(--color-knowledge)]"
            >
              GitHub
            </a>
            <span className="text-[color:var(--color-text-disabled)]">&middot;</span>
            <Link
              href="/security"
              className="transition-colors hover:text-[color:var(--color-knowledge)]"
            >
              Security
            </Link>
            <span className="text-[color:var(--color-text-disabled)]">&middot;</span>
            <Link
              href="/methodology"
              className="transition-colors hover:text-[color:var(--color-knowledge)]"
            >
              Methodology
            </Link>
            <span className="text-[color:var(--color-text-disabled)]">&middot;</span>
            <Link
              href="/verify"
              className="transition-colors hover:text-[color:var(--color-knowledge)]"
            >
              Verify a receipt
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-knowledge)]"
              style={{ boxShadow: '0 0 8px var(--color-knowledge)' }}
            />
            <span>przm v0.7 &middot; multi-tenant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
