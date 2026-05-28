/**
 * Typed HTTP client for the przm-access admin API.
 *
 * SERVER-SIDE ONLY. Never import from a client component.
 * The operator key is a secret; it must never reach the browser.
 *
 * Usage:
 *   import { accessAdmin } from '@/lib/access-admin'
 *   const org = await accessAdmin.orgs.get(orgId)
 *
 * This is a STUB. Integration logic ships in Task #09 (Stripe
 * integration) and Task #05 (Admin dashboard). The shapes defined
 * here are authoritative for Task #10's scaffolding; downstream
 * tasks fill in the method bodies.
 *
 * Auth: Bearer token in the Authorization header.
 * Base URL: PRZM_ACCESS_BASE_URL env var (e.g. https://access.przm.sh).
 * Key: PRZM_ACCESS_ADMIN_KEY env var.
 */

import 'server-only'

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
  deploymentMode: 'cloud' | 'self_hosted' | 'air_gap'
  createdAt: string
}

export interface AccessOrgWithTenants extends AccessOrg {
  tenants: {
    cloud: AccessTenant[]
    self_hosted: AccessTenant[]
    air_gap: AccessTenant[]
  }
}

export interface AccessMember {
  id: string
  userId: string
  tenantId: string
  role: string
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

export interface AccessUser {
  id: string
  email: string
  name: string | null
  orgId: string
  role: 'owner' | 'admin' | 'member' | 'operator'
  createdAt: string
}

// ── Operator-scoped types ─────────────────────────────────────────────

export interface License {
  id: string
  orgId: string
  customerName: string
  mode: 'annual' | 'perpetual'
  seatCap: number
  tenantCap: number
  issuedAt: string
  expiresAt: string
  status: 'active' | 'expired' | 'revoked'
}

export interface IssueLicenseInput {
  orgId: string
  mode: 'annual' | 'perpetual'
  expiresAfterDays: number
  seatCap: number
  tenantCap: number
  customerName: string
}

export interface IssueLicenseResult {
  id: string
  jwt: string
  exp: string
}

export interface ProvisionTenantInput {
  orgId: string
  slug: string
  name: string
  deploymentMode: 'cloud:us-east' | 'cloud:eu' | 'self_hosted' | 'air_gap'
  licenseId?: string
}

export interface CreateOrgInput {
  slug: string
  name: string
  plan: string
  primaryOwnerEmail: string
}

export interface AccessInvitation {
  id: string
  orgId: string
  email: string
  role: 'owner' | 'admin' | 'member'
  expiresAt: string
  token: string
}

export interface InvitationAcceptResult {
  userId: string
  orgId: string
  membershipId: string
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
  /**
   * List all organizations.
   * GET /admin/orgs
   */
  list(): Promise<AccessOrg[]> {
    return apiFetch<AccessOrg[]>('/admin/orgs')
  },

  /**
   * Get a single organization by ID (with tenants by deployment mode).
   * GET /admin/orgs/:id
   */
  get(id: string): Promise<AccessOrgWithTenants> {
    return apiFetch<AccessOrgWithTenants>(`/admin/orgs/${id}`)
  },

  /**
   * Get active seat count for an org.
   * GET /admin/orgs/:id/seats
   */
  seats(id: string): Promise<AccessSeatSummary> {
    return apiFetch<AccessSeatSummary>(`/admin/orgs/${id}/seats`)
  },

  /**
   * Toggle a user's active-seat status within an org.
   * PATCH /admin/orgs/:id/seats/:userId
   */
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

