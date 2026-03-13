import {
  createHealthSnapshot,
  createMarketSnapshot,
  createRebalancePlan,
  type AllocationProfile,
} from "@heaven-financial/market";
import { createServerFn } from "@tanstack/react-start";

function validateScenarioInput(input: unknown) {
  const profile =
    typeof input === "object" &&
    input !== null &&
    "profile" in input &&
    (input.profile === "defensive" || input.profile === "balanced" || input.profile === "growth")
      ? (input.profile as AllocationProfile)
      : null;

  const amount =
    typeof input === "object" && input !== null && "amount" in input
      ? Number(input.amount)
      : Number.NaN;

  if (!profile) {
    throw new Error("Choose a valid allocation profile.");
  }

  if (!Number.isFinite(amount) || amount < 100_000) {
    throw new Error("Enter an investable amount of at least 100,000.");
  }

  return {
    profile,
    amount: Math.round(amount),
  };
}

export const getDashboardData = createServerFn({ method: "GET" }).handler(async () => ({
  snapshot: createMarketSnapshot(),
  defaultPlan: createRebalancePlan({
    profile: "balanced",
    amount: 2_500_000,
  }),
  health: createHealthSnapshot(),
}));

export const getStatusData = createServerFn({ method: "GET" }).handler(async () => ({
  health: createHealthSnapshot(),
  snapshot: createMarketSnapshot(),
}));

export const runRebalanceScenario = createServerFn({ method: "POST" })
  .inputValidator(validateScenarioInput)
  .handler(async ({ data }) => createRebalancePlan(data));
