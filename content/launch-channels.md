# Launch Channel Drafts

> NOT FOR POSTING. Review and approve each section before use.
> Numbers below are from the signed v0.1 receipts (2026-05-18).
> Per the launch sequence, HN drops on Tuesday of week 2, not week 1.

---

## Show HN

### Title

```
Show HN: I measured how multi-agent AI frameworks fold to confederate-injected wrong answers
```

(99 chars, under HN's title limit but on the long side. Alternative shorter version below.)

### Title (alternative, shorter)

```
Show HN: przm, a multi-agent AI reliability leaderboard with signed receipts
```

(78 chars)

### Body

```
przm (przm.sh) is an open-source multi-axis leaderboard for AI failure modes that don't have vendor-neutral standards yet.

The v0.1 benchmark is multi-agent convergence and sycophancy. Setup: N agents debate a question with a known correct answer. One agent is a "confederate" that's been pre-assigned a wrong answer plus a confident-sounding rationale to defend it. We measure:

- correct_final_answer_rate: did the group land on the right answer?
- collapse_rate: how often did the group converge to a single answer (right or wrong) without surfacing the reasoning that should have stopped it?
- sycophancy_ratio: how often did an agent that started correct end on the confederate's wrong answer?
- tokens_per_correct_answer: compute spent per correct outcome
- position_flips_per_agent_per_round: round-over-round answer changes (descriptive)

Scoring is deterministic. Pure-function math on recorded state, no LLM judge anywhere. Every result is an Ed25519-signed JSON receipt with adapter version, LLM version, fixture SHA-256, and full per-round transcripts pinned. Anyone can re-run and verify.

The most interesting v0.1 finding:

Holding the model constant (gpt-4o-mini), the orchestration framework drives collapse rate. On the 30-fixture combined run: hand-rolled synchronous baseline 90%, sequential-reveal baseline 83%, AutoGen RoundRobinGroupChat 20%. On the sealed 6-fixture holdout: baseline 83%, sequential 67%, AutoGen 0 collapses out of 6. The gap survives even when we control for reveal protocol — the sequential baseline uses AutoGen's same in-round visibility pattern and still collapses 4× more often than AutoGen itself. The framework is doing real work beyond just letting agents see each other within a round.

Other findings:
- Claude Haiku 4.5 (96.7% correct) and gpt-5-mini (96.7%) both held against confederate pressure on most fixtures. gpt-5-mini uses about 4× more tokens per correct answer than Haiku for the same correctness.
- gpt-4o-mini baseline at 90% correct, AutoGen at 83% correct — small correctness drop but a much smaller collapse rate, which is a worthwhile trade for trust-critical workflows.
- gpt-5-mini collapsed on 100% of scenarios it got right. Smarter model, same convergence pathology when one agent is confidently wrong.

What's in v0.1:
- 30 hand-curated fixtures across 5 categories (factual-math, code-correctness, factual-history, temporal-ordering, boolean-trap). All correct answers verified against authoritative sources before commit.
- 6 adapter configurations: baseline-Anthropic Haiku (sync + sequential), baseline-Azure gpt-5-mini and gpt-4o-mini (sync), gpt-4o-mini sequential, AutoGen gpt-4o-mini.
- 12 Ed25519-signed receipts on the leaderboard (each adapter × combined + holdout), full per-round transcripts pinned.
- A signature verifier that runs in your browser via SubtleCrypto.

What's not in v0.1: CrewAI, LangGraph, OpenAI Agents SDK adapters land in v0.2 once a CrewAI/litellm interop quirk is resolved. 20% holdout split once we hit ≥50 fixtures.

Business model: vendor certification ($999/release with a charter free tier for the first 3-5 customers) plus custom enterprise eval ($5K to $25K). OSS is free. Money comes from being the authoritative third party that ran the test, not from selling the harness.

Why this didn't already exist: structural conflict. The companies that build eval tooling (Patronus, Braintrust, LangSmith) sell to the same AI app builders whose frameworks we'd need to benchmark. Publishing "this framework's agents collapse to wrong answers" antagonizes their customer base.

Built in under 3 weeks. Solo founder plus AI agents wrote and adversarially-audited most of the code. If the methodology is wrong, the open source means you find out faster than I could hide it.

Methodology:  https://przm.sh/methodology#convergence
Leaderboard:  https://przm.sh/leaderboard
Verify:       https://przm.sh/verify
Repo:         https://github.com/OneNomad-LLC/przm-bench (Apache-2.0)
```

### First OP comment (post immediately after submission)

Post this as the first reply to your own Show HN as soon as the submission lands. It frames the discussion, signals you're actively engaging, and surfaces the things people will reasonably want to question.

```
OP here, happy to dig into anything. A few things worth flagging up front since I'd be asking them in your shoes:

(1) Sample size. v0.1 is 30 hand-curated convergence scenarios across 5 categories. That's a small N, and the headline gap (90% baseline collapse vs 20% AutoGen collapse on combined; 83% vs 0/6 on holdout) could narrow as fixtures expand. I'm sized for "this is enough to demonstrate the methodology works and the orchestration delta is real and large"; not "this is a final ranking." Holdout split (20% sealed pre-publication) is the partial defense, but I'd happily take fixture PRs.

(2) Confederate prompts are authored. Each scenario's confederate uses a hand-written wrong-but-confident rationale. That's an inputs-side judgment call. The mitigation in the methodology: competitors can submit replacement confederate prompts via PR and we publish both runs side by side. If you think a specific fixture's confederate is too weak or too strong, that's a real bug, file it.

(3) AI-built and AI-audited. The whole stack (methodology docs, scoring functions, fixture set, adapter contract, receipt schema) was drafted, reviewed, and iterated by Claude. I made the calls and wrote the positioning; the agents wrote and tested the code. That's why "no LLM in the grading loop" is load-bearing for us, not aesthetic: it's the only path to a credibility chain that doesn't end at "trust the AI that wrote the eval."

(4) v0.1 has 2 framework adapters, not 5. CrewAI / LangGraph / OpenAI Agents SDK ship v0.2 (the CrewAI adapter is built but hit a litellm/Azure interop quirk on full-bench runs). What's published today is baseline + AutoGen, same model. If you're a framework maintainer reading this and want adapter input, the source is at github.com/OneNomad-LLC/przm-bench and PRs are welcome.

Will be here all day. Hard questions get the most attention.
```
(~1,650 chars; fits HN's 5K comment limit with plenty of margin.)

---

## Twitter / X Thread

The X thread lives in `content/social/launch-x-thread.json` so the
posting script consumes the same source of truth that humans review.
Edit there, then dry-run with:

```
node scripts/social/post-thread.cjs content/social/launch-x-thread.json
```

---

## Bluesky

```
I measured how multi-agent AI systems collapse to confidently-wrong answers. Same model, different framework: on the sealed holdout, AutoGen 0 of 6 collapses, hand-rolled baseline 5 of 6. Signed receipts, no LLM judge, open source. przm.sh
```

(196 chars)

---

## LinkedIn — OneNomad company page

Voice: OneNomad-announces-przm (third-person company voice). Posts from <https://www.linkedin.com/company/onenomad/>.

```
OneNomad is launching przm today, an open-source, vendor-neutral leaderboard for AI reliability.

Multi-agent AI systems have a reliability problem that nobody has been measuring well. When one agent confidently asserts a wrong answer, how many of the other agents (who started correct) end up agreeing with it? And how much of that depends on the orchestration framework versus the underlying model?

przm v0.1 (https://przm.sh) measures multi-agent convergence and sycophancy across five scoring axes. Deterministic math. No LLM in the grading loop. Every result is an Ed25519-signed receipt anyone can verify against the published public key.

The headline finding: same model (gpt-4o-mini), same 30 fixtures, three different orchestration patterns. Hand-rolled synchronous-round baseline 90% collapse. Sequential-reveal baseline (same as AutoGen's reveal pattern, but otherwise vanilla) 83%. Microsoft AutoGen's RoundRobinGroupChat 20%. On the sealed 6-fixture holdout: baseline 83%, sequential 67%, AutoGen 0. The AutoGen advantage holds even when we control for reveal protocol, so the framework is doing real work beyond just letting agents see each other within a round.

Frontier models held correctness reliably. Claude Haiku 4.5 at 96.7% correct, gpt-5-mini at 96.7%. But gpt-5-mini collapsed on 100% of scenarios it got right — the consensus pathology is independent of model intelligence when the orchestration doesn't actively resist it.

Why didn't this benchmark already exist? Structural conflict. The companies best positioned to build it (Patronus, Braintrust, LangSmith) sell to the same AI app builders whose frameworks would be benchmarked. Publishing "this framework's agents collapse to wrong answers" antagonizes their customer base. A vendor-neutral third party that doesn't sell into the framework market is the only entity that can credibly run this.

For AI framework vendors: certification is open. The first 5 charter customers get a signed receipt free in exchange for case-study rights. After that, $999 per release for a third-party performance attestation you can publish on your own site. We don't tune the benchmark to your strengths. That's the point.

For AI engineering managers choosing a framework: there's now a number to anchor the conversation. Read the methodology, run the verification yourself, or PR our adapter implementation if you think it handicaps your framework.

przm is the first product from OneNomad LLC, an independent research-and-tools shop building infrastructure for the AI reliability problem.

→ przm.sh
→ github.com/OneNomad-LLC/przm-bench (Apache-2.0)

#AIReliability #MultiAgent #OpenSource #AgentBenchmarks
```

(~2,900 chars, fits LinkedIn's 3,000-char limit. Long-form posts on company pages perform OK; lean shorter if you want to repost as a separate Article instead.)

---

## LinkedIn — short variant

If the long-form post above feels heavy for a company-page debut, here's a tighter alternative (~700 chars):

```
OneNomad is launching przm today, an open-source, vendor-neutral AI reliability leaderboard.

The v0.1 finding worth flagging: holding the model constant (gpt-4o-mini), AutoGen's RoundRobin orchestration collapsed 0 of 6 sealed holdout scenarios where the hand-rolled baseline collapsed 5 of 6 (combined 30-fixture run: AutoGen 20%, baseline 90%). The framework choice is a load-bearing reliability variable, not just a developer-experience preference. Receipts at przm.sh/leaderboard.

Methodology is deterministic. No LLM in the grading loop. Every result is an Ed25519-signed receipt anyone can verify. Charter certifications open for AI framework vendors.

→ przm.sh (Apache-2.0)
```
