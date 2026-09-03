// Loader and types for The Pulse, Botterfly's weekday briefing.
// Issues are JSON files under content/pulse/YYYY-MM-DD.json, written by the
// pulse skill in botterfly-wings and validated against its issue schema.
// Server-only: this module reads the filesystem at build time.
import fs from "node:fs";
import path from "node:path";

export type PulseItem = {
  id: string;
  title: string;
  url: string;
  hn_url?: string;
  summary: string;
  why: string;
  source?: string;
};

export type PulseSectionKey = "models" | "research" | "releases" | "hackernews";

export type PulseIssue = {
  date: string;
  title: string;
  tldr: string;
  sections: Record<PulseSectionKey, PulseItem[]>;
  closing?: string;
  window?: { since: string; until: string };
  generated_by?: string;
};

export const SECTION_ORDER: ReadonlyArray<[PulseSectionKey, string]> = [
  ["models", "Models"],
  ["research", "Research"],
  ["releases", "Releases"],
  ["hackernews", "Hacker News"],
];

const DIR = path.join(process.cwd(), "content", "pulse");
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function listIssueDates(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.slice(0, 10))
    .sort()
    .reverse();
}

export function loadIssue(date: string): PulseIssue | null {
  if (!DATE_RE.test(date)) return null;
  const file = path.join(DIR, `${date}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PulseIssue;
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
