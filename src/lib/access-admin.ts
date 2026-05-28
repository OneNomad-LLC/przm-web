/**
 * Typed HTTP client for the przm-access admin API.
 *
 * Every method here is server-only and authenticated by the operator's
 * `PRZM_ACCESS_ADMIN_KEY`. Treating this module as a thin contract
 * mirror of the access service: each method maps 1:1 to a real route in
 * `apps/service/src/http/admin/*`. If a method is here, the endpoint
 * exists; otherwise it should not be here.
 *
 *   const orgs = await accessAdmin.orgs.list()
 *   const org  = await accessAdmin.orgs.get(orgId)
 */
import 'server-only'

import type { Role } from '@onenomad/przm-access'

// ── Domain types (mirroring przm-access public contract) ─────────────

export interface AccessOrg {
  id: string
  name: string
  slug: string
  plan: string
  seatCount: number | null
  createdAt: string
}

export interface AccessTenant {
  id: string
  orgId: string
  slug: string
  name: string
  deploymentMode: 'cloud' | 'self_hosted'
  createdAt: string
}

export interface AccessOrgWithTenants extends AccessOrg {
  tenants: {
    cloud: AccessTenant[]
    self_hosted: AccessTenant[]
  }
}

export interface AccessMember {
  id: string
  userId: string
  tenantId: string
  role: Role
  active: boolean
  createdAt: string
}

export interface AccessMemberWithUser extends AccessMember {
  user?: {
    id: string
    email: string | null
    name: string | null
  }
}

export interface AccessProject {
  id: string
  tenantId: string
  slug: string
  name: string
  createdAt: string
}

export interface AccessSeatSummary {
  organizationId: string
  seatsUsed: number
  seatCount: number | null
}

export interface AccessAuditEvent {
  id: string
  organizationId: string
  tenantId: string | null
  userId: string | null
  action: string
  target: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AccessAuditPage {
  events: AccessAuditEvent[]
  nextCursor: string | null
}

/**
 * Plans accepted by przm-access's create-org endpoint.
 * Source of truth: VALID_PLANS in apps/service/src/http/admin/orgs-router.ts.
 */
export type AccessOrgPlanSlug = 'free' | 'solo' | 'team' | 'business'

export interface ProvisionTenantInput {
  slug: string
  name: string
  ssoConnectionId?: string
  deploymentMode?: 'cloud' | 'self_hosted'
  licenseId?: string
}

export interface CreateOrgInput {
  slug: string
  name: string
  stripeCustomerId?: string
  plan?: AccessOrgPlanSlug
  seatCount?: number
}

// ── Client factory ────────────────────────────────────────────────────

function getBaseUrl(): string {
  const url = process.env.PRZM_ACCESS_BASE_URL
  if (!url) throw new Error('PRZM_ACCESS_BASE_URL must be set')
  return url.replace(/\/$/, '')
}

function getApiKey(): string {
  const key = process.env.PRZM_ACCESS_ADMIN_KEY
  if (!key) throw new Error('PRZM_ACCESS_ADMIN_KEY must be set')
  return key
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${getBaseUrl()}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new AccessApiError(res.status, path, body)
  }

  return res.json() as Promise<T>
}

export class AccessApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    public readonly body: string,
  ) {
    super(`przm-access API error ${status} on ${path}: ${body}`)
    this.name = 'AccessApiError'
  }
}

// ── Namespaced resource clients ───────────────────────────────────────

