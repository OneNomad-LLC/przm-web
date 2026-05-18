import { ImageResponse } from 'next/og'
import { rainbowWedges } from '@/lib/brand/rainbow-wedges'

export const runtime = 'edge'
export const alt = 'przm: vendor-neutral AI reliability benchmarks'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Satori notes (learned the hard way on /social/banner): keep the
// layout flat. Avoid combining position:absolute, multi-gradient
// backgroundImage, justifyContent:space-between with deeply nested
// flex children, or `inset:0` shorthand. They all fail silently and
// return a 0-byte PNG with HTTP 200.
export default async function Image() {
  const wedges = rainbowWedges(16, 20, 32, 24)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1d2021',
          color: '#ebdbb2',
          display: 'flex',
          alignItems: 'center',
          padding: '0 80px',
          fontFamily: 'monospace',
        }}
      >
        {/* Brand mark + wordmark on the left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <svg width="160" height="160" viewBox="0 0 32 32">
            <defs>
              <clipPath id="og-tri">
                <path d="M16 4 L28 28 L4 28 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#og-tri)">
              {wedges.map((w, i) => (
                <path key={i} d={w.d} fill={w.color} />
              ))}
            </g>
            <path
              d="M16 4 L28 28 L4 28 Z"
              fill="none"
              stroke="#ebdbb2"
              strokeOpacity="0.4"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 128,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: '#ebdbb2',
              }}
            >
              przm
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 28,
                color: '#928374',
                letterSpacing: '0.01em',
              }}
            >
              vendor-neutral AI reliability benchmarks
            </div>
            <div
              style={{
                marginTop: 32,
                fontSize: 22,
                color: '#a89984',
                lineHeight: 1.4,
                maxWidth: 720,
              }}
            >
              Signed receipts. No LLM judge.
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 22,
                color: '#a89984',
                lineHeight: 1.4,
                maxWidth: 720,
              }}
            >
              Multi-agent convergence. AI memory recall. Apache 2.0.
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 18,
                color: '#665c54',
              }}
            >
              przm.sh
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
