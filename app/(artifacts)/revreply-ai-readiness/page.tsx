"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button, Column, Grid, ListItem, PasswordInput, Stack, Tag, Tile, UnorderedList } from "@carbon/react";
import { ArrowRight, Checkmark, Locked, Renew } from "@carbon/icons-react";
import type { Assessment } from "./content";
import { SharedLayerDiagram, WikiFlowDiagram, AgentFlowDiagram } from "./diagrams";

const PUBLISHED = "2026-09-07";

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

function CountUp({ to, duration = 1300 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
        const progress = motion.matches ? 1 : Math.min((now - beginning) / duration, 1);
        setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = window.IntersectionObserver ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { start(); observer?.disconnect(); }
    }, { threshold: 0.3 }) : null;
    if (observer) observer.observe(element);
    else start();
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); };
  }, [to, duration]);
  return <span ref={ref}>{value}</span>;
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
    <div ref={ref} className={`rr-gauge ${large ? "rr-gauge-large" : ""}`} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle className="rr-gauge-track" cx="80" cy="80" r="69" />
        <circle className="rr-gauge-fill" cx="80" cy="80" r="69" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - value} />
      </svg>
      <div className="rr-gauge-value" aria-hidden="true"><span>{value}<small>%</small></span></div>
    </div>
  );
}

