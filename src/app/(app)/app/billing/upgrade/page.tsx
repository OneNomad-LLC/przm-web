/**
 * Upgrade page — /app/billing/upgrade
 *
 * Tier picker. Clicking a plan triggers a Server Action that creates
 * a Stripe Checkout session and redirects the browser to Stripe.
 *
 * Client Component: needs useState for seat count inputs + interval toggle.
 */

'use client'

import { useState, useTransition } from 'react'
import { checkoutSolo, checkoutTeam, checkoutBusiness, checkoutPilot, checkoutSelfHostedDepartmental } from '../actions'

type Interval = 'month' | 'year'

interface PlanCardProps {
  name: string
  description: string
  monthlyPrice: string
  annualPrice?: string
  trial?: string
  highlight?: boolean
  minSeats?: number
  onSubscribe: (seats: number, interval: Interval) => Promise<void>
}

function PlanCard({
  name,
  description,
  monthlyPrice,
  annualPrice,
  trial,
  highlight,
  minSeats = 1,
  onSubscribe,
}: PlanCardProps) {
  const [seats, setSeats] = useState(minSeats)
  const [interval, setInterval] = useState<Interval>('month')
  const [pending, startTransition] = useTransition()

  return (
    <div
      className="flex flex-col rounded-xl border p-5"
      style={{
        borderColor: highlight ? 'var(--color-bench)' : 'var(--color-border-default)',
        background: highlight
          ? 'color-mix(in srgb, var(--color-bench) 5%, var(--color-bg-surface))'
          : 'var(--color-bg-surface)',
      }}
    >
      {highlight ? (
        <span
          className="mb-3 w-fit rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
          style={{ background: 'var(--color-bench)', color: 'var(--color-bg-base)' }}
        >
          Most popular
        </span>
      ) : null}

      <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {name}
      </h2>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {description}
      </p>

      {/* Interval toggle */}
      {annualPrice ? (
        <div className="mt-4 flex items-center gap-2">
          {(['month', 'year'] as Interval[]).map((iv) => (
            <button
              key={iv}
              type="button"
              onClick={() => setInterval(iv)}
              className="rounded-md border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                borderColor: interval === iv ? 'var(--color-bench)' : 'var(--color-border-default)',
                color: interval === iv ? 'var(--color-bench)' : 'var(--color-text-muted)',
                background:
                  interval === iv
                    ? 'color-mix(in srgb, var(--color-bench) 10%, transparent)'
                    : undefined,
              }}
            >
              {iv === 'month' ? 'Monthly' : 'Annual (2 mo. free)'}
            </button>
          ))}
        </div>
      ) : null}

      {/* Price display */}
      <div className="mt-4">
        <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {interval === 'year' && annualPrice ? annualPrice : monthlyPrice}
        </span>
        <span className="ml-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {interval === 'year' ? '/seat/yr' : '/seat/mo'}
        </span>
      </div>

      {trial ? (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-bench)' }}>
          {trial}
        </p>
      ) : null}

      {/* Seat selector */}
      {minSeats > 1 && (
        <div className="mt-4 flex items-center gap-2">
          <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Seats
          </label>
          <input
            type="number"
            min={minSeats}
            value={seats}
            onChange={(e) => setSeats(Math.max(minSeats, Number(e.target.value)))}
            className="w-20 rounded-md border px-2 py-1 text-sm outline-none"
            style={{
              background: 'var(--color-bg-raised)',
              borderColor: 'var(--color-border-default)',
              color: 'var(--color-text-primary)',
            }}
          />
          <span className="text-xs" style={{ color: 'var(--color-text-disabled)' }}>
            (min {minSeats})
          </span>
        </div>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => onSubscribe(seats, interval))}
        className="mt-5 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          borderColor: highlight ? 'var(--color-bench)' : 'var(--color-border-default)',
          color: highlight ? 'var(--color-bench)' : 'var(--color-text-secondary)',
          background: highlight
            ? 'color-mix(in srgb, var(--color-bench) 10%, transparent)'
            : undefined,
        }}
      >
        {pending ? 'Redirecting…' : 'Subscribe'}
      </button>
    </div>
  )
}

export default function UpgradePage() {
  const [pilotPending, startPilot] = useTransition()
  const [deptPending, startDept] = useTransition()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Billing · Upgrade
        </p>
        <h1
          className="mt-2 text-3xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Choose a plan.
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          All plans include full MCP access, audit logs, and self-service billing. Annual plans
          include 2 months free.
        </p>
      </div>

      {/* Cloud plans grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <PlanCard
          name="Solo"
          description="For individual practitioners. One seat, full access."
          monthlyPrice="$19"
          annualPrice="$190"
          trial="14-day free trial — card required"
          minSeats={1}
          onSubscribe={async (_, interval) => { await checkoutSolo(interval) }}
        />
        <PlanCard
          name="Team"
          description="For engineering teams. 5-seat minimum, shared audit log."
          monthlyPrice="$25"
          annualPrice="$250"
          trial="30-day free trial — card required"
          highlight
          minSeats={5}
          onSubscribe={async (seats, interval) => { await checkoutTeam(interval, seats) }}
        />
        <PlanCard
          name="Business"
          description="For organizations. 25-seat minimum, SSO, SCIM provisioning."
          monthlyPrice="$59"
          annualPrice="$590"
          minSeats={25}
          onSubscribe={async (seats, interval) => { await checkoutBusiness(interval, seats) }}
        />
      </div>

      {/* Pilot SKU */}
      <div className="mt-6">
        <div
          className="rounded-xl border p-5"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Business Pilot
              </h2>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                10 seats · 90 days · $2,070 one-time. Converts to Business Annual with a{' '}
                <span style={{ color: 'var(--color-bench)' }}>$2,070 credit</span> applied.
              </p>
            </div>
            <button
              type="button"
              disabled={pilotPending}
              onClick={() => startPilot(async () => { await checkoutPilot() })}
              className="shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {pilotPending ? 'Redirecting…' : 'Start Pilot — $2,070'}
            </button>
          </div>
        </div>
      </div>

      {/* Self-Hosted */}
      <div className="mt-4">
        <div
          className="rounded-xl border p-5"
          style={{
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-surface)',
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Self-Hosted Departmental
              </h2>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                $25K/yr flat. Your infrastructure, your data. Division ($60K) and Enterprise
                ($120K) available — contact us.
              </p>
            </div>
            <button
              type="button"
              disabled={deptPending}
              onClick={() => startDept(async () => { await checkoutSelfHostedDepartmental() })}
              className="shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {deptPending ? 'Redirecting…' : 'Subscribe — $25K/yr'}
            </button>
          </div>
        </div>
      </div>

      {/* Division / Enterprise CTA */}
      <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-disabled)' }}>
        Self-Hosted Division ($60K) or Enterprise ($120K with ramp)?{' '}
        <a
          href="mailto:sales@przm.sh"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}
        >
          Contact sales.
        </a>
      </p>
    </div>
  )
}
