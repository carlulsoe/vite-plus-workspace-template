import { describe, expect, test } from "vite-plus/test";
import {
  createDashboardData,
  createScenarioPlan,
  createStatusData,
  validateScenarioInput,
} from "./dashboard-data";

describe("dashboard data boundary", () => {
  test("returns the default dashboard payload", async () => {
    const result = await createDashboardData();

    expect(result.defaultPlan.profile).toBe("balanced");
    expect(result.defaultPlan.investableAmount).toBe(2_500_000);
    expect(result.snapshot.movers).toHaveLength(3);
    expect(result.health.status).toBe("operational");
    expect(result.health.boundaryMode).toBe("package-first");
  });

  test("returns the status payload", async () => {
    const result = await createStatusData();

    expect(result.health.checks).toHaveLength(3);
    expect(result.snapshot.watchlist.length).toBeGreaterThanOrEqual(3);
  });

  test("normalizes a valid rebalance scenario", async () => {
    const result = await createScenarioPlan({
      profile: "growth",
      amount: 250_000.6,
    });

    expect(result.profile).toBe("growth");
    expect(result.investableAmount).toBe(250_001);
    expect(result.slices.reduce((total, slice) => total + slice.amount, 0)).toBe(250_001);
  });

  test("validates and rounds scenario input", () => {
    expect(
      validateScenarioInput({
        profile: "defensive",
        amount: 150_000.5,
      }),
    ).toEqual({
      profile: "defensive",
      amount: 150_001,
    });
  });

  test("rejects scenarios below the minimum amount", async () => {
    await expect(createScenarioPlan({ profile: "balanced", amount: 99_999 })).rejects.toThrow(
      "Enter an investable amount of at least 100,000.",
    );
  });

  test("rejects invalid profiles", () => {
    expect(() => validateScenarioInput({ profile: "income", amount: 250_000 })).toThrow(
      "Choose a valid allocation profile.",
    );
  });
});
