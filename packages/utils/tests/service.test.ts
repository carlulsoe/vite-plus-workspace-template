import { describe, expect, test } from "vite-plus/test";
import { createDeliveryPlan, createHealthSnapshot, createWorkspaceSnapshot } from "../src";

describe("workspace services", () => {
  test("workspace snapshot returns the strongest movers first", () => {
    const snapshot = createWorkspaceSnapshot(new Date("2026-03-13T08:00:00.000Z"));

    expect(snapshot.movers).toHaveLength(3);
    expect(snapshot.movers.map((instrument) => instrument.symbol)).toEqual([
      "GR-03",
      "UI-01",
      "DX-09",
    ]);
    expect(snapshot.generatedAt).toBe("2026-03-13T08:00:00.000Z");
  });

  test("delivery plan allocates the full budget", () => {
    const plan = createDeliveryPlan({
      profile: "balanced",
      budget: 2_500_000,
    });

    const allocated = plan.slices.reduce((total, slice) => total + slice.amount, 0);

    expect(allocated).toBe(2_500_000);
    expect(plan.slices[0]?.focusArea).toBe("Foundation");
    expect(plan.profile).toBe("balanced");
    expect(plan.expectedRange).toBe("Expected coordination load: moderate");
  });

  test("delivery plan assigns any rounding remainder to the final slice", () => {
    const plan = createDeliveryPlan({
      profile: "balanced",
      budget: 100_001,
    });

    const allocated = plan.slices.reduce((total, slice) => total + slice.amount, 0);
    const reserveSlice = plan.slices.at(-1);

    expect(allocated).toBe(100_001);
    expect(reserveSlice?.focusArea).toBe("Reserve");
    expect(reserveSlice?.amount).toBe(8_001);
  });

  test("health snapshot reports the package-first boundary mode", () => {
    const health = createHealthSnapshot(new Date("2026-03-13T08:00:00.000Z"));

    expect(health.status).toBe("operational");
    expect(health.boundaryMode).toBe("package-first");
    expect(health.routeCount).toBe(3);
    expect(health.checks).toHaveLength(3);
    expect(health.checkedAt).toBe("2026-03-13T08:00:00.000Z");
  });
});
