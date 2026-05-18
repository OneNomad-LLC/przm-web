import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// X header / banner: 1500×500 recommended. On mobile, the top and
// bottom ~20% are clipped by avatar overlay + nav UI. Keep the
// brand mark + tagline in the middle ~60% (y=100..400).
//
// Satori notes: avoid `position: absolute` + multi-linear-gradient
// backgrounds — they fail silently and return an empty PNG. Stick
// to flex with explicit width/height children.
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
          justifyContent: 'space-between',
          padding: '0 96px',
          fontFamily: 'monospace',
        }}
      >
        {/* Left: triangle + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <svg width="180" height="180" viewBox="0 0 32 32">
            <defs>
              <radialGradient id="bn-rainbow" cx="16" cy="20" r="18" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#E84040" />
                <stop offset="0.17" stopColor="#F59520" />
                <stop offset="0.33" stopColor="#E8C830" />
                <stop offset="0.5" stopColor="#34C468" />
                <stop offset="0.67" stopColor="#3B9EFF" />
                <stop offset="0.83" stopColor="#6655DD" />
                <stop offset="1" stopColor="#9955CC" />
              </radialGradient>
            </defs>
            <path d="M16 4 L28 28 L4 28 Z" fill="url(#bn-rainbow)" />
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
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
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1.35,
            }}
          >
            <span>same model, different framework</span>
            <span>difference in collapse rate</span>
          </div>
        </div>
      </div>
    ),
    { width: 1500, height: 500 },
  )
}
