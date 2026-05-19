import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { listPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | przm',
  description:
    'Findings, methodology updates, and launch notes from the przm AI reliability leaderboard.',
  alternates: { canonical: '/blog' },
}

function formatDate(iso: string): string {
  // Accept either YYYY-MM-DD or ISO timestamps; render YYYY-MM-DD.
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toISOString().slice(0, 10)
}

export default async function BlogIndexPage() {
  const posts = await listPosts()
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pb-20 pt-20">
        <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
            // blog
          </div>
          <h1 className="font-mono text-3xl font-semibold leading-tight tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            Notes
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            Findings, methodology updates, launch notes. No marketing copy. If
            we get a number wrong, we issue a new receipt and link the
            correction.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-[color:var(--color-text-muted)]">
            // no posts yet. First one drops with v0.1.
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6 transition-colors hover:border-[color:var(--color-bench)]"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-muted)]">
                    {formatDate(post.publishedAt)}
                    {post.author ? ` · ${post.author}` : ''}
                  </div>
                  <h2 className="mb-2 font-mono text-lg font-semibold text-[color:var(--color-text-primary)] transition-colors group-hover:text-[color:var(--color-bench)]">
                    {post.title}
                  </h2>
                  {post.description ? (
                    <p className="font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                      {post.description}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
        </div>
      </main>
      <Footer />
    </>
  )
}
