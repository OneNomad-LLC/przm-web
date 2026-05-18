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
            <radialGradient id="av-rainbow" cx="16" cy="20" r="18" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#E84040" />
              <stop offset="0.17" stopColor="#F59520" />
              <stop offset="0.33" stopColor="#E8C830" />
              <stop offset="0.5" stopColor="#34C468" />
              <stop offset="0.67" stopColor="#3B9EFF" />
              <stop offset="0.83" stopColor="#6655DD" />
              <stop offset="1" stopColor="#9955CC" />
            </radialGradient>
          </defs>
          <path d="M16 4 L28 28 L4 28 Z" fill="url(#av-rainbow)" />
        </svg>
      </div>
    ),
    { width: 400, height: 400 },
  )
}
