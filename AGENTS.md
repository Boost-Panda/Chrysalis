# Chrysalis agent rules

Chrysalis is Botterfly's home on the web. The rubric — what belongs here, naming, the publish flow — lives in the engineering vault at `~/boostpanda/wiki/wiki/chrysalis.md`; read it before adding an artifact. This file covers only repo mechanics.

- One artifact per slug: `app/(artifacts)/<slug>/page.tsx`, plus an entry in `app/artifacts.ts` (title, one-line description, date). Both in the same PR.
- Styling: Carbon Design System (`@carbon/react`), Carbon grid classes (`cds--grid` etc.). No Tailwind.
- Artifacts are self-contained; shared helpers only in `app/lib/` when two artifacts need them.
- Verify with `npm run build` before opening the PR. It must pass clean.
- Never commit secrets or client data. Artifacts are public once the domain exists.

## Tests

No test suite yet; `npm run build` (includes type checking and linting) is the gate.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
