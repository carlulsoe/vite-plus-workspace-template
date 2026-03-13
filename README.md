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

- Shared market logic lives in `packages/utils`, exported as `@heaven-financial/market`.
- The website lives in `apps/website`.
- The architectural layering note is in `docs/architecture/layering.md`.
