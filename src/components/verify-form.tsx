'use client'

import { useState } from 'react'
import { ShieldCheck, ShieldX, Shield, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PubKey {
  id: string
  benchmark: string
  pem: string
  fingerprint: string
}

interface SignedReceipt {
  signature?: {
    algorithm?: string
    publicKeyFingerprint?: string
    value?: string
  }
  benchmark?: string
}

type VerifyResult =
  | { status: 'verified'; keyId: string; benchmark: string }
  | { status: 'invalid'; reason: string }
  | { status: 'unsigned' }
  | { status: 'unknown-key'; receiptFingerprint: string }
  | { status: 'error'; reason: string }

/** JCS (RFC 8785) stringify. */
function jcsStringify(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    return '[' + value.map(jcsStringify).join(',') + ']'
  }
  if (typeof value === 'object') {
    const sorted = Object.keys(value as Record<string, unknown>).sort()
    const pairs = sorted.map(
      (k) =>
        `${JSON.stringify(k)}:${jcsStringify((value as Record<string, unknown>)[k])}`,
    )
    return '{' + pairs.join(',') + '}'
  }
  return JSON.stringify(value)
}

/**
 * Non-deterministic fields excluded from the signed payload. Must
 * match `NON_DETERMINISTIC_FIELDS` + `NON_DETERMINISTIC_SCORE_FIELDS`
 * in przm-bench/src/receipt/canonicalize.ts. Browser verifier and
 * Node signer/verifier all have to strip the same set or signatures
 * won't verify.
 */
const STRIP_TOP_LEVEL = new Set(['signature', 'ranAt', 'receiptId'])
const STRIP_FROM_SCORES = new Set([
  'latency_p50_ms',
  'latency_p95_ms',
  'ingest_throughput_items_per_sec',
])

function stripNonDeterministic(value: unknown): unknown {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }
  const src = value as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(src)) {
    if (STRIP_TOP_LEVEL.has(k)) continue
    if (
      k === 'scores' &&
      v !== null &&
      typeof v === 'object' &&
      !Array.isArray(v)
    ) {
      const cleanScores: Record<string, unknown> = {}
      for (const [sk, sv] of Object.entries(v as Record<string, unknown>)) {
        if (STRIP_FROM_SCORES.has(sk)) continue
        cleanScores[sk] = sv
      }
      out[k] = cleanScores
      continue
    }
    out[k] = v
  }
  return out
}

async function verifyReceiptJson(
  receiptJson: string,
  keys: PubKey[],
): Promise<VerifyResult> {
  let receipt: SignedReceipt & Record<string, unknown>
  try {
    receipt = JSON.parse(receiptJson)
  } catch {
    return { status: 'error', reason: 'Invalid JSON. Could not parse receipt.' }
  }

  if (!receipt.signature?.value) {
    return { status: 'unsigned' }
  }

  const receiptFingerprint = receipt.signature.publicKeyFingerprint
  // Find the key whose fingerprint matches the receipt's claim. If the
  // receipt doesn't claim one, fall through and try every key — costs
  // nothing and old receipts may not include the fingerprint.
  const candidates = receiptFingerprint
    ? keys.filter((k) => k.fingerprint === receiptFingerprint)
    : keys

  if (candidates.length === 0) {
    return { status: 'unknown-key', receiptFingerprint: receiptFingerprint ?? '(unspecified)' }
  }

  for (const key of candidates) {
    try {
      const b64 = key.pem
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s+/g, '')

      const keyBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
      const cryptoKey = await crypto.subtle.importKey(
        'spki',
        keyBytes,
        { name: 'Ed25519' },
        false,
        ['verify'],
      )

      // Strip signature + non-deterministic fields (ranAt, receiptId,
      // wall-clock latency/throughput) BEFORE canonicalizing. Has to
      // match the signer's exclusion set in
      // przm-bench/src/receipt/canonicalize.ts or signatures won't
      // verify.
      const receiptForSigning = stripNonDeterministic(receipt)
      const canonical = jcsStringify(receiptForSigning)
      const payloadBytes = new TextEncoder().encode(canonical)

      const sigB64 = receipt.signature.value.replace(/-/g, '+').replace(/_/g, '/')
      const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0))

      const ok = await crypto.subtle.verify('Ed25519', cryptoKey, sigBytes, payloadBytes)
      if (ok) {
        return {
          status: 'verified',
          keyId: key.id,
          benchmark: typeof receipt.benchmark === 'string' ? receipt.benchmark : key.benchmark,
        }
      }
    } catch {
      // try the next candidate
    }
  }

  return {
    status: 'invalid',
    reason: 'Signature did not verify against the matching public key.',
  }
}

