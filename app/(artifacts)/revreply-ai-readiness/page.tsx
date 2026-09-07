"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button, Column, Grid, ListItem, PasswordInput, Stack, Tag, Tile, UnorderedList } from "@carbon/react";
import { ArrowDown, ArrowRight, Checkmark, Locked, Renew } from "@carbon/icons-react";

// PASSWORD: Ali will set the real one. This client-side invitation gate is not secure authentication.
const PASSWORD = 'CHANGEME-PENDING';
const PUBLISHED = "2026-09-07";

// CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
const DIMENSIONS = [
  {
    title: "Data readiness", score: 72, cue: "Build on reliable inputs", number: "01",
    description: "Can AI find the right information—and trust what it finds?",
    observations: ["Map where customer and conversation records live.", "Check a sample for missing fields, duplicates and consent.", "Agree which source wins when records disagree."],
  },
  // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
  {
    title: "Tooling & stack", score: 68, cue: "Connect before adding", number: "02",
    description: "Can your existing tools work together without another layer of manual effort?",
    observations: ["Review available integrations and access permissions.", "Test one end-to-end handoff in a safe environment.", "Identify who owns failures, retries and monitoring."],
  },
  // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
  {
    title: "Team & skills", score: 58, cue: "Make people part of the system", number: "03",
    description: "Will the people using AI know when to trust it—and when to step in?",
    observations: ["Find a business champion and a day-to-day owner.", "Practice reviewing AI output with realistic examples.", "Create a simple way for users to flag bad results."],
  },
  // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
  {
    title: "Process maturity", score: 64, cue: "Start with one repeatable job", number: "04",
    description: "Is the workflow clear enough to improve before you automate it?",
    observations: ["Document the steps, exceptions and human approvals.", "Measure today’s time spent and quality of outcomes.", "Choose a narrow pilot with a clear definition of success."],
  },
  // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
  {
    title: "Governance & risk", score: 48, cue: "Set the boundaries early", number: "05",
    description: "Are there clear rules for what AI can see, say and do?",
    observations: ["Agree which data must never reach an AI provider.", "Keep human approval for consequential actions.", "Define retention, audit trails and a way to stop the pilot."],
  },
];
const OVERALL = Math.round(DIMENSIONS.reduce((sum, dimension) => sum + dimension.score, 0) / DIMENSIONS.length);

// CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
const NEXT_STEPS = [
  { title: "Validate the starting point", detail: "Walk through one real workflow with its owner. Confirm the data, tools and constraints before treating any score as a finding.", output: "Output · an evidence-backed baseline" },
  { title: "Design a contained pilot", detail: "Choose one repetitive task with low downside. Set a measurable goal, human review and clear stop conditions.", output: "Output · a focused pilot brief" },
  { title: "Prove value, then expand", detail: "Compare results with the baseline. Review quality, time saved and user feedback before deciding whether to scale.", output: "Output · a go / no-go decision" },
];

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.dataset.motion = "pending";
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.motion = "visible";
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`rr-reveal ${className}`} style={{ "--rr-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

function Gauge({ score, label, large = false }: { score: number; label: string; large?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    let started = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = () => {
      if (started) return;
      started = true;
      const beginning = performance.now();
      const tick = (now: number) => {
        const progress = motion.matches ? 1 : Math.min((now - beginning) / 1400, 1);
        setValue(Math.round(score * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = window.IntersectionObserver ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { start(); observer?.disconnect(); }
    }, { threshold: 0.2 }) : null;
    if (observer) observer.observe(element);
    else start();
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); };
  }, [score]);
  return (
    <div ref={ref} className={`rr-gauge ${large ? "rr-gauge-large" : ""}`} role="meter" aria-label={`${label} — illustrative score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle className="rr-gauge-track" cx="80" cy="80" r="69" />
        <circle className="rr-gauge-fill" cx="80" cy="80" r="69" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - value} />
      </svg>
      <div className="rr-gauge-value" aria-hidden="true"><span>{value}</span><small>/ 100</small></div>
    </div>
  );
}

function Assessment({ onLock }: { onLock: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [showAgenda, setShowAgenda] = useState(false);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  return (
    <div id="assessment" className="rr-assessment">
      <nav className="rr-nav" aria-label="Assessment sections">
        <a href="#overview">01 / The opportunity</a><a href="#dimensions">02 / Five dimensions</a><a href="#verdict">03 / The way forward</a>
        <Button kind="ghost" size="sm" renderIcon={Locked} onClick={onLock}>Close assessment</Button>
      </nav>
      {/* // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5 */}
      <section id="overview" className="rr-hero rr-section">
        <Grid>
          <Column lg={10} md={8} sm={4}>
            <Reveal><p className="rr-eyebrow">01 / The opportunity</p><h1 ref={heading} tabIndex={-1}>Less AI guesswork.<br /><span>A clearer next move.</span></h1>
              <p className="rr-lead">RevReply · AI readiness assessment</p>
              <p className="rr-body">A practical look at the foundations that turn AI ambition into useful work. Before investing in more tools, understand what is ready, what needs attention and where a focused pilot could make a difference.</p>
              <div className="rr-hero-actions"><Button href="#dimensions" renderIcon={ArrowDown}>Explore the assessment</Button><span className="rr-caption">Five dimensions. One grounded starting point.</span></div>
            </Reveal>
          </Column>
          <Column lg={6} md={8} sm={4}>
            <Reveal delay={180} className="rr-opportunity">
              <div className="rr-orbit" aria-hidden="true"><div /><div /><div /><span>AI<br /><small>with intention</small></span></div>
              <p className="rr-eyebrow">The question is not “Can we use AI?”</p><p className="rr-orbit-caption">It is “Where can AI<br />earn its place?”</p>
            </Reveal>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <Reveal delay={250}><Tile className="rr-disclaimer"><Tag type="warm-gray">Illustrative, not evaluated</Tag><p>All scores and observations below are placeholder examples for discussion. They are not findings about RevReply, an audit or a prediction of results. No client data was used.</p></Tile></Reveal>
          </Column>
        </Grid>
      </section>

      {/* // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5 */}
      <section id="dimensions" className="rr-section rr-dimensions" aria-labelledby="dimensions-title">
        <Grid>
          <Column lg={6} md={8} sm={4}><Reveal><p className="rr-eyebrow">02 / The foundations</p><h2 id="dimensions-title">Readiness is more<br />than technology.</h2></Reveal></Column>
          <Column lg={8} md={8} sm={4}><Reveal delay={120}><p className="rr-lead">Five lenses. A more complete picture.</p><p className="rr-body">We look at the information, systems, people and guardrails around a workflow—not just the model. Each lens helps identify what a responsible first step would require.</p><p className="rr-caption rr-scale">Illustrative scale: 0 = foundations absent · 100 = foundations established.<br />Scores demonstrate the format; they are not benchmarked or validated.</p></Reveal></Column>
        </Grid>
        <Grid className="rr-cards">
          {DIMENSIONS.map((dimension, index) => (
            <Column key={dimension.title} lg={index === 4 ? 16 : 8} md={8} sm={4}>
              <Reveal delay={index % 2 * 100}>
                <Tile className={`rr-dimension ${index === 4 ? "rr-dimension-wide" : ""}`}>
                  <div className="rr-card-copy"><p className="rr-eyebrow"><span className="rr-index">{dimension.number}</span>{dimension.cue}</p><h3>{dimension.title}</h3><p className="rr-card-description">{dimension.description}</p>
                    <p className="rr-caption rr-observations-label">What we would investigate</p>
                    <UnorderedList>{dimension.observations.map(observation => <ListItem key={observation}>{observation}</ListItem>)}</UnorderedList>
                  </div>
                  <div className="rr-card-score"><Gauge score={dimension.score} label={dimension.title} /><p className="rr-caption">Illustrative score</p></div>
                </Tile>
              </Reveal>
            </Column>
          ))}
        </Grid>
      </section>

      {/* // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5 */}
      <section id="verdict" className="rr-section rr-verdict" aria-labelledby="verdict-title">
        <Grid>
          <Column lg={9} md={8} sm={4}><Reveal><p className="rr-eyebrow">03 / The way forward</p><Tag type="blue">Illustrative verdict</Tag><h2 id="verdict-title">A focused pilot.<br />Not a leap of faith.</h2><p className="rr-lead">Build confidence before you build at scale.</p><p className="rr-body">In this example, the technical foundations are ahead of the operating guardrails. The sensible next move would be to validate the evidence, strengthen ownership and test one bounded workflow with a human in the loop.</p><p className="rr-caption rr-scale">This is a draft scenario—not a recommendation based on a completed RevReply assessment.</p></Reveal></Column>
          <Column lg={7} md={8} sm={4}><Reveal delay={160} className="rr-overall"><p className="rr-eyebrow">Overall readiness · example</p><Gauge score={OVERALL} label="Overall readiness" large /><p className="rr-overall-caption">Room to build. Reason to focus.</p><p className="rr-caption">Rounded, equally weighted average of the five example scores.<br />Not a probability of success.</p></Reveal></Column>
        </Grid>
        {/* // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5 */}
        <div id="next-steps" className="rr-next-steps">
          <Grid><Column lg={16} md={8} sm={4}><Reveal><h3>Three steps from ambition to evidence.</h3></Reveal></Column>
            {NEXT_STEPS.map((step, index) => <Column key={step.title} lg={index === 2 ? 6 : 5} md={8} sm={4}><Reveal delay={index * 110}><Tile className="rr-step"><span className="rr-step-number">0{index + 1}</span><h4>{step.title}</h4><p>{step.detail}</p><p className="rr-caption rr-step-output"><Checkmark size={16} />{step.output}</p></Tile></Reveal></Column>)}
          </Grid>
        </div>
      </section>

      {/* // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5 */}
      <section id="conversation" className="rr-section rr-closing" aria-labelledby="closing-title">
        <Grid>
          <Column lg={10} md={8} sm={4}><Reveal><p className="rr-eyebrow">The next conversation</p><h2 id="closing-title">Bring one workflow.<br />Let’s find the right first move.</h2><p className="rr-lead">No transformation theatre. A clear problem, a small test and evidence you can act on.</p><Button renderIcon={ArrowRight} aria-expanded={showAgenda} aria-controls="discovery-agenda" onClick={() => setShowAgenda(!showAgenda)}>{showAgenda ? "Hide the conversation guide" : "Prepare our first conversation"}</Button>
            {showAgenda && <Tile id="discovery-agenda" className="rr-agenda"><h3>Your discovery conversation</h3><p>Reply to the person who shared this assessment to arrange a discussion. Bring these three things:</p><UnorderedList><ListItem>One repetitive workflow and the person who owns it.</ListItem><ListItem>A description of the tools and data involved—no sensitive records.</ListItem><ListItem>What a better outcome would look like, and what must not go wrong.</ListItem></UnorderedList><p className="rr-caption">This guide does not send a message or book a meeting.</p></Tile>}
          </Reveal></Column>
          <Column lg={6} md={8} sm={4}><Reveal delay={180} className="rr-closing-note"><Renew size={32} /><p>Start small.<br />Learn deliberately.<br />Scale what works.</p></Reveal></Column>
        </Grid>
      </section>
      <footer className="rr-footer"><span>BoostPanda / Prepared for a RevReply conversation</span><span>Draft proposal · No client data · {PUBLISHED}</span></footer>
    </div>
  );
}

export default function RevReplyReadinessPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [shaking, setShaking] = useState(false);

  return (
    <main className="rr">
      <div className="rr-masthead"><span className="rr-wordmark">BoostPanda <span>/ RevReply</span></span><div className="rr-tags"><Tag type="blue">AI readiness assessment</Tag><Tag type="warm-gray">Draft — pending final review</Tag><Tag type="gray">Published {PUBLISHED}</Tag></div></div>
      {unlocked ? <Assessment onLock={() => { setUnlocked(false); setPassword(""); setInvalid(false); window.scrollTo({ top: 0 }); }} /> : (
        // CONTENT-TODO(Ali): replace with final copy from Claude artifact b6fc50f5
        <section className="rr-gate" aria-labelledby="invitation-title">
          <Grid>
            <Column lg={9} md={8} sm={4}><div className="rr-invitation"><p className="rr-eyebrow">A conversation worth opening</p><h1 id="invitation-title">Your next chapter<br />with AI starts<br /><span>with clarity.</span></h1><p className="rr-lead">RevReply · AI readiness assessment</p><p className="rr-body">An invitation to explore what a thoughtful first step with AI could look like. Prepared by BoostPanda for our conversation.</p><div className="rr-invitation-line" aria-hidden="true" /><p className="rr-caption">A considered starting point. Not another tool pitch.</p></div></Column>
            <Column lg={6} md={8} sm={4}><Tile className={`rr-gate-card ${shaking ? "rr-shake" : ""}`} onAnimationEnd={() => setShaking(false)}><Stack gap={6}><Locked size={28} /><div><p className="rr-eyebrow">Your invitation</p><h2>Welcome, RevReply.</h2><p>Use the password shared with you to open the draft assessment.</p></div><form onSubmit={event => { event.preventDefault(); if (password === PASSWORD) { setPassword(""); setUnlocked(true); } else { setInvalid(true); setShaking(true); } }}><Stack gap={5}><PasswordInput id="invitation-password" labelText="Invitation password" value={password} autoComplete="off" invalid={invalid} invalidText={<span role="alert">That password does not match. Please try again.</span>} onChange={event => { setPassword(event.target.value); setInvalid(false); }} required /><Button type="submit" renderIcon={ArrowRight}>Open the assessment</Button></Stack></form><p className="rr-caption">Need the password? Ask the person who sent you this link.</p></Stack></Tile></Column>
          </Grid>
          <div className="rr-gate-footer"><span>Prepared with intention. Built for discussion.</span><span>BoostPanda / 2026</span></div>
        </section>
      )}
      <style jsx global>{`
        .rr { color: var(--cds-text-primary); background: var(--cds-background); min-height: 100vh; --rr-blue: var(--cds-link-primary); }
        .rr * { box-sizing: border-box; }
        .rr .cds--css-grid { max-width: 1440px; }
        .rr h1, .rr h2, .rr h3, .rr h4, .rr p { margin: 0; }
        .rr h1 { font-size: clamp(3rem, 5.3vw, 5.75rem); font-weight: 300; line-height: 1.06; letter-spacing: -0.035em; }
        .rr h1 span { color: var(--rr-blue); }
        .rr h2 { font-size: clamp(2.25rem, 3.5vw, 3.75rem); font-weight: 300; line-height: 1.12; letter-spacing: -0.025em; }
        .rr h3 { font-size: 1.75rem; font-weight: 300; line-height: 1.2; }
        .rr h4 { font-size: 1.5rem; font-weight: 400; line-height: 1.25; }
        .rr .rr-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.12em; line-height: 1.6; margin-bottom: 1.25rem; color: var(--cds-text-secondary); }
        .rr .rr-lead { font-size: clamp(1.25rem, 2vw, 1.625rem); font-weight: 300; line-height: 1.45; margin-top: 1.75rem; max-width: 40rem; }
        .rr .rr-body { font-size: 1rem; line-height: 1.65; max-width: 35rem; margin-top: 1rem; color: var(--cds-text-secondary); }
        .rr .rr-caption { font-size: 0.75rem; line-height: 1.6; color: var(--cds-text-secondary); letter-spacing: 0.01em; }
        .rr-masthead { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1.25rem 2rem; border-bottom: 1px solid var(--cds-border-subtle-01); background: var(--cds-layer-01); }
        .rr-wordmark { font-weight: 600; font-size: 0.875rem; white-space: nowrap; }
        .rr-wordmark > span { font-weight: 400; color: var(--cds-text-secondary); margin-left: 0.75rem; }
        .rr-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; }
        .rr-gate { padding-top: clamp(3rem, 8vh, 7rem); }
        .rr-invitation { padding: 1rem 0 3rem; animation: rr-enter 850ms both; }
        .rr-invitation-line { height: 2px; width: 6rem; background: var(--rr-blue); margin: 2.5rem 0 1rem; transform-origin: left; animation: rr-line 1200ms 200ms both; }
        .rr .rr-gate-card { margin-top: 2rem; padding: 2.5rem; background: var(--cds-layer-01); border-top: 3px solid var(--rr-blue); animation: rr-enter 900ms 120ms both; }
        .rr-gate-card h2 { font-size: 2rem; margin-bottom: 1rem; }
        .rr-gate-card p { line-height: 1.6; }
        .rr-gate-card .cds--btn { width: 100%; max-width: none; }
        .rr .rr-shake { animation: rr-shake 380ms ease-in-out; }
        .rr-gate-footer, .rr-footer { display: flex; justify-content: space-between; gap: 1rem; margin: 3rem 2rem 0; padding: 1.5rem 0; border-top: 1px solid var(--cds-border-subtle-01); font-size: 0.75rem; color: var(--cds-text-secondary); }
        .rr-nav { display: flex; align-items: center; gap: 2rem; padding: 0.75rem 2rem; border-bottom: 1px solid var(--cds-border-subtle-01); background: var(--cds-layer-01); }
        .rr-nav a { font-size: 0.75rem; text-decoration: none; color: var(--cds-text-secondary); }
        .rr-nav a:hover { color: var(--rr-blue); }
        .rr-nav .cds--btn { margin-left: auto; }
        .rr-section { padding: 6rem 0; scroll-margin-top: 1rem; }
        .rr-assessment { animation: rr-enter 650ms both; }
        .rr-hero { padding-top: 5rem; }
        .rr-hero-actions { display: flex; align-items: center; gap: 1.5rem; margin-top: 2rem; }
        .rr-opportunity { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1rem; }
        .rr-orbit { position: relative; width: 240px; height: 240px; margin-bottom: 2rem; }
        .rr-orbit > div { border: 1px solid var(--cds-border-subtle-02); position: absolute; inset: 0; border-radius: 50%; animation: rr-orbit 4s ease-in-out; }
        .rr-orbit > div:nth-child(2) { inset: 25px; border-color: var(--cds-border-interactive); animation-delay: 150ms; }
        .rr-orbit > div:nth-child(3) { inset: 50px; animation-delay: 300ms; }
        .rr-orbit > span { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 3.5rem; font-weight: 300; color: var(--rr-blue); }
        .rr-orbit small { font-size: 0.75rem; line-height: 2; color: var(--cds-text-secondary); }
        .rr .rr-orbit-caption { font-size: 1.75rem; font-weight: 300; line-height: 1.3; }
        .rr .rr-disclaimer { display: flex; gap: 1.5rem; align-items: center; border-left: 2px solid var(--cds-border-strong-01); margin-top: 4rem; padding: 1.25rem 1.5rem; }
        .rr-disclaimer .cds--tag { flex-shrink: 0; }
        .rr-disclaimer p { max-width: 58rem; font-size: 0.875rem; line-height: 1.5; color: var(--cds-text-secondary); }
        .rr-dimensions { background: var(--cds-layer-01); border-block: 1px solid var(--cds-border-subtle-01); }
        .rr-dimensions .rr-lead { margin-top: 0; }
        .rr .rr-scale { margin-top: 1.5rem; }
        .rr-cards { margin-top: 3rem; row-gap: 1.5rem; }
        .rr-cards .rr-reveal { height: 100%; }
        .rr .rr-dimension { height: 100%; padding: 2rem; background: var(--cds-background); display: flex; gap: 1rem; justify-content: space-between; border-top: 2px solid var(--cds-border-subtle-01); transition: transform 220ms, border-color 220ms; }
        .rr-dimension:hover { transform: translateY(-4px); border-top-color: var(--rr-blue); }
        .rr-card-copy { min-width: 0; flex: 1; }
        .rr-index { display: block; color: var(--rr-blue); margin-bottom: 1rem; font-size: 0.875rem; }
        .rr .rr-card-description { font-size: 1rem; line-height: 1.5; margin-top: 0.75rem; max-width: 33rem; }
        .rr .rr-observations-label { margin-top: 2rem; margin-bottom: 0.75rem; }
        .rr .cds--list--unordered { margin-left: 1rem; }
        .rr .cds--list__item { color: var(--cds-text-secondary); font-size: 0.875rem; line-height: 1.5; padding-bottom: 0.5rem; }
        .rr-card-score { flex: 0 0 126px; text-align: center; padding-top: 1.25rem; }
        .rr-gauge { position: relative; width: 126px; height: 126px; margin: 0 auto 1rem; }
        .rr-gauge svg { width: 100%; height: 100%; transform: rotate(-90deg); overflow: visible; }
        .rr-gauge circle { fill: none; stroke-width: 5; }
        .rr-gauge-track { stroke: var(--cds-border-subtle-01); }
        .rr-gauge-fill { stroke: var(--rr-blue); stroke-linecap: round; }
        .rr-gauge-value { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .rr-gauge-value span { font-size: 2.625rem; font-weight: 300; font-variant-numeric: tabular-nums; }
        .rr-gauge-value small { font-size: 0.75rem; color: var(--cds-text-secondary); margin-top: 0.5rem; }
        .rr-dimension-wide .rr-card-score { flex-basis: 30%; }
        .rr-dimension-wide .rr-card-copy { max-width: 48rem; }
        .rr-verdict h2 { margin-top: 1.25rem; }
        .rr-overall { text-align: center; padding-top: 1rem; }
        .rr-gauge-large { width: 256px; height: 256px; margin: 1.5rem auto; }
        .rr-gauge-large .rr-gauge-value span { font-size: 5.5rem; }
        .rr .rr-overall-caption { font-size: 1.5rem; font-weight: 300; margin-bottom: 0.75rem; }
        .rr-next-steps { margin-top: 5rem; scroll-margin-top: 2rem; }
        .rr-next-steps .cds--css-grid { row-gap: 1.5rem; }
        .rr-next-steps .rr-reveal { height: 100%; }
        .rr .rr-step { padding: 2rem; height: 100%; border-top: 1px solid var(--cds-border-interactive); }
        .rr-step-number { display: block; font-size: 2.625rem; font-weight: 300; color: var(--rr-blue); margin-bottom: 2rem; }
        .rr-step h4 { margin-bottom: 1rem; }
        .rr-step p { font-size: 0.875rem; line-height: 1.6; }
        .rr .rr-step-output { display: flex; gap: 0.5rem; align-items: flex-start; margin-top: 2rem; }
        .rr-step-output svg { flex-shrink: 0; }
        .rr-closing { background: var(--cds-layer-01); border-top: 1px solid var(--cds-border-subtle-01); }
        .rr-closing .cds--btn { margin-top: 2rem; }
        .rr-closing-note { border-left: 1px solid var(--cds-border-subtle-02); margin: 2rem 0; padding: 0 0 0 3rem; color: var(--rr-blue); }
        .rr-closing-note p { margin-top: 3rem; font-size: 1.75rem; font-weight: 300; line-height: 1.5; }
        .rr .rr-agenda { margin-top: 2rem; border-left: 2px solid var(--rr-blue); padding: 1.5rem; animation: rr-enter 400ms both; }
        .rr-agenda p { margin-block: 1rem; line-height: 1.5; }
        .rr-footer { margin-top: 0; }
        .rr-reveal { transition: opacity 750ms var(--rr-delay), transform 750ms var(--rr-delay); }
        .rr-reveal[data-motion="pending"] { opacity: 0; transform: translateY(28px); }
        .rr-reveal[data-motion="visible"], .rr-reveal:focus-within { opacity: 1; transform: none; }
        @keyframes rr-enter { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes rr-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes rr-shake { 0%, 100% { transform: translateX(0); } 25%, 75% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
        @keyframes rr-orbit { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.9); } }
        @media (min-width: 66rem) { .rr-gate-card { position: relative; top: 1rem; } }
        @media (max-width: 65.99rem) { .rr-opportunity { margin-top: 3rem; } .rr-dimensions .rr-lead { margin-top: 2rem; } .rr-nav { gap: 1rem; flex-wrap: wrap; } .rr-masthead { flex-wrap: wrap; } .rr-closing-note { margin-top: 3rem; } .rr-overall { margin-top: 3rem; } }
        @media (max-width: 41.99rem) { .rr-masthead, .rr-nav { padding: 1rem; } .rr-tags { gap: 0; } .rr-section { padding: 3.5rem 0; } .rr-gate { padding-top: 2rem; } .rr .rr-gate-card { padding: 1.5rem; margin-top: 0; } .rr-gate-footer, .rr-footer { flex-direction: column; margin-inline: 1rem; } .rr-hero-actions { align-items: flex-start; flex-direction: column; } .rr .rr-disclaimer { flex-direction: column; align-items: flex-start; gap: 0.75rem; } .rr .rr-dimension { padding: 1.5rem; flex-direction: column-reverse; } .rr-card-score, .rr-dimension-wide .rr-card-score { flex-basis: auto; align-self: flex-start; padding-top: 0; } .rr-gauge { width: 110px; height: 110px; } .rr-gauge-large { width: 240px; height: 240px; } .rr-nav .cds--btn { margin-left: 0; } .rr-nav a { padding-block: 0.5rem; } }
        @media (prefers-reduced-motion: no-preference) { html:has(.rr) { scroll-behavior: smooth; } }
        @media (prefers-reduced-motion: reduce) { .rr *, .rr *::before, .rr *::after { animation: none !important; transition: none !important; } .rr-reveal[data-motion] { opacity: 1; transform: none; } }
        @media print { .rr-nav, .rr-closing .cds--btn { display: none; } .rr-reveal[data-motion] { opacity: 1; transform: none; } .rr-section { padding-block: 2rem; } .rr-dimension { break-inside: avoid; } }
      `}</style>
    </main>
  );
}
