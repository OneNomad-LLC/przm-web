import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

/**
 * Append `uselibpqcompat=true` to Neon connection strings so the
 * `sslmode=require` they ship with keeps its current semantics.
 * Also silences the boot-time deprecation warning from pg-connection-string.
 */
function withLibpqCompat(rawUrl: string): string {
  try {
    const u = new URL(rawUrl)
    if (!u.searchParams.has('uselibpqcompat')) {
      u.searchParams.set('uselibpqcompat', 'true')
    }
    return u.toString()
  } catch {
    return rawUrl
  }
}

/**
 * Postgres connection pool for auth + customer data.
 *
 * Lazy-initialized on first getDb() call so the build doesn't fail
 * when DATABASE_URL is absent. The first actual DB call at request
 * time will throw a clear error if the env var is missing.
 *
 * max: 3 lets ~30 concurrent Vercel Serverless instances run before
 * exhausting Neon's default 100-connection limit.
 */
let _pool: Pool | null = null
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

function getPool(): Pool {
  if (_pool) return _pool
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL must be set (add the Neon integration in Vercel or configure .env.local)',
    )
  }
  _pool = new Pool({ connectionString: withLibpqCompat(url), max: 3 })
  return _pool
}

function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (_db) return _db
  _db = drizzle(getPool(), { schema })
  return _db
}

/**
 * Drizzle DB instance. Access via this export in server code.
 * The underlying pool is created on first use, not at import time.
 */
export const db: ReturnType<typeof drizzle<typeof schema>> = new Proxy(
  // Placeholder target — all gets are forwarded to the lazy instance.
  {} as ReturnType<typeof drizzle<typeof schema>>,
  {
    get(_target, prop) {
      return Reflect.get(getDb(), prop)
    },
    apply(_target, thisArg, args: unknown[]) {
      return Reflect.apply(getDb() as unknown as (...a: unknown[]) => unknown, thisArg, args)
    },
  },
)

export type DB = ReturnType<typeof drizzle<typeof schema>>
