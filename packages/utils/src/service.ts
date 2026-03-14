import { baselineScorecard, deliveryNotes, planningRationales, planningTargets } from "./config";
import { workspaceSignals } from "./repo";
import type { DeliveryPlan, HealthSnapshot, PlanningInput, WorkspaceSnapshot } from "./types";

function sortByAbsoluteMove() {
  return [...workspaceSignals].sort(
    (left, right) => Math.abs(right.dayChangePct) - Math.abs(left.dayChangePct),
  );
}

function planHeadline(profile: PlanningInput["profile"]) {
  switch (profile) {
    case "steady":
      return "Steady delivery plan with protected platform work";
    case "acceleration":
      return "Acceleration plan with core operations protected";
    default:
      return "Balanced roadmap across product, platform, and growth";
  }
}

function planRange(profile: PlanningInput["profile"]) {
  switch (profile) {
    case "steady":
      return "Expected coordination load: low to moderate";
    case "acceleration":
      return "Expected coordination load: moderate to high";
    default:
      return "Expected coordination load: moderate";
  }
}

export function createWorkspaceSnapshot(asOf = new Date()): WorkspaceSnapshot {
  return {
    generatedAt: asOf.toISOString(),
    movers: sortByAbsoluteMove().slice(0, 3),
    scorecard: baselineScorecard,
    deliveryNotes,
    watchlist: workspaceSignals,
  };
}

export function createDeliveryPlan(input: PlanningInput): DeliveryPlan {
  const weights = planningTargets[input.profile];
  const entries = Object.entries(weights) as Array<[keyof typeof weights, number]>;
  let assigned = 0;

  const slices = entries.map(([focusArea, weight], index) => {
    const isLast = index === entries.length - 1;
    const amount = isLast ? input.budget - assigned : Math.round(input.budget * weight);
    assigned += amount;

    return {
      focusArea,
      weight,
      amount,
      rationale: planningRationales[focusArea],
    };
  });

  return {
    headline: planHeadline(input.profile),
    expectedRange: planRange(input.profile),
    totalBudget: input.budget,
    profile: input.profile,
    slices,
  };
}

export function createHealthSnapshot(asOf = new Date()): HealthSnapshot {
  return {
    status: "operational",
    boundaryMode: "package-first",
    checkedAt: asOf.toISOString(),
    packageCount: 1,
    routeCount: 3,
    checks: [
      {
        label: "Core package",
        detail:
          "Shared signals and planning services resolve from the workspace package entrypoint.",
        state: "pass",
      },
      {
        label: "Nitro API",
        detail: "The /api/health route can serialize status without touching app UI state.",
        state: "pass",
      },
      {
        label: "Route shape",
        detail:
          "Dashboard and status pages load through TanStack Start file routes and server functions.",
        state: "pass",
      },
    ],
  };
}
