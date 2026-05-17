/**
 * POST /api/admin/reply
 *
 * Sends a reply through Resend to the prospect associated with the
 * given submission, records it in the replies table, and advances the
 * submission's status to "replied" if it was "new".
 *
 * Auth: this route lives under /api/admin/* so the middleware in
 * src/middleware.ts already gates it with HTTP Basic Auth.
 *
 * Body:
 *   { submissionId: uuid, body: string }
 */

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSubmission, recordReply, setStatus } from '@/lib/submissions'

export const runtime = 'nodejs'

const FROM_ADDRESS = 'przm <hello@przm.sh>'
const REPLY_TO_DOMAIN = 'agent.przm.sh'

/**
 * Plus-addressed Reply-To so prospect replies route back to the right
 * submission. agent+<first-8-of-uuid>@agent.przm.sh — the inbound
 * webhook (POST /api/email/inbound) parses the +tag and threads.
 */
function replyToFor(submissionId: string): string {
  const tag = submissionId.replace(/-/g, '').slice(0, 8)
  return `agent+${tag}@${REPLY_TO_DOMAIN}`
}

interface Payload {
  submissionId?: unknown
  body?: unknown
}

function isUuid(s: unknown): s is string {
  return (
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
  )
}

export async function POST(request: Request) {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, reason: 'RESEND_API_KEY not configured' },
      { status: 503 },
    )
  }

  let payload: Payload
  try {
    payload = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid JSON' }, { status: 400 })
  }

  if (!isUuid(payload.submissionId)) {
    return NextResponse.json(
      { ok: false, reason: 'submissionId must be a valid UUID' },
      { status: 400 },
    )
  }
  const submissionId = payload.submissionId
  if (
    typeof payload.body !== 'string' ||
    payload.body.trim().length === 0 ||
    payload.body.length > 20_000
  ) {
    return NextResponse.json(
      { ok: false, reason: 'body required (1–20000 chars)' },
      { status: 400 },
    )
  }
  const body = payload.body.trim()

  const submission = await getSubmission(submissionId)
  if (!submission) {
    return NextResponse.json({ ok: false, reason: 'submission not found' }, { status: 404 })
  }

  const subject = `Re: przm ${submission.tier} cert — ${submission.framework}`

  let resendId: string | undefined
  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: submission.email,
      replyTo: replyToFor(submissionId),
      subject,
      text: body,
    })
    if (result.error) {
      console.error('admin/reply: resend returned error', result.error)
      return NextResponse.json(
        {
          ok: false,
          reason:
            'mail send failed: ' +
            (result.error.message ?? result.error.name ?? 'unknown Resend error'),
        },
        { status: 502 },
      )
    }
    resendId = result.data?.id
    if (!resendId) {
      console.warn('admin/reply: resend returned no id but no error either', result)
    }
  } catch (e) {
    console.error('admin/reply: resend.send threw', e)
    return NextResponse.json(
      { ok: false, reason: 'mail send failed: ' + (e instanceof Error ? e.message : String(e)) },
      { status: 502 },
    )
  }

  try {
    await recordReply({ submissionId, body, resendId })
    if (submission.status === 'new') {
      await setStatus(submissionId, 'replied')
    }
  } catch (e) {
    // Email already went out — log but don't fail the request
    console.error('admin/reply: db record failed (email already sent)', e)
  }

  return NextResponse.json({ ok: true, resendId }, { status: 200 })
}
