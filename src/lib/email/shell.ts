/**
 * Email shell — wraps body HTML in a branded, email-safe template.
 *
 * Design rules (because email clients are stuck in 2005):
 *   - Tables for layout (Outlook ignores flex/grid).
 *   - Inline styles only (Gmail strips <style> in some contexts).
 *   - Width capped at 600px.
 *   - Web-safe fonts only — no @import.
 *   - Absolute URLs everywhere.
 *   - Light mode by default; the site is dark but emails-in-dark
 *     surprises users. Accent is the same bench-green so the brand
 *     read still lands.
 *
 * Returns full <!DOCTYPE html>...</html> string ready to pass to
 * Resend as the `html` field. Always send a `text` field too — this
 * shell is only for the HTML alternative.
 */

const ACCENT = '#34C468' // bench green
const TEXT = '#1a1a1a'
const TEXT_SECONDARY = '#525252'
const TEXT_MUTED = '#888888'
const BORDER = '#e6e6e6'
const BG = '#f5f5f7'
const CARD = '#ffffff'

const FONT_BODY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const FONT_MONO = "'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace"

const SITE = 'https://przm.sh'

interface ShellOptions {
  preheader?: string
  bodyHtml: string
  title?: string
}

export function renderEmailShell({
  preheader = '',
  bodyHtml,
  title = 'przm',
}: ShellOptions): string {
  // Preheader: shown in inbox list as preview text. Hidden visually
  // in the email itself. Limit ~100 chars or it overflows preview.
  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT_BODY};color:${TEXT};-webkit-font-smoothing:antialiased;">
