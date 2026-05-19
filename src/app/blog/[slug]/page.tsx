import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { listPosts, getPost } from '@/lib/blog'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await listPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Not found' }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://przm.sh/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toISOString().slice(0, 10)
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // BlogPosting JSON-LD for search
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@type': 'Organization', name: 'OneNomad LLC' },
    publisher: {
      '@type': 'Organization',
      name: 'OneNomad LLC',
      url: 'https://przm.sh',
    },
    mainEntityOfPage: `https://przm.sh/blog/${post.slug}`,
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl border-x border-[color:var(--color-border-subtle)] pt-14">
        {/* Post header */}
        <section className="px-6 pb-10 pt-16">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="text-xs font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-bench)]"
            >
              ← All posts
            </Link>
            <div className="mt-8 text-[11px] font-medium uppercase tracking-widest text-[color:var(--color-text-muted)]">
              {formatDate(post.publishedAt)}
              {post.author ? ` · ${post.author}` : ''}
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
              {post.title}
            </h1>
          </div>
        </section>

        {/* Post body */}
        <section className="border-t border-[color:var(--color-border-subtle)] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <article>
              <div
                className="prose-bench"
                dangerouslySetInnerHTML={{ __html: post.htmlBody }}
              />
            </article>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
