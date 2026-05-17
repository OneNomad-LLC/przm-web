/**
 * Typed accessors for the submissions + replies tables.
 *
 * All queries go through the neon-serverless HTTP driver via @/lib/db.
 */

import { sql } from './db'

export type Tier = 'charter' | 'standard' | 'extended' | 'enterprise'
export type SubmissionStatus =
  | 'new'
  | 'replied'
  | 'meeting_scheduled'
  | 'closed_won'
  | 'closed_lost'
  | 'archived'

export interface Submission {
  id: string
  createdAt: string
  tier: Tier
  email: string
  company: string
  framework: string
  releaseVersion: string | null
  context: string | null
  status: SubmissionStatus
  notes: string | null
  updatedAt: string
}

export interface Reply {
  id: string
  submissionId: string
  sentAt: string
  body: string
  resendId: string | null
  direction: 'outbound' | 'inbound'
}

interface RawSubmissionRow {
  id: string
  created_at: string
  tier: Tier
  email: string
  company: string
  framework: string
  release_version: string | null
  context: string | null
  status: SubmissionStatus
  notes: string | null
  updated_at: string
}

function rowToSubmission(r: RawSubmissionRow): Submission {
  return {
    id: r.id,
    createdAt: r.created_at,
    tier: r.tier,
    email: r.email,
    company: r.company,
    framework: r.framework,
    releaseVersion: r.release_version,
    context: r.context,
    status: r.status,
    notes: r.notes,
    updatedAt: r.updated_at,
  }
}

export async function listSubmissions(): Promise<Submission[]> {
  const rows = (await sql()`
    SELECT id, created_at, tier, email, company, framework, release_version,
           context, status, notes, updated_at
    FROM submissions
    ORDER BY created_at DESC
    LIMIT 500
  `) as RawSubmissionRow[]
  return rows.map(rowToSubmission)
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const rows = (await sql()`
    SELECT id, created_at, tier, email, company, framework, release_version,
           context, status, notes, updated_at
    FROM submissions
    WHERE id = ${id}::uuid
    LIMIT 1
  `) as RawSubmissionRow[]
  if (rows.length === 0) return null
  return rowToSubmission(rows[0]!)
}

export async function getReplies(submissionId: string): Promise<Reply[]> {
  const rows = (await sql()`
    SELECT id, submission_id, sent_at, body, resend_id, direction
    FROM replies
    WHERE submission_id = ${submissionId}::uuid
    ORDER BY sent_at ASC
  `) as Array<{
    id: string
    submission_id: string
    sent_at: string
    body: string
    resend_id: string | null
    direction: 'outbound' | 'inbound'
  }>
  return rows.map((r) => ({
    id: r.id,
    submissionId: r.submission_id,
    sentAt: r.sent_at,
    body: r.body,
    resendId: r.resend_id,
    direction: r.direction,
  }))
}

export async function recordReply(opts: {
  submissionId: string
  body: string
  resendId?: string
}): Promise<Reply> {
  const rows = (await sql()`
    INSERT INTO replies (submission_id, body, resend_id)
    VALUES (${opts.submissionId}::uuid, ${opts.body}, ${opts.resendId ?? null})
    RETURNING id, submission_id, sent_at, body, resend_id, direction
  `) as Array<{
    id: string
    submission_id: string
    sent_at: string
    body: string
    resend_id: string | null
    direction: 'outbound' | 'inbound'
  }>
  const row = rows[0]!
  return {
    id: row.id,
    submissionId: row.submission_id,
    sentAt: row.sent_at,
    body: row.body,
    resendId: row.resend_id,
    direction: row.direction,
  }
}

export async function setStatus(
  submissionId: string,
  status: SubmissionStatus,
): Promise<void> {
  await sql()`
    UPDATE submissions
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${submissionId}::uuid
  `
}

export async function setNotes(
  submissionId: string,
  notes: string,
): Promise<void> {
  await sql()`
    UPDATE submissions
    SET notes = ${notes}, updated_at = NOW()
    WHERE id = ${submissionId}::uuid
  `
}
