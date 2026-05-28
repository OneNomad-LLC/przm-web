/**
 * Projects page — /app/projects
 *
 * Lists the tenant's projects and lets admins create new ones.
 * Server Component; mutations via Server Action in actions.ts.
 */

import type { Metadata } from 'next'
import { requireUser } from '@/lib/session'
import { getAccessContext } from '@/lib/access-context'
import { accessAdmin } from '@/lib/access-admin'
import { CreateProjectForm } from './create-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects | przm',
}

export default async function ProjectsPage() {
  const { user } = await requireUser()
  const ctx = await getAccessContext(user.id)

  if (!ctx) {
    return (
      <div>
        <div className="mb-8">
          <p
            className="text-[11px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Projects
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
            Your account isn&apos;t linked to an organization yet.
          </p>
        </div>
      </div>
    )
  }

  let projects: Awaited<ReturnType<typeof accessAdmin.projects.list>>['projects'] = []
  let fetchError: string | null = null

  try {
    const res = await accessAdmin.projects.list(ctx.tenantId)
    projects = res.projects
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Projects
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Projects.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Projects scope query visibility and member access within your tenant.
        </p>
      </div>

      {/* Create form */}
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
          New project
        </h2>
        <CreateProjectForm />
      </div>

      {/* Projects grid */}
      {fetchError ? (
        <p className="text-sm" style={{ color: 'var(--color-red)' }}>
          Failed to load projects: {fetchError}
        </p>
      ) : projects.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No projects yet. Create one above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border p-5"
              style={{
                borderColor: 'var(--color-border-default)',
                background: 'var(--color-bg-surface)',
              }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {p.name}
              </h2>
              <p
                className="mt-1 font-mono text-xs"
                style={{ color: 'var(--color-text-disabled)' }}
              >
                {p.slug}
              </p>
              <p
                className="mt-3 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Created {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
