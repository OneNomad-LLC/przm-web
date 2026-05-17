import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'przm — Vendor-neutral AI reliability benchmarks'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1d2021',
          color: '#ebdbb2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'monospace',
        }}
      >
        {/* Top: logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <defs>
              <radialGradient id="og-top" cx="16" cy="4" r="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#34C468" stopOpacity="1" />
                <stop offset="1" stopColor="#34C468" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="og-bl" cx="4" cy="28" r="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#E84040" stopOpacity="1" />
                <stop offset="1" stopColor="#E84040" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="og-br" cx="28" cy="28" r="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FABD2F" stopOpacity="1" />
                <stop offset="1" stopColor="#FABD2F" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M16 4 L28 28 L4 28 Z" fill="#1d2021" />
            <g style={{ mixBlendMode: 'screen' }}>
              <path d="M16 4 L28 28 L4 28 Z" fill="url(#og-top)" />
              <path d="M16 4 L28 28 L4 28 Z" fill="url(#og-bl)" />
              <path d="M16 4 L28 28 L4 28 Z" fill="url(#og-br)" />
            </g>
            <path
              d="M16 4 L28 28 L4 28 Z"
              fill="none"
              stroke="#ebdbb2"
              strokeOpacity="0.2"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.02em' }}>
            przm
          </div>
        </div>

        {/* Middle: tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#E84040' }}>AI reliability</span>, measured.
          </div>
          <div style={{ fontSize: 28, color: '#928374', lineHeight: 1.4 }}>
            Multi-axis benchmarks. Deterministic scoring. Ed25519-signed receipts. Apache-2.0.
          </div>
        </div>

        {/* Bottom: tags */}
        <div style={{ display: 'flex', gap: 18, fontSize: 22, color: '#928374' }}>
          <span style={{ color: '#34C468' }}>●</span>
          <span>convergence</span>
          <span>·</span>
          <span style={{ color: '#E84040' }}>●</span>
          <span>memory</span>
          <span>·</span>
          <span style={{ color: '#FABD2F' }}>●</span>
          <span>code-review (next)</span>
          <span style={{ marginLeft: 'auto', color: '#665c54' }}>przm.sh</span>
        </div>
      </div>
    ),
    size,
  )
}
