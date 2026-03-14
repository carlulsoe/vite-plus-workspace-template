import type {
  BudgetSlice,
  DeliveryNote,
  FocusArea,
  PlanningProfile,
  SnapshotMetric,
} from "./types";

type PlanningTargetMap = Record<PlanningProfile, Record<FocusArea | "Reserve", number>>;

export const planningTargets: PlanningTargetMap = {
  steady: {
    Foundation: 0.28,
    Product: 0.24,
    Experience: 0.14,
    Growth: 0.1,
    Operations: 0.14,
    Reserve: 0.1,
  },
  balanced: {
    Foundation: 0.22,
    Product: 0.26,
    Experience: 0.18,
    Growth: 0.14,
    Operations: 0.12,
    Reserve: 0.08,
  },
  acceleration: {
    Foundation: 0.18,
    Product: 0.32,
    Experience: 0.18,
    Growth: 0.18,
    Operations: 0.08,
    Reserve: 0.06,
  },
};

export const planningRationales: Record<BudgetSlice["focusArea"], string> = {
  Foundation: "Protect routing, auth, and shared platform work so product delivery stays stable.",
  Product: "Fund the roadmap where customer value and learning loops are strongest.",
  Experience:
    "Keep polish, accessibility, and usability work visible instead of treating it as overflow.",
  Growth: "Reserve room for onboarding, experimentation, and conversion improvements.",
  Operations: "Sustain the workflows that keep launches, support, and incident response reliable.",
  Reserve: "Hold capacity for surprises, regressions, and work discovered during delivery.",
};

export const baselineScorecard: SnapshotMetric[] = [
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
];

export const deliveryNotes: DeliveryNote[] = [
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
];
