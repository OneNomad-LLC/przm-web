# przm channel strategy — where attention comes from, in what order

Six channels considered. Three get serious investment, three get
opportunistic posting only. Solo operator with a 64-day clock cannot
run six channels well; pretending otherwise is how launches die.

---

## Tier 1 — the three channels that matter

### 1. Hacker News (single highest-leverage launch surface)

**Why it's tier 1:** The audience overlaps all three ICPs. Front-page
hit drives more vendor inbound in 48 hours than any other channel
delivers in a month. The methodology and "signed receipt" frame is
exactly what HN respects — vendor-neutral, deterministic, open
source, Apache-2.0, reproducible.

**Why it could miss:** HN is fickle. "We benchmarked AI frameworks"
posts hit and miss based on title, time of day, and whether
something more interesting drops the same hour. There is no second
chance — you submit once and either it catches or it doesn't.

**Content that goes here:**

- **Launch Show HN post.** Title to test (pick one, do not A/B):
  - "Show HN: I benchmarked how fast multi-agent AI frameworks fold to a confidently wrong agent"
  - "Show HN: Multi-agent convergence benchmark with signed receipts"
  - "Show HN: przm — vendor-neutral AI reliability leaderboard"
  - Recommendation: option 1. It's specific, names the failure mode, implies a result.
- **Follow-up Ask HN** later: "Ask HN: What AI failure modes don't have a vendor-neutral benchmark yet?"
- **Reactive comments only.** Do not post unrelated content; do not re-submit anything that didn't catch.

**Cadence:** ONE serious submission. Then nothing for 30 days. Then the v0.2 framework-results launch as a second submission. Two HN shots in 90 days, not twenty.

**Success criteria:**
- Week 1: front page (top 30) for at least 2 hours. Anything less is a soft launch.
- Month 1: 100+ comments on the launch thread, at least 3 framework-maintainer responses in-thread.
- Quarter 1: cited in at least one other HN thread organically.

**Honest risk:** If the spread between frameworks is narrow on the first published numbers, HN will eat us alive ("this measures nothing"). Mitigation: do NOT submit to HN until we have a signed receipt showing meaningful spread.

---

### 2. Twitter/X (AI engineer cluster)

**Why it's tier 1:** This is where the AI engineering audience lives day to day. swyx, Nathan Lambert, Simon Willison, the framework maintainers — they all read X. A good launch thread propagates through quote-RTs faster than HN goes hot.

**Content that goes here:**
- **Launch thread (5-9 tweets).** Format: hook tweet with the headline number, methodology image (one chart), receipt verify command, link to przm.sh.
- **Per-framework threads.** One short thread per framework when its numbers go up. Five total, spaced across week 2.
- **Reply game.** When someone tweets "what AI framework should I use," reply with the leaderboard URL.
- **Public methodology pushback.** When a maintainer or researcher points out a methodology flaw, fix it publicly and thank them.

**Cadence:** 3-5 tweets per week through launch and post-launch month. Drop to 2 per week after.

**Success criteria:**
- Week 1: launch thread > 50K impressions, one reply from a framework maintainer.
- Month 1: 1000+ followers, 3+ tagged shares from named industry accounts.
- Quarter 1: przm referenced in at least 3 organic tweets per week.

**Honest risk:** X reach for new accounts is brutal without a following. The launch will likely under-deliver here unless Matt has pre-built relationships or one named account amplifies. Mitigation: get one amplifier (Simon Willison reply, or Lambert quote-tweet) and the algorithm follows.

---

### 3. Framework GitHub Discussions + Issues (the most underrated channel)

**Why it's tier 1:** This is where the framework's actual users hang out, and where a maintainer can't pretend they didn't see your message. Opening a discussion in the CrewAI, AutoGen, LangGraph, Microsoft Agent Framework, and OpenAI Agents SDK repos saying "we benchmarked your framework, here's the adapter, here's the score, PR welcome to improve the adapter" does three things:

1. Forces the maintainer to engage publicly. Either they engage and we have a relationship, or they ignore and that's a story too.
2. Generates inbound from users who watch those repos and now know we exist.
3. Establishes the precedent that przm engages with maintainers first, publicly, before shipping receipts.

**Content that goes here:**
- **One discussion per framework** on day 2 of launch (NOT day 1 — let HN drop first).
- **Adapter PRs.** Maintainers should be able to PR adjustments to the adapter that lives in our repo.
- **Re-published receipts** every time a framework ships a release that materially changes the numbers.

**Cadence:** 5 discussions in launch week (one per framework). After that, react when they release; never spam.

**Success criteria:**
- Week 1: at least 2 of 5 frameworks engage in-thread with substantive comments.
- Month 1: at least 1 framework opens a PR against our adapter.
- Quarter 1: at least 1 framework maintainer cites their przm receipt in their own release notes.

