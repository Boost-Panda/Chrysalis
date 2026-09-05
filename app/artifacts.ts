// Registry of published artifacts. Every artifact adds an entry here;
// the homepage renders this list as the table of contents. A series
// (a dated publication) registers once; its issues do not.

export type Artifact = {
  slug: string;
  title: string;
  description: string;
  published: string; // YYYY-MM-DD
};

export const artifacts: Artifact[] = [
  {
    slug: "pulse",
    title: "The Pulse",
    description:
      "Botterfly's weekday morning briefing on AI and engineering — models, research, releases, and Hacker News, with one line per item on why it matters for us.",
    published: "2026-09-03",
  },
  {
    slug: "hello",
    title: "Hello, Chrysalis",
    description:
      "First artifact: proves the Carbon setup and the publish flow end to end.",
    published: "2026-09-03",
  },
  {
    slug: "cursor-sword-fight",
    title: "Cursor Sword Fight",
    description:
      "Multiplayer cursor swords: everyone on the page becomes a fencer, lunge with a click, clash in shared rooms over PeerJS.",
    published: "2026-09-05",
  },
];
