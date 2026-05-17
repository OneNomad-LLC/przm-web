# przm ICP map — who we sell to, in what order

Three concentric ICPs. Inner ring is the only one with money on day 1.
Middle ring is where the brand gets built. Outer ring is what makes
the brand referenceable.

## ICP 1 — Vendor-cert buyer (the only one with budget on day 1)

### Who they are

Head of DevRel, Head of Product, or founding engineer at a Series A-D
AI infrastructure company whose product is one of:

- A multi-agent framework (CrewAI, LangChain/LangGraph, Microsoft
  Agent Framework, agent runtimes from infra startups)
- An agent platform / orchestration SaaS (Crew Enterprise, LangSmith,
  Lindy, Relevance AI, Vellum, etc)
- An AI memory product that needs an external recall number (Mem0,
  Letta, Zep, MemPalace, HippoRAG)
- An LLM gateway / router that wants to advertise convergence-aware
  agent support (OpenRouter, Portkey, LiteLLM commercial)
- A vector DB or context-engine company that gets cited in
  retrieval-heavy agent stacks (Pinecone, Weaviate, Turbopuffer,
  Chroma Cloud)

Title: VP Engineering, Head of DevRel, Head of Growth, or founder.

Company stage: Has paid customers. Has a marketing budget line item.
Has shipped a launch in the last 60 days. Cares about appearing on
comparison pages because they get compared all day.

They buy with: a marketing budget, a competitive-benchmarking budget,
or a developer-relations content budget. Discretionary spend in the
$1K-$50K range without a procurement cycle.

### What pain we solve

They get asked "how do you compare to [competitor]?" on every sales
call and in every developer evaluation. Their answer today is one of:

- "We're better at X, look at our blog post." Self-published; reads
  as marketing.
- "Here's a customer case study." Anecdotal; one workload, biased
  selection.
- "Try it yourself." Friction; the prospect bounces.

What they need is a third-party number with a methodology page they
can link from their landing page and that survives an engineer's
skepticism. That's what a signed przm receipt is.

The deeper pain: if a competitor publishes a przm receipt first, our
ICP looks worse by absence. The asymmetry favors early movers, which
is the angle we sell on.

### What they pay

v0.1 reality check — we have zero customer logos, no signed receipts,
no leaderboard yet. **$999 is too high for a first transaction.** See
pushback section in the launch sequence. The honest first-customer
ladder:

| Customer rank | Price | Deliverable |
|---|---|---|
| 1-3 (charter) | $0 in exchange for: case-study rights, blog quote, public mention on the leaderboard launch | Signed receipt + cert badge they can use |
| 4-8 (early) | $999 flat | Signed receipt for one release, cert badge, listing |
| 9+ | $999 - $9,999 by company stage | Per-release cert with tiered SLAs |

Once 3-5 receipts are up and a leaderboard exists, the price ladder
becomes credible. Before that, the leaderboard is the product we're
selling, not the receipt.

### How they discover us

Three paths:

1. **The leaderboard itself.** Someone googling "best multi-agent
   framework benchmark" or "AutoGen vs LangGraph" lands on a
   leaderboard page with their competitor's number on it. They reach
   out so theirs is on it too.
2. **HN / Twitter X-thread launch.** Their head of DevRel sees the
   convergence benchmark in their feed, shares it internally, the VP
   forwards it to the founder, the founder asks "where do we rank?"
3. **Direct outbound.** Cold email from Matt to head of DevRel — see
   outreach playbook.

### Who already has their attention

- **Patronus, Braintrust, LangSmith, Helicone, Langfuse, Arize.** Eval
  / observability vendors that already sell to this same buyer. We
  don't compete; we sit upstream of them as the third-party that
  signs the receipt their dashboard reports against.
- **swyx (Latent Space).** Their de facto agent-framework critic.
  Coverage in Latent Space drives this buyer's attention more than
  any cold email.
- **Their own competitive comparison pages.** Every vendor in this
  segment maintains a "vs X" page; przm becomes the third-party they
  cite on those pages.
- **YC Demo Day batch alumni Slack / Discord.** Most of these
  founders cross-pollinate news there before anywhere else.

---

## ICP 2 — AI engineering manager evaluating frameworks (the brand-builder)

### Who they are

Senior engineering manager or staff engineer at a Series C+ tech
company, traditional enterprise digital team, or financial-services
AI team. Title: Director of AI Engineering, Principal Engineer,
Engineering Manager (AI Platform).

Company stage: 200-5000 employees, has 1-3 AI engineering pods,
shipped at least one agentic product to internal users in the last
year, currently evaluating "which agent framework do we standardize
on for the next 18 months."

They buy with: an evaluation budget that pays for POCs, sometimes a
contract with an analyst (Gartner, Forrester) but increasingly with
"a credible third-party benchmark someone shared on Slack."

### What pain we solve

The framework selection meeting. Someone in the room champions
LangGraph because they used it on a side project; someone else
champions Crew because their last team adopted it; the manager has to
decide and has no defensible data. Every vendor's docs say their
framework is best.

