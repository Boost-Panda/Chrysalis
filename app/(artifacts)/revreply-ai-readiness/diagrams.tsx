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

function Wire({ d, delay = 0, marker }: { d: string; delay?: number; marker?: string }) {
  return (
    <path
      className="rr-wire"
      d={d}
      markerEnd={marker ? `url(#${marker})` : undefined}
      style={{ "--rr-delay": `${delay}ms` } as CSSProperties}
      fill="none"
    />
  );
}

function ArrowMarker({ id, color = "blue" }: { id: string; color?: "blue" | "green" }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" className={color === "green" ? "rr-arrowhead rr-arrowhead-return" : "rr-arrowhead"} />
      </marker>
    </defs>
  );
}

// Diagram 1 — today (isolated seats) vs proposed (one shared layer).
export function SharedLayerDiagram() {
  const m = "sl-arrow";
  return (
    <svg viewBox="0 0 900 470" role="img" aria-label="Today: five isolated seats with no shared context. Proposed: one shared layer of two repos that every agent and person reads from and writes to.">
      <ArrowMarker id={m} />
      <text x={30} y={36} className="rr-diagram-title">TODAY · NO SHARED LAYER</text>
      <Node x={40} y={80} title="Support agent" sub="one user · ticket + log tools" variant="today" delay={0} />
      <Node x={230} y={100} title="Developer agents" sub="own context · each laptop" variant="today" delay={120} />
      <Node x={40} y={210} title="Review & triage" sub="people · from memory" variant="today" delay={240} />
      <Node x={230} y={240} title="PR review bot" sub="PDF into chat · no replies" variant="today" delay={360} />
      <Node x={110} y={370} title="Models page" sub="docs tool · read by no agent" variant="today" delay={480} />

      <g className="rr-fix-arrow" style={{ "--rr-delay": "700ms" } as CSSProperties}>
        <path className="rr-wire rr-wire-strong" d="M 395 235 L 449 235" fill="none" markerEnd={`url(#${m})`} />
        <text x={398} y={222} className="rr-node-sub">the fix</text>
      </g>

      <text x={505} y={36} className="rr-diagram-title rr-diagram-title-blue">PROPOSED · ONE SHARED LAYER, TWO REPOS</text>
      <Node x={475} y={70} title="Shared agent" sub="built from support agent" delay={340} />
      <Node x={725} y={70} title="Developer agents" sub="same skills · same wiki" delay={420} />
      <Node x={575} y={170} w={180} h={60} title="Wiki repo" sub="knowledge base + case memory" variant="repo" delay={100} />
      <Node x={575} y={272} w={180} h={60} title="Skills repo" sub="review · triage · fix · design" variant="repo" delay={220} />
      <Node x={762} y={252} w={128} h={48} title="Models page" sub="mirrored into wiki" delay={660} />
      <Node x={475} y={392} title="Review & triage" sub="search + add cases" delay={500} />
      <Node x={725} y={392} title="PR review bot" sub="a skill, in the PR thread" delay={580} />

      <Wire d="M 551 124 C 575 142, 605 156, 636 167" delay={800} marker={m} />
      <Wire d="M 801 124 C 775 142, 725 156, 694 167" delay={860} marker={m} />
      <Wire d="M 551 390 C 575 372, 610 348, 636 336" delay={920} marker={m} />
      <Wire d="M 801 390 C 775 372, 725 348, 694 336" delay={980} marker={m} />
      <Wire d="M 764 250 C 758 242, 756 236, 756 232" delay={1040} marker={m} />
    </svg>
  );
}

