import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { listPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | przm',
  description:
    'Product updates, benchmark findings, methodology notes, and platform launches from the przm team.',
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
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Header */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              Blog
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Notes.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
              Findings, methodology updates, launch notes. No marketing copy. If we get a number
              wrong, we issue a new receipt and link the correction.
            </p>
          </div>
        </section>

        {/* Post list */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            {posts.length === 0 ? (
              <p className="text-base text-[color:var(--color-text-muted)]">
                No posts yet. First one drops with v0.1.
              </p>
            ) : (
              <ul className="flex flex-col gap-5">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block rounded-xl border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-surface)]/40 p-6 transition-colors hover:border-[color:var(--color-bench)]/40 hover:bg-[color:var(--color-bg-surface)]/60"
                    >
                      <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
                        {formatDate(post.publishedAt)}
                        {post.author ? ` · ${post.author}` : ''}
                      </div>
                      <h2 className="mb-2 text-xl font-semibold text-[color:var(--color-text-primary)] transition-colors group-hover:text-[color:var(--color-bench)]">
                        {post.title}
                      </h2>
                      {post.description ? (
                        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                          {post.description}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