przm gives that manager a number to anchor the conversation. Not the
only input, but the one that turns the meeting from "preferences"
into "here's the convergence collapse rate; given our use case has
multi-agent debate, that matters most."

The deeper pain: when their team ships an agent that hallucinates a
wrong answer because of premature consensus, the manager owns the
post-mortem. A vendor-neutral benchmark gives them air cover for the
selection decision after the fact.

### What they pay

Nothing directly. This is the brand-building ICP, not the
revenue ICP. They consume the leaderboard for free; they may later
buy a custom evaluation if they're picking between two vendors and
want a private bench on their own use case ($5K-$25K, but that's
quarter-2+ revenue).

The reason to court them anyway: their reading habits drive ICP 1's
buying behavior. If 200 AI engineering managers cite przm in their
internal framework selection docs, ICP 1 starts asking why they
aren't on it.

### How they discover us

- **HN front page.** Tech-org engineering managers read HN at lunch.
  A "we measured how fast multi-agent frameworks collapse" post that
  hits front page reaches more of these people than any cold list
  could.
- **Latent Space, Interconnects, AI Tidbits.** These newsletters get
  forwarded around enterprise AI Slacks.
- **LinkedIn long-form posts.** This segment reads LinkedIn more than
  the founder set; an "I benchmarked five agent frameworks, here's
  the spread" post with a chart and the methodology link converts.
- **Conference talks (NeurIPS workshops, AI Engineer Summit, ODSC,
  QCon AI).** Out of scope for solo-founder Q1. Maybe Q3.

### Who already has their attention

- **Their own director or VP**, who reads Lenny's Newsletter, The
  Pragmatic Engineer, Latent Space.
- **Gartner / Forrester.** Slow to cite open-source benchmarks. We
  ignore them.
- **LinkedIn AI-engineering-influencer cluster** — the people who
  post weekly takes on agent frameworks with thousands of likes. We
  don't try to be them; we get cited by them.
- **Their internal Slack #ai-engineering channel**, which is where
  links die or spread.

---

## ICP 3 — AI researcher / academic / open-source maintainer (the credibility ICP)

### Who they are

PhD student, postdoc, research engineer at an AI lab (Ai2, EleutherAI,
HuggingFace research, BAIR, Stanford NLP, MILA), or a maintainer on
the GitHub of one of the frameworks we benchmark.

They are not the buyer. They are the gatekeeper of "is this
methodology actually rigorous, or is it benchmark theater?"

### What pain we solve

Nothing they pay to solve. What we offer them: a credible benchmark
to cite in papers, contributor credit on holdout fixtures, and the
specific signal that their framework's number went up or down across
versions (which is useful for them as PR feedback for their own
work).

### What they pay

Nothing. We pay them in attribution, citations, and PR access. They
pay us in legitimacy — a Nathan Lambert tweet saying "this
methodology is actually defensible" is worth more than three pieces
of paid coverage to ICPs 1 and 2.

### How they discover us

- **arXiv references** in our methodology pages. We cite the two
  papers (Peacemaker or Troublemaker; Disentangling Drivers of LLM
  Social Conformity) by name; the authors notice when their papers
  get cited in a benchmark.
- **GitHub Discussions** in the framework repos. We open one
  thread per framework asking adapter authors to review our adapter
  for fairness. That conversation pulls in people who watch those
  repos.
- **Twitter/X AI research cluster.** Nathan Lambert, Jeremy Howard,
  Sebastian Raschka, Andrej Karpathy, Aman Sanger, Sasha Rush. We
  don't tag them; if the work is good they find it. If we tag them,
  we look thirsty.

### Who already has their attention

- arXiv-sanity, Papers with Code, ML Twitter, ML Discord research
  channels.
- The specific subset of the AI Engineer Substack circuit that
  doubles as research: Sebastian Raschka, Lilian Weng's blog,
  Chip Huyen, swyx.

---

## What we don't pursue (and why)

- **CTO / CIO at Fortune 500.** Wrong sales cycle for our maturity.
  6-18 month enterprise procurement, RFPs, security reviews. We can't
  service them in 64 days. Eventually, but not now.
- **VC investors as a buyer.** A signed Crew receipt does not make
  Sequoia write a check. It might make Sequoia's portfolio company
  buy a cert. Indirect path; not an ICP, a downstream effect.
- **The general developer.** "I am a Python developer who messes with
  LLMs" is too broad. They don't have budget, they don't buy certs,
  they don't run procurement. They are a Reddit audience, not an
  ICP.

## Sequencing summary

- Week 1-2: ICP 3 (researchers) for credibility, then ICP 2
  (managers) for distribution.
- Week 2-4: ICP 1 (vendor buyers) for first revenue, contingent on
  ICPs 2-3 having created the air cover.
- Quarter 2+: enterprise custom-eval (a subset of ICP 2 with a
  separate motion).

If we try to sell to ICP 1 before ICPs 2 and 3 have legitimized us,
the answer is "who are you" and the conversation ends. Order matters.
