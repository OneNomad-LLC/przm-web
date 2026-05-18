import type { Metadata } from 'next'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ConvergenceReceiptView } from '@/components/convergence-receipt-view'
import { MemoryReceiptView } from '@/components/memory-receipt-view'

interface PageProps {
  params: Promise<{ id: string }>
}

interface ConvergenceReceiptShape {
  receiptId: string
  benchmark: string
  benchVersion: string
  ranAt: string
  adapter: { name: string; version: string; llmModel: string }
  configuration: { nAgents: number; nRounds: number }
  fixtureSet: { n: number; setSha256: string }
  environment: {
    node: string
    platform: string
    git: { commit: string; dirty: boolean }
  }
  scores: {
    correct_final_answer_rate: number
    collapse_rate: number
    sycophancy_ratio: number
    tokens_per_correct_answer: number
    position_flips_per_agent_per_round: number
  }
  perScenario: Array<{
    scenarioId: string
    scenarioSha256: string
    finalConsensus: string | null
    correct: boolean
    collapsed: boolean
    sycophancyOccurred: boolean | null
    positionFlipsByAgent: number[]
    totalOutputTokens: number
    transcript: {
      scenarioId: string
      rounds: Array<{
        roundNumber: number
        perAgent: Array<{
          agentIndex: number
          answer: string
          message: string
          outputTokens: number
        }>
      }>
    }
  }>
  signature?: {
    algorithm: 'Ed25519'
    publicKeyFingerprint: string
    value: string
  }
}

const CONVERGENCE_DIR = path.join(
  process.cwd(),
  'public',
  'receipts',
  'convergence',
)

const MEMORY_DIR = path.join(
  process.cwd(),
  'public',
  'receipts',
  'memory',
)

interface MemoryReceiptShape {
  receiptId: string
  benchVersion: string
  ranAt: string
  adapter: { name: string; version: string }
  fixture: { id: string; sha256: string; n: number }
  environment: {
    node: string
    platform: string
    git: { commit: string; dirty: boolean }
  }
  scores: {
    recall_at_5: number
    recall_at_10: number
    ndcg_at_10: number
    latency_p50_ms: number
    latency_p95_ms: number
    ingest_throughput_items_per_sec: number
  }
  perQuery: Array<{
    queryId: string
    retrieved: string[]
    hit: boolean
    rank: number | null
    latencyMs: number
  }>
  signature?: {
    algorithm: 'Ed25519'
    publicKeyFingerprint: string
    value: string
  }
}

type ReceiptKind = 'convergence' | 'memory'

interface ReceiptEntry {
  filename: string
  receiptId: string
  ranAt: string
  kind: ReceiptKind
}

async function listConvergence(): Promise<ReceiptEntry[]> {
  if (!existsSync(CONVERGENCE_DIR)) return []
  const files = (await readdir(CONVERGENCE_DIR)).filter((f) => f.endsWith('.json'))
  const out: ReceiptEntry[] = []
  for (const file of files) {
    try {
      const raw = await readFile(path.join(CONVERGENCE_DIR, file), 'utf-8')
      const r = JSON.parse(raw) as Partial<ConvergenceReceiptShape>
      if (!r.receiptId) continue
      out.push({
        filename: file,
        receiptId: r.receiptId,
        ranAt: r.ranAt ?? '',
        kind: 'convergence',
      })
    } catch {
      // skip malformed
    }
  }
  return out
}

async function listMemory(): Promise<ReceiptEntry[]> {
  if (!existsSync(MEMORY_DIR)) return []
  const files = (await readdir(MEMORY_DIR)).filter((f) => f.endsWith('.json'))
  const out: ReceiptEntry[] = []
  for (const file of files) {
    try {
      const raw = await readFile(path.join(MEMORY_DIR, file), 'utf-8')
      const r = JSON.parse(raw) as Partial<MemoryReceiptShape>
      if (!r.receiptId) continue
      out.push({
        filename: file,
        receiptId: r.receiptId,
        ranAt: r.ranAt ?? '',
        kind: 'memory',
      })
    } catch {
      // skip malformed
    }
  }
  return out
}

