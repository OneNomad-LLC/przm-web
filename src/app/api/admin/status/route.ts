/**
 * POST /api/admin/status
 *
 * Update the workflow status on a submission. Auth via middleware.
 */

import { NextResponse } from 'next/server'
import { setStatus, type SubmissionStatus } from '@/lib/submissions'

export const runtime = 'nodejs'

const VALID: SubmissionStatus[] = [
  'new',
  'replied',
  'meeting_scheduled',
  'closed_won',
  'closed_lost',
  'archived',
]

interface Payload {
  submissionId?: unknown
  status?: unknown
}

function isUuid(s: unknown): s is string {
  return (
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
  )
}

export async function POST(request: Request) {
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
  if (
    typeof payload.status !== 'string' ||
    !VALID.includes(payload.status as SubmissionStatus)
  ) {
    return NextResponse.json(
      { ok: false, reason: `status must be one of: ${VALID.join(', ')}` },
      { status: 400 },
    )
  }

  try {
    await setStatus(payload.submissionId, payload.status as SubmissionStatus)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { ok: false, reason: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    )
  }
}
