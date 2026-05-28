/**
 * Magic-link sign-in email.
 *
 * Sent by better-auth's magicLink plugin via the sendMagicLink hook
 * in src/lib/auth.ts. The link is single-use and expires in 10 minutes.
 */

import { Resend } from 'resend'
import { renderEmailShell, html } from './shell'

let _resend: Resend | null = null

function getResend(): Resend {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY must be set')
  }
  _resend = new Resend(key)
  return _resend
}

export interface SendMagicLinkArgs {
  to: string
  magicUrl: string
}

export async function sendMagicLink({ to, magicUrl }: SendMagicLinkArgs): Promise<void> {
  const subject = 'Your przm sign-in link'

  const bodyHtml = [
    html.h1('Sign in to przm'),
    html.p('Click the button below to sign in. The link expires in 10 minutes and can only be used once.'),
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td>
      <a href="${escapeAttr(magicUrl)}"
         style="display:inline-block;background:#34C468;color:#1d2021;font-weight:600;font-size:15px;text-decoration:none;padding:12px 28px;border-radius:6px;letter-spacing:-0.01em;">
        Sign in to przm →
      </a>
    </td>
  </tr>
</table>`,
    html.p('If you didn\'t request this link, you can safely ignore this email.'),
    `<p style="margin:16px 0 0 0;font-size:12px;color:#888;line-height:1.5;">Or copy and paste this URL into your browser:<br><code style="font-family:monospace;font-size:11px;word-break:break-all;">${escapeHtml(magicUrl)}</code></p>`,
  ].join('\n')

  const bodyText = [
    'Sign in to przm',
    '',
    'Click the link below to sign in. It expires in 10 minutes and is single-use.',
    '',
    magicUrl,
    '',
    `If you didn't request this, ignore this email.`,
  ].join('\n')

  const htmlOut = renderEmailShell({
    title: subject,
    preheader: 'Your single-use sign-in link for przm. Expires in 10 minutes.',
    bodyHtml,
  })

  await getResend().emails.send({
    from: 'przm <noreply@przm.sh>',
    to,
    subject,
    html: htmlOut,
    text: bodyText,
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
