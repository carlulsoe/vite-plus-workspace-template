# Vite+ Starter Workspace

This repository is now structured to serve two roles:

- a working Vite+ monorepo for a workspace planning dashboard built with TanStack Start, Nitro,
  and a shared workspace package
- a local template source through `tools/create-starter`

## Current App Surface

The website in `apps/website` currently ships:

- `/` for the dashboard, backed by TanStack Start server functions
- `/status` for the operational status view
- `/api/health` for the machine-readable health payload

The shared package in `packages/utils` currently exports the planning and status helpers that power
those routes:

- `createWorkspaceSnapshot`
- `createDeliveryPlan`
- `createHealthSnapshot`

## Use It As A Template

Local generator:

```bash
vp create create-starter -- --directory my-new-app --name my-new-app
```

GitHub template:

```bash
vp create github:<owner>/<repo> --directory my-new-app
```

The generator path is the more complete option today because it rewrites the starter identity from
`vite-plus-workspace-template` / `Workspace Starter` / `@vite-plus-workspace-template/core` to
values derived from `--name`. The target directory is passed after `--` because it belongs to the
underlying Bingo template, not Vite+'s builtin template flags.

## Development

```bash
vp install
vp run dev
vp check
vp test
vp run ready
vp run website#e2e
vp run mutate
```

`vp run ready` is the full root validation pipeline. It runs format and lint checks, package and
website tests, package and website builds, and the Playwright suite.

## Dev Container

Open the repo in a Dev Container to get Node 22, the global `vp` CLI, and Chromium browser support
for Playwright. The container runs `CI=true vp install` on first create, so workspace dependencies
are installed without needing an interactive TTY.

## Layout

- The website lives in `apps/website`.
- Shared domain logic lives in `packages/utils`, exported as `@vite-plus-workspace-template/core`.
- App-side server adapters live in `apps/website/src/lib`.
- The architectural layering note is in `docs/architecture/layering.md`.
- The current testing coverage and commands are documented in `docs/testing-strategy.md`.

## Mutation Testing

Mutation testing is wired up with StrykerJS across the core package, the website data boundary, and
the top-level website components:

```bash
vp run mutate
```

The current scope targets:

- `packages/utils/src/**/*.ts`
- `apps/website/src/lib/**/*.ts`
- `apps/website/src/components/*.tsx`

It runs the focused package, lib, and component tests instead of the full workspace so the mutation
loop stays bounded.
