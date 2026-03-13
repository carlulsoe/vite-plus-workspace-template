import {
  allocationRationales,
  allocationTargets,
  baselineScorecard,
  strategyNotes,
} from "./config";
import { marketWatchlist } from "./repo";
import type { HealthSnapshot, MarketSnapshot, RebalanceInput, RebalancePlan } from "./types";

function sortByAbsoluteMove() {
  return [...marketWatchlist].sort(
    (left, right) => Math.abs(right.dayChangePct) - Math.abs(left.dayChangePct),
  );
}

function planHeadline(profile: RebalanceInput["profile"]) {
  switch (profile) {
    case "defensive":
      return "Defensive carry with duration ballast";
    case "growth":
      return "Growth-tilted allocation with hard hedges intact";
    default:
      return "Balanced cross-asset mix with liquid macro optionality";
  }
}

function planRange(profile: RebalanceInput["profile"]) {
  switch (profile) {
    case "defensive":
      return "Expected annualized drawdown: 5% to 8%";
    case "growth":
      return "Expected annualized drawdown: 11% to 15%";
    default:
      return "Expected annualized drawdown: 8% to 11%";
  }
}

export function createMarketSnapshot(asOf = new Date()): MarketSnapshot {
  return {
    generatedAt: asOf.toISOString(),
    movers: sortByAbsoluteMove().slice(0, 3),
    scorecard: baselineScorecard,
    strategyNotes,
    watchlist: marketWatchlist,
  };
}

export function createRebalancePlan(input: RebalanceInput): RebalancePlan {
  const weights = allocationTargets[input.profile];
  const entries = Object.entries(weights) as Array<[keyof typeof weights, number]>;
  let assigned = 0;

  const slices = entries.map(([assetClass, weight], index) => {
    const isLast = index === entries.length - 1;
    const amount = isLast ? input.amount - assigned : Math.round(input.amount * weight);
    assigned += amount;

    return {
      assetClass,
      weight,
      amount,
      rationale: allocationRationales[assetClass],
    };
  });

  return {
    headline: planHeadline(input.profile),
    expectedRange: planRange(input.profile),
    investableAmount: input.amount,
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
        label: "Market package",
        detail:
          "Shared watchlist and allocation services resolve from the workspace package entrypoint.",
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
