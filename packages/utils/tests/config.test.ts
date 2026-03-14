import { describe, expect, test } from "vite-plus/test";
import { baselineScorecard, deliveryNotes, planningRationales } from "../src/config";

describe("workspace config", () => {
  test("planning rationales preserve the intended focus-area copy", () => {
    expect(Object.keys(planningRationales)).toEqual([
      "Foundation",
      "Product",
      "Experience",
      "Growth",
      "Operations",
      "Reserve",
    ]);

    expect(planningRationales).toEqual({
      Foundation:
        "Protect routing, auth, and shared platform work so product delivery stays stable.",
      Product: "Fund the roadmap where customer value and learning loops are strongest.",
      Experience:
        "Keep polish, accessibility, and usability work visible instead of treating it as overflow.",
      Growth: "Reserve room for onboarding, experimentation, and conversion improvements.",
      Operations:
        "Sustain the workflows that keep launches, support, and incident response reliable.",
      Reserve: "Hold capacity for surprises, regressions, and work discovered during delivery.",
    });
  });

  test("baseline scorecard keeps the starter metrics and copy", () => {
    expect(baselineScorecard).toHaveLength(3);
    expect(baselineScorecard).toEqual([
      {
        label: "Delivery Confidence",
        value: "72",
        tone: "positive",
        detail: "The current plan has healthy momentum and dependencies are visible early.",
      },
      {
        label: "Platform Health",
        value: "Stable",
        tone: "steady",
        detail: "Core foundations are supporting feature work without creating daily drag.",
      },
      {
        label: "Experiment Velocity",
        value: "6 live",
        tone: "positive",
        detail: "The team is still creating space for iteration while keeping the roadmap intact.",
      },
    ]);
  });

  test("delivery notes keep the three baseline planning stances", () => {
    expect(deliveryNotes).toHaveLength(3);
    expect(deliveryNotes).toEqual([
      {
        title: "Protect foundation work while shipping",
        summary:
          "Shared infrastructure should move in lockstep with product delivery, not as a cleanup phase.",
        stance: "Prioritize",
      },
      {
        title: "Keep operations visible in the plan",
        summary:
          "Automation, incident response, and support tooling should be budgeted explicitly instead of borrowed from feature time.",
        stance: "Maintain",
      },
      {
        title: "Use growth work to validate the roadmap",
        summary:
          "Onboarding and activation experiments should sharpen product decisions, not run in a separate silo.",
        stance: "Support",
      },
    ]);
  });
});
