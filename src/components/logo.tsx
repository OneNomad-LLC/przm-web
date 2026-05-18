interface LogoProps {
  size?: number
  /** Optional solid color override. When set, suppresses the rainbow gradient. */
  color?: string
  className?: string
}

/**
 * przm logo: equilateral triangle filled with a conic-gradient
 * rainbow (color-wheel sweep, ROY G BIV around the center). Uses
 * CSS conic-gradient inside a clipped div rather than SVG because
 * SVG has no native conic gradient primitive. Browser support for
 * conic-gradient is 95%+ (Chrome 69, Safari 12.1, Firefox 83).
 *
 * Static images (favicon, OG, avatar, banner) use a 24-wedge SVG
 * approximation for the same look in raster contexts.
 */
export function Logo({ size = 20, color, className }: LogoProps) {
  // Equilateral triangle clip-path expressed in percentages so it
  // scales with the box. Centroid is at 50%, 66.7%.
  const clipPath = 'polygon(50% 6%, 100% 92%, 0% 92%)'

  return (
    <div
      role="img"
      aria-label="przm"
      className={className}
      style={{
        width: size,
        height: size,
        clipPath,
        WebkitClipPath: clipPath,
        background: color
          ? color
          : 'conic-gradient(from 0deg at 50% 66.7%, #E84040, #F59520, #E8C830, #34C468, #3B9EFF, #6655DD, #9955CC, #E84040)',
      }}
    />
  )
}
