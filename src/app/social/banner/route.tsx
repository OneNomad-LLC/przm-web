import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// X header / banner: 1500×500 recommended. On mobile, the top and
// bottom ~20% are clipped by avatar overlay + nav UI. Keep the
// brand mark + tagline in the middle ~60% (y=100..400).
export async function GET() {
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
          padding: '0 96px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Subtle grid (very low opacity) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(#ebdbb2 1px, transparent 1px), linear-gradient(90deg, #ebdbb2 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Left: triangle + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, zIndex: 1 }}>
          <svg width="180" height="180" viewBox="0 0 32 32">
            <defs>
              <radialGradient id="bn-top" cx="16" cy="4" r="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#34C468" stopOpacity="1" />
                <stop offset="1" stopColor="#34C468" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bn-bl" cx="4" cy="28" r="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#E84040" stopOpacity="1" />
                <stop offset="1" stopColor="#E84040" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bn-br" cx="28" cy="28" r="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FABD2F" stopOpacity="1" />
                <stop offset="1" stopColor="#FABD2F" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M16 4 L28 28 L4 28 Z" fill="#1d2021" />
            <g style={{ mixBlendMode: 'screen' }}>
              <path d="M16 4 L28 28 L4 28 Z" fill="url(#bn-top)" />
              <path d="M16 4 L28 28 L4 28 Z" fill="url(#bn-bl)" />
              <path d="M16 4 L28 28 L4 28 Z" fill="url(#bn-br)" />
            </g>
            <path
              d="M16 4 L28 28 L4 28 Z"
              fill="none"
              stroke="#ebdbb2"
              strokeOpacity="0.25"
              strokeWidth="0.4"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 120,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: '#ebdbb2',
              }}
            >
              przm
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                color: '#928374',
                letterSpacing: '0.02em',
              }}
            >
              vendor-neutral AI reliability benchmarks
            </div>
          </div>
        </div>

        {/* Right: headline finding */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: '#665c54',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            v0.1 finding
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1,
              color: '#34C468',
              letterSpacing: '-0.02em',
            }}
          >
            7.3×
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 18,
              color: '#928374',
              textAlign: 'right',
              maxWidth: 360,
              lineHeight: 1.35,
            }}
          >
            same model, different framework
            <br />
            difference in collapse rate
          </div>
        </div>
      </div>
    ),
    { width: 1500, height: 500 },
  )
}
