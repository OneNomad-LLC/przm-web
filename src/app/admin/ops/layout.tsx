/**
 * Operator console layout — all /admin/ops/* routes.
 *
 * Server Component: gate-checks the operator role via requireOperator()
 * before rendering the shell. Non-operators are redirected to /app/dashboard.
 */

import { requireOperator } from '@/lib/operator'
import { OpsShell } from './ops-shell'

export const dynamic = 'force-dynamic'

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireOperator()
  return <OpsShell email={user.email}>{children}</OpsShell>
}
