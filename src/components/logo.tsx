import { rainbowWedges } from '@/lib/brand/rainbow-wedges'

interface LogoProps {
  size?: number
  /** Optional solid color override. When set, suppresses the rainbow gradient. */
  color?: string
  className?: string
}

/**
 * przm logo: triangle filled with a conic-rainbow sweep around the
 * centroid (approximated via 24 SVG wedge slices clipped to the
 * triangle). Thin cream stroke defines the edges.
 *
 * Path lives in a 32-unit viewBox so the navbar, favicon, OG image,
 * avatar, and banner are all pixel-identical when scaled. Do not
 * change the path or the centroid here without also re-generating
 * public/favicon.svg via scripts/gen-favicon.cjs.
 */
const VIEWBOX = 32
const TRIANGLE_D = 'M16 4 L28 28 L4 28 Z'
const CENTROID_X = 16
const CENTROID_Y = 20 // (4 + 28 + 28) / 3
const WEDGE_RADIUS = 18 // covers the apex (16 units from centroid) with margin
const WEDGES = rainbowWedges(CENTROID_X, CENTROID_Y, WEDGE_RADIUS, 24)

export function Logo({ size = 20, color, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="przm"
      role="img"
    >
      <defs>
        <clipPath id="przm-tri-clip">
          <path d={TRIANGLE_D} />
        </clipPath>
      </defs>
      {color ? (
        <path d={TRIANGLE_D} fill={color} />
      ) : (
        <g clipPath="url(#przm-tri-clip)">
          {WEDGES.map((w, i) => (
            <path key={i} d={w.d} fill={w.color} />
          ))}
        </g>
      )}
      <path
        d={TRIANGLE_D}
        fill="none"
        stroke="#ebdbb2"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