function Assessment({ data, onLock }: { data: Assessment; onLock: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [agendaOpen, setAgendaOpen] = useState(false);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const a = data;

  return (
    <div className="rr-assessment">
      <nav className="rr-nav" aria-label="Assessment sections">
        <a href="#headline">01 / Headline</a>
        <a href="#seats">02 / Five seats</a>
        <a href="#findings">03 / Findings</a>
        <a href="#plan">04 / The plan</a>
        <a href="#tracing">05 / Visibility</a>
        <a href="#access">06 / To start</a>
        <Button kind="ghost" size="sm" renderIcon={Locked} onClick={onLock}>Close assessment</Button>
      </nav>

      <section id="headline" className="rr-hero rr-section">
        <Grid>
          <Column lg={10} md={8} sm={4}>
            <Reveal><p className="rr-eyebrow">The headline</p>
              <h1 ref={heading} tabIndex={-1}>{a.headline.a}<br /><span>{a.headline.b}</span></h1>
              <p className="rr-lead">{a.headline.lead}</p>
            </Reveal>
          </Column>
          <Column lg={6} md={8} sm={4}>
            <Reveal delay={160} className="rr-orbit-wrap">
              <div className="rr-orbit" aria-hidden="true"><div /><div /><div /><span>1<br /><small>shared layer<br />to build</small></span></div>
            </Reveal>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <Reveal delay={220}>
              <div className="rr-stats">
                {a.stats.map((stat, i) => (
                  <div className="rr-stat" key={stat.label} style={{ "--rr-delay": `${i * 90}ms` } as CSSProperties}>
                    <span className="rr-stat-number"><CountUp to={stat.n} /></span>
                    <span className="rr-caption">{stat.label}</span>
                  </div>
                ))}
              </div>
              <Tile className="rr-disclaimer">
                <Tag type="warm-gray">Prepared for {a.preparedFor}</Tag>
                <p>By {a.preparedBy} · {a.written} · Confidential — shared for this conversation only.</p>
              </Tile>
            </Reveal>
          </Column>
        </Grid>
      </section>

      <section id="headline-why" className="rr-section">
        <Grid>
          <Column lg={10} md={8} sm={4}>
            <Reveal><h2>{a.headlineSection.title}</h2><p className="rr-body">{a.headlineSection.body}</p><p className="rr-body">{a.headlineSection.body2}</p></Reveal>
          </Column>
        </Grid>
      </section>

      <section id="seats" className="rr-section rr-seats">
        <Grid>
          <Column lg={6} md={8} sm={4}><Reveal><p className="rr-eyebrow">{a.seats.eyebrow}</p><h2>{a.seats.title}</h2></Reveal></Column>
        </Grid>
        <Grid className="rr-cards">
          {a.seats.items.map((seat, i) => (
            <Column key={seat.role} lg={i === 4 ? 16 : 8} md={8} sm={4}>
              <Reveal delay={(i % 2) * 100}>
                <Tile className={`rr-seat ${i === 4 ? "rr-seat-wide" : ""}`}>
                  <div className="rr-seat-copy">
                    <p className="rr-eyebrow"><span className="rr-index">{String(i + 1).padStart(2, "0")}</span>Seat</p>
                    <h3>{seat.role}</h3>
                    <p className="rr-seat-row"><strong>AI today</strong> {seat.ai}</p>
                    <p className="rr-seat-row"><strong>Biggest pain</strong> {seat.pain}</p>
                  </div>
                  <div className="rr-seat-score"><Gauge score={[80, 55, 50, 45, 30][i]} label={`${seat.role} — illustrative AI maturity`} /><p className="rr-caption">AI in workflow · illustrative</p></div>
                </Tile>
              </Reveal>
            </Column>
          ))}
        </Grid>
      </section>

      <section id="findings" className="rr-section rr-findings">
        <Grid>
          <Column lg={16} md={8} sm={4}><Reveal><p className="rr-eyebrow">{a.findings.eyebrow}</p><h2>{a.findings.title}</h2></Reveal></Column>
          {a.findings.items.map((finding, i) => (
            <Column key={finding.n} lg={16} md={8} sm={4}>
              <Reveal delay={i * 90}>
                <div className="rr-finding">
                  <span className="rr-finding-number">{finding.n}</span>
                  <div>
                    <h3>{finding.title}</h3>
                    <p className="rr-body">{finding.body}</p>
                    {finding.aside && <Tile className="rr-aside">{finding.aside}</Tile>}                  </div>
                </div>
              </Reveal>
            </Column>
          ))}
        </Grid>

        <Reveal><Tile className="rr-diagram-tile"><SharedLayerDiagram /></Tile></Reveal>
      </section>

      <section id="plan" className="rr-section rr-plan">
        <Grid>
          <Column lg={16} md={8} sm={4}><Reveal><p className="rr-eyebrow">{a.plan.eyebrow}</p><h2>{a.plan.title}</h2></Reveal></Column>
          <Column lg={16} md={8} sm={4}><Reveal><Tile className="rr-plan-block"><Tag type="blue">{a.plan.first.label}</Tag><h3>{a.plan.first.title}</h3><UnorderedList>{a.plan.first.items.map(item => <ListItem key={item.slice(0, 40)}>{item}</ListItem>)}</UnorderedList></Tile></Reveal></Column>
          <Column lg={16} md={8} sm={4}><Reveal delay={120}><Tile className="rr-plan-block"><Tag type="blue">{a.plan.repos.label}</Tag><h3>{a.plan.repos.title}</h3>{a.plan.repos.items.map(repo => <div key={repo.name} className="rr-plan-item"><h4>{repo.name}</h4><p className="rr-body">{repo.body}</p></div>)}</Tile></Reveal></Column>
          <Column lg={16} md={8} sm={4}><Reveal delay={200}><Tile className="rr-plan-block"><Tag type="blue">{a.plan.agent.label}</Tag><h3>{a.plan.agent.title}</h3><UnorderedList>{a.plan.agent.items.map(item => <ListItem key={item.slice(0, 40)}>{item}</ListItem>)}</UnorderedList></Tile></Reveal></Column>
          <Column lg={16} md={8} sm={4}><Reveal><Tile className="rr-diagram-tile"><WikiFlowDiagram /></Tile></Reveal></Column>
          <Column lg={16} md={8} sm={4}><Reveal delay={120}><Tile className="rr-diagram-tile"><AgentFlowDiagram /></Tile></Reveal></Column>
        </Grid>
      </section>

      <section id="tracing" className="rr-section rr-tracing">
        <Grid>
          <Column lg={9} md={8} sm={4}><Reveal><p className="rr-eyebrow">{a.trace.eyebrow}</p><h2>{a.trace.title}</h2><p className="rr-lead">{a.trace.lead}</p></Reveal></Column>
        </Grid>
        <Grid>
          <Column lg={8} md={8} sm={4}><Reveal><Tile className="rr-plan-block"><h3>{a.trace.tracing.name}</h3><p className="rr-body">{a.trace.tracing.body}</p></Tile></Reveal></Column>
          <Column lg={8} md={8} sm={4}><Reveal delay={120}><Tile className="rr-plan-block"><h3>{a.trace.redaction.name}</h3><p className="rr-body">{a.trace.redaction.body}</p><p className="rr-caption rr-step-output"><Checkmark size={16} />{a.trace.redaction.closing}</p></Tile></Reveal></Column>
          <Column lg={16} md={8} sm={4}>
            <Reveal delay={180}>
              <Tile className="rr-trace-demo">
                <p className="rr-eyebrow">{a.trace.example.title}<span className="rr-index"> · {a.trace.example.subtitle}</span></p>
                <div className="rr-trace-steps">
                  {a.trace.example.steps.map((step, i) => (
                    <div className={`rr-trace-step rr-trace-${step.status}`} key={step.t} style={{ "--rr-delay": `${i * 350}ms` } as CSSProperties}>
                      <span className="rr-trace-t">{step.t}</span>
                      <span className="rr-trace-action">{step.action}</span>
                      <span className="rr-trace-detail">{step.detail}</span>
                      <span className="rr-trace-status">{step.status}</span>
                    </div>
                  ))}
                </div>
                <p className="rr-caption">{a.trace.example.note}</p>
              </Tile>
            </Reveal>
          </Column>
        </Grid>
      </section>

      <section id="practice" className="rr-section">
        <Grid>
          <Column lg={10} md={8} sm={4}><Reveal><p className="rr-eyebrow">{a.practice.eyebrow}</p><h2>{a.practice.title}</h2><UnorderedList>{a.practice.items.map(item => <ListItem key={item.slice(0, 40)}>{item}</ListItem>)}</UnorderedList></Reveal></Column>
        </Grid>
      </section>

      <section id="botterfly" className="rr-section rr-promo">
        <Grid>
          <Column lg={10} md={8} sm={4}>
            <Reveal>
              <p className="rr-eyebrow">{a.selfPromo.eyebrow}</p>
              <h2 id="promo-title">{a.selfPromo.title}</h2>
              <p className="rr-body">{a.selfPromo.body}</p>
            </Reveal>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <Grid className="rr-promo-points">
              {a.selfPromo.points.map((point, i) => (
                <Column key={point.slice(0, 30)} lg={5} md={8} sm={4}>
                  <Reveal delay={i * 110}>
                    <Tile className="rr-promo-card"><Checkmark size={20} /><p>{point}</p></Tile>
                  </Reveal>
                </Column>
              ))}
            </Grid>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <Reveal delay={300}>
              <p className="rr-promo-closing">{a.selfPromo.closing}</p>
            </Reveal>
          </Column>
        </Grid>
      </section>

      <section id="access" className="rr-section rr-closing">
        <Grid>
          <Column lg={10} md={8} sm={4}><Reveal><p className="rr-eyebrow">{a.access.eyebrow}</p><h2 id="closing-title">{a.access.title}</h2><p className="rr-lead">{a.access.lead}</p>
            <UnorderedList className="rr-access-list">{a.access.items.map(([name, note]) => <ListItem key={name}><strong>{name}</strong> — {note}</ListItem>)}</UnorderedList>
            <Button renderIcon={ArrowRight} aria-expanded={agendaOpen} aria-controls="discovery-agenda" onClick={() => setAgendaOpen(!agendaOpen)}>{agendaOpen ? "Hide the conversation guide" : "Prepare our first conversation"}</Button>
            {agendaOpen && <Tile id="discovery-agenda" className="rr-agenda"><h3>Your discovery conversation</h3><p>Reply to Ali to arrange it.</p></Tile>}
          </Reveal></Column>
          <Column lg={6} md={8} sm={4}><Reveal delay={180} className="rr-closing-note"><Renew size={32} /><p>Fix the process.<br />Build the shared layer.<br />Then generate responses.</p></Reveal></Column>
        </Grid>
      </section>
      <footer className="rr-footer"><span>BoostPanda · Prepared for {a.preparedFor}</span><span>Confidential · {PUBLISHED}</span></footer>
    </div>
  );
}

export default function RevReplyReadinessPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState<Assessment | null>(null);
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/revreply-ai-readiness/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) { setInvalid(true); setShaking(true); return; }
      const payload = (await response.json()) as { assessment: Assessment };
      setData(payload.assessment);
      setPassword("");
      setUnlocked(true);
    } catch {
      setInvalid(true);
      setShaking(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="rr">
      <div className="rr-masthead"><span className="rr-wordmark">BoostPanda <span>/ RevReply</span></span><div className="rr-tags"><Tag type="blue">AI readiness assessment</Tag><Tag type="gray">September 2026</Tag></div></div>
      {unlocked && data ? (
        <Assessment data={data} onLock={() => { setUnlocked(false); setData(null); window.scrollTo({ top: 0 }); }} />
      ) : (
        <section className="rr-gate" aria-labelledby="invitation-title">
          <Grid>
            <Column lg={9} md={8} sm={4}><div className="rr-invitation"><p className="rr-eyebrow">A conversation worth opening</p><h1 id="invitation-title">The blocker is not talent.<br />It is <span>shared memory.</span></h1><p className="rr-lead">RevReply · AI readiness assessment</p><p className="rr-body">Five seats interviewed, four systemic findings, one shared layer to build. Prepared by BoostPanda for our conversation.</p><div className="rr-invitation-line" aria-hidden="true" /><p className="rr-caption">A considered starting point. Not another tool pitch.</p></div></Column>
            <Column lg={6} md={8} sm={4}><Tile className={`rr-gate-card ${shaking ? "rr-shake" : ""}`} onAnimationEnd={() => setShaking(false)}><Stack gap={6}><Locked size={28} /><div><p className="rr-eyebrow">Your invitation</p><h2>Welcome, Ramsey.</h2><p>Use the password shared with you to open the assessment.</p></div><form onSubmit={submit}><Stack gap={5}><PasswordInput id="invitation-password" labelText="Invitation password" value={password} autoComplete="off" invalid={invalid} disabled={busy} invalidText={<span role="alert">That password does not match. Please try again.</span>} onChange={event => { setPassword(event.target.value); setInvalid(false); }} required /><Button type="submit" renderIcon={ArrowRight} disabled={busy}>{busy ? "Opening…" : "Open the assessment"}</Button></Stack></form><p className="rr-caption">Need the password? Ask the person who sent you this link.</p></Stack></Tile></Column>
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
        .rr h2 { font-size: clamp(2.25rem, 3.5vw, 3.75rem); font-weight: 300; line-height: 1.12; letter-spacing: -0.025em; margin-bottom: 1.75rem; }
        .rr h3 { font-size: 1.75rem; font-weight: 300; line-height: 1.2; }
        .rr h4 { font-size: 1.25rem; font-weight: 400; line-height: 1.25; }
        .rr .rr-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.12em; line-height: 1.6; margin-bottom: 1.25rem; color: var(--cds-text-secondary); }
        .rr .rr-lead { font-size: clamp(1.25rem, 2vw, 1.625rem); font-weight: 300; line-height: 1.45; margin-top: 1.75rem; max-width: 40rem; }
        .rr .rr-body { font-size: 1rem; line-height: 1.65; max-width: 42rem; margin-top: 1rem; color: var(--cds-text-secondary); }
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
        .rr-nav { display: flex; align-items: center; gap: 2rem; padding: 0.75rem 2rem; border-bottom: 1px solid var(--cds-border-subtle-01); background: var(--cds-layer-01); position: sticky; top: 0; z-index: 10; }
        .rr-nav a { font-size: 0.75rem; text-decoration: none; color: var(--cds-text-secondary); }
        .rr-nav a:hover { color: var(--rr-blue); }
        .rr-nav .cds--btn { margin-left: auto; }
        .rr-section { padding: 6rem 0; scroll-margin-top: 4rem; }
        .rr-assessment { animation: rr-enter 650ms both; }
        .rr-hero { padding-top: 5rem; }
        .rr-orbit-wrap { display: flex; justify-content: center; }
        .rr-orbit { position: relative; width: 240px; height: 240px; margin-bottom: 2rem; }
        .rr-orbit > div { border: 1px solid var(--cds-border-subtle-02); position: absolute; inset: 0; border-radius: 50%; animation: rr-orbit 4s ease-in-out; }
        .rr-orbit > div:nth-child(2) { inset: 25px; border-color: var(--cds-border-interactive); animation-delay: 150ms; }
        .rr-orbit > div:nth-child(3) { inset: 50px; animation-delay: 300ms; }
        .rr-orbit > span { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 3.5rem; font-weight: 300; color: var(--rr-blue); }
        .rr-orbit small { font-size: 0.75rem; line-height: 2; color: var(--cds-text-secondary); }
        .rr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 3rem; }
        .rr-stat { border-left: 2px solid var(--rr-blue); padding: 0.5rem 0 0.5rem 1.25rem; animation: rr-enter 700ms both; animation-delay: var(--rr-delay); }
        .rr-stat-number { display: block; font-size: 3.5rem; font-weight: 300; line-height: 1.1; font-variant-numeric: tabular-nums; }
        .rr .rr-disclaimer { display: flex; gap: 1.5rem; align-items: center; border-left: 2px solid var(--cds-border-strong-01); margin-top: 2.5rem; padding: 1.25rem 1.5rem; }
        .rr-disclaimer .cds--tag { flex-shrink: 0; }
        .rr-disclaimer p { max-width: 58rem; font-size: 0.875rem; line-height: 1.5; color: var(--cds-text-secondary); }
        .rr-seats { background: var(--cds-layer-01); border-block: 1px solid var(--cds-border-subtle-01); }
        .rr-cards { margin-top: 3rem; row-gap: 1.5rem; }
        .rr-cards .rr-reveal { height: 100%; }
        .rr .rr-seat { height: 100%; padding: 2rem; background: var(--cds-background); display: flex; gap: 1rem; justify-content: space-between; border-top: 2px solid var(--cds-border-subtle-01); transition: transform 220ms, border-color 220ms; }
        .rr-seat:hover { transform: translateY(-4px); border-top-color: var(--rr-blue); }
        .rr-seat-copy { min-width: 0; flex: 1; }
        .rr-index { display: inline-block; color: var(--rr-blue); margin-right: 1rem; font-size: 0.875rem; }
        .rr .rr-seat-row { font-size: 0.875rem; line-height: 1.5; margin-top: 0.75rem; color: var(--cds-text-secondary); }
        .rr-seat-row strong { color: var(--cds-text-primary); font-weight: 600; margin-right: 0.5rem; }
        .rr-seat-score { flex: 0 0 126px; text-align: center; padding-top: 1.25rem; }
        .rr-gauge { position: relative; width: 126px; height: 126px; margin: 0 auto 1rem; }
        .rr-gauge svg { width: 100%; height: 100%; transform: rotate(-90deg); overflow: visible; }
        .rr-gauge circle { fill: none; stroke-width: 5; }
        .rr-gauge-track { stroke: var(--cds-border-subtle-01); }
        .rr-gauge-fill { stroke: var(--rr-blue); stroke-linecap: round; }
        .rr-gauge-value { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .rr-gauge-value span { font-size: 2.25rem; font-weight: 300; font-variant-numeric: tabular-nums; }
        .rr-gauge-value small { font-size: 0.75rem; color: var(--cds-text-secondary); margin-left: 0.25rem; }
        .rr-seat-wide .rr-seat-score { flex-basis: 30%; }
        .rr .rr-finding { display: flex; gap: 2.5rem; padding: 3rem 0; border-top: 1px solid var(--cds-border-subtle-01); }
        .rr-findings .rr-finding:first-of-type { border-top: 0; }
        .rr-finding-number { font-size: 3.5rem; font-weight: 300; color: var(--rr-blue); line-height: 1; flex: 0 0 5rem; }
        .rr .rr-aside { margin-top: 1.5rem; padding: 1rem 1.25rem; font-size: 0.875rem; color: var(--cds-text-secondary); border-left: 2px solid var(--cds-border-interactive); }
        .rr-layers { margin-top: 3rem; row-gap: 1.5rem; }
        .rr .rr-layer { height: 100%; padding: 1.5rem; }
        .rr-layer-today { opacity: 0.85; }
        .rr-layer-proposed { border-top: 3px solid var(--cds-support-success); }
        .rr .rr-layer .cds--list--unordered { margin-left: 1rem; margin-top: 1.25rem; }
        .rr .rr-layer .cds--list__item { color: var(--cds-text-secondary); font-size: 0.875rem; line-height: 1.5; padding-bottom: 0.5rem; }
        .rr-layers-caption { margin-top: 1rem; }
        .rr-plan { background: var(--cds-layer-01); border-block: 1px solid var(--cds-border-subtle-01); }
        .rr-plan .rr-cards, .rr-plan .cds--css-grid { row-gap: 1.5rem; }
        .rr .rr-plan-block { padding: 2rem; height: 100%; }
        .rr-diagram-tile { padding: 1.5rem; background: var(--cds-background); overflow-x: auto; }
        .rr-diagram-tile svg { width: 100%; min-width: 640px; height: auto; display: block; }
        .rr-diagram-title { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; fill: var(--cds-text-secondary); }
        .rr-diagram-title-blue { fill: var(--rr-blue); }
        .rr-diagram-note { font-size: 11px; fill: var(--cds-text-secondary); }
        .rr-node rect { fill: var(--cds-layer-01); stroke: var(--cds-border-subtle-01); stroke-width: 1; }
        .rr-node-title { font-size: 13px; font-weight: 600; fill: var(--cds-text-primary); text-anchor: middle; }
        .rr-node-sub { font-size: 11px; fill: var(--cds-text-secondary); text-anchor: middle; }
        .rr-node-sub-left { text-anchor: start; }
        .rr-node { opacity: 0; animation: rr-node-in 600ms both; animation-delay: var(--rr-delay, 0ms); transition: transform 200ms; }
        .rr-node:hover { transform: translateY(-2px); }
        .rr-node rect { transition: stroke 200ms, fill 200ms; }
        .rr-node-today rect { stroke: var(--cds-support-error); fill: var(--cds-layer-02); }
        .rr-node-today .rr-node-title, .rr-node-today ~ .rr-node-title { fill: var(--cds-text-secondary); }
        .rr-node-repo rect { stroke: var(--rr-blue); stroke-width: 1.5; fill: var(--cds-layer-01); }
        .rr-node-repo .rr-node-title { fill: var(--rr-blue); }
        .rr-node-source rect { fill: var(--cds-layer-02); stroke-dasharray: 3 2; }
        .rr-node-consumer rect { fill: var(--cds-layer-02); }
        .rr-node-hub rect { stroke: var(--rr-blue); stroke-width: 2; }
        .rr-node-event rect { fill: var(--cds-layer-02); }
        .rr-node-action rect { stroke: var(--cds-support-success); }
        .rr-wire { stroke: var(--cds-border-interactive); stroke-width: 1.5; stroke-dasharray: 6 5; opacity: 0; animation: rr-wire-draw 900ms both, rr-wire-flow 1.6s linear infinite 1.6s; animation-delay: var(--rr-delay, 0ms), 1.8s; }
        .rr-wire-strong { stroke-width: 2.5; stroke-dasharray: none; }
        .rr-wire-return { stroke: var(--cds-support-success); }
        .rr-arrowhead { fill: var(--cds-border-interactive); }
        .rr-arrowhead-return { fill: var(--cds-support-success); }
        .rr-fix-arrow, .rr-return-flow { opacity: 0; animation: rr-node-in 600ms both; animation-delay: var(--rr-delay, 0ms); }
        @keyframes rr-node-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes rr-wire-draw { from { stroke-dashoffset: 200; opacity: 0.4; } to { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes rr-wire-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -22; } }
        @media (prefers-reduced-motion: reduce) { .rr-node, .rr-wire, .rr-fix-arrow, .rr-return-flow { animation: none; opacity: 1; } .rr-wire { stroke-dasharray: none; } }
        .rr-plan-block h3 { margin: 1rem 0 1.5rem; }
        .rr .rr-plan-block .cds--list--unordered { margin-left: 1rem; }
        .rr .rr-plan-block .cds--list__item { color: var(--cds-text-secondary); font-size: 0.875rem; line-height: 1.6; padding-bottom: 0.6rem; }
        .rr-plan-item { margin-top: 1.25rem; }
        .rr-trace-demo { padding: 2rem; }
        .rr-trace-steps { margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .rr-trace-step { display: grid; grid-template-columns: 3.5rem 9rem 1fr 6rem; gap: 1rem; align-items: baseline; padding: 0.75rem 1rem; border: 1px solid var(--cds-border-subtle-01); border-left: 3px solid var(--cds-support-success); font-size: 0.875rem; animation: rr-slide-in 600ms both; animation-delay: var(--rr-delay); }
        .rr-trace-failed { border-left-color: var(--cds-support-error); background: var(--cds-layer-02); }
        .rr-trace-improvised { border-left-color: var(--cds-support-warning); background: var(--cds-layer-02); }
        .rr-trace-t { font-variant-numeric: tabular-nums; color: var(--cds-text-secondary); }
        .rr-trace-action { font-weight: 600; }
        .rr-trace-detail { color: var(--cds-text-secondary); line-height: 1.5; }
        .rr-trace-status { text-align: right; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
        .rr-trace-failed .rr-trace-status { color: var(--cds-support-error); }
        .rr-trace-improvised .rr-trace-status { color: var(--cds-support-warning); }
        .rr .rr-access-list { margin: 1.5rem 0 2rem 1rem; }
        .rr-promo { border-block: 1px solid var(--cds-border-subtle-01); background: linear-gradient(180deg, var(--cds-layer-02), var(--cds-background)); }
        .rr-promo-points { margin-top: 2.5rem; row-gap: 1.5rem; }
        .rr .rr-promo-card { padding: 1.5rem; height: 100%; border-top: 2px solid var(--rr-blue); }
        .rr-promo-card svg { color: var(--rr-blue); margin-bottom: 1rem; }
        .rr-promo-card p { font-size: 0.875rem; line-height: 1.6; color: var(--cds-text-secondary); }
        .rr-promo-closing { font-size: clamp(1.5rem, 2.5vw, 2.25rem); font-weight: 300; line-height: 1.3; margin-top: 3.5rem; color: var(--rr-blue); animation: rr-enter 900ms both; }
        .rr .rr-access-list .cds--list__item { color: var(--cds-text-secondary); font-size: 0.875rem; line-height: 1.6; padding-bottom: 0.6rem; }
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
        @keyframes rr-slide-in { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
        @media (min-width: 66rem) { .rr-gate-card { position: relative; top: 1rem; } }
        @media (max-width: 65.99rem) { .rr-orbit-wrap { margin-top: 3rem; } .rr-nav { gap: 1rem; flex-wrap: wrap; } .rr-masthead { flex-wrap: wrap; } .rr-closing-note { margin-top: 3rem; } .rr-trace-step { grid-template-columns: 3.5rem 1fr; } .rr-trace-detail { grid-column: 1 / -1; } .rr-trace-status { text-align: left; } }
        @media (max-width: 41.99rem) { .rr-masthead, .rr-nav { padding: 1rem; } .rr-tags { gap: 0; } .rr-section { padding: 3.5rem 0; } .rr-gate { padding-top: 2rem; } .rr .rr-gate-card { padding: 1.5rem; margin-top: 0; } .rr-gate-footer, .rr-footer { flex-direction: column; margin-inline: 1rem; } .rr-hero-actions { align-items: flex-start; flex-direction: column; } .rr .rr-disclaimer { flex-direction: column; align-items: flex-start; gap: 0.75rem; } .rr .rr-seat { padding: 1.5rem; flex-direction: column-reverse; } .rr-seat-score, .rr-seat-wide .rr-seat-score { flex-basis: auto; align-self: flex-start; padding-top: 0; } .rr-gauge { width: 110px; height: 110px; } .rr .rr-finding { flex-direction: column; gap: 1rem; padding: 2rem 0; } .rr-stats { grid-template-columns: repeat(2, 1fr); } .rr-nav .cds--btn { margin-left: 0; } .rr-nav a { padding-block: 0.5rem; } }
        @media (prefers-reduced-motion: no-preference) { html:has(.rr) { scroll-behavior: smooth; } }
        @media (prefers-reduced-motion: reduce) { .rr *, .rr *::before, .rr *::after { animation: none !important; transition: none !important; } .rr-reveal[data-motion] { opacity: 1; transform: none; } }
        @media print { .rr-nav, .rr-closing .cds--btn { display: none; } .rr-reveal[data-motion] { opacity: 1; transform: none; } .rr-section { padding-block: 2rem; } .rr-trace-step, .rr-finding { break-inside: avoid; } }
      `}</style>
    </main>
  );
}
