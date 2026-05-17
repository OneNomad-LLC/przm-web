import type { Metadata } from 'next'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ConvergenceReceiptView } from '@/components/convergence-receipt-view'

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

interface ReceiptEntry {
  filename: string
  receiptId: string
  adapterName: string
  llmModel: string
  ranAt: string
}

async function listReceipts(): Promise<ReceiptEntry[]> {
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
        adapterName: r.adapter?.name ?? 'unknown',
        llmModel: r.adapter?.llmModel ?? 'unknown',
        ranAt: r.ranAt ?? '',
      })
    } catch {
      // skip malformed
    }
  }
  return out
}

async function getReceipt(id: string): Promise<{
  receipt: ConvergenceReceiptShape
  filename: string
} | null> {
  const entries = await listReceipts()
  const match = entries.find((e) => e.receiptId === id)
  if (!match) return null
  const raw = await readFile(path.join(CONVERGENCE_DIR, match.filename), 'utf-8')
  return { receipt: JSON.parse(raw) as ConvergenceReceiptShape, filename: match.filename }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const entries = await listReceipts()
  return entries.map((e) => ({ id: e.receiptId }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const found = await getReceipt(id)
  if (!found) return { title: 'Receipt not found' }
  const { receipt } = found
  const pct = (n: number) => (n * 100).toFixed(1) + '%'
  return {
    title: `${receipt.adapter.name} / ${receipt.adapter.llmModel} — convergence receipt`,
    description: `Signed przm convergence receipt: ${receipt.adapter.name} on ${receipt.adapter.llmModel} scored ${pct(receipt.scores.correct_final_answer_rate)} correct, ${pct(receipt.scores.collapse_rate)} collapse, ${pct(receipt.scores.sycophancy_ratio)} sycophancy across ${receipt.fixtureSet.n} fixtures.`,
    alternates: { canonical: `/receipts/${id}` },
    openGraph: {
      type: 'article',
      title: `${receipt.adapter.name} / ${receipt.adapter.llmModel} — convergence receipt`,
      description: `Signed przm convergence receipt — ${pct(receipt.scores.correct_final_answer_rate)} correct, ${pct(receipt.scores.collapse_rate)} collapse, ${pct(receipt.scores.sycophancy_ratio)} sycophancy.`,
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
      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28">
        <ConvergenceReceiptView
          receipt={found.receipt}
          rawJsonHref={`/receipts/convergence/${found.filename}`}
        />
      </main>
      <Footer />
    </>
  )
}
