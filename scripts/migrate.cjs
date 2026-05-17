/* eslint-disable */
/**
 * Run the schema migration against the configured Neon DB.
 *
 * Usage:
 *   DATABASE_URL=postgres://... node scripts/migrate.cjs
 */
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tier            TEXT NOT NULL CHECK (tier IN ('charter', 'standard', 'extended', 'enterprise')),
    email           TEXT NOT NULL,
    company         TEXT NOT NULL,
    framework       TEXT NOT NULL,
    release_version TEXT,
    context         TEXT,
    status          TEXT NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'replied', 'meeting_scheduled', 'closed_won', 'closed_lost', 'archived')),
    notes           TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    raw             JSONB
  )`,
  `CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions (status, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS submissions_email_idx ON submissions (email)`,
  `CREATE TABLE IF NOT EXISTS replies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    body            TEXT NOT NULL,
    resend_id       TEXT,
    direction       TEXT NOT NULL DEFAULT 'outbound'
                      CHECK (direction IN ('outbound', 'inbound'))
  )`,
  `CREATE INDEX IF NOT EXISTS replies_submission_idx ON replies (submission_id, sent_at)`,
];

(async () => {
  for (const stmt of statements) {
    const tag = stmt.split(/\s+/).slice(0, 6).join(' ');
    try {
      await sql.query(stmt);
      console.log('OK   ' + tag);
    } catch (e) {
      console.log('FAIL ' + tag + ' -> ' + e.message);
      process.exit(1);
    }
  }
  const tables = await sql.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
  );
  console.log('\nTables in public schema:');
  for (const t of tables) console.log('  - ' + t.table_name);
})();
