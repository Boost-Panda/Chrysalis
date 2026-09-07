"use client";

import type { CSSProperties } from "react";

type NodeProps = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  delay?: number;
  variant?: "today" | "repo" | "satellite" | "source" | "consumer" | "hub" | "event" | "action";
};

function Node({ x, y, w = 152, h = 52, title, sub, delay = 0, variant = "satellite" }: NodeProps) {
  return (
    <g className={`rr-node rr-node-${variant}`} style={{ "--rr-delay": `${delay}ms` } as CSSProperties}>
      <rect x={x} y={y} width={w} height={h} rx={6} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 4 : y + h / 2 + 4} className="rr-node-title">
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} className="rr-node-sub">
          {sub}
        </text>
      )}
    </g>
  );
}

function Wire({ d, delay = 0, reverse = false }: { d: string; delay?: number; reverse?: boolean }) {
  return (
    <path
      className={`rr-wire${reverse ? " rr-wire-return" : ""}`}
      d={d}
      style={{ "--rr-delay": `${delay}ms` } as CSSProperties}
      fill="none"
    />
  );
}

// Diagram 1 — today (isolated seats) vs proposed (one shared layer).
export function SharedLayerDiagram() {
  return (
    <svg viewBox="0 0 900 470" role="img" aria-label="Today: five isolated seats with no shared context. Proposed: one shared layer of two repos that every agent and person reads from and writes to.">
      <text x={30} y={36} className="rr-diagram-title">TODAY · NO SHARED LAYER</text>
      <Node x={40} y={80} title="Support agent" sub="one user · ticket + log tools" variant="today" delay={0} />
      <Node x={230} y={100} title="Developer agents" sub="own context · each laptop" variant="today" delay={120} />
      <Node x={40} y={210} title="Review & triage" sub="people · from memory" variant="today" delay={240} />
      <Node x={230} y={240} title="PR review bot" sub="PDF into chat · no replies" variant="today" delay={360} />
      <Node x={110} y={370} title="Models page" sub="docs tool · read by no agent" variant="today" delay={480} />

      <g className="rr-fix-arrow" style={{ "--rr-delay": "700ms" } as CSSProperties}>
        <path className="rr-wire rr-wire-strong" d="M 395 235 L 455 235" fill="none" />
        <polygon points="455,229 467,235 455,241" className="rr-arrowhead" />
        <text x={405} y={222} className="rr-node-sub">the fix</text>
      </g>

      <text x={505} y={36} className="rr-diagram-title rr-diagram-title-blue">PROPOSED · ONE SHARED LAYER, TWO REPOS</text>
      <Node x={575} y={170} w={180} h={60} title="Wiki repo" sub="knowledge base + case memory" variant="repo" delay={100} />
      <Node x={575} y={272} w={180} h={60} title="Skills repo" sub="review · triage · fix · design" variant="repo" delay={220} />
      <Node x={475} y={70} title="Shared agent" sub="built from support agent" delay={340} />
      <Node x={725} y={70} title="Developer agents" sub="same skills · same wiki" delay={420} />
      <Node x={475} y={392} title="Review & triage" sub="search + add cases" delay={500} />
      <Node x={725} y={392} title="PR review bot" sub="a skill, in the PR thread" delay={580} />
      <Node x={752} y={200} w={140} h={48} title="Models page" sub="mirrored into wiki" delay={660} />

      <Wire d="M 540 122 C 560 140, 580 150, 610 168" delay={800} />
      <Wire d="M 780 122 C 770 140, 740 150, 710 168" delay={860} />
      <Wire d="M 540 392 C 560 370, 580 355, 610 334" delay={920} />
      <Wire d="M 780 392 C 770 370, 740 355, 710 334" delay={980} />
      <Wire d="M 752 220 L 705 214" delay={1040} />
      <Wire d="M 620 170 L 620 236" delay={1100} />
    </svg>
  );
}

