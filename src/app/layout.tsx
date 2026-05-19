import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-sans',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'przm: vendor-neutral AI reliability benchmarks',
    template: '%s | przm',
  },
  description:
    'Multi-axis AI reliability leaderboard. Deterministic scoring, Ed25519-signed receipts, adversarial holdout sets. Multi-agent convergence, AI memory recall, more. Apache-2.0.',
  metadataBase: new URL('https://przm.sh'),
  alternates: {
    canonical: '/',
  },
  keywords: [
    'AI benchmark',
    'AI reliability',
    'multi-agent convergence',
    'sycophancy',
    'AI memory benchmark',
    'LLM evaluation',
    'CrewAI benchmark',
    'AutoGen benchmark',
    'LangGraph benchmark',
    'Claude Agents SDK',
    'signed receipts',
    'reproducible AI benchmark',
  ],
  authors: [{ name: 'OneNomad LLC' }],
  creator: 'OneNomad LLC',
  publisher: 'OneNomad LLC',
  openGraph: {
    type: 'website',
    siteName: 'przm',
    title: 'przm: vendor-neutral AI reliability benchmarks',
    description:
      'Multi-axis AI reliability leaderboard. Signed, reproducible, adversarial. Apache-2.0.',
    url: 'https://przm.sh',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'przm: vendor-neutral AI reliability benchmarks',
    description:
      'Multi-axis AI reliability leaderboard. Signed, reproducible, adversarial. Apache-2.0.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OneNomad LLC',
  url: 'https://przm.sh',
  sameAs: [
    'https://github.com/OneNomad-LLC',
    'https://onenomad.dev',
  ],
  brand: {
    '@type': 'Brand',
    name: 'przm',
    description:
      'Vendor-neutral, deterministic, signed-receipt AI reliability benchmarks.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
