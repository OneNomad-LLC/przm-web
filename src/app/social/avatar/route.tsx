import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// X avatar: 400x400, but X applies a circular crop. The visible
// region is the inscribed circle (~314px diameter), so anything in
// the corners is clipped. Keep the meaningful brand mark centered
// and well inside the safe zone.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1d2021',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
        }}
      >
        <svg width="280" height="280" viewBox="0 0 32 32">
          <defs>
            <radialGradient id="av-top" cx="16" cy="4" r="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#34C468" stopOpacity="1" />
              <stop offset="1" stopColor="#34C468" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="av-bl" cx="4" cy="28" r="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#E84040" stopOpacity="1" />
              <stop offset="1" stopColor="#E84040" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="av-br" cx="28" cy="28" r="24" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FABD2F" stopOpacity="1" />
              <stop offset="1" stopColor="#FABD2F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M16 4 L28 28 L4 28 Z" fill="#1d2021" />
          <g style={{ mixBlendMode: 'screen' }}>
            <path d="M16 4 L28 28 L4 28 Z" fill="url(#av-top)" />
            <path d="M16 4 L28 28 L4 28 Z" fill="url(#av-bl)" />
            <path d="M16 4 L28 28 L4 28 Z" fill="url(#av-br)" />
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
      </div>
    ),
    { width: 400, height: 400 },
  )
}
