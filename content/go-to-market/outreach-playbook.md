# przm outreach playbook — three plays for week 1

Three concrete outreach motions for the launch week. Each has a real list of recipients (named, with public sources for the names), an actual email template, and a follow-up rule.

The rule across all three: every email is short, specific, names something only-our-research would have produced, and respects the recipient's time. If we can't write the email in under 150 words, we don't send it.

---

## PLAY 1 — Framework maintainer outreach ("respect move")

### Goal

Give each framework's lead maintainer a chance to see their number before we publish it. This is not a gotcha. It buys us three things:

1. A relationship with the people who will define whether we look like an "adversarial benchmark farm" or "the industry standard."
2. Adapter quality feedback. They know their framework's quirks better than we do.
3. A story to tell on launch: "We sent every framework's lead maintainer their numbers a week before publication."

### The recipients (with public sources)

| Framework | Lead person | Public handle(s) | How to contact | Source |
|---|---|---|---|---|
| **CrewAI** | João Moura, Founder/CEO | GitHub `@joaomdmoura`, X `@joaomdmoura` | DM on X, or email via crewai.com contact form | github.com/joaomdmoura (profile lists "Founder of crewAI") |
| **Microsoft Agent Framework** (successor to AutoGen) | (no individual maintainer named publicly on README; Microsoft team) | n/a individual | GitHub issue + Discord office hours per COMMUNITY.md | github.com/microsoft/agent-framework |
| **LangGraph / LangChain** | Harrison Chase, Co-founder | GitHub `@hwchase17`, X `@hwchase17` | DM on X; or harrison@langchain.dev (publicly listed in past LangChain materials) | github.com/hwchase17, langchain.com/about |
| **OpenAI Agents SDK** (successor to Swarm) | Ilan Bigio (DX), James Hills (DX) | GitHub `@ibigio`, `@jhills20` | DM via X, or via openai.com developer support form | github.com/openai/swarm README "Core Contributors" list |
| **AutoGen** (maintenance mode) | Microsoft team — community managed; aka.ms/autogen-discord | n/a individual | Discord; not high priority since maintenance-mode | github.com/microsoft/autogen |

Verify each before sending. The public-source data above was last refreshed early 2026 and roles may have shifted by launch (2026-05-19) and beyond.

### The email template (CrewAI variant; adapt sender language per recipient)

```
Subject: CrewAI's convergence number (heads-up before we publish)

Hi João,

I'm Matt Stvartak — I run OneNomad LLC and built przm.sh, an
open-source benchmark suite for AI reliability failure modes that
don't have a standard yet.

We just ran our multi-agent convergence benchmark across five
frameworks. CrewAI's numbers are:

  - correct_final_answer_rate:    [number]
  - collapse_rate:                [number]
  - sycophancy_ratio:             [number]

Full methodology + signed receipt:
https://przm.sh/methodology#convergence
https://przm.sh/results/[receipt-id]

We're going public with the full leaderboard on [date]. Two asks
before then:

1. Adapter review. Our CrewAI adapter is at
   github.com/OneNomad-LLC/przm-bench/blob/main/src/adapters/multiagent/crewai.ts
   — if anything looks unfair (parser leniency, prompt structure,
   default agent count), PRs welcome.

2. Charter customer. If CrewAI wants a signed receipt for use in
   your own marketing, the first 3-5 framework adopters get it FREE
   in exchange for a case-study quote. Three charter slots open
   today.

No reply needed if you'd rather not engage. We're publishing either
way; this is a courtesy heads-up so you're not learning it from HN.

— Matt
hello@mattstvartak.com
przm.sh
```

### Variants

- **For LangGraph (Harrison):** Add one line acknowledging that LangGraph is the most-cited framework in the literature on agent debate; we want their adapter to be the fairest.
- **For OpenAI Agents SDK (Ilan / James):** Skip the cert offer — OpenAI does not buy cert programs from third parties. Frame as "your number, your adapter, your feedback before we publish."
- **For Microsoft Agent Framework:** No individual recipient; post in their Discord office hours instead.
- **For AutoGen maintenance-mode community:** Post a GitHub Discussions thread; do not email. Acknowledge maintenance mode explicitly.