async function listReceipts(): Promise<ReceiptEntry[]> {
  const [conv, mem] = await Promise.all([listConvergence(), listMemory()])
  return [...conv, ...mem]
}

type LoadedReceipt =
  | { kind: 'convergence'; receipt: ConvergenceReceiptShape; filename: string }
  | { kind: 'memory'; receipt: MemoryReceiptShape; filename: string }

async function getReceipt(id: string): Promise<LoadedReceipt | null> {
  const entries = await listReceipts()
  const match = entries.find((e) => e.receiptId === id)
  if (!match) return null
  const dir = match.kind === 'memory' ? MEMORY_DIR : CONVERGENCE_DIR
  const raw = await readFile(path.join(dir, match.filename), 'utf-8')
  const parsed = JSON.parse(raw)
  if (match.kind === 'memory') {
    return { kind: 'memory', receipt: parsed as MemoryReceiptShape, filename: match.filename }
  }
  return { kind: 'convergence', receipt: parsed as ConvergenceReceiptShape, filename: match.filename }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const entries = await listReceipts()
  return entries.map((e) => ({ id: e.receiptId }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const found = await getReceipt(id)
  if (!found) return { title: 'Receipt not found' }
  const pct = (n: number) => (n * 100).toFixed(1) + '%'

  if (found.kind === 'memory') {
    const r = found.receipt
    return {
      title: `${r.adapter.name} / ${r.fixture.id}. Memory recall receipt`,
      description: `Signed przm memory receipt: ${r.adapter.name} v${r.adapter.version} on ${r.fixture.id} scored ${pct(r.scores.recall_at_10)} recall@10, ${pct(r.scores.ndcg_at_10)} NDCG@10 across ${r.fixture.n.toLocaleString()} items.`,
      alternates: { canonical: `/receipts/${id}` },
      openGraph: {
        type: 'article',
        title: `${r.adapter.name} / ${r.fixture.id}. Memory recall receipt`,
        description: `Signed przm memory receipt: ${pct(r.scores.recall_at_10)} recall@10, ${pct(r.scores.ndcg_at_10)} NDCG@10.`,
        url: `https://przm.sh/receipts/${id}`,
      },
    }
  }

  const r = found.receipt
  return {
    title: `${r.adapter.name} / ${r.adapter.llmModel}. Convergence receipt`,
    description: `Signed przm convergence receipt: ${r.adapter.name} on ${r.adapter.llmModel} scored ${pct(r.scores.correct_final_answer_rate)} correct, ${pct(r.scores.collapse_rate)} collapse, ${pct(r.scores.sycophancy_ratio)} sycophancy across ${r.fixtureSet.n} fixtures.`,
    alternates: { canonical: `/receipts/${id}` },
    openGraph: {
      type: 'article',
      title: `${r.adapter.name} / ${r.adapter.llmModel}. Convergence receipt`,
      description: `Signed przm convergence receipt: ${pct(r.scores.correct_final_answer_rate)} correct, ${pct(r.scores.collapse_rate)} collapse, ${pct(r.scores.sycophancy_ratio)} sycophancy.`,
      url: `https://przm.sh/receipts/${id}`,
    },
  }
}

export default async function ReceiptPage({ params }: PageProps) {
  const { id } = await params
  const found = await getReceipt(id)
  if (!found) notFound()

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-28">
        {found.kind === 'memory' ? (
          <MemoryReceiptView
            receipt={found.receipt}
            rawJsonHref={`/receipts/memory/${found.filename}`}
          />
        ) : (
          <ConvergenceReceiptView
            receipt={found.receipt}
            rawJsonHref={`/receipts/convergence/${found.filename}`}
          />
        )}
      </main>
      <Footer />
    </>
  )
}
