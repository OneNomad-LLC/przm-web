/**
 * better-auth catch-all route handler.
 *
 * Handles all /api/auth/* requests: sign-in, sign-out, OAuth callbacks,
 * magic-link verification, passkey registration/authentication, etc.
 *
 * Do not add custom logic here — use better-auth plugins or hooks in
 * src/lib/auth.ts instead.
 */

import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
