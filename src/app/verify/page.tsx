import type { Metadata } from 'next'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import crypto from 'node:crypto'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VerifyForm } from '@/components/verify-form'

export const metadata: Metadata = {
  title: 'Verify a receipt | przm',
  description:
    'Paste any signed przm receipt JSON and verify its Ed25519 signature in your browser. No server roundtrip, no data leaves your machine.',
  alternates: { canonical: '/verify' },
}

interface PubKey {
  /** Stable name for the key — e.g. "convergence-preview", "memory". */
  id: string
  /** Which benchmark this key signs receipts for. */
  benchmark: string
  /** PEM-encoded public key. */
  pem: string
  /** sha256 fingerprint, matches receipt.signature.publicKeyFingerprint. */
  fingerprint: string
}

const KEY_DEFS: Array<{ id: string; benchmark: string; filename: string }> = [
  // Convergence v0.1 preview key (lives in the bench repo's public mirror)
  {
    id: 'convergence-preview',
    benchmark: 'convergence-v0.1-preview',
    filename: 'convergence-preview.pub',
  },
  // Memory benchmark (the original key, from the engram bench)
  {
    id: 'memory',
    benchmark: 'memory',
    filename: 'receipt-signing.pub',
  },
]

function fingerprintFromPem(pem: string): string {
  try {
    const b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '')
    const bytes = Buffer.from(b64, 'base64')
    return 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex')
  } catch {
    return 'sha256:unknown'
  }
}

async function loadKeys(): Promise<PubKey[]> {
  const dir = path.join(process.cwd(), 'public', 'keys')
  const found: PubKey[] = []
  for (const def of KEY_DEFS) {
    const filePath = path.join(dir, def.filename)
    if (!existsSync(filePath)) continue
    try {
      const pem = await readFile(filePath, 'utf-8')
      found.push({
        id: def.id,
        benchmark: def.benchmark,
        pem,
        fingerprint: fingerprintFromPem(pem),
      })
    } catch {
      // skip
    }
  }
  return found
}

export default async function VerifyPage() {
  const keys = await loadKeys()

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-28">
        <div className="mb-10">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // verify
          </div>
          <h1 className="font-mono text-3xl font-semibold text-[color:var(--color-text-primary)]">
            Verify a receipt
          </h1>
          <p className="mt-4 font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            Paste any signed receipt JSON below. Verification runs entirely in
            your browser using SubtleCrypto. No data leaves your machine. The
            form auto-detects which benchmark the receipt belongs to
            (convergence, memory, etc.) and verifies against the right public
            key.
          </p>
        </div>

        <VerifyForm keys={keys} />

        {/* Published keys */}
        <div className="mt-12 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)] p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            Public verification keys
          </p>
          {keys.length === 0 ? (
            <p className="font-mono text-xs text-[color:var(--color-text-disabled)]">
              No public keys loaded.
            </p>
          ) : (
            <ul className="space-y-3">
              {keys.map((k) => (
                <li
                  key={k.id}
                  className="border-l-2 border-[color:var(--color-bench)] pl-3"
                >
                  <div className="font-mono text-xs text-[color:var(--color-text-primary)]">
                    {k.id}
                    <span className="ml-2 text-[color:var(--color-text-muted)]">
                      ({k.benchmark})
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-[color:var(--color-text-disabled)]">
                    {k.fingerprint}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CLI equivalent */}
        <div className="mt-6 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)] p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            CLI equivalent
          </p>
          <pre className="mt-2 font-mono text-xs text-[color:var(--color-text-secondary)]">
            <code>{`npx @onenomad/przm-bench verify <receipt-file>.json`}</code>
          </pre>
          <p className="mt-3 font-mono text-xs text-[color:var(--color-text-disabled)]">
            Programmatically:{' '}
            <code className="text-[color:var(--color-bench)]">
              import {'{ verifyReceipt, loadPublicKey }'} from &apos;@onenomad/przm-bench&apos;
            </code>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
