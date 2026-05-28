'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { createProject } from './actions'

export function CreateProjectForm() {
  const [error, dispatch, isPending] = useActionState(createProject, null)
  const formRef = useRef<HTMLFormElement>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  // Auto-generate slug from name while untouched.
  useEffect(() => {
    if (!slugTouched) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 63),
      )
    }
  }, [name, slugTouched])

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await dispatch(fd)
        if (!error) {
          setName('')
          setSlug('')
          setSlugTouched(false)
        }
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="proj-name"
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Name
        </label>
        <input
          id="proj-name"
          name="name"
          type="text"
          required
          placeholder="e.g. Search API"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm outline-none transition-colors focus:border-[var(--color-bench)]"
          style={{
            background: 'var(--color-bg-raised)',
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="proj-slug"
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Slug
        </label>
        <input
          id="proj-slug"
          name="slug"
          type="text"
          required
          placeholder="e.g. search-api"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          className="rounded-md border px-3 py-1.5 font-mono text-sm outline-none transition-colors focus:border-[var(--color-bench)]"
          style={{
            background: 'var(--color-bg-raised)',
            borderColor: 'var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          borderColor: 'var(--color-bench)',
          color: 'var(--color-bench)',
          background: 'color-mix(in srgb, var(--color-bench) 8%, transparent)',
        }}
      >
        {isPending ? 'Creating…' : 'Create'}
      </button>

      {error ? (
        <p className="text-sm" style={{ color: 'var(--color-red)' }}>
          {error}
        </p>
      ) : null}
    </form>
  )
}
