import Link from "next/link";
import { notFound } from "next/navigation";
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
import { ArrowLeft, ArrowRight, Launch } from "@carbon/icons-react";
import {
  SECTION_ORDER,
  formatDate,
  listIssueDates,
  loadIssue,
} from "@/app/lib/pulse";

type Params = { date: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return listIssueDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { date } = await params;
  const issue = loadIssue(date);
  if (!issue) return { title: "The Pulse" };
  return { title: issue.title, description: issue.tldr };
}

export default async function PulseIssuePage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const issue = loadIssue(date);
  if (!issue) notFound();

  const dates = listIssueDates(); // newest first
  const idx = dates.indexOf(date);
  const newer = idx > 0 ? dates[idx - 1] : null;
  const older = idx >= 0 && idx < dates.length - 1 ? dates[idx + 1] : null;

  return (
    <main>
      <Grid narrow style={{ paddingTop: "2rem" }}>
        <Column lg={12} md={6} sm={4}>
          <Breadcrumb noTrailingSlash style={{ marginBottom: "1rem" }}>
            <BreadcrumbItem href="/">Chrysalis</BreadcrumbItem>
            <BreadcrumbItem href="/pulse">The Pulse</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>{date}</BreadcrumbItem>
          </Breadcrumb>
          <h1 style={{ fontSize: "2.625rem", fontWeight: 300, margin: "0 0 0.5rem 0" }}>
            {issue.title}
          </h1>
          <Tag type="blue" style={{ marginBottom: "1.5rem" }}>
            published {formatDate(issue.date)}
          </Tag>
        </Column>
      </Grid>
      <Grid>
        <Column lg={10} md={6} sm={4}>
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.5, marginBottom: "2.5rem" }}>
            {issue.tldr}
          </p>
        </Column>
      </Grid>

      {SECTION_ORDER.map(([key, label]) => {
        const items = issue.sections[key] ?? [];
        return (
          <section key={key} style={{ marginBottom: "2.5rem" }}>
            <Grid>
              <Column lg={12} md={6} sm={4}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 300, margin: "0 0 1rem 0" }}>{label}</h2>
                {items.length === 0 && (
                  <p style={{ color: "#525252" }}>Nothing notable in the window.</p>
                )}
              </Column>
            </Grid>
            <Grid>
              {items.map((item) => (
                <Column lg={10} md={6} sm={4} key={item.id} style={{ marginBottom: "1rem" }}>
                  <Tile>
                    <Stack gap={3}>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
                        <a href={item.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                          {item.title} <Launch size={16} />
                        </a>
                      </h3>
                      <p style={{ margin: 0 }}>{item.summary}</p>
                      <p style={{ margin: 0, color: "#525252" }}>
                        <strong style={{ fontWeight: 600 }}>Why it matters for us: </strong>
                        {item.why}
                      </p>
                      {item.hn_url && (
                        <a href={item.hn_url} target="_blank" rel="noreferrer" style={{ fontSize: "0.875rem" }}>
                          Discussion on Hacker News
                        </a>
                      )}
                    </Stack>
                  </Tile>
                </Column>
              ))}
            </Grid>
          </section>
        );
      })}

      {issue.closing && (
        <Grid>
          <Column lg={10} md={6} sm={4}>
            <p style={{ color: "#525252", fontStyle: "italic", marginBottom: "2rem" }}>{issue.closing}</p>
          </Column>
        </Grid>
      )}

      <Grid style={{ paddingBottom: "4rem" }}>
        <Column lg={12} md={6} sm={4}>
          <Stack orientation="horizontal" gap={6}>
            {older ? (
              <Link href={`/pulse/${older}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <ArrowLeft size={16} /> {older}
              </Link>
            ) : <span />}
            <Link href="/pulse">All issues</Link>
            {newer ? (
              <Link href={`/pulse/${newer}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {newer} <ArrowRight size={16} />
              </Link>
            ) : <span />}
          </Stack>
        </Column>
      </Grid>
    </main>
  );
}
