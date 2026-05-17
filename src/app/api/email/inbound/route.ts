/**
 * POST /api/email/inbound
 *
 * Resend Inbound webhook receiver. Resend POSTs an event when an
 * email arrives at any address on a verified inbound domain.
 *
 * Webhook payload is metadata only — body and headers must be fetched
 * separately via the Received Emails API.
 *
 * Threading rule:
 * 1. We send outbound with Reply-To set to `agent+<tag>@agent.przm.sh`
 *    where <tag> is the first 8 hex chars of the submission UUID.
 * 2. When the prospect replies, the email lands at that plus-address.
 * 3. We parse the +tag from `data.to`, look up the submission, append
 *    a row to `replies` with direction='inbound'.
 * 4. We also nudge the submission's `updated_at` so it surfaces at the
 *    top of the admin inbox.
 *
 * Fallback: if no tag can be extracted, the inbound is logged but
 * left unattached. Future: surface unattached inbound under
 * /admin/inbox/unattached for manual triage.
 *
 * Security: optional signature verification via RESEND_WEBHOOK_SECRET.
 * Resend uses Svix-style signing (svix-id, svix-timestamp, svix-signature
 * headers). If the secret env var is set, the request must pass; if not,
 * we accept all requests (development mode).
 */

import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { sql, isDbConfigured } from '@/lib/db'

export const runtime = 'nodejs'

const RESEND_API_BASE = 'https://api.resend.com'

interface ResendInboundPayload {
  type: string
  created_at?: string
  data?: {
    email_id?: string
    from?: { email?: string; name?: string } | string
    to?: Array<{ email?: string; name?: string } | string>
    subject?: string
    attachments?: Array<{ filename?: string; content_type?: string }>
  }
}

function asEmail(v: unknown): string | null {
  if (typeof v === 'string') return v
  if (v && typeof v === 'object' && 'email' in v && typeof v.email === 'string') {
    return v.email
  }
  return null
}

/**
 * Pull `agent+<tag>@agent.przm.sh` out of a list of recipients and
 * return the 8-hex-char tag. Returns null if no tagged address found.
 */
function extractTag(to: NonNullable<ResendInboundPayload['data']>['to']): string | null {
  if (!Array.isArray(to)) return null
  for (const recipient of to) {
    const email = asEmail(recipient)
    if (!email) continue
    const match = email.toLowerCase().match(/^agent\+([0-9a-f]{8})@agent\.przm\.sh$/)
    if (match) return match[1]!
  }
  return null
}

/**
 * Find a submission whose UUID (stripped of dashes) starts with the
 * given 8-char tag. The tag is the first 8 hex chars of the UUID, so a
 * single LIKE query on the de-dashed form works. We further guard with
 * LIMIT 2 — if two submissions collide on the same 8 chars, we'd want
 * to know (the probability is ~2^-32 per pair so this is basically
 * never; if it ever fires, we fall back to no attachment).
 */
async function findSubmissionByTag(tag: string): Promise<string | null> {
  const rows = (await sql()`
    SELECT id::text AS id
    FROM submissions
    WHERE REPLACE(id::text, '-', '') LIKE ${tag + '%'}
    LIMIT 2
  `) as Array<{ id: string }>
  if (rows.length === 1) return rows[0]!.id
  return null
}

/**
 * Fetch full body text from Resend's Received Emails API using the
 * email_id from the webhook payload. Resend's webhook fires the
 * moment they finish parsing the envelope; the body sometimes lags
 * by 1-3 seconds. We retry with exponential backoff so we don't
 * record body=empty for emails that have one.
 */
async function fetchInboundBody(emailId: string, apiKey: string): Promise<string> {
  const delaysMs = [0, 1500, 3500, 7500] // total ~12s budget across 4 tries
  for (const delay of delaysMs) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay))
    try {
      const res = await fetch(`${RESEND_API_BASE}/emails/${emailId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!res.ok) continue
      const body = (await res.json()) as { text?: string; html?: string }
      const text = body.text ?? (body.html ?? '').replace(/<[^>]+>/g, '').slice(0, 20_000)
      if (text.trim().length > 0) return text
      // Body still empty — Resend hasn't finished parsing; retry after delay
    } catch {
      // Network blip or 5xx — retry after delay
    }
  }
  return ''
}

export async function POST(request: Request) {
  // Signature verification (optional in dev, required if secret is set)
  const secret = process.env['RESEND_WEBHOOK_SECRET']
  const rawBody = await request.text()
  if (secret) {
    try {
      const headers = {
        'svix-id': request.headers.get('svix-id') ?? '',
        'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
        'svix-signature': request.headers.get('svix-signature') ?? '',
      }
      new Webhook(secret).verify(rawBody, headers)
    } catch (e) {
      console.error('email/inbound: signature verification failed', e)
      return NextResponse.json({ ok: false, reason: 'invalid signature' }, { status: 401 })
    }
  }

  let payload: ResendInboundPayload
  try {
    payload = JSON.parse(rawBody) as ResendInboundPayload
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid JSON' }, { status: 400 })
  }

  if (payload.type !== 'email.received') {
    // Could be email.delivered or other event types we don't act on
    return NextResponse.json({ ok: true, ignored: payload.type }, { status: 200 })
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, reason: 'db not configured' }, { status: 503 })
  }

  const tag = extractTag(payload.data?.to)
  const fromEmail = asEmail(payload.data?.from)
  const subject = payload.data?.subject ?? '(no subject)'
  const emailId = payload.data?.email_id

  // Fetch body in parallel with submission lookup
  const apiKey = process.env['RESEND_API_KEY']
  const [bodyText, submissionId] = await Promise.all([
    emailId && apiKey ? fetchInboundBody(emailId, apiKey) : Promise.resolve(''),
    tag ? findSubmissionByTag(tag) : Promise.resolve(null),
  ])

  if (!submissionId) {
    // Unattached inbound: log so we can build a triage UI later if
    // there's volume. For now, accept-and-ignore so Resend doesn't
    // retry forever.
    console.warn('email/inbound: no matching submission for tag', {
      tag,
      fromEmail,
      subject,
    })
    return NextResponse.json({ ok: true, attached: false }, { status: 200 })
  }

  const bodyForRecord =
    `From: ${fromEmail ?? '(unknown)'}\nSubject: ${subject}\n\n${bodyText || '(no body retrieved from Resend)'}`

  try {
    await sql()`
      INSERT INTO replies (submission_id, body, resend_id, direction)
      VALUES (${submissionId}::uuid, ${bodyForRecord}, ${emailId ?? null}, 'inbound')
    `
    // Nudge updated_at so this submission surfaces at the top of the inbox
    await sql()`
      UPDATE submissions
      SET updated_at = NOW()
      WHERE id = ${submissionId}::uuid
    `
  } catch (e) {
    console.error('email/inbound: db insert failed', e)
    // Acknowledge anyway so Resend doesn't retry forever; we can
    // backfill by scanning their dashboard if needed.
    return NextResponse.json({ ok: true, attached: false, warning: 'db insert failed' }, { status: 200 })
  }

  return NextResponse.json({ ok: true, attached: true, submissionId }, { status: 200 })
}
