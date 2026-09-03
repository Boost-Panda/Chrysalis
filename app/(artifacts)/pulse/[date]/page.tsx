import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  Column,
  Grid,
  Tag,
} from "@carbon/react";
import { ArrowLeft, ArrowRight } from "@carbon/icons-react";
import { SECTION_ORDER, loadIssue, listIssueDates } from "../../../lib/pulse";

const SECTION_TITLES: Record<string, string> = {
  models: "Models",
  research: "Research",
  releases: "Releases",
  hackernews: "Hacker News",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const issue = loadIssue(date);
  return {
    title: issue ? `${issue.title} — The Pulse` : "The Pulse",
    description: issue?.tldr,
  };
}

export function generateStaticParams() {
  return listIssueDates().map((date) => ({ date }));
}

export default async function PulseIssuePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const issue = loadIssue(date);
  if (!issue) notFound();

  const dates = listIssueDates();
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
            <BreadcrumbItem isCurrentPage>{issue.date}</BreadcrumbItem>
          </Breadcrumb>
          <h1 style={{ fontSize: "2.625rem", fontWeight: 300, margin: "0 0 0.5rem 0" }}>
            {issue.title}
          </h1>
          <Tag type="blue" style={{ marginBottom: "1.5rem" }}>
            published {issue.date}
          </Tag>
        </Column>
      </Grid>
      <Grid>
        <Column lg={8} md={6} sm={4}>
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.5, marginBottom: "2rem" }}>
            {issue.tldr}
          </p>
        </Column>
      </Grid>

      {SECTION_ORDER.map((section) => {
        const items = issue.sections?.[section] ?? [];
        if (items.length === 0) return null;
        return (
          <section key={section} style={{ paddingBottom: "2rem" }}>
            <Grid>
              <Column lg={12} md={6} sm={4}>
                <h2 style={{ fontWeight: 600, margin: "0 0 1rem 0" }}>
                  {SECTION_TITLES[section]}
                </h2>
              </Column>
            </Grid>
            <Grid>
              {items.map((item) => (
                <Column lg={8} md={6} sm={4} key={item.id} style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ fontWeight: 600, margin: 0, fontSize: "1rem" }}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <p style={{ margin: "0.25rem 0 0.25rem 0" }}>{item.summary}</p>
                  <p style={{ margin: 0, color: "#525252" }}>{item.why}</p>
                  {item.hn_url && (
                    <p style={{ margin: "0.25rem 0 0 0" }}>
                      <a href={item.hn_url} target="_blank" rel="noopener noreferrer">
                        Hacker News discussion
                      </a>
                    </p>
                  )}
                </Column>
              ))}
            </Grid>
          </section>
        );
      })}

      {issue.closing && (
        <Grid>
          <Column lg={8} md={6} sm={4}>
            <p style={{ color: "#525252", fontStyle: "italic", paddingBottom: "1rem" }}>
              {issue.closing}
            </p>
          </Column>
        </Grid>
      )}

      <Grid narrow style={{ paddingBottom: "4rem" }}>
        <Column lg={12} md={6} sm={4}>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e0e0e0", paddingTop: "1rem" }}>
            {older ? (
              <Link href={`/pulse/${older}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <ArrowLeft size={16} /> Older — {older}
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={`/pulse/${newer}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Newer — {newer} <ArrowRight size={16} />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </Column>
      </Grid>
    </main>
  );
}
