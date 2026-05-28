/**
 * Auth layout — centered card for login/signup/invite flows.
 * Dark background matching the site's Gruvbox palette.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Logo */}
      <a
        href="/"
        className="mb-8 font-mono text-xl font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        przm
      </a>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{
          background: 'var(--color-bg-surface)',
          borderColor: 'var(--color-border-default)',
        }}
      >
        {children}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-center text-xs" style={{ color: 'var(--color-text-disabled)' }}>
        <a
          href="/methodology"
          className="transition-colors hover:text-[color:var(--color-text-muted)]"
        >
          Methodology
        </a>
        &nbsp;·&nbsp;
        <a
          href="/leaderboard"
          className="transition-colors hover:text-[color:var(--color-text-muted)]"
        >
          Leaderboard
        </a>
      </p>
    </div>
  )
}
