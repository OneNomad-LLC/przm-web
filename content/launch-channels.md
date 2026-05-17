# Launch Channel Drafts

> NOT FOR POSTING. Review and approve each section before use.

---

## Show HN

### Title

```
Show HN: przm – vendor-neutral AI reliability benchmarks with signed receipts
```

(77 chars)

### Body

```
przm (przm.sh) is an open-source multi-axis leaderboard for AI failure modes that don't have vendor-neutral measurement standards yet.

The v0.1 benchmark is multi-agent convergence + sycophancy. Setup: N agents debate a question with a known correct answer. One agent is a confederate — pre-assigned a wrong answer and a confident-sounding rationale to defend it. We measure:

- correct_final_answer_rate: does the group land on the right answer?
- collapse_rate: how often does a group converge to a single answer without surfacing the reasoning that should have stopped it?
- sycophancy_ratio: how often does an agent that started correct end with the confederate's wrong answer?
- token_waste_ratio: compute spent on debates that ended wrong
- position_flip_rate: round-over-round answer changes (descriptive)

All scoring is deterministic — pure-function math on recorded state, no LLM judge. Every result is an Ed25519-signed JSON receipt with fixture SHA-256, adapter version, LLM version, and full per-round transcripts pinned. Anyone can re-run and verify.

30 fixtures ship in v0.1 across five categories: factual-math, code-correctness, factual-history, temporal-ordering, boolean-trap. Fixtures are designed to break things — confederate rationales fabricate plausible citations, fake-precision arithmetic walkthroughs, and confident taxonomic distinctions.

Early finding, stated carefully: frontier-tier models running baseline orchestration fold to popular-misconception confederates on a subset of fixtures we'd considered easy. We're not quantifying beyond that until the full adapter suite is in.

What's in v0.1:
- Baseline adapter: hand-rolled N-agent R-round debate using Anthropic Messages API
- Azure adapter: gpt-5-mini and gpt-4o-mini via Azure OpenAI
- AutoGen adapter: gpt-4o-mini

What's NOT in v0.1 but is planned: CrewAI, LangGraph, OpenAI Swarm adapters (v0.2, 7-10 days). The holdout split waits until we hit ≥50 fixtures.

The business model is vendor certification ($999-$9,999/release) and custom enterprise evaluation ($5K-$25K one-shot). The OSS is free. Money comes from being the authoritative third party that ran the test — not from selling the harness or the fixtures.

Why not Patronus/Braintrust/LangSmith? Structural conflict: they sell to the same AI app builders whose frameworks we'd need to benchmark. They cannot credibly publish "this framework's agents collapse to wrong answers" without antagonizing their customer base.

Built in <3 weeks by a solo founder + AI agents. If the methodology is wrong, the open source means you find out faster than we could hide it.

Methodology: przm.sh/methodology
Verify a receipt: przm.sh/verify
GitHub: github.com/OneNomad-LLC/bench
```

---

## Twitter / X Thread

### Tweet 1 (seed — ≤ 240 chars)

```
We built a benchmark for something no one's measuring: how fast multi-agent AI systems collapse to a confidently-stated wrong answer.

It's open source. Every result is a signed receipt. No LLM judge.

przm.sh — thread below.
```

### Tweet 2

```
The failure mode is called sycophancy collapse. One agent gets pre-assigned a wrong answer + a confident rationale. The rest start with the correct answer.

We measure how many of the correct agents end up agreeing with the wrong one.

Turns out: a lot of them.
```

### Tweet 3

```
Why doesn't something like this already exist?

Structural conflict. The companies that build eval tooling sell to the same AI app builders whose frameworks we'd need to benchmark. You can't credibly call out CrewAI's convergence problem when CrewAI's customers are also your customers.

So the standard doesn't exist. We built it.
```

### Tweet 4

```
The methodology is deterministic — no LLM in the grading loop. Scoring is pure-function math on recorded state.

Every result is an Ed25519-signed receipt: adapter version, LLM version, fixture SHA-256, full per-round transcripts. All pinned, all verifiable.

If we got it wrong, you can find out faster than we can hide it.
```

### Tweet 5

```
v0.1 is live:
- 30 fixtures across 5 categories (factual-math, code-correctness, history, temporal ordering, boolean traps)
- Baseline adapter + Azure (gpt-5-mini, gpt-4o-mini) + AutoGen
- Vendor certification open: $999/release for a signed third-party receipt

Framework adapter comparisons in v0.2, ~1 week out.

przm.sh
```

---

## Bluesky

```
We measured how fast multi-agent AI systems collapse to a confidently wrong answer. Signed receipts, no LLM judge, fully open source. Frontier models fold on fixtures we thought were easy. przm.sh
```

(193 chars)

---

## LinkedIn

Multi-agent AI systems have a reliability problem that nobody's measuring. When one agent confidently asserts a wrong answer, how many of the other agents — who started with the correct answer — end up agreeing with it?

We ran the test. The results weren't reassuring.

przm (przm.sh) is an open-source AI reliability leaderboard we launched today. The v0.1 benchmark measures multi-agent convergence and sycophancy: five scoring axes, deterministic math, no LLM judge, every result an Ed25519-signed receipt that anyone can verify against our public key.

Why this benchmark, and why now? Two reasons.

First, the failure mode is real and documented — peer-reviewed arXiv papers on sycophancy collapse and disagreement convergence in multi-agent systems — but there's no vendor-neutral measurement standard for it. You can find plenty of "measure your LLM" SaaS. You can't find a signed, reproducible, adversarially-constructed benchmark showing how CrewAI vs. AutoGen vs. LangGraph actually hold up when one agent is injected with a confidently-stated wrong answer.

Second, the companies best positioned to build this face a structural conflict: they sell to the same AI app builders whose frameworks they'd need to benchmark. Publishing a convergence leaderboard would antagonize their customer base. So the leaderboard doesn't exist.

v0.1 ships with 30 fixtures across five categories — factual math, code correctness, factual history, temporal ordering, and popular misconceptions used as boolean traps. The fixture design is adversarial: confederate rationales fabricate plausible-sounding citations, use fake-precision arithmetic walkthroughs, and invent taxonomic distinctions that sound rigorous.

The early finding, stated carefully: frontier-tier models running baseline orchestration fold to popular-misconception confederates on a subset of fixtures we expected to be straightforward.

For AI framework vendors: certification is open. A przm receipt is a signed, third-party performance attestation at $999 per release — something you can publish on your website and your customers can verify. We don't tune the benchmark to your strengths. That's the point.

The benchmark harness is Apache-2.0. Read the methodology, run the verification yourself, or submit a PR if you think the methodology is wrong.

przm.sh | github.com/OneNomad-LLC/bench
