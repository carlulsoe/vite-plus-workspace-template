import { describe, expect, test } from "vite-plus/test";
import { workspaceSignals } from "../src/repo";

describe("workspace repo fixtures", () => {
  test("signals stay in the curated starter order with stable identifiers", () => {
    expect(workspaceSignals.map((signal) => signal.id)).toEqual([
      "design-system",
      "auth-boundary",
      "product-insights",
      "growth-loop",
      "ops-automation",
      "developer-experience",
    ]);

    expect(workspaceSignals.map((signal) => signal.symbol)).toEqual([
      "UI-01",
      "PL-07",
      "PD-12",
      "GR-03",
      "OP-05",
      "DX-09",
    ]);
  });

  test("signals keep the expected labels, movement, and signal strengths", () => {
    expect(
      workspaceSignals.map(({ id, label, dayChangePct, monthChangePct, signal, focusArea }) => ({
        id,
        label,
        dayChangePct,
        monthChangePct,
        signal,
        focusArea,
      })),
    ).toEqual([
      {
        id: "design-system",
        label: "Design System Refresh",
        dayChangePct: 2.4,
        monthChangePct: 7.1,
        signal: "Accelerating",
        focusArea: "Experience",
      },
      {
        id: "auth-boundary",
        label: "Auth Boundary Hardening",
        dayChangePct: -0.8,
        monthChangePct: 2.1,
        signal: "Watch",
        focusArea: "Foundation",
      },
      {
        id: "product-insights",
        label: "Product Insights Pipeline",
        dayChangePct: 1.3,
        monthChangePct: 4.4,
        signal: "Steady",
        focusArea: "Product",
      },
      {
        id: "growth-loop",
        label: "Self-Serve Onboarding",
        dayChangePct: 3.1,
        monthChangePct: 6.2,
        signal: "Accelerating",
        focusArea: "Growth",
      },
      {
        id: "ops-automation",
        label: "Workflow Automation",
        dayChangePct: -1.6,
        monthChangePct: 1.7,
        signal: "Steady",
        focusArea: "Operations",
      },
      {
        id: "developer-experience",
        label: "Developer Experience",
        dayChangePct: 1.9,
        monthChangePct: 5.6,
        signal: "Accelerating",
        focusArea: "Foundation",
      },
    ]);
  });

  test("signals keep their template notes and the two watch items remain negative on the day", () => {
    expect(workspaceSignals.map((signal) => signal.note)).toEqual([
      "Component adoption is climbing quickly now that primitives and docs are aligned.",
      "Permissions and session flows need another pass before downstream teams can move faster.",
      "Reporting coverage is good enough to support prioritization, but instrumentation still has gaps.",
      "Activation work is paying off, and the next bottleneck has become clearer.",
      "The operating baseline is improving, but recurring manual steps still slow releases down.",
      "Tooling friction is dropping, which is making every other focus area easier to ship.",
    ]);

    expect(
      workspaceSignals
        .filter((signal) => signal.dayChangePct < 0)
        .map(({ id, symbol, dayChangePct }) => ({ id, symbol, dayChangePct })),
    ).toEqual([
      { id: "auth-boundary", symbol: "PL-07", dayChangePct: -0.8 },
      { id: "ops-automation", symbol: "OP-05", dayChangePct: -1.6 },
    ]);
  });
});
