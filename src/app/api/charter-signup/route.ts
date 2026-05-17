/**
 * POST /api/charter-signup
 *
 * Captures inbound interest from the vendor-cert page's charter form.
 * - Validates the input.
 * - Sends an acknowledgment email to the prospect (sets expectations,
 *   gives them the methodology link, asks the questions Matt would ask
 *   on a first call so they show up to that call prepared).
 * - Sends a notification email to hello@onenomad.dev with the full
 *   submission payload + a suggested reply.
 *
 * No DB. The two outbound emails ARE the record. If volume grows
 * enough that this becomes a problem, we'll add storage then.
 *
 * Requires env: RESEND_API_KEY (set in Vercel project env vars).
 */

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const FROM_ADDRESS = 'przm <hello@send.przm.sh>'
const REPLY_TO = 'hello@onenomad.dev'
const NOTIFY_TO = 'hello@onenomad.dev'

interface Payload {
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
  // Cheap structural check; not an RFC validator.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim()) && s.length <= 254
}

function sanitizeForEmail(s: string): string {
  // Strip control chars + cap length defensively
  return s.replace(/[\x00-\x1f\x7f]/g, '').slice(0, 2000)
}

export async function POST(request: Request) {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, reason: 'mail backend not configured' },
      { status: 503 },
    )
  }

  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid JSON' }, { status: 400 })
  }

  if (!isString(body.email) || !emailLooksValid(body.email)) {
    return NextResponse.json(
      { ok: false, reason: 'valid email required' },
      { status: 400 },
    )
  }
  if (!isString(body.company, 200)) {
    return NextResponse.json(
      { ok: false, reason: 'company required' },
      { status: 400 },
    )
  }
  if (!isString(body.framework, 200)) {
    return NextResponse.json(
      { ok: false, reason: 'framework or product required' },
      { status: 400 },
    )
  }

  const email = body.email.trim()
  const company = sanitizeForEmail(body.company.trim())
  const framework = sanitizeForEmail(body.framework.trim())
  const release = isString(body.release, 200)
    ? sanitizeForEmail(body.release.trim())
    : ''
  const context = isString(body.context, 2000)
    ? sanitizeForEmail(body.context.trim())
    : ''

  const resend = new Resend(apiKey)

  // ── Email 1: acknowledgment to the prospect ─────────────────────
  const ackSubject = `przm charter slot — got it, here's what's next`
  const ackText = [
    `Hi,`,
    ``,
    `Got your charter-customer interest from przm.sh — thank you.`,
    ``,
    `Here's what happens next: I'll reach out within one business day`,
    `to schedule a 15-minute call. Before that call, three things are`,
    `useful to know on your end:`,
    ``,
    `1. Which release of ${framework} you want certified (commit hash`,
    `   or version tag).`,
    `2. Which LLM your framework will run during the bench`,
    `   (we run your adapter with your model; you provide a sample`,
    `   API key so the run is billed to you and you can audit what`,
    `   was called).`,
    `3. What "good" looks like to you. Charter customers get a free`,
    `   signed receipt + leaderboard placement + a charter badge,`,
    `   in exchange for a 1-2 sentence quote + permission to cite`,
    `   ${company} by name. If that's not what you're looking for,`,
    `   we should figure that out before we run anything.`,
    ``,
    `Methodology spec: https://przm.sh/methodology#convergence`,
    `Public verification key: https://github.com/OneNomad-LLC/przm-bench/blob/main/keys/convergence-preview.pub`,
    ``,
    `If anything looks unfair about the adapter we'd run against`,
    `${framework}, you can PR our adapter file directly:`,
    `https://github.com/OneNomad-LLC/przm-bench/tree/main/src/adapters/multiagent`,
    ``,
    `— Matt`,
    `OneNomad LLC`,
    `hello@onenomad.dev`,
  ].join('\n')

  // ── Email 2: notification to me ─────────────────────────────────
  const notifySubject = `[przm charter signup] ${company} — ${framework}`
  const notifyText = [
    `New charter-customer interest from the vendor-cert page.`,
    ``,
    `Email:      ${email}`,
    `Company:    ${company}`,
    `Framework:  ${framework}`,
    `Release:    ${release || '(not specified)'}`,
    ``,
    `Context:`,
    context ? context : '(none)',
    ``,
    `──`,
    `Suggested reply: schedule a 15-min call. Acknowledgment email`,
    `was sent automatically with the three pre-call questions, so they`,
    `should arrive prepared.`,
  ].join('\n')

  try {
    // Send both in parallel. If the ack fails but the notification
    // succeeds, the user still gets the signal; if the notification
    // fails but the ack succeeds, the prospect is acknowledged and
    // we can re-derive their address from Resend's send log.
    await Promise.all([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        replyTo: REPLY_TO,
        subject: ackSubject,
        text: ackText,
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: NOTIFY_TO,
        replyTo: email,
        subject: notifySubject,
        text: notifyText,
      }),
    ])
  } catch (e) {
    // Don't 500 — log it and tell the user the form succeeded but
    // we'll follow up manually. The notification email is the
    // load-bearing one for us; an outbound failure is annoying but
    // not blocking for the prospect.
    console.error('charter-signup: resend.send failed', e)
    return NextResponse.json(
      {
        ok: true,
        warning:
          'mail delivery had an issue — please also drop us a line at hello@onenomad.dev so we can follow up manually',
      },
      { status: 200 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
