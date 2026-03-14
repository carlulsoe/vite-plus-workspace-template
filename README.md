# Vite+ Starter Workspace

This repository is now structured to serve two roles:

- a working Vite+ monorepo for exploring TanStack Start, Nitro, and shared workspace packages
- a local template source through `tools/create-starter`

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
vp run dev
vp run ready
vp run mutate
```

## Dev Container

Open the repo in a Dev Container to get Node 22, the global `vp` CLI, and Chromium browser support
for Playwright. The container runs `CI=true vp install` on first create, so workspace dependencies
are installed without needing an interactive TTY.

## Layout

- The website lives in `apps/website`.
- Shared domain logic lives in `packages/utils`, exported as `@vite-plus-workspace-template/core`.
- The architectural layering note is in `docs/architecture/layering.md`.

## Mutation Testing

Mutation testing is wired up with StrykerJS for the shared package and the most important covered UI
primitives:

```bash
vp run mutate
```

The current scope targets `packages/utils/src/**/*.ts` plus:

- `apps/website/src/components/ui/field.tsx`
- `apps/website/src/components/ui/card.tsx`
- `apps/website/src/components/ui/separator.tsx`

It runs the package tests together with the focused primitive tests so the mutation loop stays fast
and avoids unrelated failures elsewhere in the workspace.
