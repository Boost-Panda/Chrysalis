import fs from "fs";
import path from "path";

// One Pulse issue, content/pulse/YYYY-MM-DD.json (shape: issue.schema.json
// in botterfly-wings skills/editorial/pulse).

export type PulseItem = {
  id: string;
  title: string;
  url: string;
  hn_url?: string;
  summary: string;
  why: string;
};

export type PulseIssue = {
  date: string;
  title: string;
  tldr: string;
  sections: {
    models: PulseItem[];
    research: PulseItem[];
    releases: PulseItem[];
    hackernews: PulseItem[];
    x_posts?: PulseItem[];
  };
  closing?: string;
  window?: { since: string; until: string };
  generated_by?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "pulse");
const SECTION_ORDER: (keyof PulseIssue["sections"])[] = [
  "models",
  "research",
  "releases",
  "hackernews",
  "x_posts",
];

export function listIssueDates(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
}

export function loadIssue(date: string): PulseIssue | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const file = path.join(CONTENT_DIR, `${date}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as PulseIssue;
}

export { SECTION_ORDER };
