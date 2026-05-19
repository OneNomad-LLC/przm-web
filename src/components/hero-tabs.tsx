'use client'

import { useState } from 'react'

type TabId = 'run' | 'receipt' | 'verify'

interface Tab {
  id: TabId
  label: string
  filename: string
  language: 'bash' | 'json' | 'typescript'
}

const TABS: Tab[] = [
  { id: 'run', label: 'Run the bench', filename: 'terminal', language: 'bash' },
  { id: 'receipt', label: 'Get a signed receipt', filename: 'receipt.json', language: 'json' },
  { id: 'verify', label: 'Anyone can verify', filename: 'verify.ts', language: 'typescript' },
]

export function HeroTabs() {
  const [active, setActive] = useState<TabId>('run')

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/60 shadow-2xl shadow-black/40">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]/60 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
        </div>
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-disabled)]">
          przm-bench
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-disabled)]">
          {TABS.find((t) => t.id === active)?.filename}
        </span>
      </div>

      {/* Tab strip */}
      <div className="flex border-b border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-base)]/40">
        {TABS.map((tab, i) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 border-r border-[color:var(--color-border-subtle)] px-4 py-3 text-left font-mono text-[11px] transition-colors last:border-r-0 ${
                isActive
                  ? 'bg-[color:var(--color-bg-surface)]/80 text-[color:var(--color-text-primary)]'
                  : 'text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg-surface)]/30 hover:text-[color:var(--color-text-secondary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[color:var(--color-text-disabled)]">0{i + 1}</span>
                <span>{tab.label}</span>
                {isActive ? (
                  <span
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{
                      background: 'var(--color-bench)',
                      boxShadow: '0 0 8px var(--color-bench)',
                    }}
                  />
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      {/* Code body */}
      <div className="overflow-x-auto bg-[color:var(--color-bg-base)]/30 p-5">
        {active === 'run' ? <RunBlock /> : null}
        {active === 'receipt' ? <ReceiptBlock /> : null}
        {active === 'verify' ? <VerifyBlock /> : null}
      </div>
    </div>
  )
}

// ── Syntax-style helpers ──────────────────────────────────────────────────

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <span>
      <span style={{ color: 'var(--color-bench)' }}>$ </span>
      <span className="text-[color:var(--color-text-primary)]">{children}</span>
    </span>
  )
}

function Comment({ children }: { children: React.ReactNode }) {
  return <span className="text-[color:var(--color-text-disabled)]">{children}</span>
}

function Str({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-knowledge)' }}>{children}</span>
}

function Num({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-runtime)' }}>{children}</span>
}

function Key({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-voice)' }}>{children}</span>
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-memory)' }}>{children}</span>
}

function OK({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-bench)' }}>{children}</span>
}

function Wrong({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-memory)' }}>{children}</span>
}

// ── Tab bodies ────────────────────────────────────────────────────────────

function RunBlock() {
  return (
    <pre className="font-mono text-[12px] leading-relaxed text-[color:var(--color-text-secondary)]">
      <Prompt>pnpm tsx scripts/run-convergence-bench.ts</Prompt>
      {'\n\n'}
      <Comment>── baseline-anthropic (claude-haiku-4-5) ────────────────────</Comment>
      {'\n'}   factual-math-001              consensus=391       <OK>CORRECT</OK>
      {'\n'}   code-correctness-002          consensus=True False <OK>CORRECT</OK>
      {'\n'}   temporal-ordering-003         consensus=BCA       <Wrong>WRONG</Wrong>
      {'\n'}   factual-history-001           consensus=1969      <OK>CORRECT</OK>
      {'\n'}   ...{'\n'}
      <Comment>── autogen (gpt-4o-mini) ────────────────────────────────────</Comment>
      {'\n'}   factual-math-001              consensus=391       <OK>CORRECT</OK>
      {'\n'}   boolean-trap-003              consensus=false     <OK>CORRECT</OK>
      {'\n'}   ...{'\n\n'}
      <Comment>%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</Comment>
      {'\n'}
      <Comment>% Convergence benchmark — aggregate scores</Comment>
      {'\n'}
      <Comment>%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</Comment>
      {'\n'}   metric          haiku    gpt-5-mini   gpt-4o-mini   autogen
      {'\n'}   correct_rate    <Num>96.7%</Num>    <Num>96.7%</Num>        <Num>76.7%</Num>         <Num>93.3%</Num>
      {'\n'}   collapse_rate   <Num>56.7%</Num>    <Num>96.7%</Num>        <Num>73.3%</Num>         <OK>10.0%</OK>
      {'\n\n'}
      <OK>✓</OK> Signed <Num>6</Num> receipts → <Str>results/published/convergence/</Str>
    </pre>
  )
}

