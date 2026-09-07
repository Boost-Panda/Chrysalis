// Server-only assessment content for the RevReply readiness artifact.
// Never imported by the client page — it reaches the browser only through
// the unlock API route after a correct password.
import { timingSafeEqual } from "crypto";

export type Finding = { n: string; title: string; body: string; aside?: string };

// PASSWORD: Ali sets the real one before sharing the link.
const PASSWORD = "RevReply2026!";

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Content transcribed from Ali's assessment (Claude artifact b6fc50f5, Sep 7 2026).
export const ASSESSMENT = {
  kicker: "RevReply · AI readiness assessment · September 2026",
  headline: {
    a: "The blocker is not AI talent.",
    b: "It is shared memory and process.",
    lead:
      "Five conversations, five seats, one root cause: what the team knows lives in people's heads, in chat threads, and on individual laptops. Nothing an agent, a new joiner, or a colleague in another seat can reference. All of it is buildable.",
  },
  stats: [
    { n: 5, label: "seats interviewed" },
    { n: 4, label: "systemic findings" },
    { n: 2, label: "agents sitting idle" },
    { n: 1, label: "shared layer to build" },
  ],
  preparedFor: "Ramsey Al-Ramahi",
  preparedBy: "Ali Raza",
  written: "written Sep 7, 2026 from five interviews on Sep 1–2 and the V1 models inventory",
  headlineSection: {
    eyebrow: "The headline",
    title: "This is good news, and it is cheaper than a hiring problem.",
    body: "Engineers cannot give their agents system context. Triage cannot tell a new issue from a repeat. The response reviewer cannot find the case she remembers. The classifier has no record of what it got wrong last week. Same cause, four symptoms.",
    body2:
      "The people are capable and most of them already use AI. The tooling is in hand; the practice is shallow and individual. What they lack is buildable: a shared knowledge base, a case memory, a shared library of skills that carries good practice to every developer, a gate between staging and production, and an owner for the classifier. RevReply also already owns two agents, a support agent and a PR-review bot, and neither is set up to work like an engineer.",
  },
  seats: {
    eyebrow: "Who uses what",
    title: "Five seats, one gap.",
    items: [
      {
        role: "Orchestrator + legacy developer",
        ai: "Heavy. Claude Code for reviews and refactoring; building an internal agent for debugging and writing.",
        pain: "No shared agent, no shared logs; carries both codebases; hiring bandwidth.",
      },
      {
        role: "Backend developer",
        ai: "Claude through the web UI, PHPStorm. No agentic workflow.",
        pain: "Agents cannot understand the system because there is no knowledge base; log and live-server access is slow; onboarding had no docs.",
      },
      {
        role: "Ticket board owner",
        ai: "AI-savvy. Uses the existing support agent (ticket and log tools) on the ops side. It has no engineering knowledge attached.",
        pain: "No tools to triage with confidence; cannot dedupe; no engineering wiki to point people to.",
      },
      {
        role: "Legacy maintenance developer",
        ai: "AI-assisted coding, but the setup has not moved in years: no skills, no newer tooling, no view of what is out there now.",
        pain: "Classifier misclassifications; unverified staging pushes hitting production; unclear ownership turning into blame.",
      },
      {
        role: "Response manager",
        ai: "None in the workflow. Reviews outgoing replies by hand; non-technical.",
        pain: "Repeat issues she remembers seeing but cannot find again; nothing is kept in one place.",
      },
    ],
  },
  findings: {
    eyebrow: "Findings",
    title: "Four things that are true today.",
    items: [
      {
        n: "01",
        title: "There is no shared knowledge base, and every seat feels it.",
        body: "Engineering has no wiki, no architecture notes, no onboarding docs; knowledge transfer happens person to person. Each developer's AI context is siloed on their own machine. On the ops side the same gap shows up as repeat issues: the board owner cannot tell whether a ticket is new, the response manager cannot find the earlier case, the legacy maintainer has proposed tracking similar cases from the last 30 days because nobody can today. Four people are solving the same problems repeatedly and none of it lands anywhere.",
      } as Finding,
      {
        n: "02",
        title: "Nothing stands between staging and production, and the classifier has no owner.",
        body: "Per the legacy maintainer: V1 runs in production, V2 in staging (Python-based); different branches run against each environment; pushes go to production without staging being verified; bad response logic has reached production and he counts 120+ tickets impacted. There is confusion inside the team about what pushes through Laravel versus Python, which is itself a symptom of the version drift. The \"blame game\" he describes is what an ownership gap looks like from the inside: when the classifier misbehaves, nobody is clearly on the hook, so the conversation becomes about fault instead of fix. High-priority tickets are missing their windows for the same reason.",
      } as Finding,
      {
        n: "03",
        title: "The response-quality feedback loop is broken.",
        body: "The response manager judges replies good or bad every day. You graded hundreds of classifier outputs line by line. The legacy maintainer sees misclassifications (a weekend run of 20+ cases where around 16 came back blank). None of that judgment is captured as data anyone can reuse. There is no LLM observability (no Langfuse or Braintrust), so when the model misfires nobody can see what it was thinking or which tool call failed. There is no PII redaction in front of LLM calls. Response generation built on this foundation would inherit the classifier's failure mode: misclassifications are already the number one issue source and they cascade straight into the reply.",
        aside:
          "The classifier itself, the most consequential call in the system, runs on azure/gpt-4.1-mini while the generators it feeds run claude-sonnet-4-5 and gemini-3.1-pro (per the V1 models page in Confluence).",
      } as Finding,
      {
        n: "04",
        title: "Two agents already exist, and neither works like an engineer.",
        body: "The existing support agent is used by one person. Where it runs, what it knows, what rubric it follows and how it improves are undocumented; it has ticket and log tools but no engineering context and no presence in the repos. The PR-review bot posts a PDF report into a Slack channel. Nobody can reply to it, ask why it flagged something, or see which guidelines it applied, and nothing it learns from one review reaches the next. Set up properly, one agent with the right context should be reviewing pull requests in the thread, triaging tickets against the client's actual requirements before an engineer spends time reproducing them, and opening pull requests with fixes when asked. That capacity is sitting idle today. Things are all over the place; the fix is to connect them: one agent, one wiki, one skills repo.",
      } as Finding,
    ],
  },
  layers: {
    caption:
      "Today nothing shares context. Proposed: one shared layer of two repos that every agent and every person reads from and writes to, with the two dead ends folded in.",
    today: {
      title: "Today · no shared layer",
      items: [
        ["Support agent", "one user · ticket + log tools"],
        ["Developer agents", "own context · on each laptop"],
        ["Review & triage", "people · from memory"],
        ["PR review bot", "PDF into a chat, no replies"],
        ["Models page in a docs tool", "read by no agent"],
      ],
    },
    proposed: {
      title: "Proposed · shared layer, two GitHub repos",
      items: [
        ["Wiki repo", "knowledge base + case memory"],
        ["Skills repo", "review · triage · fix · design"],
        ["Shared agent", "built from the support agent"],
        ["Developer agents", "same skills · same wiki"],
        ["Review & triage", "search cases · add cases · skills + wiki"],
        ["PR review bot", "becomes a skill, in the PR thread"],
        ["Models page", "mirrored into the wiki repo"],
      ],
    },
  },
  plan: {
    eyebrow: "The plan, in order",
    title: "Fix the process first. Build the shared layer next.",
    first: {
      label: "First",
      title: "Process fixes that need no build",
      items: [
        "A staging verification gate: nothing reaches production without a named person checking it in staging first.",
        "One named owner for the classifier codebase. This single decision removes most of the blame dynamic.",
        "A \"review required\" flag for low-confidence classifications, so a confused model asks for a human instead of sending a blank or a guess. The legacy maintainer proposed this and it is a quick win.",
        "One written statement of what moves to Python and what stays Laravel. The team is not aligned on this and the confusion is already causing drift.",
        "Run last week's failed classifications through the V1 classify prompt on a stronger model. It is a small experiment that tells you how much of the misclassification problem is model capacity.",
      ],
    },
    repos: {
      label: "Then · my hands",
      title: "The shared harness, part one: two repos",
      items: [
        {
          name: "A wiki repo on GitHub.",
          body: "The shared engineering and product knowledge base, in folder-based markdown that agents can read, seeded with architecture, environments, deploy path and runbooks; the existing Confluence pages, such as the V1 models inventory, get mirrored in rather than abandoned. The same repo holds the case memory: every misclassification and bad response, with what was done about it, in one searchable place. One piece of infrastructure serves four needs: the response manager's \"I have seen this before\" lookup, the board owner's dedupe, the legacy maintainer's similar-case tracking, and the evaluation dataset response generation will need anyway. The email embedding store already in the V1 service is a ready starting point. Agents maintain the wiki, people curate it. This is the pattern I run at Botterfly and BoostPanda today; it is proven, not an experiment.",
        },
        {
          name: "A skills repo on GitHub.",
          body: "Every skill the team uses lives in one versioned place, and any harness loads them, whether that is the shared agent, each developer's Claude Code, or the PR reviewer. Seeded from my own collection: code review, plan stress-testing (grilling), triage, domain modeling, codebase design, test-first development. Then custom RevReply skills on top: triage against the case memory, classifier debugging, response review. A skill is how the team's standard for a code review or a triage travels with the repo instead of living in one person's head. It is also how practice upgrades without a training program: a developer who runs the review skill gets the team's review, whether or not they follow the tooling news.",
        },
        {
          name: "The PR reviewer becomes the first skill in that repo.",
          body: "It reviews in the pull request thread instead of dropping a PDF in Slack, its rubric is a file anyone can read and edit, and it answers questions about its own review.",
        },
      ],
    },
    agent: {
      label: "Next",
      title: "The shared harness, part two: the agent",
      items: [
        "One shared agent, reachable in Slack, with the wiki repo as its context and the skills repo as its abilities, plus repo, ticket board and log access. Starting point is the support agent already in the building, once I can see how it is set up; take-over versus rebuild is decided after that, and after I see whatever has already been built toward one.",
        "Three jobs to start with: review pull requests in the thread, triage incoming tickets against the case memory and the client's requirements with the relevant logs attached, and open a pull request with a fix when someone asks it to.",
        "Log and environment access for the agent and for the developers waiting on it today.",
      ],
    },
  },
  trace: {
    eyebrow: "Before response generation starts",
    title: "See what the AI did, every single time",
    lead:
      "Today, when a reply goes wrong, nobody can see why. Two things fix that. Both are wiring, not research.",
    tracing: {
      name: "Tracing: a flight recorder for every AI decision",
      body: "Every time the system classifies an email or writes a reply, a trace records what went in, what the model was told, which tools it called, what came back, how long it took and what it cost. When a reply is wrong, you open the trace and see exactly where it went wrong: the classifier picked the wrong label, or a tool call failed and the model improvised. A bad reply stops being an argument and becomes a quick lookup, and every case in the case memory links to its trace. The same records let you score quality week over week and test a model change before it reaches a customer. Langfuse and Braintrust are the two off-the-shelf products for this. Neither requires building anything new, and Langfuse can run inside RevReply's own cloud, which matters for SOC 2.",
    },
    example: {
      title: "Example trace · illustrative",
      subtitle: "reply for inbound email #48213",
      steps: [
        { t: "0.0s", action: "Classify", detail: "gpt-4.1-mini · label: CHECK BACK LATER · confidence low", status: "ok" },
        { t: "0.8s", action: "Route", detail: "picked the check-back generator", status: "ok" },
        { t: "0.9s", action: "Calendar tool", detail: "fetch open slots · timed out after 4s", status: "failed" },
        { t: "4.9s", action: "Generate reply", detail: "gemini-3.1-pro · offered \"Tuesday at 3pm\" · no slot data was available", status: "improvised" },
        { t: "6.1s", action: "Send", detail: "reply delivered · 1,840 tokens · $0.012", status: "ok" },
      ],
      note: "This is the failure you cannot see today: a tool call failed, the model filled the gap with a made-up time, and the customer got a confident wrong answer. With tracing it is visible at a glance, and it becomes a case.",
    },
    redaction: {
      name: "Redaction: the model never learns who the person is",
      body: "A small piece of plain code strips names, email addresses and phone numbers before any text reaches a model, and puts them back into the reply afterwards. Not left to the model to \"be careful\": done in code, on every call, no exceptions. This is the question SOC 2 auditors and enterprise buyers will ask.",
      closing: "With those two in place, response generation on the rebuilt classifier can move fast and be measured.",
    },
  },
  practice: {
    eyebrow: "Alongside all of the above",
    title: "Practice",
    items: [
      "Move the one developer still coding through the web UI to an agentic workflow (Claude Code).",
      "A hands-on walkthrough per developer to install the skills library on real work. After that the skills do the teaching.",
    ],
  },
  access: {
    eyebrow: "What I need to start",
    title: "Access, not approvals.",
    lead: "Everything gets built inside RevReply's own accounts and repos. Design and hosting are my calls. From you I need access:",
    items: [
      ["GitHub org", "create repos and install a GitHub app for the agent"],
      ["Slack", "install and configure a bot app"],
      ["Ticket board", "admin or API access"],
      ["Logs, environments, cloud account", "read access to staging and production, and to the account the agent will run in"],
      ["Model providers", "the company's accounts and keys, so nothing runs on personal accounts"],
      ["Existing support agent", "where it runs, its configuration, credentials and source"],
      ["PR-review bot", "source and rubric"],
      ["Anything already built", "toward a harness or the classifier, so I do not rebuild what exists"],
    ],
  },
  speed: {
    eyebrow: "The difference this makes",
    title: "From days to minutes.",
    body: "Today a misclassified ticket can sit for days: someone notices, reproduces it, finds the similar case they half-remember, waits for a fix, and hopes the fix reaches production safely. With the shared layer, the same ticket is triaged against every past case in seconds, the fix is proposed as a pull request with the trace attached, and a human approves it — the whole loop in minutes, not days.",
    before: {
      label: "Today",
      items: ["Ticket noticed by a person", "Manually reproduced", "Similar case hunted from memory", "Fix queued behind other work", "Unverified push to production"],
    },
    after: {
      label: "With the shared layer",
      items: ["Agent triages on arrival", "Reproduction started automatically", "Similar cases attached in seconds", "Fix proposed as a pull request", "Human approves, gate verified"],
    },
    closing: "Triage and fix, measured in minutes. That is the difference a shared memory makes.",
  },
  selfPromo: {
    eyebrow: "One more thing",
    title: "This page is the demo.",
    body: "You are not looking at a deck an agency assembled. This assessment — the gated page, the diagrams, the build and deploy behind it — was produced by Botterfly, BoostPanda's agentic engineering system, working the same way the shared agent above would work in yours: a knowledge base it maintains, a library of skills it loads per job, every action verified before it reports done.",
    points: [
      "A wiki of everything learned — repos, decisions, runbooks — that any session can reference, so nothing lives only in one person's head.",
      "A skills repo where each job has a procedure: the same review, the same rigor, every time.",
      "Every claim on this page was verified against the real build before it reached you. That discipline is what we propose to bring to RevReply.",
    ],
    closing: "The plan above is not a theory. It is how this was built.",
  },
} as const;

export type Assessment = typeof ASSESSMENT;
