# Distribution recovery — 2026-05-20

The 2026-05-19 launch hit a wall: HN flagged + dead (item 48192734,
score 1), ~50 npm pulls each on memory/voice, 0 GitHub stars. The
X/Bluesky/LinkedIn round drove a small but real signal; HN was the
expected center of gravity and it didn't fire.

This document is the second-shot distribution plan. Different channels
than launch day, different angles per channel. **Nothing in this file
auto-posts — Matt picks order + timing, drops the body into the
relevant client.**

## Priority order (recommended)

**HN is closed for now.** Matt sent the mod second-chance email on
launch day; no response. Sending another one within a week reads as
nagging and historically gets ignored. The HN channel for this
submission is dead — try again with v0.2 (different angle, different
submitter behavior, fresh url path is fine), not now.

1. **/r/LocalLLaMA** — Wed–Thu 9am ET. AI infra audience, big subreddit
   (~150k+ active subs), historically receptive to OSS bench/tooling.
   **Highest expected return** of any channel here.
2. **Lobste.rs** — needs an invite. If Matt doesn't have one, skip or
   ask a contact. High-signal, durable discussion threads.
3. **/r/MachineLearning** — different audience than LocalLLaMA, more
   academic. Posts there expect methodology-first framing.
4. **Mastodon (AI/ML)** — fediverse.science, hachyderm.io. Lower
   absolute reach but tight ML-research community.
5. **dev.to** — easy wide reach, lower signal-to-noise. Worth doing
   for SEO and as a republishable artifact.
