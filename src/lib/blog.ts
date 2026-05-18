/**
 * Blog post loader — reads markdown files from content/blog/*.md, parses
 * frontmatter via gray-matter, returns typed BlogPost objects sorted by
 * publishedAt descending. Slug = filename without .md, unless overridden
 * in frontmatter.
 */

import { readFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  author?: string
  htmlBody: string
  /** Raw markdown for ad-hoc use (RSS, structured data). */
  markdownBody: string
}

const CONTENT_DIR = join(process.cwd(), 'content', 'blog')

export async function listPosts(): Promise<BlogPost[]> {
  if (!existsSync(CONTENT_DIR)) return []
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'))
  const posts = await Promise.all(files.map((f) => loadByFilename(f)))
  return posts
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  // Try slug as filename first, then scan if it doesn't match
  const direct = await loadByFilename(`${slug}.md`)
  if (direct) return direct
  const posts = await listPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

async function loadByFilename(filename: string): Promise<BlogPost | null> {
  const filePath = join(CONTENT_DIR, filename)
  if (!existsSync(filePath)) return null
  const s = await stat(filePath)
  if (!s.isFile()) return null

  const raw = await readFile(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const slugFromName = filename.replace(/\.md$/, '')
  const slug = typeof data.slug === 'string' ? data.slug : slugFromName

  // gray-matter parses unquoted YAML dates as JS Date objects. Accept
  // both shapes and normalize to an ISO date string. Reject only if
  // the field is missing or unparseable.
  const publishedAt = normalizePublishedAt(data.publishedAt)
  if (typeof data.title !== 'string' || publishedAt === null) {
    return null
  }

  const htmlBody = await marked(content, { gfm: true })

  return {
    slug,
    title: data.title,
    description:
      typeof data.description === 'string' ? data.description : '',
    publishedAt,
    author: typeof data.author === 'string' ? data.author : undefined,
    htmlBody,
    markdownBody: content,
  }
}

function normalizePublishedAt(raw: unknown): string | null {
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10) // YYYY-MM-DD
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim()
  }
  return null
}