### Follow-up rule

- No reply in 5 business days → ONE follow-up.
- No reply to follow-up → publish, and reference in the launch thread neutrally.
- Substantive reply → engage on the merits. If they have a real adapter complaint, fix it before publishing.

### Honest assessment

Realistic expectation: 2 of 5 substantive replies. That's a win.

---

## PLAY 2 — Vendor-cert sales outreach (the revenue play)

### Goal

Get the first paid receipt sold — or, more honestly, get the first 3-5 charter customers signed at $0 in exchange for case-study rights, then start charging $999 once we have logos.

### Pre-requisite reality check

Charging $999 to a stranger in week 1 is a hard sell with zero brand. The ladder we run:

- **Week 1:** offer free signed receipts to 3-5 charter customers
- **Week 3:** $999 flat for one release receipt, no discount, only after at least 3 charter logos are public
- **Week 6+:** tiered $999-$9,999 by company stage and SLA

Lead with "you're going to be on the leaderboard either way; here's how you get the signed receipt that goes with it."

### The 15 target companies

| # | Company | Stage | Why they're a target | Angle to lead with |
|---|---|---|---|---|
| 1 | CrewAI | Series A | Entire pitch is "agents that work together." Convergence collapse is their nightmare. | "If you score well, you have the best evidence in the category." |
| 2 | LangChain Inc. (LangGraph) | Series A | Most-cited framework. They sell LangSmith on top. | "Your number either confirms or contests the dominant narrative; either way you want it pinned." |
| 3 | Mem0 | YC W24 | Memory-recall pitch. | "Get the signed receipt for your memory recall number on YOUR fixtures + our holdout." |
| 4 | Letta (MemGPT) | Seed/Series A | Memory + agent durability. | Same as Mem0. |
| 5 | Zep | YC W23 | Long-term agent memory. Sells temporal reasoning. | "LongMemEval-temporal is your strongest axis on paper; get the third-party receipt." |
| 6 | Crew Enterprise / Crew Studio | Same as #1 | Their enterprise customers ask about agent reliability constantly. | "Sales-side enablement: cite this in security questionnaire responses." |
| 7 | Lindy | Series A | Agent platform for businesses; sells reliability. | "Your prospects already ask 'how do you compare'; this gives you a number." |
| 8 | Relevance AI | Series A | Agent platform; competes with Lindy and Crew. | Same as Lindy. |
| 9 | Vellum AI | YC W23 | LLM ops + agent eval combined. | "You sell eval already; cert complements (doesn't compete with) your SKU." |
| 10 | Pinecone | Series B | Context for agents narrative. | "Show that agents-on-Pinecone resist convergence collapse better than alternatives." |
| 11 | Weaviate | Series B | Same vector-DB-for-agents angle. | Same as Pinecone. |
| 12 | Turbopuffer | Series A | New vector DB, hungry for differentiation. | "A cert receipt is a cheap differentiator." |
| 13 | OpenRouter | Bootstrapped | LLM gateway; convergence-aware routing in roadmap. | "Cert your routing layer's convergence-aware option; first gateway to have it." |
| 14 | Portkey | Series A | LLM gateway competitor to OpenRouter. | Same as OpenRouter. |
| 15 | Vapi / Bland / Retell | Series A each | Voice agent multi-turn = convergence in real-time. | "Voice agents that flip mid-call are your worst nightmare." |

Verify company stage and round before personalizing each email. Don't cite wrong rounds in cold outreach.

### Charter / free-tier email template

```
Subject: First 5 logos on przm's convergence leaderboard — free for charter customers

Hi [first name],

I'm Matt — I run OneNomad LLC and built przm.sh, a vendor-neutral
benchmark suite for AI reliability failure modes.

Our multi-agent convergence benchmark goes live [date]. Every major
framework gets benchmarked whether they ask to or not (CrewAI,
LangGraph, AutoGen, Agents SDK). The leaderboard is OSS, methodology
is published, all results are Ed25519-signed.

Your company is on my "should have a signed receipt for this"
shortlist. Specifically, [one-sentence-specific reason].

I'm signing the first 3-5 vendors as charter customers — free
release receipt + leaderboard placement, in exchange for a quote we
can use and permission to cite your company name on launch day.

15 minutes this week to walk you through the methodology and what
the signed receipt looks like?

przm.sh/vendor-cert
github.com/OneNomad-LLC/przm-bench

— Matt
hello@mattstvartak.com
```

