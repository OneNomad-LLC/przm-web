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
 * 4. Send notification email to hello@onenomad.dev with admin-inbox link
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

export const runtime = 'nodejs'

const FROM_ADDRESS = 'przm <hello@przm.sh>'
const NOTIFY_TO = 'hello@onenomad.dev'
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

function tierLabel(tier: Tier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

function ackEmail(tier: Tier, company: string, framework: string): { subject: string; text: string } {
  const intro = {
    charter: `Got your charter-customer interest from przm.sh — thank you.`,
    standard: `Got your Standard certification request from przm.sh — thank you.`,
    extended: `Got your Extended certification request from przm.sh — thank you.`,
    enterprise: `Got your Enterprise certification inquiry from przm.sh — thank you.`,
  }[tier]

  const turnaround = {
    charter: 'one business day',
    standard: 'one business day',
    extended: 'same business day',
    enterprise: 'same business day',
  }[tier]

  const tierSpecific = {
    charter:
      `Charter customers get a free signed receipt + leaderboard placement + a charter\nbadge, in exchange for permission to cite ${company} by name and a 1-2 sentence\nquote we can use on launch day.`,
    standard:
      `Standard certification is $999/release: one full benchmark run, signed receipt,\npublic leaderboard entry, private findings brief, 5 business day turnaround.`,
    extended:
      `Extended certification is $2,499/release: everything in Standard plus the 20%\nholdout subset run (so your number reflects generalization, not fixture\ntuning) and 72-hour priority turnaround.`,
    enterprise:
      `Enterprise certification is $9,999/release: custom fixture set authored\nagainst your domain, private receipt unless you choose to publish, 30-day\nre-run option after patches.`,
  }[tier]

  const subject = `przm ${tierLabel(tier)} cert — got it, here's what's next`
  const text = [
    `Hi,`,
    ``,
    intro,
    ``,
    `Here's what happens next: Matt will reach out within ${turnaround} to`,
    `schedule a 15-minute call. Before that call, three things are useful to`,
    `know on your end:`,
    ``,
    `1. Which release of ${framework} you want certified (commit hash or version tag).`,
    `2. Which LLM your framework will run during the bench (we run your`,
    `   adapter with your model; you provide a sample API key so the run is`,
    `   billed to you and you can audit what was called).`,
    `3. What "good" looks like to you.`,
    ``,
    tierSpecific,
    ``,
    `Methodology spec:  https://przm.sh/methodology#convergence`,
    `Public key:        https://github.com/OneNomad-LLC/przm-bench/blob/main/keys/convergence-preview.pub`,
    `Adapter source:    https://github.com/OneNomad-LLC/przm-bench/tree/main/src/adapters/multiagent`,
    ``,
    `If anything looks unfair about the adapter we'd run against ${framework}, you`,
    `can PR our adapter file directly.`,
    ``,
    `— Matt`,
    `OneNomad LLC`,
    `hello@onenomad.dev`,
  ].join('\n')

  return { subject, text }
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
    const ack = ackEmail(tier, company, framework)
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
              ') — please also drop us a line at hello@onenomad.dev so we can follow up manually',
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
            'submission received but mail delivery had an issue — please also drop us a line at hello@onenomad.dev so we can follow up manually',
          submissionId,
        },
        { status: 200 },
      )
    }
  }

  return NextResponse.json({ ok: true, submissionId, tier }, { status: 200 })
}
