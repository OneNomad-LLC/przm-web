# przm-web

The website at [przm.sh](https://przm.sh). Multi-axis AI reliability leaderboard.

This repo owns the user-facing surface: marketing pages, the receipt
ledger, the verify-a-receipt page, and the canonical methodology
specifications under [`content/`](content/).

Reference implementations of the benchmarks specified here live in
[OneNomad-LLC/przm-bench](https://github.com/OneNomad-LLC/przm-bench).

## Stack

- Next.js 15 (App Router, React 19, Server Components)
- TypeScript strict mode
- Tailwind 4
- `marked` for methodology markdown rendering
- Deployed on Vercel

## Develop

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint      # next lint
npm run typecheck # tsc --noEmit
```

## Methodology docs

Per-benchmark specifications live in [`content/`](content/) as plain
markdown. The methodology page at [`/methodology`](https://przm.sh/methodology)
reads them at build time and renders them under per-benchmark sections
with anchored URLs.

To add a new benchmark methodology:

1. Drop the spec at `content/methodology-<slug>.md`.
2. Add an entry to `BENCHMARK_DOCS` in
   `src/app/methodology/page.tsx` (slug + title + status + 1-line
   description).
3. The TOC, section, and "view on GitHub" link are derived from that
   entry.

## Why specs live here, not in `przm-bench`

Methodology specifications are product artifacts, not engineering
artifacts. The website is where users actually encounter them.
`przm-bench` is the reference implementation of these specs. When the
spec changes, it changes here (as a docs PR, reviewed for clarity),
and the bench harness then catches up.

This matches how every working benchmark organization operates: IETF
RFCs, MLPerf, SPEC, ImageNet. The spec is the product. The runner
implements the spec.

## License

Apache-2.0.
