/* eslint-disable */
/**
 * One-shot generator for public/favicon.svg.
 *
 * The favicon must be byte-identical (visually) to the navbar Logo
 * component and to the Satori-rendered avatar/banner/og brand mark.
 * To enforce that, all four surfaces consume the same
 * rainbowWedges() helper. This script imports it (via the strip-
 * types Node loader) and emits the static SVG.
 *
 * Re-run after any change to the wedge helper, the centroid, the
 * triangle path, or the wedge count.
 *
 * Usage:
 *   node --experimental-strip-types scripts/gen-favicon.cjs
 */
const fs = require('fs');
const path = require('path');

// Inline copy of the wedge generator since this CJS script can't
// import the TS helper directly without a build step. Keep this in
// sync with src/lib/brand/rainbow-wedges.ts.
const STOPS = [
  [0 / 6, [0xe8, 0x40, 0x40]],
  [1 / 6, [0xf5, 0x95, 0x20]],
  [2 / 6, [0xe8, 0xc8, 0x30]],
  [3 / 6, [0x34, 0xc4, 0x68]],
  [4 / 6, [0x3b, 0x9e, 0xff]],
  [5 / 6, [0x66, 0x55, 0xdd]],
  [6 / 6, [0x99, 0x55, 0xcc]],
];
function lerp(a, b, t) { return a + (b - a) * t; }
function toHex(rgb) {
  return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function colorAt(f) {
  const ff = ((f % 1) + 1) % 1;
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [f1, c1] = STOPS[i];
    const [f2, c2] = STOPS[i + 1];
    if (ff >= f1 && ff <= f2) {
      const t = (ff - f1) / (f2 - f1);
      return toHex([lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]);
    }
  }
  return toHex(STOPS[STOPS.length - 1][1]);
}
function rainbowWedges(cx, cy, radius, count) {
  const wedges = [];
  for (let i = 0; i < count; i++) {
    const fStart = i / count;
    const fEnd = (i + 1) / count;
    const fMid = (i + 0.5) / count;
    const a1 = fStart * 2 * Math.PI - Math.PI / 2;
    const a2 = fEnd * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const x2 = cx + radius * Math.cos(a2);
    const y2 = cy + radius * Math.sin(a2);
    const d = `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;
    wedges.push({ d, color: colorAt(fMid) });
  }
  return wedges;
}

// Must match src/components/logo.tsx constants exactly.
const TRIANGLE_D = 'M16 4 L28 28 L4 28 Z';
const CENTROID_X = 16;
const CENTROID_Y = 20;
const WEDGE_RADIUS = 18;
const COUNT = 24;

const wedges = rainbowWedges(CENTROID_X, CENTROID_Y, WEDGE_RADIUS, COUNT);

const wedgePaths = wedges.map(w => `    <path d="${w.d}" fill="${w.color}"/>`).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <defs>
    <clipPath id="przm-tri">
      <path d="${TRIANGLE_D}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#przm-tri)">
${wedgePaths}
  </g>
  <path d="${TRIANGLE_D}" fill="none" stroke="#ebdbb2" stroke-opacity="0.4" stroke-width="0.5" stroke-linejoin="round"/>
</svg>
`;

const dest = path.join(__dirname, '..', 'public', 'favicon.svg');
fs.writeFileSync(dest, svg, 'utf-8');
console.log(`Wrote ${dest} (${svg.length} bytes, ${COUNT} wedges)`);
