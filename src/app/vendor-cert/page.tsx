import type { Metadata } from 'next'
import { readFile } from 'fs/promises'
import path from 'path'
import { marked } from 'marked'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Vendor certification | przm',
  description:
    'Get your AI framework or model independently benchmarked. Signed Ed25519 receipt with per-scenario transcripts. From $999/release.',
  alternates: { canonical: '/vendor-cert' },
  openGraph: {
    type: 'website',
    title: 'przm vendor certification',
    description:
      'Independent third-party benchmarking for AI frameworks and models. Signed, deterministic, publishable.',
    url: 'https://przm.sh/vendor-cert',
  },
}

async function loadOnePager(): Promise<string> {
  try {
    const mdPath = path.join(process.cwd(), 'content', 'vendor-cert-onepager.md')
    const md = await readFile(mdPath, 'utf-8')
    return await marked(md, { gfm: true })
  } catch {
    return '<p><em>One-pager content not found.</em></p>'
  }
}

const offerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI framework benchmarking and certification',
  provider: {
    '@type': 'Organization',
    name: 'OneNomad LLC',
    url: 'https://przm.sh',
  },
  description:
    'Independent third-party benchmarking of AI frameworks and models. Signed Ed25519 receipts with per-scenario transcripts.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Standard certification',
      price: '999',
      priceCurrency: 'USD',
      description: 'One full benchmark run, signed receipt, private findings brief.',
    },
    {
      '@type': 'Offer',
      name: 'Extended certification',
      price: '2499',
      priceCurrency: 'USD',
      description: 'Standard + holdout subset run + 72-hour turnaround.',
    },
    {
      '@type': 'Offer',
      name: 'Enterprise certification',
      price: '9999',
      priceCurrency: 'USD',
      description: 'Custom fixture set authored against your domain. Private receipt.',
    },
  ],
}

export default async function VendorCertPage() {
  const html = await loadOnePager()
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-28">
        <div className="mb-8">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // vendor certification
          </div>
        </div>
        <div
          className="prose-bench"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="mt-16 flex flex-col gap-3 border-t border-[color:var(--color-border-subtle)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="mailto:hello@onenomad.dev?subject=przm%20vendor%20certification"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-semibold text-[color:var(--color-charcoal)] transition-colors"
            style={{ background: 'var(--color-bench)' }}
          >
            Start a certification &rarr;
          </a>
          <a
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-default)] px-4 py-2 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-bench)] hover:text-[color:var(--color-bench)]"
          >
            Read the methodology first
          </a>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
        />
      </main>
      <Footer />
    </>
  )
}
