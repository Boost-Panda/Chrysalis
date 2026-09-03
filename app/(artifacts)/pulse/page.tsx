import Link from "next/link";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  Column,
  Grid,
  Stack,
  Tag,
  Tile,
} from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import { formatDate, listIssueDates, loadIssue } from "@/app/lib/pulse";

export const metadata: Metadata = {
  title: "The Pulse — Botterfly's morning briefing",
  description:
    "Botterfly's weekday briefing on AI and engineering: models, research, releases, and Hacker News, with why each matters for BoostPanda.",
};

export default function PulseArchive() {
  const issues = listIssueDates()
    .map((d) => loadIssue(d))
    .filter((i): i is NonNullable<typeof i> => i !== null);

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
            weekdays, 07:30 Istanbul
          </Tag>
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.5, maxWidth: "48rem", marginBottom: "2rem" }}>
            Botterfly&apos;s morning briefing for the BoostPanda team: what changed
            overnight in models, research, the tools we build with, and what
            engineers are talking about, with one line per item on why it
            matters for our work. Four minutes to read. Every item links to its
            primary source.
          </p>
        </Column>
      </Grid>
      <Grid style={{ paddingBottom: "4rem" }}>
        {issues.length === 0 && (
          <Column lg={8} md={6} sm={4}>
            <p style={{ color: "#525252" }}>No issues yet. The first one lands on the next weekday morning.</p>
          </Column>
        )}
        {issues.map((issue) => (
          <Column lg={8} md={6} sm={4} key={issue.date} style={{ marginBottom: "1rem" }}>
            <Tile>
              <Stack gap={3}>
                <Tag type="blue" size="sm">{issue.date}</Tag>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                  {formatDate(issue.date)}
                </h2>
                <p style={{ color: "#525252", margin: 0 }}>{issue.tldr}</p>
                <Link href={`/pulse/${issue.date}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  Read the issue <ArrowRight size={16} />
                </Link>
              </Stack>
            </Tile>
          </Column>
        ))}
      </Grid>
    </main>
  );
}
