import { expect, test } from "vite-plus/test";
import { createHealthSnapshot, createMarketSnapshot, createRebalancePlan } from "../src";

test("market snapshot returns the strongest movers first", () => {
  const snapshot = createMarketSnapshot(new Date("2026-03-13T08:00:00.000Z"));

  expect(snapshot.movers).toHaveLength(3);
  expect(snapshot.movers[0]?.symbol).toBe("BRN");
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
});

test("health snapshot reports the package-first boundary mode", () => {
  const health = createHealthSnapshot(new Date("2026-03-13T08:00:00.000Z"));

  expect(health.status).toBe("operational");
  expect(health.boundaryMode).toBe("package-first");
  expect(health.checkedAt).toBe("2026-03-13T08:00:00.000Z");
});
