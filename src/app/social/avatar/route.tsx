import { ImageResponse } from 'next/og'
import { rainbowWedges } from '@/lib/brand/rainbow-wedges'

export const runtime = 'edge'

// X avatar: 400x400, but X applies a circular crop. The visible
// region is the inscribed circle (~314px diameter), so anything in
// the corners is clipped. Keep the meaningful brand mark centered
// and well inside the safe zone.
export async function GET() {
  // Triangle in 32-unit viewBox, centroid at (16, 20).
  const wedges = rainbowWedges(16, 20, 32, 24)

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
            <clipPath id="av-tri">
              <path d="M16 4 L28 28 L4 28 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#av-tri)">
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
      </div>
    ),
    { width: 400, height: 400 },
  )
}