**Honest risk:** A hostile reception. If a maintainer takes the benchmark as an attack and rallies their community against us, we look bad. Mitigation: the email-first respect move. Public discussion only AFTER private email gave them 24-48 hours to see the number first.

---

## Tier 2 — the supporting channels (opportunistic, not driving)

### 4. LinkedIn (AI engineering manager segment)

**Why tier 2, not tier 1:** LinkedIn drives ICP 2 (managers), who do not buy. The brand-building value is real, but the conversion to revenue is indirect and slow.

**Content:** Launch post + one follow-up per framework in the two weeks after + monthly leaderboard updates.

**Cadence:** Launch + 5 framework posts in month 1 (~6 posts in 30 days), then 1 per month maintenance.

**Success criteria:**
- Week 1: 100+ reactions on launch post, 10+ thoughtful comments.
- Month 1: at least 2 inbound DMs from AI engineering managers asking about custom eval.
- Quarter 1: 1 inbound from an enterprise AI team requesting paid custom evaluation.

**Honest risk:** LinkedIn is a cold-conversion graveyard for technical content. A rigorous benchmark post will get respect from the right people but won't hit the algorithm. That's fine; the right people seeing it is what matters.

---

### 5. AI engineering Substacks / newsletters (earned coverage only)

**Why tier 2:** Earned media, not owned. We can't post into these — we have to get the writer to cover us. High-leverage when it works, uncertain timing and outcome.

**The realistic write-ups to chase:**
- **Latent Space (swyx + Alessio):** Their about page explicitly says no cold emails; warm intro required. Do NOT cold-email. Strategy: get cited in a tweet by someone swyx already follows.
- **Interconnects (Nathan Lambert):** Cold pitch is fair; Nathan publishes contact email. He covers benchmarks, post-training, reasoning. Convergence + sycophancy is in his beat.
- **Simon Willison's weblog:** Simon doesn't take pitches per se but notices things on HN and X. Strategy: hope he sees the HN post.
- **AI Tidbits (Sahar Mor + Arthur Mor):** Newsletter format emphasizes weekly news roundups. Pitch as "news event" not "guest post."
- **The Pragmatic Engineer (Gergely Orosz):** Long shot for v0.1; better fit when we have an enterprise customer story.

**Cadence:** Pitch each writer ONCE during launch week. Follow up ONCE two weeks later if there's been substantive news.

**Success criteria:**
- Month 1: 1 of 5 pitches converts to coverage.
- Quarter 1: at least 2 newsletter mentions total.

**Honest risk:** The hit rate on cold pitches is low even for great products. Plan for zero coverage and treat any earned mention as a windfall.

---

### 6. Reddit (mostly noise, narrow upside)

**Why tier 2 / borderline tier 3:** r/MachineLearning and r/LocalLLaMA reach researchers and hobbyists respectively. Neither buys vendor certs. r/MachineLearning moderators kill anything that smells like self-promotion.

**Content:**
- **r/LocalLLaMA: one self-text post** on launch day or day 2, framed as community-grounded, not promotional.
- **r/MachineLearning: do not post unless covered by a 3rd party.** Self-posts get removed.

**Cadence:** 1-2 posts in launch month, then nothing unless there's real news.

**Honest risk:** Reddit drives near-zero revenue and consumes disproportionate emotional energy on hostile comments. Capped time investment is the right move.

---

## Channels we explicitly are NOT running in Q1

- **Paid acquisition.** No budget; brand insufficient to convert.
- **Webinars / conferences.** Solo operator, 64-day clock, wrong shape of work.
- **Community building (Discord, dedicated forum).** Premature.
- **YouTube / video.** Wrong shape for a benchmark spec.
- **Podcasts as guest.** Possible Q2+ but only after one of the newsletter pitches converts.

## Weekly cadence summary (sustainable through launch month)

| Day | Channel | Content |
|---|---|---|
| Mon | X | 1 substantive tweet or short thread on a finding |
| Tue | GitHub Discussions | 1 maintainer reply or PR review |
| Wed | LinkedIn | Bi-weekly post (alternating with quiet week) |
| Thu | X | 1 reply game (no original post) |
| Fri | Internal | Receipt run + leaderboard update commit |

Approximately 3-4 hours per week of marketing surface area.

## How we know we're winning vs losing

- **Winning signals:** vendor inbound from outreach we didn't send, framework maintainers opening PRs against our adapters, a Lambert or Willison mention without us asking, "przm" used as a verb in a random GitHub issue.
- **Losing signals:** launch HN flames out, no vendor responds to outreach, framework maintainers ignore the GitHub discussions, Twitter launch thread under 5K impressions. If 3 of 4 happen, pause and re-position before pushing harder; do not double down on a launch that didn't land.
