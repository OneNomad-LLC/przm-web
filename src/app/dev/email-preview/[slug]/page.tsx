import { notFound } from 'next/navigation'
import { renderSignupAck } from '@/lib/email/signup-ack'
import { renderAdminReply } from '@/lib/email/admin-reply'

export const dynamic = 'force-dynamic'

const SAMPLE = {
  company: 'Acme Robotics',
  framework: 'AcmeAgent v2.1.0',
} as const

const ADMIN_REPLY_BODY = [
  `Thanks for the quick reply.`,
  ``,
  `To answer your three questions:`,
  ``,
  `1. We'd target the v2.1.0 release on the convergence axis. The five categories on the leaderboard right now (mathematical-fact, scientific-consensus, temporal-ordering, factual-recall, ethical-dilemma) all apply to multi-agent setups.`,
  ``,
  `2. For the LLM, gpt-4o-mini is the easiest call — that's where the comparable rows on the leaderboard sit today. If you want a different one, the adapter takes any provider via OpenRouter.`,
  ``,
  `3. On "good": the headline number you'd publish is the % correct + % collapse rate on the holdout subset. The methodology page goes into more detail at https://przm.sh/methodology#convergence.`,
  ``,
  `Want me to spin up a 15-min slot this week? My calendar is at https://cal.com/onenomad.`,
].join('\n')

function render(slug: string): { subject: string; html: string; text: string } | null {
  if (slug.startsWith('signup-ack-')) {
    const tier = slug.replace('signup-ack-', '') as
      | 'charter'
      | 'standard'
      | 'extended'
      | 'enterprise'
    if (!['charter', 'standard', 'extended', 'enterprise'].includes(tier))
      return null
    return renderSignupAck({
      tier,
      company: SAMPLE.company,
      framework: SAMPLE.framework,
    })
  }
  if (slug === 'admin-reply') {
    return renderAdminReply({
      body: ADMIN_REPLY_BODY,
      tier: 'charter',
      framework: SAMPLE.framework,
    })
  }
  return null
}

export default async function EmailPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (process.env['NODE_ENV'] === 'production') notFound()
  const { slug } = await params
  const rendered = render(slug)
  if (!rendered) notFound()

  return (
    <main style={{ padding: '24px', background: '#1d2021', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          marginBottom: 16,
          padding: 16,
          background: '#282828',
          border: '1px solid #504945',
          borderRadius: 8,
          fontFamily:
            "'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace",
          color: '#ebdbb2',
          fontSize: 13,
        }}
      >
        <div style={{ color: '#928374', marginBottom: 4 }}>SUBJECT</div>
        <div style={{ marginBottom: 12 }}>{rendered.subject}</div>
        <div style={{ fontSize: 12 }}>
          <a href="/dev/email-preview" style={{ color: '#928374' }}>
            ← Back to index
          </a>
        </div>
      </div>
      <iframe
        srcDoc={rendered.html}
        style={{
          width: '100%',
          maxWidth: 900,
          height: 'calc(100vh - 160px)',
          margin: '0 auto',
          display: 'block',
          border: '1px solid #504945',
          borderRadius: 8,
          background: '#f5f5f7',
        }}
        title="Email preview"
      />
    </main>
  )
}
