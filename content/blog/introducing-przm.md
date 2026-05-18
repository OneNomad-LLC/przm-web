---
title: "Introducing przm: a vendor-neutral AI reliability leaderboard"
slug: introducing-przm
description: "przm publishes signed, deterministic, adversarial benchmarks for AI failure modes that have no vendor-neutral standard yet. First up: multi-agent convergence."
publishedAt: "2026-05-17"
author: "Matt Stvartak"
---

There's a whole category of companies that will help you measure your LLM. Patronus, Braintrust, LangSmith, Helicone. They all sell some flavor of "instrument your AI app and see what's going wrong." That category is fine. It's also full.

What doesn't exist is a vendor-neutral standard for the failure modes that show up specifically in multi-agent systems. And a signed, reproducible record of which frameworks fall apart and which don't.

That's what przm is.

## The problem with current evals

Eval tooling has a structural problem. The companies that build it sell to the same AI app builders whose frameworks we'd need to benchmark. If LangSmith published a leaderboard showing LangGraph's agents are unusually susceptible to sycophancy collapse, that's a live grenade in their customer base. They won't. They can't. The revenue conflict is too direct.

So nobody credible publishes "here's how fast CrewAI's agents fold to a confidently-stated wrong answer." Not because the failure mode isn't real (it is, documented in peer-reviewed arXiv papers), but because publishing it would antagonize the exact people paying for your SaaS.

The benchmark doesn't exist. We built it.

## What przm measures

The v0.1 benchmark is **multi-agent convergence and sycophancy**.

The setup: N agents debate a question that has a known correct answer. One agent is a confederate. It's been pre-assigned a wrong answer plus a confident-sounding rationale to defend it. We then measure five things:

- **Final correctness**: does the group land on the right answer at the end of the debate?
- **Collapse rate**: how often does a group converge to a single answer without surfacing the reasoning that should have stopped them?
- **Sycophancy ratio**: how often does an agent that started with the correct answer end with the confederate's wrong one?
- **Token-waste ratio**: how much compute did the framework burn on debates it ultimately got wrong?
- **Position-flip rate**: how much do individual agents flip their positions round-over-round? (Descriptive, not prescriptive. Some frameworks flip to explore; this axis separates exploration from capitulation when combined with the sycophancy ratio.)

Every score is a pure math function on recorded state. There's no LLM anywhere in the grading loop. Two runs of the same fixture produce byte-identical scores.

## Why "no LLM judge" matters

Most eval pipelines use an LLM to decide whether an answer was correct. That means your evaluation is as reliable as your judge model's opinion, which varies by temperature, by model version, by prompt wording, and by the judge's own biases.

przm uses structured output extraction and string comparison against canonical correct answers. The scoring functions are published. The fixture correct answers are published. The adapter code is published. If you think we got something wrong, submit a PR. The methodology is the product. Opacity is the thing we can't afford.

## What we found in the v0.1 signed run

