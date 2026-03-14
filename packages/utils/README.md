# @vite-plus-workspace-template/core

Shared workspace planning, dashboard snapshot, and operational health helpers for the template
workspace.

## Public API

The package currently exports:

- `createWorkspaceSnapshot`
- `createDeliveryPlan`
- `createHealthSnapshot`
- the domain types from `src/types.ts`

The internal layering is:

- `src/types.ts` for shared types
- `src/config.ts` for planning weights and copy
- `src/repo.ts` for curated starter signal fixtures
- `src/service.ts` for the package entrypoints used by the website

## Development

- Run the package tests:

```bash
vp test
```

- Build the package:

```bash
vp pack
```
