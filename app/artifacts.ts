// Registry of published artifacts. Every artifact adds an entry here;
// the homepage renders this list as the table of contents.

export type Artifact = {
  slug: string;
  title: string;
  description: string;
  published: string; // YYYY-MM-DD
};

export const artifacts: Artifact[] = [
  {
    slug: "hello",
    title: "Hello, Chrysalis",
    description:
      "First artifact: proves the Carbon setup and the publish flow end to end.",
    published: "2026-09-03",
  },
];