### Follow-up rule

- No reply in 7 business days → ONE follow-up with news.
- No reply to follow-up → "Q2 list."
- Reply asking for time → propose 3 specific 15-min slots same email back.

### Honest assessment

Charter pitch should convert 2-4 of 15. First $999 follow-up: 1-2 once charter logos exist. Realistic month-1 revenue: $0-$2,000. Realistic Q1: $5K-$20K if the launch lands.

If we're not seeing 2 charter logos signed by week 2, the message is wrong, the targets are wrong, or the brand is too immature.

---

## PLAY 3 — Earned-media outreach (newsletter / writer pitches)

### Goal

Get one substantive write-up. We do NOT need all five to land — one is the difference between a soft launch and a real one.

### The five recipients

| # | Outlet | Author | Contact | Pitch shape | Notes |
|---|---|---|---|---|---|
| 1 | Interconnects | Nathan Lambert | mail@interconnects.ai | Methodology-deep; cite the arXiv papers | Best fit for our methodology angle. He has published critically about benchmark integrity. |
| 2 | Simon Willison's weblog | Simon Willison | X @simonw is best signal | Don't pitch directly; ensure HN post gets seen | He notices things on HN/X organically. |
| 3 | AI Tidbits | Sahar Mor + Arthur Mor | LinkedIn DM | News-format pitch | Newsletter format: weekly news roundup. |
| 4 | The Pragmatic Engineer | Gergely Orosz | pragmaticengineer.com newsletter pitch form | Long shot for v0.1; better fit with enterprise customer story | Audience is engineering managers / leadership. |
| 5 | Latent Space | swyx + Alessio | latent.space about page: no cold emails, warm intro required | DO NOT cold-email | Get cited by someone they follow. |

### Nathan Lambert variant

```
Subject: New benchmark — multi-agent convergence + sycophancy, signed receipts

Hi Nathan,

Long-time Interconnects reader — [specific recent post reference if
honest, otherwise omit].

I just shipped przm.sh — open-source, vendor-neutral benchmark
suite. v0.1 headline benchmark measures multi-agent convergence and
sycophancy in CrewAI / AutoGen / LangGraph / Microsoft Agent
Framework / OpenAI Agents SDK. Methodology cites Peacemaker or
Troublemaker (arXiv 2509.23055) and Disentangling Drivers of LLM
Social Conformity (arXiv 2508.14918).

Every receipt is Ed25519-signed; no LLM in the scoring loop;
fixture SHA + container hash + model version all pinned. Holdout
split modeled on LongMemEval's protocol.

Methodology: https://przm.sh/methodology#convergence
Repo: https://github.com/OneNomad-LLC/przm-bench (Apache-2.0)

If it's worth a Tidbit in Interconnects, I'd be honored. Happy to
walk through the methodology threats-to-validity section, which is
where I'd want the rigor questioned hardest.

— Matt Stvartak
OneNomad LLC
hello@mattstvartak.com
```

### Variants

- **AI Tidbits:** Drop the methodology depth; emphasize "first vendor-neutral leaderboard for AI failure modes that don't have standards yet."
- **Pragmatic Engineer:** Hold off until Q2.
- **Latent Space:** Do not cold email.

### Follow-up rule

- No reply in 7 days → ONE follow-up: "Closing the loop, leaderboard went live yesterday; here's the launch thread if useful."
- No reply to follow-up → stop.

### Honest assessment

Realistic launch-month coverage: 1 of 5. Two would be exceptional. Zero means the methodology page wasn't rigorous enough or the news hook wasn't sharp enough.

---

## Tactical execution notes

- **Send emails on Tuesday-Thursday morning** in the recipient's timezone.
- **One email per recipient per week, maximum.**
- **Track in a single sheet** (Notion DB or plain CSV).
- **Reply within 2 hours** during US business hours if a recipient responds.
- **Never send a templated email with the placeholder visible.**
