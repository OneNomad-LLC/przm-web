/**
 * Admin reply email. Wraps Matt's typed reply body in the branded
 * shell so the prospect sees the same look-and-feel as the ack.
 *
 * The plain-text body is Matt's input verbatim; the HTML rendering
 * wraps it in the shell with paragraph breaks + auto-linked URLs.
 */

import { renderEmailShell, html } from './shell'

export interface AdminReplyArgs {
  /** Matt's typed reply (newline-delimited text, possibly empty paragraphs) */
  body: string
  /** From the submission — used for the subject line */
  tier: string
  framework: string
}

export function renderAdminReply({
  body,
  tier,
  framework,
}: AdminReplyArgs): { subject: string; html: string; text: string } {
  const subject = `Re: przm ${tier} cert — ${framework}`

  const bodyHtml = [
    html.fromPlainText(body),
    html.sig('Matt Stvartak', 'founder, przm', 'matt@przm.sh'),
  ].join('\n')

  const htmlOut = renderEmailShell({
    title: subject,
    preheader: firstSentence(body),
    bodyHtml,
  })

  return { subject, html: htmlOut, text: body }
}

/** Use the first sentence of the body as the inbox preview text */
function firstSentence(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/^(.{0,140}?[.!?])(\s|$)/)
  if (match && match[1]) return match[1]
  return trimmed.slice(0, 140)
}
