import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const TEMPLATES = [
  { slug: 'signup-ack-charter', label: 'Signup ack — Charter (free)' },
  { slug: 'signup-ack-standard', label: 'Signup ack — Standard ($999)' },
  { slug: 'signup-ack-extended', label: 'Signup ack — Extended ($2,499)' },
  { slug: 'signup-ack-enterprise', label: 'Signup ack — Enterprise ($9,999)' },
  { slug: 'admin-reply', label: 'Admin reply — sample' },
] as const

export default function EmailPreviewIndex() {
  if (process.env['NODE_ENV'] === 'production') notFound()
  return (
    <main style={{ padding: '48px 32px', maxWidth: 720, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily:
            "'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace",
          fontSize: 24,
          marginBottom: 12,
        }}
      >
        Email previews
      </h1>
      <p style={{ color: '#928374', marginBottom: 32 }}>
        Dev-only. Click a template to view what the recipient sees. Use the
        iframe in this page for a true email-client-style render (constrained
        width, padded background).
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {TEMPLATES.map((t) => (
          <li key={t.slug} style={{ marginBottom: 8 }}>
            <Link
              href={`/dev/email-preview/${t.slug}`}
              style={{ color: '#34C468', textDecoration: 'underline' }}
            >
              {t.label}
            </Link>
            <span
              style={{
                color: '#928374',
                fontFamily:
                  "'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace",
                fontSize: 12,
                marginLeft: 12,
              }}
            >
              /dev/email-preview/{t.slug}
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}
