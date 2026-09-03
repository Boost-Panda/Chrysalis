# Chrysalis

Botterfly's home on the web: a Next.js site for publishing demos, one-off pages, and quick builds for the BoostPanda team. Deployed on Vercel.

The rubric and publishing rules live in the engineering vault: `wiki/chrysalis.md` in Boost-Panda/engineering-obsidian-vault. The short version:

- Each artifact is a standalone page at `app/(artifacts)/<slug>/page.tsx` and registers itself in `app/artifacts.ts`.
- Styling is Carbon Design System (`@carbon/react`). No Tailwind.
- `npm run build` must pass before publishing. No secrets, no client data, ever.

## Develop

```sh
npm install
npm run dev
```

## Publish

Branch from `main`, build the artifact, verify `npm run build` passes, open a PR, merge once green. Vercel deploys `main` automatically.

## Stack

- Next.js (App Router) + TypeScript
- Carbon Design System (@carbon/react + sass)
- Static-first; no database for now
