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
    expect(result.defaultPlan.totalBudget).toBe(2_500_000);
    expect(result.snapshot.movers).toHaveLength(3);
    expect(result.health.status).toBe("operational");
    expect(result.health.boundaryMode).toBe("package-first");
  });

  test("returns the status payload", async () => {
    const result = await createStatusData();

    expect(result.health.checks).toHaveLength(3);
    expect(result.snapshot.watchlist.length).toBeGreaterThanOrEqual(3);
    expect(result.health.packageCount).toBe(1);
    expect(result.health.routeCount).toBe(3);
    expect(result.health.checks[0]?.label).toBe("Core package");
    expect(result.snapshot.watchlist[0]?.label).toBe("Design System Refresh");
  });

  test("normalizes a valid planning scenario", async () => {
    const result = await createScenarioPlan({
      profile: "acceleration",
      amount: 250_000.6,
    });

    expect(result.profile).toBe("acceleration");
    expect(result.totalBudget).toBe(250_001);
    expect(result.headline).toBe("Acceleration plan with core operations protected");
    expect(result.expectedRange).toBe("Expected coordination load: moderate to high");
    expect(result.slices).toHaveLength(6);
    expect(result.slices[0]).toMatchObject({
      focusArea: "Foundation",
      amount: 45_000,
    });
    expect(result.slices.at(-1)).toMatchObject({
      focusArea: "Reserve",
      amount: 15_001,
    });
    expect(result.slices.reduce((total, slice) => total + slice.amount, 0)).toBe(250_001);
  });

  test("validates and rounds scenario input", () => {
    expect(
      validateScenarioInput({
        profile: "steady",
        amount: 150_000.5,
      }),
    ).toEqual({
      profile: "steady",
      budget: 150_001,
    });
  });

  test("rejects scenarios below the minimum amount", async () => {
    await expect(createScenarioPlan({ profile: "balanced", amount: 99_999 })).rejects.toThrow(
      "Enter a planning budget of at least 100,000.",
    );
  });

  test("accepts a scenario at the minimum amount", async () => {
    expect(
      validateScenarioInput({
        profile: "balanced",
        amount: 100_000,
      }),
    ).toEqual({
      profile: "balanced",
      budget: 100_000,
    });

    await expect(
      createScenarioPlan({ profile: "balanced", amount: 100_000 }),
    ).resolves.toMatchObject({
      profile: "balanced",
      totalBudget: 100_000,
    });
  });

  test("rejects invalid profiles", () => {
    expect(() => validateScenarioInput({ profile: "income", amount: 250_000 })).toThrow(
      "Choose a valid delivery profile.",
    );
  });
});