function ReceiptBlock() {
  return (
    <pre className="font-mono text-[12px] leading-relaxed text-[color:var(--color-text-secondary)]">
      {'{'}
      {'\n'}  <Key>"receiptId"</Key>: <Str>"7d7db21e-9706-4906-9498-df9e0c38dfb3"</Str>,
      {'\n'}  <Key>"benchmark"</Key>: <Str>"convergence-v0.1-preview"</Str>,
      {'\n'}  <Key>"ranAt"</Key>: <Str>"2026-05-19T03:42:49.408Z"</Str>,
      {'\n'}  <Key>"adapter"</Key>: {'{'}
      {'\n'}    <Key>"name"</Key>: <Str>"autogen"</Str>,
      {'\n'}    <Key>"version"</Key>: <Str>"0.1.0"</Str>,
      {'\n'}    <Key>"llmModel"</Key>: <Str>"gpt-4o-mini"</Str>
      {'\n'}  {'}'},
      {'\n'}  <Key>"fixtureSet"</Key>: {'{'} <Key>"n"</Key>: <Num>30</Num>, <Key>"subset"</Key>: <Str>"all"</Str> {'}'},
      {'\n'}  <Key>"environment"</Key>: {'{'}
      {'\n'}    <Key>"git"</Key>: {'{'} <Key>"commit"</Key>: <Str>"5eb554c..."</Str> {'}'}
      {'\n'}  {'}'},
      {'\n'}  <Key>"scores"</Key>: {'{'}
      {'\n'}    <Key>"correct_final_answer_rate"</Key>: <Num>0.933</Num>,
      {'\n'}    <Key>"collapse_rate"</Key>: <OK>0.100</OK>,
      {'\n'}    <Key>"sycophancy_ratio"</Key>: <Num>0</Num>,
      {'\n'}    <Key>"tokens_per_correct_answer"</Key>: <Num>949</Num>
      {'\n'}  {'}'},
      {'\n'}  <Key>"signature"</Key>: <Str>"MEUCIQDj0...3pV6+kQ=="</Str>  <Comment>// Ed25519, RFC 8785 JCS</Comment>
      {'\n'}{'}'}
    </pre>
  )
}

function VerifyBlock() {
  return (
    <pre className="font-mono text-[12px] leading-relaxed text-[color:var(--color-text-secondary)]">
      <Kw>import</Kw> {'{'} verifyConvergenceReceipt, loadPublicKey {'}'} <Kw>from</Kw> <Str>&apos;@onenomad/przm-bench&apos;</Str>
      {'\n'}<Kw>import</Kw> {'{'} readFileSync {'}'} <Kw>from</Kw> <Str>&apos;node:fs&apos;</Str>
      {'\n\n'}
      <Comment>// Public key is committed in the repo at keys/convergence-preview.pub</Comment>
      {'\n'}<Kw>const</Kw> pub = <Kw>await</Kw> loadPublicKey(<Str>&apos;keys/convergence-preview.pub&apos;</Str>)
      {'\n'}<Kw>const</Kw> receipt = JSON.parse(readFileSync(<Str>&apos;receipt.json&apos;</Str>, <Str>&apos;utf-8&apos;</Str>))
      {'\n\n'}
      <Kw>const</Kw> result = verifyConvergenceReceipt(receipt, pub)
      {'\n\n'}
      <Kw>if</Kw> (result.ok) {'{'}
      {'\n'}  console.log(<Str>&apos;<OK>✓</OK> signature valid&apos;</Str>)
      {'\n'}  console.log(<Str>&apos;adapter:&apos;</Str>, receipt.adapter.name, receipt.adapter.llmModel)
      {'\n'}  console.log(<Str>&apos;collapse_rate:&apos;</Str>, receipt.scores.collapse_rate)
      {'\n'}{'}'} <Kw>else</Kw> {'{'}
      {'\n'}  console.error(<Str>&apos;<Wrong>✗</Wrong>&apos;</Str>, result.reason)
      {'\n'}{'}'}
      {'\n\n'}
      <Comment>// Or verify in your browser at przm.sh/verify — same SubtleCrypto path,</Comment>
      {'\n'}<Comment>// same RFC 8785 canonicalization, no data leaves your machine.</Comment>
    </pre>
  )
}
