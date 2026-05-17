/**
 * Postgres connection via Neon's HTTP driver.
 *
 * Edge-runtime friendly. No connection pooling concerns (every query
 * is a one-shot HTTPS request). Returns plain objects.
 *
 * Env var:
 *   DATABASE_URL — provided automatically by the Vercel Neon
 *     marketplace integration. Falls back to POSTGRES_URL or
 *     POSTGRES_URL_NON_POOLING which Vercel also injects.
 *
 * If no URL is configured, query() throws a clear message so callers
 * can return a graceful 503 instead of an opaque crash.
 */

import { neon } from '@neondatabase/serverless'

function getConnectionString(): string {
  const candidates = [
    process.env['DATABASE_URL'],
    process.env['POSTGRES_URL'],
    process.env['POSTGRES_URL_NON_POOLING'],
  ]
  const url = candidates.find((s) => typeof s === 'string' && s.length > 0)
  if (!url) {
    throw new Error(
      'Database not configured. Set DATABASE_URL (or add the Neon marketplace integration in Vercel).',
    )
  }
  return url
}

let _sql: ReturnType<typeof neon> | null = null

function getSql(): ReturnType<typeof neon> {
  if (_sql) return _sql
  _sql = neon(getConnectionString())
  return _sql
}

/**
 * Run a parameterized query. Use tagged-template form for safety:
 *
 *   const rows = await sql`SELECT * FROM submissions WHERE id = ${id}`
 *
 * The neon() driver returns Promise<Array<Row>>; rows are plain
 * objects keyed by column name.
 */
export function sql() {
  return getSql()
}

/** True if the database connection is configured. UI may render
 *  graceful 'database not yet connected' states based on this. */
export function isDbConfigured(): boolean {
  try {
    getConnectionString()
    return true
  } catch {
    return false
  }
}