const orgs = {
  /** POST /admin/orgs */
  create(input: CreateOrgInput): Promise<AccessOrg> {
    return apiFetch<AccessOrg>('/admin/orgs', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  /** GET /admin/orgs */
  list(): Promise<AccessOrg[]> {
    return apiFetch<AccessOrg[]>('/admin/orgs')
  },

  /** GET /admin/orgs/:id */
  get(id: string): Promise<AccessOrgWithTenants> {
    return apiFetch<AccessOrgWithTenants>(`/admin/orgs/${id}`)
  },

  /** GET /admin/orgs/:id/seats */
  seats(id: string): Promise<AccessSeatSummary> {
    return apiFetch<AccessSeatSummary>(`/admin/orgs/${id}/seats`)
  },

  /** PATCH /admin/orgs/:id/seats/:userId */
  setSeatActive(
    orgId: string,
    userId: string,
    active: boolean,
  ): Promise<{ organizationId: string; userId: string; active: boolean; membershipsUpdated: number }> {
    return apiFetch(
      `/admin/orgs/${orgId}/seats/${userId}`,
      { method: 'PATCH', body: JSON.stringify({ active }) },
    )
  },

  /** GET /admin/orgs/:id/audit */
  audit(
    id: string,
    params?: { since?: string; cursor?: string; limit?: number },
  ): Promise<AccessAuditPage> {
    const qs = new URLSearchParams()
    if (params?.since) qs.set('since', params.since)
    if (params?.cursor) qs.set('cursor', params.cursor)
    if (params?.limit !== undefined) qs.set('limit', String(params.limit))
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return apiFetch<AccessAuditPage>(`/admin/orgs/${id}/audit${suffix}`)
  },

  /** POST /admin/orgs/:id/users — create an app_user under the org */
  createUser(
    orgId: string,
    payload: { email?: string; name?: string; ssoSubject?: string },
  ): Promise<{ id: string; email: string | null; name: string | null }> {
    return apiFetch(`/admin/orgs/${orgId}/users`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

const members = {
  /** GET /admin/tenants/:tenantId/members */
  list(tenantId: string): Promise<{ members: AccessMemberWithUser[] }> {
    return apiFetch<{ members: AccessMemberWithUser[] }>(
      `/admin/tenants/${tenantId}/members`,
    )
  },

  /** POST /admin/tenants/:tenantId/members */
  add(
    tenantId: string,
    payload: { email?: string; userId?: string; role: Role },
  ): Promise<AccessMember> {
    return apiFetch<AccessMember>(`/admin/tenants/${tenantId}/members`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /** PATCH /admin/tenants/:tenantId/members/:userId */
  setRole(
    tenantId: string,
    userId: string,
    role: Role,
  ): Promise<AccessMember> {
    return apiFetch<AccessMember>(
      `/admin/tenants/${tenantId}/members/${userId}`,
      { method: 'PATCH', body: JSON.stringify({ role }) },
    )
  },
}

const projects = {
  /** GET /admin/tenants/:tenantId/projects */
  list(tenantId: string): Promise<{ projects: AccessProject[] }> {
    return apiFetch<{ projects: AccessProject[] }>(
      `/admin/tenants/${tenantId}/projects`,
    )
  },

  /** POST /admin/tenants/:tenantId/projects */
  create(
    tenantId: string,
    payload: { slug: string; name: string },
  ): Promise<AccessProject> {
    return apiFetch<AccessProject>(`/admin/tenants/${tenantId}/projects`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

const tenants = {
  /** POST /admin/orgs/:orgId/tenants */
  create(orgId: string, input: ProvisionTenantInput): Promise<AccessTenant> {
    return apiFetch<AccessTenant>(`/admin/orgs/${orgId}/tenants`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}

// ── Stripe bridge surface (Task #11: server endpoints missing) ────────
// The endpoints below DO NOT EXIST on przm-access. Every call from
// `src/lib/billing/bridge.ts` 404s silently. Kept here so the bridge
// still compiles; Task #11 fixes by adding /admin/orgs/:id/plan and
// /admin/orgs/:id/billing_status to apps/service/src/http/admin/orgs-router.ts.

export interface AccessOrgPlan {
  plan: string
  seatCount: number
  stripeSubscriptionId: string | null
  updatedAt: string
}

export interface AccessOrgBillingStatus {
  pastDue: boolean
  updatedAt: string
}

const orgsBilling = {
  /** @deprecated Task #11 — endpoint does not exist server-side; call 404s. */
  updatePlan(
    orgId: string,
    payload: {
      plan: string
      seatCount: number
      stripeSubscriptionId: string | null
      reason?: string
    },
    method: 'POST' | 'PATCH' = 'PATCH',
  ): Promise<AccessOrgPlan> {
    return apiFetch<AccessOrgPlan>(`/admin/orgs/${orgId}/plan`, {
      method,
      body: JSON.stringify(payload),
    })
  },

  /** @deprecated Task #11 — endpoint does not exist server-side; call 404s. */
  updateBillingStatus(
    orgId: string,
    payload: { pastDue: boolean },
  ): Promise<AccessOrgBillingStatus> {
    return apiFetch<AccessOrgBillingStatus>(`/admin/orgs/${orgId}/billing_status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
}

/**
 * The single export. All methods are server-side only; each call
 * throws `AccessApiError` on non-2xx responses.
 *
 * Each method points to a real route in przm-access. Adding a method
 * here that has no server endpoint is a bug — the call will 404 at
 * runtime. See Task #11 (Stripe bridge orgs.updatePlan / .updateBillingStatus
 * regression for an example of how this drift happens).
 */
export const accessAdmin = {
  orgs: { ...orgs, ...orgsBilling },
  members,
  projects,
  tenants,
}
