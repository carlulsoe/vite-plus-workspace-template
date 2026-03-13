# Heaven Financial

A Vite+ monorepo that now uses a TanStack Start website with Nitro-backed routes and a shared
market package.

## Development

- Run the development app:

```bash
vp run dev
```

- Validate the repo:

```bash
vp run ready
```

## Dev Container

- Open the repo in a Dev Container to get Node 22, the global `vp` CLI, and
  Chromium browser support for Playwright.
- The container runs `CI=true vp install` on first create, so workspace
  dependencies are installed without needing an interactive TTY.

- Shared market logic lives in `packages/utils`, exported as `@heaven-financial/market`.
- The website lives in `apps/website`.
- The architectural layering note is in `docs/architecture/layering.md`.
