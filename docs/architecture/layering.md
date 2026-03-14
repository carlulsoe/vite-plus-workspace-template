# Architectural Layering

Borrowed from the useful structural discipline in `harness-eng`, the intent here is:

`types -> config -> repo -> service -> app boundary -> routes/ui`

## Package boundaries

- Application routes should import shared logic through workspace package names such as
  `@vite-plus-workspace-template/core`.
- Shared planning logic belongs in packages, not inside route components.
- App-side adapters should stay thin:
  `dashboard-data.ts` converts website inputs into package calls,
  `dashboard.ts` wraps those calls with TanStack Start server functions, and
  `health-response.ts` serializes the health payload for Nitro.
- Nitro handlers should stay thin and serialize data returned by package-backed app adapters.

## Current usage

- `packages/utils/src/types.ts`
- `packages/utils/src/config.ts`
- `packages/utils/src/repo.ts`
- `packages/utils/src/service.ts`
- `apps/website/src/lib/dashboard-data.ts`
- `apps/website/src/lib/dashboard.ts`
- `apps/website/src/lib/health-response.ts`
- `apps/website/src/routes/*`
