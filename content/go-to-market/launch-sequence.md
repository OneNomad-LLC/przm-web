# przm v0.1 — 14-day launch sequence

Day 0 = the day the first signed receipt is live on przm.sh.

Everything in this sequence assumes that artifact exists and builds outward. The sequence is designed to compound: each day's output becomes input for the next. Do not collapse it. Do not do everything on day 1.

---

## Day -3 to Day -1 (pre-launch prep)

Before day 0, three things must be true:
1. The benchmark has been run against the baseline adapter. At least one signed receipt exists at `results/published/`.
2. `przm.sh` has a working leaderboard page (even if only one row).
3. `keys/convergence-preview.pub` is committed and the verify command works end-to-end.

If any of those three fail, do not start the sequence. Fix and restart.

---

## Day 0 — Receipts are live; quiet day

**Public-facing activity:** none. This is on purpose.

**Internal work:**
- Run the full convergence bench against the baseline adapter one more time. Verify identical receipt hash.
- Write the blog post for day 4 in draft. Single chart, methodology link, receipt-verify command. Aim for ~1500 words.
- Write the HN submission title and the X launch thread, also as drafts.

**Why no public posts:** Day 0 is QA, not launch.

---

## Day 1 (Tuesday recommended) — Charter outreach round 1

**Public-facing activity:** none.

**Outreach:** Send 5 charter-customer emails. Targets in priority order:
1. CrewAI (João Moura)
2. Mem0
3. Letta
4. Crew Enterprise
5. Zep

Hold the other 10 targets until day 8.

---

## Day 2 — Framework maintainer outreach (Play 1, all 5)

**Outreach:** Send all 5 framework-maintainer emails. One per recipient.

**Other work:**
- Finalize the blog post draft.
- Draft the GitHub Discussions posts for day 5.

---

## Day 3 — Newsletter pitches (Play 3, the 3 viable ones)

**Outreach:** Send 3 emails:
1. Nathan Lambert (Interconnects)
2. AI Tidbits
3. Pragmatic Engineer (pitch form)

Do NOT email swyx. Do NOT pitch Simon Willison directly.

**Other work:**
- Push the blog post to staging.
- Pre-schedule the launch X thread for day 4 morning.

---

## Day 4 (Thursday recommended) — BLOG POST + X THREAD

**0900 ET:**
- Publish the blog post on przm.sh under `/blog/`.
- Post the X launch thread.
- Update the homepage hero.

**Throughout the day:**
- Reply to every X reply within 30 minutes.
- No HN submission today. That comes day 8.

---

## Day 5 — GitHub Discussions on all 5 framework repos

**Public-facing activity:**
- Post 5 GitHub Discussions, one per framework repo.
- Each post: ~150 words, links to the published receipt, asks for adapter review, links to methodology.

---

## Day 6-7 — Consolidation

**Work:**
- Reach out to any framework maintainers who replied substantively; merge their PRs; re-sign receipts.
- Engage with any newsletter writer who responded.
- Update the blog post if any methodology improvement landed.

---

## Day 8 (Tuesday of week 2) — HN SUBMISSION + SECOND X SURGE

**0800-0900 ET:**

- Submit to Hacker News. Title: "Show HN: I benchmarked how fast multi-agent AI frameworks fold to a confidently wrong agent."
- HN body: 2 sentences on what + why, headline finding (one number), link to blog post, link to repo, line about Apache-2.0 + verify-receipt command.

**Throughout the day:**
- Reply to every HN comment within 30 minutes. Stay polite when challenged on methodology.
- Re-post the X launch thread as a "Now on HN" quote tweet.
- Monitor Reddit r/LocalLLaMA. If HN hits, someone will cross-post. Do NOT cross-post ourselves.

**Why we waited:**
- Tuesday optimization (highest HN front-page conversion).
- 4 days of organic chatter; the HN submission lands into context.
- Maintainer feedback integrated.

---

## Day 9 — Inbound triage day

**Work:**
- Triage every inbound DM, email, and PR from the HN surge.
- For each charter-customer inbound: schedule a 15-min call within 3 business days.
- Write a short "Day 1 of HN launch — what we learned" Twitter reply.

---

## Day 10 — LinkedIn post + second-tier outreach

**Public-facing:**
- LinkedIn launch post (different format from X thread).

**Outreach:**
- Send the second batch of charter-customer outreach: the other 10.

---

## Day 11 — Maintainer follow-up + receipt re-runs

**Work:**
- Follow up with any framework maintainer who has NOT replied yet. ONE follow-up per recipient.
- For any maintainer who responded: send them the updated receipt; ask if they want their logo on the leaderboard's "thanks to" section.
- Re-run the benchmark if any methodology fix landed.

---

## Day 12 — First-charter-customer close push

**Work:**
- For any charter-customer prospect from rounds 1 or 2 who has taken a call: send the close email. The charter offer expires day 14.
- For any prospect who has gone cold: ONE final follow-up.

**Public-facing:**
- One X post: "[N] charter customers closed; [N] still open. After Friday the charter tier closes."

---

## Day 13 — Newsletter cycle check + content prep

**Work:**
- Check whether any newsletter writer published. If Lambert or AI Tidbits covered us, reply + quote-RT + update homepage.
- Begin drafting the v0.2 launch plan publicly.
- Internal post-mortem document.

**Public-facing:**
- One LinkedIn post recapping a single concrete learning.

---

## Day 14 — Charter close + start of v0.2 phase

**Work:**
- Finalize charter customer list. Move closed charter customers to the leaderboard "first 3-5 charters" callout.
- Anyone not closed by EOD becomes a $999 prospect for week 3.
- Send post-charter outreach to second-batch targets with the revised pricing message.

**Public-facing:**
- One X thread: "Two weeks of przm v0.1. Here's what happened." Honest retrospective.

---

## What gets measured at day 14

| Metric | Target (realistic) | Target (good) | Target (exceptional) |
|---|---|---|---|
| Charter customers closed | 2 | 4 | 5 (cap hit) |
| HN front page (top 30) duration | 2-4 hours | 4-12 hours | Top 5 for 4+ hours |
| X launch thread impressions | 25K | 100K | 250K+ |
| Newsletter coverage | 0 | 1 | 2+ |
| Framework maintainers engaged substantively | 1 | 2 | 3+ |
| GitHub repo stars | 100 | 500 | 2000+ |
| First $999 invoice sent | end of day 14 | day 12 | day 10 |
| Inbound from VCs / acquirers | 0 (expected) | 1-2 | 5+ |

---

## What happens if days 4-8 flame out

- **No HN front page, no newsletter pickup, no framework maintainer engagement:** the methodology is good but the positioning didn't hit. Pivot the headline message; re-launch in week 3 with the v0.2 framework numbers.
- **HN front page, but no charter customers close:** the message works for engineers but the buyer is in a different segment. Re-survey what HN commenters do for work.
- **Charter customers close but no HN, no newsletter, no amplification:** the product-market fit is real but the distribution failed. Double down on outreach, shelve newsletter pitches, plan v0.2 differently.
- **Nothing closes, nothing lands:** the wedge may be wrong. Re-evaluate. Do NOT spend a third week pushing harder.

The 64-day clock is non-negotiable.
