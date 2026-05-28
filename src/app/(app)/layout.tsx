/**
 * App route group layout — authenticated shell.
 *
 * All routes under /app/* require a valid session. The middleware
 * (src/middleware.ts) redirects unauthenticated requests to /auth/login
 * before they reach here, so this layout can assume a session exists.
 *
 * Server Component: reads the session to pass the user to the shell.
 * Dashboard pages (Members, Projects, Queries, Audit) are Task #05
 * and will plug into this shell.
 */

import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/session'
import { AppShell } from './app-shell'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Double-check server-side. Middleware handles the common case;
  // this catches edge cases (direct RSC render, middleware bypass).
  let user: Awaited<ReturnType<typeof requireUser>>['user']
  try {
    ;({ user } = await requireUser())
  } catch {
    redirect('/auth/login')
  }

  return <AppShell user={user}>{children}</AppShell>
}
