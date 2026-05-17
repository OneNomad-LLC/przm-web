-- 001_submissions.sql
-- Initial schema: lead submissions from the vendor-cert page.
--
-- Run once against the production database:
--   psql "$DATABASE_URL" -f sql/001_submissions.sql
--
-- Or via the Neon SQL Editor at https://console.neon.tech.
--
-- Idempotent: re-running is safe (IF NOT EXISTS guards).

CREATE TABLE IF NOT EXISTS submissions (
  -- UUID generated server-side
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- When the submission arrived (UTC)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Which pricing tier they came in on
  tier            TEXT NOT NULL CHECK (tier IN ('charter', 'standard', 'extended', 'enterprise')),
  -- Required fields from the form
  email           TEXT NOT NULL,
  company         TEXT NOT NULL,
  framework       TEXT NOT NULL,
  -- Optional fields
  release_version TEXT,
  context         TEXT,
  -- Workflow status
  status          TEXT NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new', 'replied', 'meeting_scheduled', 'closed_won', 'closed_lost', 'archived')),
  -- Free-form internal notes for Matt
  notes           TEXT,
  -- Last update timestamp
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Raw payload for debugging (e.g. UA, referrer)
  raw             JSONB
);

CREATE INDEX IF NOT EXISTS submissions_created_at_idx
  ON submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS submissions_status_idx
  ON submissions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS submissions_email_idx
  ON submissions (email);

-- Replies sent through the admin inbox. One submission can have N replies.
CREATE TABLE IF NOT EXISTS replies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- The actual email body that was sent
  body            TEXT NOT NULL,
  -- Resend message id, so we can correlate later if needed
  resend_id       TEXT,
  -- Direction: 'outbound' = we sent it; 'inbound' = prospect replied
  -- (inbound is future-work — would require a Resend inbound parse webhook)
  direction       TEXT NOT NULL DEFAULT 'outbound'
                    CHECK (direction IN ('outbound', 'inbound'))
);

CREATE INDEX IF NOT EXISTS replies_submission_idx
  ON replies (submission_id, sent_at);
