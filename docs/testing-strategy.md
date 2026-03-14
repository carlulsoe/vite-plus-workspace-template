# Testing Strategy

This repo now has Playwright end-to-end coverage in progress. The next step is to add faster layers
below that so most regressions are caught before they need a full browser.

## Priorities

1. Unit tests for shared planning logic in `packages/utils`.
2. Integration tests for app-side server functions and API routes in `apps/website`.
3. Route and component tests for critical UI state changes.
4. Accessibility checks for key routes.
5. Visual regression coverage for the dashboard and status surfaces.
6. Mutation testing for the shared package.

## What each layer should cover

### 1. Unit tests

Target:

- `packages/utils/src/service.ts`
- `packages/utils/src/config.ts`
- `packages/utils/src/repo.ts`

Focus:

- sorting and selection of top movers
- timestamp handling
- planning-budget rounding and remainder handling
- profile-specific plan copy
- health snapshot counts and check contents
- mutant survival in `packages/utils/src/**/*.ts`

These tests should stay deterministic and avoid rendering UI.

### 2. Server-function and API integration tests

Target:

- `apps/website/src/lib/dashboard.ts`
- `apps/website/src/routes/api/health.ts`

Focus:

- default dashboard payload shape
- status payload shape
- scenario validation failures
- scenario amount normalization
- health route response headers and JSON structure

These tests should verify that the website layer stays thin and continues to consume the shared
package correctly.

### 3. Route and component tests

Target:

- `apps/website/src/routes/index.tsx`
- `apps/website/src/routes/status.tsx`

Focus:

- initial loader-driven render
- scenario submit pending state
- scenario error state
- updated plan render after a successful submit
- route-level accessibility landmarks and labels

Do not spend time exhaustively testing generated `components/ui/*` wrappers unless they contain
project-specific behavior.

### 4. Accessibility tests

Target routes:

- `/`
- `/status`

Focus:

- axe smoke checks
- keyboard navigation through the scenario form
- visible labels and alert semantics

### 5. Visual regression tests

Target pages:

- dashboard
- status

Focus:

- major layout drift
- card density and spacing
- responsive breakpoints
- destructive alert presentation

## Rollout order

1. Expand `packages/utils` unit coverage.
2. Add website integration tests around server-side data boundaries.
3. Add route/component tests for the dashboard form flow.
4. Add accessibility assertions to route tests.
5. Add targeted screenshot baselines for the two main pages.

## Definition of done

- `vp run test -r` passes for workspace packages with tests.
- `vp run mutate` completes for the shared package baseline.
- `vp check` passes.
- New tests cover both success and failure paths for the scenario flow.
- Playwright stays focused on user journeys, not logic that can be proven faster elsewhere.

## Mutation testing

Run the current mutation target with:

```bash
vp run mutate
```

It currently tests a lot and takes on average 15 min to run.
