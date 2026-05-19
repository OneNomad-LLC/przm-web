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
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Header */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Verify
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Verify a receipt.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
              Paste any signed receipt JSON below. Verification runs entirely in your browser via
              SubtleCrypto — no data leaves your machine. The form auto-detects which benchmark
              the receipt belongs to (convergence, memory, etc.) and verifies against the right
              public key.
            </p>
          </div>
        </section>

        {/* Verifier form */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <VerifyForm keys={keys} />
          </div>
        </section>

        {/* Published keys */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Public verification keys
            </p>
            <div className="rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 p-5">
              {keys.length === 0 ? (
                <p className="text-sm text-[color:var(--color-text-disabled)]">
                  No public keys loaded.
                </p>
              ) : (
                <ul className="space-y-3">
                  {keys.map((k) => (
                    <li
                      key={k.id}
                      className="border-l-2 border-[color:var(--color-bench)] pl-3"
                    >
                      <div className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                        {k.id}
                        <span className="ml-2 font-mono text-xs font-normal text-[color:var(--color-text-muted)]">
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
          </div>
        </section>

        {/* CLI equivalent */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              CLI equivalent
            </p>
            <div className="rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 p-5">
              <pre className="overflow-x-auto font-mono text-sm text-[color:var(--color-text-secondary)]">
                <code>{`npx @onenomad/przm-bench verify <receipt-file>.json`}</code>
              </pre>
              <p className="mt-3 text-sm text-[color:var(--color-text-disabled)]">
                Programmatically:{' '}
                <code className="font-mono text-[color:var(--color-bench)]">
                  import {'{ verifyReceipt, loadPublicKey }'} from &apos;@onenomad/przm-bench&apos;
                </code>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
