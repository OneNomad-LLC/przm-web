---
title: "Introducing przm: a vendor-neutral AI reliability leaderboard"
slug: introducing-przm
description: "przm publishes signed, deterministic, adversarial benchmarks for AI failure modes that have no vendor-neutral standard yet. First up: multi-agent convergence."
publishedAt: "2026-05-19"
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

30 fixtures across 5 categories. 6 adapter configurations. 3 agents × 3 rounds per scenario. 12 Ed25519-signed receipts (each adapter × combined-30 + holdout-6) live on the [leaderboard](https://przm.sh/leaderboard).

Combined run (30 fixtures):

```
metric                            haiku-baseline  haiku-sequential  gpt-5-mini  gpt-4o-mini-baseline  gpt-4o-mini-sequential  autogen/gpt-4o-mini
correct_final_answer_rate         96.7%           93.3%             96.7%       90.0%                 83.3%                   83.3%
collapse_rate (lower better)      56.7%           53.3%             100.0%      90.0%                 83.3%                   20.0%
sycophancy_ratio (lower better)   0.0%            0.0%              0.0%        3.3%                  0.0%                    0.0%
tokens_per_correct_answer         1,174           1,170             4,820       659                   685                     935
position_flips_per_agent_per_round 0.074          0.059             0.111       0.115                 0.096                   0.037
```

Sealed 6-fixture holdout (different scenarios, same code):

```
metric                            haiku-baseline  haiku-sequential  gpt-5-mini  gpt-4o-mini-baseline  gpt-4o-mini-sequential  autogen/gpt-4o-mini
correct_final_answer_rate         100.0%          83.3%             100.0%      66.7%                 66.7%                   83.3%
collapse_rate (lower better)      66.7%           66.7%             100.0%      83.3%                 66.7%                   0.0%
```

The headline is the same-model-different-framework comparison on the holdout. Hold the model constant (`gpt-4o-mini`), and AutoGen's `RoundRobinGroupChat` collapsed **0 of 6 sealed scenarios** while the hand-rolled baseline collapsed 5 of 6. On the larger 30-fixture combined set: baseline 90% collapse, AutoGen 20%.

What matters about this measurement: we ran *two* baseline variants for `gpt-4o-mini`, one with synchronous reveal (agents answer blind in-round, only see prior rounds) and one with sequential reveal (agent N reads agents 0..N-1 in the same round, matching what AutoGen does). The sequential baseline still collapses at 83% combined / 67% holdout. So the AutoGen advantage isn't just "agents can see each other within a round." The framework is doing real work beyond the reveal-protocol choice. We don't fully understand what that work is yet; it's a hypothesis-generating finding, not a closed explanation.

A few other findings worth naming:

- Claude Haiku 4.5 held correctness at 96.7% combined / 100% holdout and collapsed at roughly half the rate of `gpt-4o-mini` baseline (56.7% vs 90% combined). On these specific fixtures the model itself resists the confederate better, which is what you'd expect when the model has stronger priors against the wrong answer.
- `gpt-5-mini` collapsed on 100% of scenarios it got right. Smarter model, same convergence pathology when the confederate is confidently wrong and the orchestration doesn't actively resist consensus.
- `gpt-5-mini` uses ~4× more tokens per correct answer than Haiku (4,820 vs 1,174) for the same correctness rate. The reasoning-model budget shows up in the spend column without showing up in the outcome column on this benchmark.
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
