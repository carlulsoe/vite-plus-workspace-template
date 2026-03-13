import {
  createHealthSnapshot,
  createMarketSnapshot,
  createRebalancePlan,
  type AllocationProfile,
} from "@heaven-financial/market";

export function validateScenarioInput(input: unknown) {
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

export async function createDashboardData() {
  return {
    snapshot: createMarketSnapshot(),
    defaultPlan: createRebalancePlan({
      profile: "balanced",
      amount: 2_500_000,
    }),
    health: createHealthSnapshot(),
  };
}

export async function createStatusData() {
  return {
    health: createHealthSnapshot(),
    snapshot: createMarketSnapshot(),
  };
}

export async function createScenarioPlan(input: unknown) {
  return createRebalancePlan(validateScenarioInput(input));
}

export type DashboardData = Awaited<ReturnType<typeof createDashboardData>>;
export type StatusData = Awaited<ReturnType<typeof createStatusData>>;