${preheaderHtml}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG};padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:${CARD};border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="padding:24px 32px 16px 32px;border-bottom:1px solid ${BORDER};">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align:middle;">
                  <a href="${SITE}" style="text-decoration:none;color:${TEXT};">
                    <span style="display:inline-block;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:12px solid ${ACCENT};margin-right:10px;vertical-align:middle;"></span><span style="font-family:${FONT_MONO};font-size:18px;font-weight:600;letter-spacing:-0.01em;color:${TEXT};vertical-align:middle;">przm</span>
                  </a>
                </td>
                <td align="right" style="vertical-align:middle;font-family:${FONT_MONO};font-size:11px;color:${TEXT_MUTED};letter-spacing:0.02em;">
                  AI RELIABILITY BENCHMARKS
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;font-size:15px;line-height:1.65;color:${TEXT};">
${bodyHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 24px 32px;border-top:1px solid ${BORDER};background:#fafafa;font-size:12px;color:${TEXT_MUTED};line-height:1.6;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td>
                  <strong style="color:${TEXT_SECONDARY};font-weight:600;">przm</strong> &mdash; vendor-neutral AI reliability benchmarks.<br>
                  <a href="${SITE}" style="color:${ACCENT};text-decoration:none;">przm.sh</a> &nbsp;·&nbsp;
                  <a href="${SITE}/methodology" style="color:${ACCENT};text-decoration:none;">methodology</a> &nbsp;·&nbsp;
                  <a href="${SITE}/leaderboard" style="color:${ACCENT};text-decoration:none;">leaderboard</a>
                  <div style="margin-top:10px;color:${TEXT_MUTED};font-size:11px;">made with 🩷 by <a href="https://onenomad.dev" style="color:${TEXT_MUTED};text-decoration:underline;">onenomad</a></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!-- Tagline below card -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;margin-top:12px;">
        <tr>
          <td align="center" style="font-size:11px;color:${TEXT_MUTED};font-family:${FONT_BODY};line-height:1.5;">
            You're receiving this because you contacted us through <a href="${SITE}" style="color:${TEXT_MUTED};text-decoration:underline;">przm.sh</a>.<br>
            Reply directly to this email — it routes back to a human.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/**
 * Markdown-ish helpers for building bodyHtml. Tiny on purpose — we
 * don't need a full renderer, just a few primitives so the route
 * files stay readable.
 */
export const html = {
  h1(text: string): string {
    return `<h1 style="margin:0 0 16px 0;font-size:20px;line-height:1.3;font-weight:600;color:${TEXT};font-family:${FONT_BODY};">${escapeHtml(text)}</h1>`
  },
  h2(text: string): string {
    return `<h2 style="margin:24px 0 12px 0;font-size:15px;line-height:1.3;font-weight:600;color:${TEXT};font-family:${FONT_BODY};">${escapeHtml(text)}</h2>`
  },
  p(content: string): string {
    return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY};">${content}</p>`
  },
  /** Raw paragraph — caller supplies inline HTML (links, bold, etc) */
  pRaw(content: string): string {
    return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY};">${content}</p>`
  },
  ol(items: string[]): string {
    const lis = items
      .map(
        (i) =>
          `<li style="margin-bottom:8px;color:${TEXT_SECONDARY};line-height:1.6;">${i}</li>`,
      )
      .join('')
    return `<ol style="margin:0 0 16px 0;padding-left:24px;color:${TEXT_SECONDARY};font-size:15px;">${lis}</ol>`
  },
  ul(items: string[]): string {
    const lis = items
      .map(
        (i) =>
          `<li style="margin-bottom:8px;color:${TEXT_SECONDARY};line-height:1.6;">${i}</li>`,
      )
      .join('')
    return `<ul style="margin:0 0 16px 0;padding-left:24px;color:${TEXT_SECONDARY};font-size:15px;">${lis}</ul>`
  },
  /** Code-span (inline) */
  code(text: string): string {
    return `<code style="font-family:${FONT_MONO};font-size:13px;background:#f0f0f0;border:1px solid ${BORDER};border-radius:3px;padding:1px 5px;color:${TEXT};">${escapeHtml(text)}</code>`
  },
  link(text: string, url: string): string {
    return `<a href="${escapeAttr(url)}" style="color:${ACCENT};text-decoration:underline;text-underline-offset:2px;">${escapeHtml(text)}</a>`
  },
  /** A labelled key/value row block, e.g. for facts/specs */
  kv(rows: Array<[string, string]>): string {
    const trs = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;font-family:${FONT_MONO};font-size:12px;color:${TEXT_MUTED};white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:6px 0;font-size:14px;color:${TEXT};vertical-align:top;">${v}</td></tr>`,
      )
      .join('')
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;border-collapse:collapse;">${trs}</table>`
  },
  /** Callout box for the per-tier offer details */
  callout(content: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;background:#f6fcf8;border:1px solid #c8e6cf;border-left:3px solid ${ACCENT};border-radius:4px;">
  <tr><td style="padding:14px 18px;font-size:14px;line-height:1.6;color:${TEXT};">${content}</td></tr>
</table>`
  },
  sig(name: string, role: string, email: string): string {
    return `<p style="margin:24px 0 0 0;font-size:14px;line-height:1.6;color:${TEXT_SECONDARY};">— ${escapeHtml(name)}<br><span style="color:${TEXT_MUTED};font-size:13px;">${escapeHtml(role)}</span><br><a href="mailto:${escapeAttr(email)}" style="color:${ACCENT};text-decoration:none;font-size:13px;">${escapeHtml(email)}</a></p>`
  },
  /** Renders a free-form text body (newlines → <br>, blank lines → <p>).
   *  Used by admin reply where Matt types markdown-ish text. */
  fromPlainText(text: string): string {
    const escaped = escapeHtml(text)
    const linked = autoLink(escaped)
    return linked
      .split(/\n\n+/)
      .map(
        (para) =>
          `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${TEXT_SECONDARY};">${para.replace(/\n/g, '<br>')}</p>`,
      )
      .join('')
  },
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/** Auto-link bare http(s) URLs in escaped text */
function autoLink(escapedText: string): string {
  return escapedText.replace(
    /(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]])/g,
    (url) =>
      `<a href="${url}" style="color:${ACCENT};text-decoration:underline;text-underline-offset:2px;">${url}</a>`,
  )
}