interface VerifyFormProps {
  keys: PubKey[]
}

export function VerifyForm({ keys }: VerifyFormProps) {
  const [json, setJson] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    if (!json.trim()) return
    setLoading(true)
    setResult(null)
    const res = await verifyReceiptJson(json.trim(), keys)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Textarea */}
      <div>
        <label
          htmlFor="receipt-json"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]"
        >
          Paste receipt JSON
        </label>
        <textarea
          id="receipt-json"
          value={json}
          onChange={(e) => {
            setJson(e.target.value)
            setResult(null)
          }}
          rows={14}
          spellCheck={false}
          className="w-full rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)] p-4 font-mono text-xs text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-disabled)] outline-none transition-colors focus:border-[color:var(--color-gold)]/60"
          placeholder={'{\n  "receiptId": "...",\n  "signature": { ... }\n}'}
        />
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={!json.trim() || loading}
        style={json.trim() && !loading ? { background: 'var(--color-bench)' } : undefined}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-medium transition-all',
          json.trim() && !loading
            ? 'text-[color:var(--color-charcoal)]'
            : 'cursor-not-allowed bg-[color:var(--color-bg-raised)] text-[color:var(--color-text-disabled)]',
        )}
      >
        <Shield size={14} />
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      {/* Result */}
      {result && <VerifyResultBanner result={result} />}
    </div>
  )
}

function VerifyResultBanner({ result }: { result: VerifyResult }) {
  if (result.status === 'verified') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-green)]/40 bg-[color:var(--color-green)]/10 p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[color:var(--color-green)]" />
        <div>
          <p className="font-mono text-sm font-semibold text-[color:var(--color-green)]">
            Signature verified
          </p>
          <p className="mt-1 font-mono text-xs text-[color:var(--color-text-secondary)]">
            The receipt is authentic and was signed with the{' '}
            <code className="text-[color:var(--color-green)]">{result.keyId}</code> przm
            private key ({result.benchmark}). Scores have not been altered.
          </p>
        </div>
      </div>
    )
  }

  if (result.status === 'invalid') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-red)]/40 bg-[color:var(--color-red)]/10 p-4">
        <ShieldX size={18} className="mt-0.5 shrink-0 text-[color:var(--color-red)]" />
        <div>
          <p className="font-mono text-sm font-semibold text-[color:var(--color-red)]">
            Signature invalid
          </p>
          <p className="mt-1 font-mono text-xs text-[color:var(--color-text-secondary)]">
            {result.reason}
          </p>
        </div>
      </div>
    )
  }

  if (result.status === 'unknown-key') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-orange)]/40 bg-[color:var(--color-orange)]/10 p-4">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-[color:var(--color-orange)]" />
        <div>
          <p className="font-mono text-sm font-semibold text-[color:var(--color-orange)]">
            Unknown signing key
          </p>
          <p className="mt-1 font-mono text-xs text-[color:var(--color-text-secondary)]">
            The receipt claims fingerprint{' '}
            <code className="break-all text-[color:var(--color-orange)]">
              {result.receiptFingerprint}
            </code>{' '}
            which is not one of the published przm keys. Either the receipt is
            from a different benchmark suite or the key hasn&apos;t been mirrored
            here yet.
          </p>
        </div>
      </div>
    )
  }

  if (result.status === 'unsigned') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)] p-4">
        <Shield size={18} className="mt-0.5 shrink-0 text-[color:var(--color-text-muted)]" />
        <div>
          <p className="font-mono text-sm font-semibold text-[color:var(--color-text-secondary)]">
            No signature present
          </p>
          <p className="mt-1 font-mono text-xs text-[color:var(--color-text-muted)]">
            This receipt does not contain a <code className="text-[color:var(--color-gold)]">signature</code>{' '}
            field. Only receipts produced by the official CI harness are signed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)] p-4">
      <AlertCircle size={18} className="mt-0.5 shrink-0 text-[color:var(--color-orange)]" />
      <div>
        <p className="font-mono text-sm font-semibold text-[color:var(--color-orange)]">
          Verification error
        </p>
        <p className="mt-1 font-mono text-xs text-[color:var(--color-text-secondary)]">
          {result.reason}
        </p>
      </div>
    </div>
  )
}
