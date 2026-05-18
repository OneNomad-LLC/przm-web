/**
 * POST /api/signup
 *
 * Single endpoint that handles all four vendor-cert tiers (charter /
 * standard / extended / enterprise). Replaces the old /api/charter-signup.
 *
 * Flow:
 * 1. Validate payload (email format, required fields, length caps)
 * 2. Insert into submissions table (Neon Postgres)
 * 3. Send acknowledgment email to the prospect (tier-specific copy)
 * 4. Send notification email to matt@przm.sh with admin-inbox link
 *
 * If the database write fails, we still try to send the notification
 * email so Matt knows a lead came in (degraded mode). If both DB and
 * email fail, we return 200 with a warning so the prospect at least
 * sees a confirmation — they can also email directly as a fallback.
 *
 * Env: RESEND_API_KEY, DATABASE_URL (or POSTGRES_URL)
 */

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { sql, isDbConfigured } from '@/lib/db'
import { renderSignupAck } from '@/lib/email/signup-ack'

export const runtime = 'nodejs'

const FROM_ADDRESS = 'przm <hello@przm.sh>'
const NOTIFY_TO = 'matt@przm.sh'
const REPLY_TO_DOMAIN = 'agent.przm.sh'

/** Plus-addressed Reply-To so prospect replies route back to this
 *  exact submission via the /api/email/inbound webhook. */
function replyToFor(submissionId: string): string {
  const tag = submissionId.replace(/-/g, '').slice(0, 8)
  return `agent+${tag}@${REPLY_TO_DOMAIN}`
}
const ADMIN_INBOX_URL = 'https://przm.sh/admin/inbox'

type Tier = 'charter' | 'standard' | 'extended' | 'enterprise'
const VALID_TIERS: Tier[] = ['charter', 'standard', 'extended', 'enterprise']

interface Payload {
  tier?: unknown
  email?: unknown
  company?: unknown
  framework?: unknown
  release?: unknown
  context?: unknown
}

function isString(v: unknown, max = 500): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max
}

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim()) && s.length <= 254
}

function sanitize(s: string, max = 2000): string {
  return s.replace(/[\x00-\x1f\x7f]/g, '').slice(0, max)
}

function notifyEmail(payload: {
  id: string | null
  tier: Tier
  email: string
  company: string
  framework: string
  release: string
  context: string
}): { subject: string; text: string } {
  const subject = `[przm ${payload.tier}] ${payload.company} — ${payload.framework}`
  const lines = [
    `New ${payload.tier} signup from the vendor-cert page.`,
    ``,
    `Email:      ${payload.email}`,
    `Company:    ${payload.company}`,
    `Framework:  ${payload.framework}`,
    `Release:    ${payload.release || '(not specified)'}`,
    ``,
    `Context:`,
    payload.context ? payload.context : '(none)',
    ``,
    `──`,
    payload.id
      ? `Admin inbox: ${ADMIN_INBOX_URL}/${payload.id}`
      : `Admin inbox: ${ADMIN_INBOX_URL} (this submission was NOT persisted — DB write failed; reply manually)`,
    `Reply directly to this email to respond to ${payload.email} (Reply-To is set).`,
  ]
  return { subject, text: lines.join('\n') }
}

export async function POST(request: Request) {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid JSON' }, { status: 400 })
  }

  // Tier defaults to 'charter' so the existing form (which doesn't yet
  // submit a tier) keeps working through the transition.
  const tier: Tier = VALID_TIERS.includes(body.tier as Tier)
    ? (body.tier as Tier)
    : 'charter'

  if (!isString(body.email) || !emailLooksValid(body.email)) {
    return NextResponse.json({ ok: false, reason: 'valid email required' }, { status: 400 })
  }
  if (!isString(body.company, 200)) {
    return NextResponse.json({ ok: false, reason: 'company required' }, { status: 400 })
  }
  if (!isString(body.framework, 200)) {
    return NextResponse.json(
      { ok: false, reason: 'framework or product required' },
      { status: 400 },
    )
  }

  const email = body.email.trim()
  const company = sanitize(body.company.trim(), 200)
  const framework = sanitize(body.framework.trim(), 200)
  const release = isString(body.release, 200) ? sanitize(body.release.trim(), 200) : ''
  const context = isString(body.context, 2000) ? sanitize(body.context.trim(), 2000) : ''

  const raw = {
    userAgent: request.headers.get('user-agent') ?? null,
    referrer: request.headers.get('referer') ?? null,
    receivedAt: new Date().toISOString(),
  }

  // ── 1. Persist to DB (best-effort) ──────────────────────────────
  let submissionId: string | null = null
  if (isDbConfigured()) {
    try {
      const rows = (await sql()`
        INSERT INTO submissions (tier, email, company, framework, release_version, context, raw)
        VALUES (${tier}, ${email}, ${company}, ${framework}, ${release || null}, ${context || null}, ${JSON.stringify(raw)}::jsonb)
        RETURNING id
      `) as Array<{ id: string }>
      submissionId = rows[0]?.id ?? null
    } catch (e) {
      console.error('signup: DB write failed', e)
    }
  }

  // ── 2. Send emails (best-effort) ────────────────────────────────
  const apiKey = process.env['RESEND_API_KEY']
  if (apiKey) {
    const resend = new Resend(apiKey)
    const ack = renderSignupAck({ tier, company, framework })
    const notify = notifyEmail({
      id: submissionId,
      tier,
      email,
      company,
      framework,
      release,
      context,
    })

    try {
      const ackReplyTo = submissionId ? replyToFor(submissionId) : NOTIFY_TO
      const [ackResult, notifyResult] = await Promise.all([
        resend.emails.send({
          from: FROM_ADDRESS,
          to: email,
          replyTo: ackReplyTo,
          subject: ack.subject,
          html: ack.html,
          text: ack.text,
        }),
        resend.emails.send({
          from: FROM_ADDRESS,
          to: NOTIFY_TO,
          replyTo: email,
          subject: notify.subject,
          text: notify.text,
        }),
      ])
      // Resend returns { data: null, error: {...} } on send failure — must
      // explicitly check; the SDK does not throw for 4xx/5xx by default.
      const failures: string[] = []
      if (ackResult.error) failures.push('ack: ' + (ackResult.error.message ?? ackResult.error.name))
      if (notifyResult.error)
        failures.push('notify: ' + (notifyResult.error.message ?? notifyResult.error.name))
      if (failures.length > 0) {
        console.error('signup: resend reported errors', failures)
        return NextResponse.json(
          {
            ok: true,
            warning:
              'submission received and saved, but mail delivery had an issue (' +
              failures.join('; ') +
              ') — please also drop us a line at matt@przm.sh so we can follow up manually',
            submissionId,
          },
          { status: 200 },
        )
      }
    } catch (e) {
      console.error('signup: resend.send threw', e)
      return NextResponse.json(
        {
          ok: true,
          warning:
            'submission received but mail delivery had an issue — please also drop us a line at matt@przm.sh so we can follow up manually',
          submissionId,
        },
        { status: 200 },
      )
    }
  }

  return NextResponse.json({ ok: true, submissionId, tier }, { status: 200 })
}
