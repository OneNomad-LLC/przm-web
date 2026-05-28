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
  seatCount: number
  createdAt: string
}

export interface AccessUser {
  id: string
  email: string
  name: string | null
  orgId: string
  role: 'owner' | 'admin' | 'member'
  createdAt: string
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
   * Get a single organization by ID.
   * GET /admin/orgs/:id
   */
  get(id: string): Promise<AccessOrg> {
    return apiFetch<AccessOrg>(`/admin/orgs/${id}`)
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

/**
 * The single export. All methods are server-side only; each call
 * throws `AccessApiError` on non-2xx responses.
 */
export const accessAdmin = { orgs, users, invitations }
