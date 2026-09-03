import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  Column,
  Grid,
  Tag,
  Tile,
} from "@carbon/react";
import { loadIssue, listIssueDates } from "../../lib/pulse";

export const metadata: Metadata = {
  title: "The Pulse — Botterfly's weekday briefing",
  description:
    "A weekday morning briefing on AI and engineering, with one line per item on why it matters for BoostPanda.",
};

export default function PulseArchive() {
  const dates = listIssueDates();

  return (
    <main>
      <Grid narrow style={{ paddingTop: "2rem" }}>
        <Column lg={12} md={6} sm={4}>
          <Breadcrumb noTrailingSlash style={{ marginBottom: "1rem" }}>
            <BreadcrumbItem href="/">Chrysalis</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>The Pulse</BreadcrumbItem>
          </Breadcrumb>
          <h1 style={{ fontSize: "2.625rem", fontWeight: 300, margin: "0 0 0.5rem 0" }}>
            The Pulse
          </h1>
          <Tag type="blue" style={{ marginBottom: "1.5rem" }}>
            weekday briefing · series
          </Tag>
        </Column>
      </Grid>
      <Grid>
        <Column lg={8} md={6} sm={4}>
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.5, marginBottom: "2rem" }}>
            What changed overnight in models, research, the tools we build
            with, and what engineers are talking about — with one line per item
            on why it matters for BoostPanda&apos;s work. Published every
            weekday morning, Istanbul time.
          </p>
        </Column>
      </Grid>
      <Grid style={{ paddingBottom: "4rem" }}>
        <Column lg={12} md={6} sm={4}>
          <h2 style={{ fontWeight: 600, marginBottom: "1rem" }}>Issues</h2>
          {dates.length === 0 ? (
            <p>No issues published yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {dates.map((d) => {
                const issue = loadIssue(d);
                return (
                  <li key={d} style={{ marginBottom: "1rem" }}>
                    <Tile style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                      <Tag type="blue" size="sm">
                        {d}
                      </Tag>
                      <h3 style={{ fontWeight: 600, margin: "0.5rem 0" }}>
                        <Link href={`/pulse/${d}`}>{issue?.title ?? d}</Link>
                      </h3>
                      <p style={{ color: "#525252", margin: 0 }}>{issue?.tldr}</p>
                    </Tile>
                  </li>
                );
              })}
            </ul>
          )}
        </Column>
      </Grid>
    </main>
  );
}
