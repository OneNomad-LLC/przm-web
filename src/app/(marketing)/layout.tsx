/**
 * Marketing route group layout.
 *
 * This group covers the public-facing site: home, leaderboard, blog,
 * methodology, vendor-cert, verify, receipts. No auth required. Pages
 * are server-rendered and fast.
 *
 * The root layout (src/app/layout.tsx) handles fonts, metadata, and
 * the HTML/body shell. This layout is a transparent passthrough.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
