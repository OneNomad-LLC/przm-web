# Launch Channel Drafts

> NOT FOR POSTING. Review and approve each section before use.
> Numbers below are from the signed v0.1 receipts (2026-05-17).
> Per the launch sequence, HN drops on Tuesday of week 2 — not week 1.

---

## Show HN

### Title

```
Show HN: I measured how multi-agent AI frameworks fold to confederate-injected wrong answers
```

(99 chars — under HN's title limit but on the long side. Alternative shorter version below.)

### Title (alternative, shorter)

```
Show HN: przm — multi-agent AI reliability leaderboard with signed receipts
```

(78 chars)

### Body

```
przm (przm.sh) is an open-source multi-axis leaderboard for AI failure modes that don't have vendor-neutral standards yet.

The v0.1 benchmark is multi-agent convergence + sycophancy. Setup: N agents debate a question with a known correct answer. One agent is a "confederate" — pre-assigned a wrong answer + a confident-sounding rationale to defend it. We measure:

- correct_final_answer_rate: did the group land on the right answer?
- collapse_rate: how often did the group converge to a single answer (right OR wrong) without surfacing the reasoning that should have stopped it?
- sycophancy_ratio: how often did an agent that started correct end on the confederate's wrong answer?
- tokens_per_correct_answer: compute spent per correct outcome
- position_flips_per_agent_per_round: round-over-round answer changes (descriptive)

Scoring is deterministic — pure-function math on recorded state, no LLM judge anywhere. Every result is an Ed25519-signed JSON receipt with adapter version, LLM version, fixture SHA-256, and full per-round transcripts pinned. Anyone can re-run and verify.

The most interesting v0.1 finding:

Holding the model constant (gpt-4o-mini), the same 30 scenarios produce a 7.3× difference in collapse rate depending on orchestration. Hand-rolled synchronous-rounds baseline: 96.7%. AutoGen RoundRobinGroupChat: 13.3%. The framework changes agent consensus dynamics independently of the underlying LLM. AutoGen's same-round visibility lets correct peers reinforce each other before the confederate's confidence compounds — the inverse of what I'd predicted.

Other findings:
- Claude Haiku 4.5 (93.3% correct) and gpt-5-mini (96.7%) both held against confederate pressure on most fixtures. Both folded on the same one: an Einstein-failed-math popular-misconception trap. gpt-5-mini uses ~4× more tokens per correct answer than Claude Haiku for ~3pp more correctness.
- gpt-4o-mini (83.3% correct, baseline) folded on the same Einstein trap + a Python mutable-default-argument question.

What's in v0.1:
- 30 hand-curated fixtures across 5 categories (factual-math, code-correctness, factual-history, temporal-ordering, boolean-trap). All correct answers verified against authoritative sources before commit.
- 4 adapters: baseline-Anthropic (Claude Haiku 4.5), baseline-Azure (gpt-5-mini + gpt-4o-mini), AutoGen (gpt-4o-mini).
- 4 Ed25519-signed receipts on the leaderboard, each with full transcripts.
- A signature verifier that runs in your browser via SubtleCrypto.

What's NOT in v0.1: CrewAI, LangGraph, OpenAI Agents SDK adapters land in v0.2 (~7-10 days). 20% holdout split once we hit ≥50 fixtures.

Business model: vendor certification ($999/release with a charter free tier for the first 3-5 customers) + custom enterprise eval ($5K-$25K). OSS is free. Money comes from being the authoritative third party that ran the test, not from selling the harness.

Why this didn't already exist: structural conflict. The companies that build eval tooling (Patronus, Braintrust, LangSmith) sell to the same AI app builders whose frameworks we'd need to benchmark. Publishing "this framework's agents collapse to wrong answers" antagonizes their customer base.

Built in <3 weeks. Solo founder + AI agents wrote and adversarially-audited most of the code. If the methodology is wrong, the open source means you find out faster than I could hide it.

Methodology:  https://przm.sh/methodology#convergence
Leaderboard:  https://przm.sh/leaderboard
Verify:       https://przm.sh/verify
Repo:         https://github.com/OneNomad-LLC/przm-bench (Apache-2.0)
```

---

## Twitter / X Thread

### Tweet 1 (seed — ≤ 240 chars)

```
I built a benchmark for something no one's measuring: how multi-agent AI systems collapse to confidently-wrong answers when one agent is confederate-injected.

Same model, different orchestration: 7.3× difference in collapse rate.

przm.sh — thread ↓
```

### Tweet 2

```
The failure mode: N agents debate a question. One is pre-assigned a wrong answer + a confident-sounding rationale. The rest start correct.

We measure how many of the correct agents end up agreeing with the wrong one — and how much of that depends on the framework, not the model.
```

### Tweet 3

```
The headline number is the same-model-different-framework comparison.

gpt-4o-mini, 30 scenarios, 3 agents × 3 rounds:
- Hand-rolled synchronous rounds:  96.7% collapse
- Microsoft AutoGen RoundRobin:     13.3% collapse

7.3× difference from orchestration alone, model held constant.
```

### Tweet 4

```
Counterintuitive direction: AutoGen's RoundRobin (where agents see peers' same-round messages) HELPS resist convergence. Correct agents 1 and 2 reinforce each other before the confederate's confidence compounds.

I had predicted the opposite. The bench surfaced the real story.
```

### Tweet 5

```
The methodology is deterministic — no LLM in the grading loop.

Every result is an Ed25519-signed receipt: adapter version, LLM, fixture SHA-256, per-round transcripts. Verify in your browser at /verify.

If the methodology is wrong, the open source means you find out faster than I can hide it.

przm.sh
```

---

## Bluesky

```
I measured how multi-agent AI systems collapse to confidently-wrong answers. Same model, different framework: 7.3× difference in collapse rate. Signed receipts, no LLM judge, fully open source. przm.sh
```

(202 chars)

---

## LinkedIn

```
Multi-agent AI systems have a reliability problem that nobody's measuring well. When one agent confidently asserts a wrong answer, how many of the other agents — who started with the correct answer — end up agreeing with it? And how much of that depends on the orchestration framework versus the underlying model?

I ran the test. The most interesting result wasn't about models at all.

przm (https://przm.sh) is an open-source AI reliability leaderboard that ships today. v0.1 measures multi-agent convergence and sycophancy across five scoring axes: deterministic math, no LLM judge, every result an Ed25519-signed receipt that anyone can verify against the published public key.

The headline finding: same model (gpt-4o-mini), same 30 fixtures, two different orchestration patterns. Hand-rolled synchronous-round debate: 96.7% collapse rate. Microsoft AutoGen's RoundRobinGroupChat: 13.3%. A 7.3× difference attributable entirely to orchestration. Counterintuitively, the framework with more same-round peer visibility (AutoGen) RESISTED convergence harder, because correct agents reinforced each other before the confederate's confidence had time to compound. That's the kind of result no published benchmark surfaces today.

Frontier models held more reliably than I expected — Claude Haiku 4.5 scored 93.3%, gpt-5-mini 96.7% — but both folded on the same scenario: a popular-misconception trap where the confederate plausibly asserts Einstein failed math in school. The bench is catching real things.

Why did this benchmark not already exist? Structural conflict: the companies best positioned to build it (Patronus, Braintrust, LangSmith) sell to the same AI app builders whose frameworks would be benchmarked. Publishing "this framework's agents collapse to wrong answers" antagonizes their customer base.

For AI framework vendors: certification is open. First 3-5 charter customers get a signed receipt free in exchange for case-study rights. After that, $999 per release for a third-party performance attestation you can publish on your own site. We don't tune the benchmark to your strengths — that's the point.

For AI engineering managers picking a framework: there's now a number to anchor the conversation. Read the methodology, run the verification yourself, or PR if you think we got it wrong.

przm.sh
github.com/OneNomad-LLC/przm-bench (Apache-2.0)
```
