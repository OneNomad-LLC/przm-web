/**
 * Signup acknowledgment email. One render function per tier so the
 * copy can drift naturally — pricing changes, offers change, etc.
 *
 * Returns { subject, html, text } for Resend.
 */

import { renderEmailShell, html } from './shell'

type Tier = 'charter' | 'standard' | 'extended' | 'enterprise'

const TIER_LABEL: Record<Tier, string> = {
  charter: 'Charter',
  standard: 'Standard',
  extended: 'Extended',
  enterprise: 'Enterprise',
}

const TURNAROUND: Record<Tier, string> = {
  charter: 'one business day',
  standard: 'one business day',
  extended: 'same business day',
  enterprise: 'same business day',
}

interface OfferDetail {
  callout: string
  textCallout: string
}

function offerFor(tier: Tier, company: string): OfferDetail {
  switch (tier) {
    case 'charter':
      return {
        callout: `<strong style="color:#1a1a1a;">Charter customer offer:</strong> free signed receipt + leaderboard placement + a charter badge. In exchange, permission to cite ${escapeHtmlInline(company)} by name and a 1–2 sentence quote we can use on launch day.`,
        textCallout: `Charter customers get a free signed receipt + leaderboard placement + a charter badge, in exchange for permission to cite ${company} by name and a 1-2 sentence quote we can use on launch day.`,
      }
    case 'standard':
      return {
        callout: `<strong style="color:#1a1a1a;">Standard certification — $999/release:</strong> one full benchmark run, signed receipt, public leaderboard entry, private findings brief, 5 business day turnaround.`,
        textCallout: `Standard certification is $999/release: one full benchmark run, signed receipt, public leaderboard entry, private findings brief, 5 business day turnaround.`,
      }
    case 'extended':
      return {
        callout: `<strong style="color:#1a1a1a;">Extended certification — $2,499/release:</strong> everything in Standard plus the 20% holdout subset run (so your number reflects generalization, not fixture tuning) and 72-hour priority turnaround.`,
        textCallout: `Extended certification is $2,499/release: everything in Standard plus the 20% holdout subset run (so your number reflects generalization, not fixture tuning) and 72-hour priority turnaround.`,
      }
    case 'enterprise':
      return {
        callout: `<strong style="color:#1a1a1a;">Enterprise certification — $9,999/release:</strong> custom fixture set authored against your domain, private receipt unless you choose to publish, 30-day re-run option after patches.`,
        textCallout: `Enterprise certification is $9,999/release: custom fixture set authored against your domain, private receipt unless you choose to publish, 30-day re-run option after patches.`,
      }
  }
}

export interface SignupAckArgs {
  tier: Tier
  company: string
  framework: string
}

export function renderSignupAck({
  tier,
  company,
  framework,
}: SignupAckArgs): { subject: string; html: string; text: string } {
  const offer = offerFor(tier, company)
  const turnaround = TURNAROUND[tier]
  const tierLabel = TIER_LABEL[tier]
  const intro: Record<Tier, string> = {
    charter: `Got your charter-customer interest from przm.sh — thank you.`,
    standard: `Got your Standard certification request from przm.sh — thank you.`,
    extended: `Got your Extended certification request from przm.sh — thank you.`,
    enterprise: `Got your Enterprise certification inquiry from przm.sh — thank you.`,
  }

  const subject = `przm ${tierLabel} cert — got it, here's what's next`

  // ── HTML body ─────────────────────────────────────────────────────
  const bodyHtml = [
    html.h1(`Got it.`),
    html.pRaw(escapeHtmlInline(intro[tier])),
    html.pRaw(
      `Matt will reach out within <strong style="color:#1a1a1a;">${escapeHtmlInline(turnaround)}</strong> to schedule a 15-minute call. Before that call, three things are useful to know on your end:`,
    ),
    html.ol([
      `Which release of <strong style="color:#1a1a1a;">${escapeHtmlInline(framework)}</strong> you want certified (commit hash or version tag).`,
      `Which LLM your framework will run during the bench — we run your adapter with your model; you provide a sample API key so the run is billed to you and you can audit what was called.`,
      `What "good" looks like to you.`,
    ]),
    html.callout(offer.callout),
    html.h2('Reference'),
    html.kv([
      [
        'methodology',
        html.link(
          'przm.sh/methodology#convergence',
          'https://przm.sh/methodology#convergence',
        ),
      ],
      [
        'public key',
        html.link(
          'github.com/.../convergence-preview.pub',
          'https://github.com/OneNomad-LLC/przm-bench/blob/main/keys/convergence-preview.pub',
        ),
      ],
      [
        'adapter source',
        html.link(
          'github.com/.../multiagent',
          'https://github.com/OneNomad-LLC/przm-bench/tree/main/src/adapters/multiagent',
        ),
      ],
    ]),
    html.pRaw(
      `If anything looks unfair about the adapter we'd run against <strong style="color:#1a1a1a;">${escapeHtmlInline(framework)}</strong>, you can PR our adapter file directly.`,
    ),
    html.sig('Matt Stvartak', 'founder · przm', 'matt@przm.sh'),
  ].join('\n')

  const htmlOut = renderEmailShell({
    title: subject,
    preheader: `Matt will reach out within ${turnaround} to schedule. Three things to think about before the call.`,
    bodyHtml,
  })

  // ── Plain-text body (sent alongside as alternative) ───────────────
  const text = [
    `Hi,`,
    ``,
    intro[tier],
    ``,
    `Here's what happens next: Matt will reach out within ${turnaround} to`,
    `schedule a 15-minute call. Before that call, three things are useful to`,
    `know on your end:`,
    ``,
    `1. Which release of ${framework} you want certified (commit hash or version tag).`,
    `2. Which LLM your framework will run during the bench (we run your`,
    `   adapter with your model; you provide a sample API key so the run is`,
    `   billed to you and you can audit what was called).`,
    `3. What "good" looks like to you.`,
    ``,
    offer.textCallout,
    ``,
    `Methodology spec:  https://przm.sh/methodology#convergence`,
    `Public key:        https://github.com/OneNomad-LLC/przm-bench/blob/main/keys/convergence-preview.pub`,
    `Adapter source:    https://github.com/OneNomad-LLC/przm-bench/tree/main/src/adapters/multiagent`,
    ``,
    `If anything looks unfair about the adapter we'd run against ${framework}, you`,
    `can PR our adapter file directly.`,
    ``,
    `— Matt`,
    `founder · przm`,
    `matt@przm.sh`,
  ].join('\n')

  return { subject, html: htmlOut, text }
}

function escapeHtmlInline(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
