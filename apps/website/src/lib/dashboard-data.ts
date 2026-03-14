import {
  createDeliveryPlan,
  createHealthSnapshot,
  createWorkspaceSnapshot,
  type PlanningProfile,
} from "@vite-plus-workspace-template/core";

export function validateScenarioInput(input: unknown) {
  const profile =
    typeof input === "object" &&
    input !== null &&
    "profile" in input &&
    (input.profile === "steady" || input.profile === "balanced" || input.profile === "acceleration")
      ? (input.profile as PlanningProfile)
      : null;

  const budget =
    typeof input === "object" && input !== null && "amount" in input
      ? Number(input.amount)
      : Number.NaN;

  if (!profile) {
    throw new Error("Choose a valid delivery profile.");
  }

  if (!Number.isFinite(budget) || budget < 100_000) {
    throw new Error("Enter a planning budget of at least 100,000.");
  }

  return {
    profile,
    budget: Math.round(budget),
  };
}

export async function createDashboardData() {
  return {
    snapshot: createWorkspaceSnapshot(),
    defaultPlan: createDeliveryPlan({
      profile: "balanced",
      budget: 2_500_000,
    }),
    health: createHealthSnapshot(),
  };
}

export async function createStatusData() {
  return {
    health: createHealthSnapshot(),
    snapshot: createWorkspaceSnapshot(),
  };
}

export async function createScenarioPlan(input: unknown) {
  return createDeliveryPlan(validateScenarioInput(input));
}

export type DashboardData = Awaited<ReturnType<typeof createDashboardData>>;
export type StatusData = Awaited<ReturnType<typeof createStatusData>>;
