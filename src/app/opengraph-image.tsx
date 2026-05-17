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
          <svg width="56" height="56" viewBox="0 0 32 32">
            <path
              d="M16 6 L26 24 L6 24 Z"
              fill="#34C468"
              stroke="#34C468"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.02em' }}>
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
          <span>code-review (next)</span>
          <span style={{ marginLeft: 'auto', color: '#665c54' }}>przm.sh</span>
        </div>
      </div>
    ),
    size,
  )
}