30 fixtures across 5 categories. 4 adapter configurations. 3 agents × 3 rounds per scenario. All four receipts Ed25519-signed and live on the [leaderboard](https://przm.sh/leaderboard).

```
metric                              claude-haiku-4-5   gpt-5-mini   gpt-4o-mini   autogen/gpt-4o-mini
correct_final_answer_rate           93.3%              96.7%        83.3%         83.3%
collapse_rate (lower better)        100.0%             100.0%       96.7%         13.3%
sycophancy_ratio (lower better)     3.3%               0.0%         0.0%          0.0%
tokens_per_correct_answer           1,173              4,987        659           875
position_flips_per_agent_per_round  0.093              0.111        0.122         0.041
```

The headline is the same-model-different-framework comparison. Hold the model constant (gpt-4o-mini) and the same 30 scenarios produce a **7.3× difference in collapse rate** depending on orchestration. Hand-rolled synchronous-round baseline: 96.7%. AutoGen's `RoundRobinGroupChat`: 13.3%. That delta is entirely the framework's signal.

Counterintuitively, the framework with *more* same-round peer visibility (AutoGen) resists convergence harder than the baseline. The reason: correct agents 1 and 2 reinforce each other before the confederate's confidence has time to compound. I had predicted the opposite direction going in. The bench surfaced the real story.

A few other findings worth naming:

- Frontier models held more reliably than mid-tier, as you'd expect. They didn't hit 100% though. Claude Haiku 4.5 folded on one scenario (the Einstein-failed-math popular-misconception trap, where the confederate cites the famous-but-false biographical story). gpt-5-mini held that one but used roughly 4 times more tokens per correct answer than Claude Haiku for about 3 percentage points more correctness.
- gpt-4o-mini's failure modes were specific. It folded on the same Einstein trap as Claude, plus a Python mutable-default-argument code question where the confederate's "this is how Python works" framing won.
- The confederate's confidence matters more than the wrongness obviousness. Fixtures where the confederate's rationale was internally consistent (fake citations, fake-precision walkthroughs) caught more agents than fixtures where the confederate just contradicted something obvious.

## The fixture set

v0.1 ships with 30 seed fixtures across five categories:

- **factual-math**: stacking percentages, floating-point representation, percentage asymmetry. Confederate uses fake-precision arithmetic walkthroughs.
- **code-correctness**: Python mutable defaults, NaN equality semantics. Confederate inverts the correct behavior with confident technical framing.
- **factual-history**: Microsoft's founding date, whether Magellan personally circumnavigated, the Wright Brothers' first flight year. Confederate exploits real ambiguity in adjacent facts.
- **temporal-ordering**: Cleopatra vs. the pyramids vs. the moon landing, Oxford vs. Tenochtitlán. These are counterintuitive-but-true orderings where confident wrongness lands hard.
- **boolean-trap**: goldfish memory, the 10% brain myth, bat vision. Classic popular misconceptions where the confederate sounds more certain than the correct agents.

Each fixture has a confederate rationale that sounds like it came from a subject-matter expert. The goldfish one fabricates fish neuroethology citations. The floating-point one claims V8 returns exactly 0.3. The Magellan one invents a "wounded and recovered" detail.

The correct answers are verified against authoritative public sources before any fixture gets committed. The AUTHORING_LOG documents the source for each one.

## The receipt

Every benchmark run produces an Ed25519-signed receipt. It's a JSON document that pins the adapter name and version, the exact LLM model used, the fixture SHA-256, the per-scenario per-round transcripts, and the final scores. The public verification key is in the repo.

Tampering is cryptographically detectable. Anyone can re-run any adapter against any fixture subset and verify the scores match. The receipt is the point. It's the thing you can hand to a vendor and say "this is what we found."

## What's shipping now vs. what's next

**v0.1 (now)**: Four adapter configurations across two providers and two orchestration patterns.

- A hand-rolled baseline (Anthropic Messages API directly, no framework) running on Claude Haiku 4.5.
- The same hand-rolled baseline running on Azure OpenAI, gpt-5-mini *and* gpt-4o-mini, so the bench has a frontier vs. mid-tier comparison out of the gate.
- Microsoft AutoGen's `RoundRobinGroupChat` running on gpt-4o-mini, holding the model constant against the baseline so any score delta is the framework's signal, not the model's.

That last pair is the load-bearing comparison. Same model, different orchestration. If a framework changes how often agents fold to confederates while the underlying LLM stays fixed, that's a finding nobody else is measuring.

**v0.2 (next)**: CrewAI and LangGraph adapters, joining AutoGen on the same gpt-4o-mini comparison. The CrewAI adapter is already scaffolded and smoke-tested; a litellm/Azure interop quirk is currently blocking the full bench run. Both adapters publish once that's resolved.

**v0.3+**: OpenAI Agents SDK and Claude Agents SDK adapters. The AI memory recall axis (already partially built, extends the Engram benchmark work). AI code review reliability.

We're not promising adapters we haven't built. If it's not in the repo, it's not in the v0.1 receipt.

## Why vendor certification is the revenue model

AI frameworks win on developer trust. If CrewAI can publish "certified by an independent third party, here's our convergence score on przm v0.1," that's marketing. It's a third-party signed receipt they can put on their website, their README, their sales deck.

We don't sell the harness. We don't sell access to fixtures. The OSS is free. The money comes from being the authoritative third party that ran the test, the same way a security auditor sells their name and not their checklist.

Vendor certification runs $999 to $9,999 per release depending on scope. Enterprise custom evaluation (private bench on your specific use case) is $5K to $25K one-shot. Continuous monitoring subscriptions come later, once the leaderboards are established enough that people care about drift.

## The "AI built this" thing

przm was built in under three weeks, primarily by AI agents. The methodology docs, the scoring functions, the fixture set, the adapter contract, the receipt schema. All of it was drafted, reviewed, and iterated by Claude. I wrote the positioning and made the calls. The agents wrote and tested the code.

I'm not leading with this as a brand position. It's more of a working proof: if the future of software is AI-built and AI-audited, we should have tools that can actually hold AI output accountable. przm is that tool, built with the same tools it measures.

If our methodology is wrong, the open source means you'll find out faster than we could hide it.

## Run the verification yourself

The benchmark harness is Apache-2.0. The fixtures are in the repo. The scoring math is published. The receipt format is documented.

- [Explore the leaderboard](https://przm.sh)
- [Read the convergence methodology](https://przm.sh/methodology)
- [Verify a receipt](https://przm.sh/verify)
- [Bench harness on GitHub](https://github.com/OneNomad-LLC/przm-bench)
- [Website source on GitHub](https://github.com/OneNomad-LLC/przm-web)

If you ship an AI framework, memory system, or code-review product, [vendor certification is open](/vendor-cert). We run the bench, you get the signed receipt.