6. **HN — defer** until v0.2 ships. Different submitter angle then
   (the v0.2 update itself, framed as "what changed and what I learned
   from people running against v0.1"). Treat the v0.1 submission as
   permanently flagged; don't try to revive it.

Below is ready-to-paste copy per channel. Adjust the first-person
voice ("I" vs "we") to match Matt's preference for each surface.

---

## 1. /r/LocalLLaMA

**Subreddit:** r/LocalLLaMA (~150k subs as of last check; verify before posting)
**Best time:** Wed/Thu 9–11am ET (US morning + EU afternoon overlap)
**Title:** `[OC] Open-source AI reliability benchmark — Ed25519-signed receipts, no LLM judge, holdout subset sealed before publication`

**Body:**

```
I've been building an open-source benchmark suite for AI failure
modes that don't have standards yet. Just shipped v0.1 yesterday
and figured this community might be a better audience than HN
turned out to be (got flagged + buried in 20 minutes there).

Repo: https://github.com/OneNomad-LLC/przm-bench
Site: https://przm.sh
License: Apache 2.0

The current v0.1 focus is multi-agent convergence — does an
orchestration framework recover when its agents disagree, or
collapse to a confidently wrong answer? Initial leaderboard,
holding gpt-4o-mini constant across all configs:

- AutoGen + gpt-4o-mini → 0 of 6 sealed holdout scenarios collapsed
- Hand-rolled baseline + gpt-4o-mini → 5 of 6 collapsed
- Same baseline with sequential reveal protocol → 4 of 6

(Combined-30 numbers tell a different story than holdout — that's
in the leaderboard.)

Things I think are worth poking at:

1. **No LLM judge anywhere.** Scoring is pure-function math on
   recorded agent state. The bench code can be wrong; the wrongness
   is testable on a clone instead of hidden inside a judge model's
   opinion.

2. **Signed receipts.** Every result is an Ed25519-signed JSON
   document. Public key is in the repo. You can verify in-browser
   at https://przm.sh/verify (no data leaves your machine — uses
   SubtleCrypto + RFC 8785 JCS canonicalization) or via the harness.

3. **20% sealed holdout.** Holdout fixture split was committed
   before any signed receipts were published. Partial defense
   against the "tune to the fixture set" problem.

4. **Adapter source published.** Every framework adapter lives in
   the repo (autogen, baseline, baseline-sequential variants for
   anthropic + azure). Framework maintainers can PR changes; we
   publish both runs side-by-side when an adapter PR materially
   changes a score.

Things I'd love to be wrong about:

- N=30 is small. Could the AutoGen vs baseline gap close on a
  bigger fixture set? Probably narrows; v0.2 expands to 100+ and
  adds CrewAI, LangGraph, OpenAI Agents SDK adapters.
- Adapter fairness. I wrote the AutoGen adapter; I tried to
  steel-man it but framework authors will see things I missed.
  PRs welcome and would be very public.
- The receipt-signing model is overkill for v0.1 but I think it
  matters once anyone's running benches against their own product
  — you want to know your CI's number is the number that went on
  the leaderboard.

Happy to answer questions. The methodology doc is at
https://przm.sh/methodology and the code is genuinely all there if
you want to clone + re-run + sign your own.
```

Notes:
- LocalLLaMA generally tolerates "I built this" posts if the post
  is technically substantive and doesn't read like a launch
  announcement.
- Avoid "buy our enterprise tier" framing here. The vendor-cert
  page exists but it's not the hook for this audience.
- If a mod removes for "self-promotion": don't push back, just
  ask politely what would land better.

---

## 2. Lobste.rs

**Tags:** `practices`, `programming` (avoid `ai` if it's gated)
**Title:** `przm — open-source AI benchmark with cryptographically signed receipts`

If you don't have an invite: skip this channel. Lobste.rs is
invite-only and submitting via a borrowed account is against
guidelines.

**Body if posting:**

```
Open-sourced an AI reliability benchmark suite yesterday. The
technical-craft details might be interesting to this crowd more
than the AI angle:

- Every benchmark result is an Ed25519-signed JSON document
  (https://github.com/OneNomad-LLC/przm-bench)
- Signing input is the receipt object canonicalized via RFC 8785
  (JCS — JSON Canonicalization Scheme), so two valid serializations
  of the same content sign to the same bytes
- Verification is a single-file path: load the public key, parse
  the receipt, re-canonicalize, verify the signature
- Browser verifier at https://przm.sh/verify uses Web Crypto
  (SubtleCrypto.verify) — no server roundtrip, no data leaves the
  user's machine
- Scoring is pure-function math on recorded state. No LLM judges,
  no graders-with-opinions. Wrong scores are testable on a clone.
- 20% sealed holdout: the split was committed before any signed
  receipts were published. Defends against the "iteratively tune
  the bench code until your tool of choice wins" failure mode.

License: Apache 2.0. Repo has the full methodology doc, every
adapter (autogen, baselines for anthropic + azure), and the GH
Actions workflow that signs + publishes receipts.

Built solo, mostly with Claude Code, in about three weeks. The
process of building a benchmark adversarially against your own
implementation surfaced a bunch of things I didn't expect — happy
to talk about that in comments if anyone's curious.
```

Notes:
- Lobste.rs voters reward technical depth over hype. The JCS +
  SubtleCrypto + pure-function-scoring details are the core hook
  here, not the AI angle.

---

## 3. /r/MachineLearning

**Subreddit:** r/MachineLearning (~3M subs but slow / heavily moderated)
**Flair:** `[R]` Research, `[P]` Project (verify on the day)
**Title (Project flair):** `[P] przm-bench v0.1 — vendor-neutral open-source benchmark for multi-agent convergence collapse`

**Body:**

```
TL;DR — Apache 2.0 benchmark for AI failure modes that don't have
standards yet. v0.1 focuses on multi-agent convergence: when a
swarm's individual answers disagree, does the framework recover
or collapse to a confidently wrong answer?

Repo: https://github.com/OneNomad-LLC/przm-bench
Methodology: https://przm.sh/methodology

Key design choices I'd like feedback on:

(1) Scoring is pure-function math on recorded agent state. No LLM
judge anywhere in the loop — using an LLM to grade LLMs is
contaminated by the same failure mode you're trying to measure.
The trade-off is that nuanced "the answer is technically right
but worded badly" cases require explicit fixture annotation
instead of a graceful judge fallback.

(2) Holdout protocol. 20% sealed subset; the split was committed
to the repo before any signed receipts were published. Doesn't
fully solve adversarial fixture-tuning but lets a reader check
that the headline number wasn't on a re-tuned set.

(3) Signed receipts. Every score is an Ed25519-signed JSON
document. Public key in the repo. Verify in-browser via
SubtleCrypto at https://przm.sh/verify, or via the harness's
verifyConvergenceReceipt function. RFC 8785 canonicalization.

(4) Adapter source published. Every framework adapter (autogen,
baseline + baseline-sequential variants) lives in the repo. The
fairness argument is "if my adapter handicaps your framework, PR
a better one and we publish both runs side-by-side until the
adapter shape stabilizes."

v0.1 N=30 across 5 categories (factual-math, code-correctness,
temporal-ordering, boolean-trap, factual-history). Holding
gpt-4o-mini constant:

- AutoGen orchestrator: 0/6 holdout collapses
- Hand-rolled baseline: 5/6 holdout collapses
- Baseline + sequential reveal protocol: 4/6 holdout collapses
- 73% baseline collapse vs 10% AutoGen on the combined-30 set
- 87% sequential-baseline as a control for reveal protocol

I'd particularly value pushback on:

- N=30 is small. v0.2 expands to 100+ and adds CrewAI, LangGraph,
  OpenAI Agents SDK.
- The "no LLM judge" stance — is there a class of scoring this
  forces me to skip that I'd be better off accepting an annotation
  cost on?
- Adapter fairness mechanism — would the "publish both runs
  side-by-side on adapter PR" pattern hold up under coordinated
  adapter-tuning?
```

Notes:
- /r/ML moderation is strict — auto-removal for tone often catches
  first-person + product-y posts. Frame as "looking for feedback
  on methodology", not "check out my launch".
- Posts with explicit numbers + repo + methodology link survive
  the auto-modqueue better than those without.

---

## 4. Mastodon (AI/ML community)

**Servers:** sigmoid.social, hachyderm.io, fediverse.science
**Length:** Multi-toot thread, 5 toots max

**Toot 1:**
```
Shipped an open-source AI reliability benchmark yesterday. The
hook: every result is an Ed25519-signed JSON receipt you can
verify in your browser. No LLM judge anywhere. Sealed 20% holdout.

https://przm.sh
github.com/OneNomad-LLC/przm-bench
Apache 2.0 🧵
```

**Toot 2:**
```
v0.1 focus is multi-agent convergence — when individual agents
disagree, does the framework recover or collapse to a confidently
wrong answer? Holding gpt-4o-mini constant:

- AutoGen: 0/6 holdout collapses
- Hand-rolled baseline: 5/6
- Baseline + sequential reveal: 4/6
```

**Toot 3:**
```
Scoring is pure-function math on recorded agent state. The bench
code can be wrong; the wrongness is testable on a clone, not
hidden inside a judge model's opinion.

Receipts: Ed25519 + RFC 8785 JCS canonicalization. Verify in your
browser at przm.sh/verify (no data leaves your machine).
```

**Toot 4:**
```
Every adapter (autogen, baseline, baseline-sequential variants)
is in the repo. If you maintain a framework and think my adapter
handicaps you, PR a better one — I publish both runs side-by-side
on adapter PRs that materially change a score.
```

**Toot 5:**
```
v0.2 expands the fixture set, adds CrewAI / LangGraph / OpenAI
Agents SDK adapters. If you want to add a fixture or push back
on the methodology, the repo is the source of truth:

github.com/OneNomad-LLC/przm-bench

PRs + harsh feedback both welcome.
```

---

## 5. dev.to article (long-form, republishable)

**Tags:** `ai`, `opensource`, `benchmark`, `webdev`
**Title:** `Building an AI benchmark that can't lie: signed receipts, sealed holdouts, no LLM judge`

This one's a longer essay — won't paste the full draft here. The
structure should be:

1. Hook: "Most AI benchmarks ask you to trust the publisher.
   I built one that doesn't."
2. The problem with LLM-judged benchmarks (contamination,
   non-reproducibility, opaque scoring).
3. Three design choices that fix it: signed receipts, sealed
   holdout, no judge model.
4. Walk through verifying a receipt in-browser (with code
   snippets — RFC 8785 canonicalization + SubtleCrypto.verify).
5. What v0.1 actually measures (multi-agent convergence) and the
   surprising AutoGen vs baseline result.
6. Close: links to the repo + methodology + invite for fixture
   PRs.

Estimated length: 1500–2000 words. The methodology doc + the
introducing-przm blog post are 80% of the source material;
restructure for dev.to's "show your work" audience.

I haven't drafted the full article here because it's the kind of
piece worth one editing pass over a cup of coffee, not a
bullet-point dump. If you want me to write the full draft, say
so and I'll do it in a follow-up.

---

## Don't-do list

- **Don't re-submit to HN under a different account.** Against
  guidelines, will get noticed, ends badly.
- **Don't post simultaneously to all subreddits.** Coordinated
  cross-posting is a downvote signature. Stagger across 2–3 days.
- **Don't add "thanks for reading!" / "would love your thoughts!"
  closers.** Reads as performance on every channel except dev.to.
- **Don't hide that the HN submission flopped.** If asked in
  comments, just say "yeah, HN flagged it — that's why I'm here".
  Honesty here is way better than dodging.

## What to track

If any channel gets traction, watch for:

1. **GitHub star spike** — indicates real interest, not just
   pageview curiosity. ~10 stars in an hour = the channel is
   working.
2. **Issue traffic** — actual users find actual bugs. The first
   issue from outside OneNomad is the success signal.
3. **Adapter PRs** — the holy grail. A framework maintainer
   PR'ing their own adapter validates the entire fairness story.

Skip vanity metrics: npm download bumps from a single thread are
noise; sustained week-over-week growth is signal.
