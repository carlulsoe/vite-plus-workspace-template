import { describe, expect, test } from "vite-plus/test";
import { createHealthSnapshot, createMarketSnapshot, createRebalancePlan } from "../src";

describe("market services", () => {
  test("market snapshot returns the strongest movers first", () => {
    const snapshot = createMarketSnapshot(new Date("2026-03-13T08:00:00.000Z"));

    expect(snapshot.movers).toHaveLength(3);
    expect(snapshot.movers.map((instrument) => instrument.symbol)).toEqual([
      "BRN",
      "ACWI-Q",
      "UST2Y",
    ]);
    expect(snapshot.generatedAt).toBe("2026-03-13T08:00:00.000Z");
  });

  test("rebalance plan allocates the full investable amount", () => {
    const plan = createRebalancePlan({
      profile: "balanced",
      amount: 2_500_000,
    });

    const allocated = plan.slices.reduce((total, slice) => total + slice.amount, 0);

    expect(allocated).toBe(2_500_000);
    expect(plan.slices[0]?.assetClass).toBe("Rates");
    expect(plan.profile).toBe("balanced");
    expect(plan.expectedRange).toBe("Expected annualized drawdown: 8% to 11%");
  });

  test("rebalance plan assigns any rounding remainder to the final slice", () => {
    const plan = createRebalancePlan({
      profile: "balanced",
      amount: 100_001,
    });

    const allocated = plan.slices.reduce((total, slice) => total + slice.amount, 0);
    const cashSlice = plan.slices.at(-1);

    expect(allocated).toBe(100_001);
    expect(cashSlice?.assetClass).toBe("Cash");
    expect(cashSlice?.amount).toBe(8_001);
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
