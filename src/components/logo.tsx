interface LogoProps {
  size?: number
  /** Optional solid color override. When set, suppresses the rainbow gradient. */
  color?: string
  className?: string
}

/**
 * przm logo: equilateral triangle suggesting a prism wedge.
 * Rainbow radial gradient from the centroid outward (red core, violet edge)
 * so the mark reads as a literal prism refraction at any size. At small
 * navbar sizes the spectrum compresses into a glowing transition; at larger
 * sizes (favicon, OG image, banner) the distinct ROY G BIV bands separate.
 */
export function Logo({ size = 20, color, className }: LogoProps) {
  // Equilateral triangle points for a size×size bounding box, centered.
  const h = size * (Math.sqrt(3) / 2)
  const cx = size / 2
  const top = (size - h) / 2
  const bottom = top + h
  const points = `${cx},${top} ${size},${bottom} 0,${bottom}`

  // Centroid of an equilateral triangle is 1/3 up from the base.
  const centroidY = top + (2 * h) / 3
  const radius = size * 0.55 // reaches the apex from the centroid

  // Stable ID per render instance prevents collisions when multiple Logos exist on a page.
  const id = `przm-rainbow-${size}-${Math.round(centroidY * 100)}`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {!color && (
        <defs>
          <radialGradient
            id={id}
            cx={cx}
            cy={centroidY}
            r={radius}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E84040" />
            <stop offset="17%" stopColor="#F59520" />
            <stop offset="33%" stopColor="#E8C830" />
            <stop offset="50%" stopColor="#34C468" />
            <stop offset="67%" stopColor="#3B9EFF" />
            <stop offset="83%" stopColor="#6655DD" />
            <stop offset="100%" stopColor="#9955CC" />
          </radialGradient>
        </defs>
      )}
      <polygon points={points} fill={color ?? `url(#${id})`} />
    </svg>
  )
}
