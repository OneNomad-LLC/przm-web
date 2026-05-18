/**
 * Conic-gradient approximation via SVG wedges. SVG has no native
 * conic-gradient primitive (CSS does, but Satori doesn't render
 * CSS conic-gradient). So for any non-DOM context (favicon, OG
 * image, social avatar, social banner) we generate N solid-color
 * pie slices radiating from a center point. At N=24 the steps
 * blend smoothly enough to read as a continuous spectrum.
 *
 * Colors are ROY G BIV looped (red at 0 degrees and 360 so the
 * sweep is seamless).
 */

const STOPS: Array<[number, [number, number, number]]> = [
  [0 / 6, [0xe8, 0x40, 0x40]], // red
  [1 / 6, [0xf5, 0x95, 0x20]], // orange
  [2 / 6, [0xe8, 0xc8, 0x30]], // yellow
  [3 / 6, [0x34, 0xc4, 0x68]], // green
  [4 / 6, [0x3b, 0x9e, 0xff]], // blue
  [5 / 6, [0x66, 0x55, 0xdd]], // indigo
  [6 / 6, [0x99, 0x55, 0xcc]], // violet (wraps back toward red at 360)
]

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function toHex(rgb: [number, number, number]): string {
  return (
    '#' +
    rgb
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  )
}

function colorAt(f: number): string {
  // Wrap [0, 1] so the gradient is seamless across the loop point.
  const ff = ((f % 1) + 1) % 1
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [f1, c1] = STOPS[i]!
    const [f2, c2] = STOPS[i + 1]!
    if (ff >= f1 && ff <= f2) {
      const t = (ff - f1) / (f2 - f1)
      return toHex([lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)])
    }
  }
  return toHex(STOPS[STOPS.length - 1]![1])
}

export interface RainbowWedge {
  d: string
  color: string
}

/**
 * Generate N pie-slice wedge paths centered on (cx, cy) with the
 * given outer radius. The first wedge starts at 12 o'clock (top of
 * the circle), sweeping clockwise.
 */
export function rainbowWedges(
  cx: number,
  cy: number,
  radius: number,
  count = 24,
): RainbowWedge[] {
  const wedges: RainbowWedge[] = []
  for (let i = 0; i < count; i++) {
    const fStart = i / count
    const fEnd = (i + 1) / count
    const fMid = (i + 0.5) / count
    // Start at -90 degrees so the gradient starts at 12 o'clock.
    const a1 = fStart * 2 * Math.PI - Math.PI / 2
    const a2 = fEnd * 2 * Math.PI - Math.PI / 2
    const x1 = cx + radius * Math.cos(a1)
    const y1 = cy + radius * Math.sin(a1)
    const x2 = cx + radius * Math.cos(a2)
    const y2 = cy + radius * Math.sin(a2)
    const d = `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`
    wedges.push({ d, color: colorAt(fMid) })
  }
  return wedges
}
