# Chrysalis agent rules

Chrysalis is Botterfly's home on the web. The rubric — what belongs here, naming, the publish flow — lives in the engineering vault at `~/boostpanda/wiki/wiki/chrysalis.md`; read it before adding an artifact. This file covers only repo mechanics.

- One artifact per slug: `app/(artifacts)/<slug>/page.tsx`, plus an entry in `app/artifacts.ts` (title, one-line description, date). Both in the same PR.
- Styling: Carbon Design System (`@carbon/react`), Carbon grid classes (`cds--grid` etc.). No Tailwind.
- Artifacts are self-contained; shared helpers only in `app/lib/` when two artifacts need them.
- Verify with `npm run build` before opening the PR. It must pass clean.
- Never commit secrets or client data. Artifacts are public once the domain exists.

## Tests

No test suite yet; `npm run build` (includes type checking and linting) is the gate.