  /**
   * Paginated audit log for an org.
   * GET /admin/orgs/:id/audit
   */
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
}

const members = {
  /**
   * List members for a tenant.
   * GET /admin/tenants/:tenantId/members
   */
  list(tenantId: string): Promise<{ members: AccessMemberWithUser[] }> {
    return apiFetch<{ members: AccessMemberWithUser[] }>(
      `/admin/tenants/${tenantId}/members`,
    )
  },

  /**
   * Add a member to a tenant by email or userId.
   * POST /admin/tenants/:tenantId/members
   */
  add(
    tenantId: string,
    payload: { email?: string; userId?: string; role: string },
  ): Promise<AccessMember> {
    return apiFetch<AccessMember>(`/admin/tenants/${tenantId}/members`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Update a member's role.
   * PATCH /admin/tenants/:tenantId/members/:userId
   */
  setRole(
    tenantId: string,
    userId: string,
    role: string,
  ): Promise<AccessMember> {
    return apiFetch<AccessMember>(
      `/admin/tenants/${tenantId}/members/${userId}`,
      { method: 'PATCH', body: JSON.stringify({ role }) },
    )
  },
}

const projects = {
  /**
   * List projects for a tenant.
   * GET /admin/tenants/:tenantId/projects
   */
  list(tenantId: string): Promise<{ projects: AccessProject[] }> {
    return apiFetch<{ projects: AccessProject[] }>(
      `/admin/tenants/${tenantId}/projects`,
    )
  },

  /**
   * Create a project under a tenant.
   * POST /admin/tenants/:tenantId/projects
   */
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

const users = {
  /**
   * List all users in an organization.
   * GET /admin/orgs/:orgId/users
   */
  listForOrg(orgId: string): Promise<AccessUser[]> {
    return apiFetch<AccessUser[]>(`/admin/orgs/${orgId}/users`)
  },

  /**
   * Get a single user by their przm-access ID.
   * GET /admin/users/:id
   */
  get(id: string): Promise<AccessUser> {
    return apiFetch<AccessUser>(`/admin/users/${id}`)
  },

  /**
   * Set a user's global role (owner | admin | member | operator).
   * PATCH /admin/users/:id/role
   */
  setRole(userId: string, role: AccessUser['role']): Promise<AccessUser> {
    return apiFetch<AccessUser>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
  },
}

const invitations = {
  /**
   * Create an invitation for a user to join an org.
   * POST /admin/orgs/:orgId/invitations
   */
  create(
    orgId: string,
    payload: { email: string; role: 'owner' | 'admin' | 'member' },
  ): Promise<AccessInvitation> {
    return apiFetch<AccessInvitation>(`/admin/orgs/${orgId}/invitations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Validate an invitation token and return the invitation details.
   * GET /admin/invitations/:token
   */
  get(token: string): Promise<AccessInvitation> {
    return apiFetch<AccessInvitation>(`/admin/invitations/${token}`)
  },

  /**
   * Accept an invitation after the user has signed in via better-auth.
   * POST /admin/invitations/:token/accept
   *
   * The webUserId is the better-auth user.id — stored as accessUserId
   * on the local users table once przm-access confirms membership.
   */
  accept(
    token: string,
    payload: { webUserId: string },
  ): Promise<InvitationAcceptResult> {
    return apiFetch<InvitationAcceptResult>(`/admin/invitations/${token}/accept`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

// ── Operator-level namespaces ─────────────────────────────────────────

const licenses = {
  /**
   * Issue a new license for an org.
   * POST /admin/licenses
   */
  issue(input: IssueLicenseInput): Promise<IssueLicenseResult> {
    return apiFetch<IssueLicenseResult>('/admin/licenses', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  /**
   * List licenses, optionally filtered by status and/or org.
   * GET /admin/licenses
   */
  list(filter?: { status?: 'active' | 'expired' | 'all'; orgId?: string }): Promise<{ licenses: License[] }> {
    const qs = new URLSearchParams()
    if (filter?.status) qs.set('status', filter.status)
    if (filter?.orgId) qs.set('orgId', filter.orgId)
    return apiFetch<{ licenses: License[] }>(`/admin/licenses${qs.size ? `?${qs}` : ''}`)
  },
}

const audit = {
  /**
   * Cross-org audit log. orgId is OPTIONAL — omit for system-wide view.
   * GET /admin/audit
   */
  list(filter?: {
    since?: string
    cursor?: string
    limit?: number
    action?: string
    orgId?: string
  }): Promise<AccessAuditPage> {
    const qs = new URLSearchParams()
    if (filter?.since) qs.set('since', filter.since)
    if (filter?.cursor) qs.set('cursor', filter.cursor)
    if (filter?.limit !== undefined) qs.set('limit', String(filter.limit))
    if (filter?.action) qs.set('action', filter.action)
    if (filter?.orgId) qs.set('orgId', filter.orgId)
    return apiFetch<AccessAuditPage>(`/admin/audit${qs.size ? `?${qs}` : ''}`)
  },
}

const orgsOperator = {
  /**
   * Create a new organization.
   * POST /admin/orgs
   */
  create(input: CreateOrgInput): Promise<AccessOrg> {
    return apiFetch<AccessOrg>('/admin/orgs', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}

const tenants = {
  /**
   * Provision a new tenant under an org.
   * POST /admin/orgs/:orgId/tenants
   */
  create(orgId: string, input: Omit<ProvisionTenantInput, 'orgId'>): Promise<AccessTenant> {
    return apiFetch<AccessTenant>(`/admin/orgs/${orgId}/tenants`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
}

/**
 * The single export. All methods are server-side only; each call
 * throws `AccessApiError` on non-2xx responses.
 */
// ── Billing-related types ─────────────────────────────────────────────

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

// ── Extend orgs namespace with billing endpoints ──────────────────────

const orgsBilling = {
  /**
   * Set the org's plan + seat count after a Stripe subscription event.
   * POST /admin/orgs/:id/plan (subscription.created)
   * PATCH /admin/orgs/:id/plan (subscription.updated / deleted)
   */
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

  /**
   * Update past_due / payment failure status.
   * PATCH /admin/orgs/:id/billing_status
   */
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

export const accessAdmin = {
  orgs: { ...orgs, ...orgsBilling, ...orgsOperator },
  members,
  projects,
  users,
  invitations,
  licenses,
  audit,
  tenants,
}
