# Architectural Layering

Borrowed from the useful structural discipline in `harness-eng`, the intent here is:

`types -> config -> repo -> service -> ui`

## Package boundaries

- Application routes should import shared logic through workspace package names such as
  `@heaven-financial/market`.
- Shared market logic belongs in packages, not inside route components.
- Nitro handlers should stay thin and serialize data returned by package services.

## Current usage

- `packages/utils/src/types.ts`
- `packages/utils/src/config.ts`
- `packages/utils/src/repo.ts`
- `packages/utils/src/service.ts`
- `apps/website/src/routes/*`
