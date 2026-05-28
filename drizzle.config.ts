import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load .env.local first (Next.js / Vercel convention), then fall back
// to .env. Vercel-set env already in process.env wins over both.
loadEnv({ path: '.env.local', override: false })
loadEnv({ path: '.env', override: false })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in the environment for drizzle-kit')
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
})