// Diagram 2 — the wiki repo: sources in, four consumers out, cases written back.
export function WikiFlowDiagram() {
  return (
    <svg viewBox="0 0 900 440" role="img" aria-label="Sources are ingested and cited by the agent into the wiki repo, which serves four consumers; each outcome is written back as a case.">
      <text x={30} y={30} className="rr-diagram-title">SOURCES · KEPT AS-IS</text>
      <Node x={30} y={60} title="Replies flagged" sub="by review" variant="source" delay={0} />
      <Node x={30} y={122} title="Tickets & incidents" variant="source" delay={80} />
      <Node x={30} y={184} title="Call & meeting notes" variant="source" delay={160} />
      <Node x={30} y={246} title="Existing docs pages" variant="source" delay={240} />
      <Node x={30} y={308} title="Code & deploy config" variant="source" delay={320} />

      <Node x={250} y={188} w={130} h={58} title="Agent ingests" sub="and cites" variant="hub" delay={420} />
      <Wire d="M 182 84 C 240 100, 260 140, 285 186" delay={500} />
      <Wire d="M 182 145 C 230 160, 245 170, 265 188" delay={540} />
      <Wire d="M 182 207 L 248 210" delay={580} />
      <Wire d="M 182 269 C 230 258, 245 248, 265 230" delay={620} />
      <Wire d="M 182 331 C 240 315, 260 275, 285 232" delay={660} />

      <g className="rr-node rr-node-repo" style={{ "--rr-delay": "760ms" } as CSSProperties}>
        <rect x={448} y={96} width={200} height={250} rx={8} />
        <text x={548} y={126} className="rr-node-title">Wiki repo</text>
        <text x={466} y={158} className="rr-node-sub rr-node-sub-left">pages/ — architecture,</text>
        <text x={466} y={174} className="rr-node-sub rr-node-sub-left">environments, deploy, runbooks</text>
        <text x={466} y={206} className="rr-node-sub rr-node-sub-left">cases/ — one file per bad reply:</text>
        <text x={466} y={222} className="rr-node-sub rr-node-sub-left">the email, the classification,</text>
        <text x={466} y={238} className="rr-node-sub rr-node-sub-left">what went wrong, the fix,</text>
        <text x={466} y={254} className="rr-node-sub rr-node-sub-left">who made it, when, linked</text>
        <text x={466} y={270} className="rr-node-sub rr-node-sub-left">to the ticket and the PR</text>
        <text x={466} y={302} className="rr-node-sub rr-node-sub-left">index.md · log.md —</text>
        <text x={466} y={318} className="rr-node-sub rr-node-sub-left">contents · every change, dated</text>
      </g>
      <Wire d="M 382 214 C 405 214, 420 214, 446 214" delay={800} />

      <text x={692} y={30} className="rr-diagram-title">WHO READS cases/</text>
      <Node x={692} y={60} w={180} title="Reviewer" sub="“seen this before?”" variant="consumer" delay={900} />
      <Node x={692} y={130} w={180} title="Triage" sub="dedupe + similar cases" variant="consumer" delay={980} />
      <Node x={692} y={200} w={180} title="Classifier debugging" variant="consumer" delay={1060} />
      <Node x={692} y={270} w={180} title="Eval set" sub="for response generation" variant="consumer" delay={1140} />
      <Wire d="M 650 150 C 672 130, 682 110, 700 96" delay={1200} />
      <Wire d="M 650 190 C 668 180, 678 165, 696 156" delay={1240} />
      <Wire d="M 650 240 C 668 240, 678 236, 696 232" delay={1280} />
      <Wire d="M 650 290 C 668 292, 678 296, 696 300" delay={1320} />

      <g className="rr-return-flow" style={{ "--rr-delay": "1400ms" } as CSSProperties}>
        <path className="rr-wire rr-wire-return" d="M 780 322 C 780 400, 620 420, 548 350" fill="none" />
        <polygon points="544,352 548,338 556,348" className="rr-arrowhead rr-arrowhead-return" />
        <text x={600} y={414} className="rr-node-sub">each outcome written back as a case update</text>
      </g>
      <text x={30} y={420} className="rr-diagram-note">Agents maintain the wiki, people curate it. The embedding store already in the V1 service is a ready starting point.</text>
    </svg>
  );
}

// Diagram 3 — the shared agent loop: event → skill → context → action → trace.
export function AgentFlowDiagram() {
  return (
    <svg viewBox="0 0 900 300" role="img" aria-label="An event arrives, the matching skill is loaded, context comes from the wiki, the action lands where the work is, and the outcome returns to the case memory with a trace.">
      <text x={30} y={30} className="rr-diagram-title">EVENTS</text>
      <Node x={30} y={60} title="PR opened" sub="GitHub" variant="event" delay={0} />
      <Node x={30} y={128} title="Ticket created" sub="ticket board" variant="event" delay={100} />
      <Node x={30} y={196} title="Question / “fix this”" sub="Slack" variant="event" delay={200} />

      <Node x={300} y={104} w={220} h={92} title="Shared agent" sub="wiki as context · skills as abilities" variant="hub" delay={320} />
      <text x={410} y={216} className="rr-node-sub">repos · logs · ticket board · models · chat</text>
      <Wire d="M 184 86 C 240 100, 260 115, 298 130" delay={420} />
      <Wire d="M 184 154 L 298 150" delay={460} />
      <Wire d="M 184 222 C 240 210, 260 190, 298 172" delay={500} />

      <text x={640} y={30} className="rr-diagram-title">ACTIONS</text>
      <Node x={640} y={60} title="Review" sub="in the PR thread" variant="action" delay={620} />
      <Node x={640} y={128} title="Triage note" sub="similar cases + logs" variant="action" delay={700} />
      <Node x={640} y={196} title="Answer" sub="or a PR with the fix" variant="action" delay={780} />
      <Wire d="M 522 128 C 580 115, 600 100, 638 88" delay={840} />
      <Wire d="M 522 150 L 638 150" delay={880} />
      <Wire d="M 522 172 C 580 188, 600 202, 638 212" delay={920} />

      <g className="rr-return-flow" style={{ "--rr-delay": "1040ms" } as CSSProperties}>
        <path className="rr-wire rr-wire-return" d="M 730 250 C 600 292, 300 292, 120 258" fill="none" />
        <polygon points="124,252 108,254 116,266" className="rr-arrowhead rr-arrowhead-return" />
        <text x={330} y={288} className="rr-node-sub">every model call traced · what happened written back: merged, resolved, corrected</text>
      </g>
    </svg>
  );
}