// Diagram 2 — the wiki repo: sources in, four consumers out, cases written back.
export function WikiFlowDiagram() {
  const m = "wf-arrow";
  return (
    <svg viewBox="0 0 900 440" role="img" aria-label="Sources are ingested and cited by the agent into the wiki repo, which serves four consumers; each outcome is written back as a case.">
      <ArrowMarker id={m} />
      <ArrowMarker id={`${m}-g`} color="green" />
      <text x={30} y={30} className="rr-diagram-title">SOURCES · KEPT AS-IS</text>
      <Node x={30} y={60} title="Replies flagged" sub="by review" variant="source" delay={0} />
      <Node x={30} y={122} title="Tickets & incidents" variant="source" delay={80} />
      <Node x={30} y={184} title="Call & meeting notes" variant="source" delay={160} />
      <Node x={30} y={246} title="Existing docs pages" variant="source" delay={240} />
      <Node x={30} y={308} title="Code & deploy config" variant="source" delay={320} />

      <Node x={250} y={188} w={130} h={58} title="Agent ingests" sub="and cites" variant="hub" delay={420} />
      <Wire d="M 182 86 C 228 110, 232 152, 246 196" delay={500} marker={m} />
      <Wire d="M 182 148 C 218 165, 228 186, 246 204" delay={540} marker={m} />
      <Wire d="M 182 210 L 246 214" delay={580} marker={m} />
      <Wire d="M 182 272 C 218 255, 228 234, 246 224" delay={620} marker={m} />
      <Wire d="M 182 334 C 228 310, 232 268, 246 232" delay={660} marker={m} />

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
      <Wire d="M 382 217 L 444 217" delay={800} marker={m} />

      <text x={692} y={30} className="rr-diagram-title">WHO READS cases/</text>
      <Node x={692} y={60} w={180} title="Reviewer" sub="“seen this before?”" variant="consumer" delay={900} />
      <Node x={692} y={130} w={180} title="Triage" sub="dedupe + similar cases" variant="consumer" delay={980} />
      <Node x={692} y={200} w={180} title="Classifier debugging" variant="consumer" delay={1060} />
      <Node x={692} y={270} w={180} title="Eval set" sub="for response generation" variant="consumer" delay={1140} />
      <Wire d="M 648 150 C 666 128, 676 108, 690 90" delay={1200} marker={m} />
      <Wire d="M 648 180 C 662 172, 676 164, 690 158" delay={1240} marker={m} />
      <Wire d="M 648 230 C 662 229, 676 228, 690 227" delay={1280} marker={m} />
      <Wire d="M 648 300 C 662 300, 676 299, 690 298" delay={1320} marker={m} />

      <g className="rr-return-flow" style={{ "--rr-delay": "1400ms" } as CSSProperties}>
        <path className="rr-wire rr-wire-return" d="M 782 324 C 782 402, 640 424, 556 352" fill="none" markerEnd={`url(#${m}-g)`} />
        <text x={548} y={396} className="rr-node-sub">each outcome written back as a case update</text>
      </g>
      <text x={30} y={420} className="rr-diagram-note">Agents maintain the wiki, people curate it. The embedding store already in the V1 service is a ready starting point.</text>
    </svg>
  );
}

// Diagram 3 — the shared agent loop: event → skill → context → action → trace.
export function AgentFlowDiagram() {
  const m = "af-arrow";
  return (
    <svg viewBox="0 0 900 300" role="img" aria-label="An event arrives, the matching skill is loaded, context comes from the wiki, the action lands where the work is, and the outcome returns to the case memory with a trace.">
      <ArrowMarker id={m} />
      <ArrowMarker id={`${m}-g`} color="green" />
      <text x={30} y={30} className="rr-diagram-title">EVENTS</text>
      <Node x={30} y={60} title="PR opened" sub="GitHub" variant="event" delay={0} />
      <Node x={30} y={128} title="Ticket created" sub="ticket board" variant="event" delay={100} />
      <Node x={30} y={196} title="Question / “fix this”" sub="Slack" variant="event" delay={200} />

      <Node x={300} y={104} w={220} h={92} title="Shared agent" sub="wiki as context · skills as abilities" variant="hub" delay={320} />
      <text x={410} y={216} className="rr-node-sub">repos · logs · ticket board · models · chat</text>
      <Wire d="M 184 88 C 235 100, 265 112, 296 126" delay={420} marker={m} />
      <Wire d="M 184 154 L 296 150" delay={460} marker={m} />
      <Wire d="M 184 220 C 235 206, 265 188, 296 174" delay={500} marker={m} />

      <text x={640} y={30} className="rr-diagram-title">ACTIONS</text>
      <Node x={640} y={60} title="Review" sub="in the PR thread" variant="action" delay={620} />
      <Node x={640} y={128} title="Triage note" sub="similar cases + logs" variant="action" delay={700} />
      <Node x={640} y={196} title="Answer" sub="or a PR with the fix" variant="action" delay={780} />
      <Wire d="M 522 126 C 560 112, 595 98, 636 90" delay={840} marker={m} />
      <Wire d="M 522 150 L 636 150" delay={880} marker={m} />
      <Wire d="M 522 174 C 560 188, 595 202, 636 214" delay={920} marker={m} />

      <g className="rr-return-flow" style={{ "--rr-delay": "1040ms" } as CSSProperties}>
        <path className="rr-wire rr-wire-return" d="M 730 250 C 600 292, 300 292, 122 260" fill="none" markerEnd={`url(#${m}-g)`} />
        <text x={330} y={288} className="rr-node-sub">every model call traced · what happened written back: merged, resolved, corrected</text>
      </g>
    </svg>
  );
}
