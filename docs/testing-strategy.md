# Testing Strategy

This repo already covers the starter at several layers. The fastest tests stay close to the shared
package and the website data boundary, while Playwright covers the routed app surfaces and visual
baselines.

## Current Coverage

### 1. Shared package unit tests

Targets:

- `packages/utils/tests/config.test.ts`
- `packages/utils/tests/repo.test.ts`
- `packages/utils/tests/service.test.ts`

Current assertions:

- stable planning copy and rationales
- curated workspace signal fixtures
- top-mover sorting and timestamp handling
- budget allocation totals, rounding, and reserve remainder handling
- profile-specific plan copy
- health snapshot counts, labels, and route totals

### 2. Website data-boundary tests

Targets:

- `apps/website/src/lib/dashboard.test.ts`
- `apps/website/src/lib/dashboard-server.test.ts`
- `apps/website/src/lib/health-response.test.ts`

Current assertions:

- default dashboard and status payload shape
- scenario input validation and rounding
- minimum-budget and invalid-profile failures
- TanStack Start server function wiring and HTTP methods
- JSON health response headers and payload shape

### 3. Component and accessibility tests

Targets:

- `apps/website/src/components/Header.test.tsx`
- `apps/website/src/components/Footer.test.tsx`
- `apps/website/src/components/dashboard-page.test.tsx`
- `apps/website/src/components/status-page.test.tsx`

Current assertions:

- header and footer navigation/content wiring
- dashboard success, pending, and error states
- keyboard flow through the scenario form
- snapshot-driven rendering on the dashboard and status pages
- accessibility smoke checks with `vitest-axe`

### 4. End-to-end and visual regression tests

Target:

- `apps/website/e2e/dashboard.spec.ts`

Current assertions:

- `/` renders the dashboard shell and default plan
- `/status` stays reachable from the primary navigation
- `/api/health` returns the expected status payload
- screenshot baselines stay stable for dashboard and status pages
- Playwright runs across `chromium`, `widescreen`, and `mobile` projects

### 5. Mutation testing

Target config:

- `stryker.config.json`

Current mutation scope:

- `packages/utils/src/**/*.ts`
- `apps/website/src/lib/**/*.ts`
- `apps/website/src/components/*.tsx`

## Commands

Run the current validation layers with:

```bash
vp check
vp test
vp run website#e2e
vp run mutate
vp run ready
```

`vp run ready` is the closest thing to a full gate at the workspace root. It runs format and lint
checks, package and website tests with coverage thresholds, package and website builds, and the
Playwright suite.

## What Is Not Covered Yet

- There are no dedicated tests for the root not-found surface yet.
- The file-route modules themselves are exercised indirectly through loaders, server functions, and
  Playwright rather than through separate route-module tests.
- Mutation testing is broader than the original shared-package-only scope and can still take
  several minutes.
