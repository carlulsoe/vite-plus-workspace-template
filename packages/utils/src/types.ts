export type FocusArea = "Foundation" | "Product" | "Experience" | "Growth" | "Operations";

export type SignalStrength = "Watch" | "Steady" | "Accelerating";

export type PlanningProfile = "steady" | "balanced" | "acceleration";

export interface WorkspaceSignal {
  id: string;
  label: string;
  symbol: string;
  focusArea: FocusArea;
  value: number;
  dayChangePct: number;
  monthChangePct: number;
  signal: SignalStrength;
  note: string;
}

export interface SnapshotMetric {
  label: string;
  value: string;
  tone: "positive" | "steady" | "negative";
  detail: string;
}

export interface DeliveryNote {
  title: string;
  summary: string;
  stance: "Prioritize" | "Maintain" | "Support";
}

export interface WorkspaceSnapshot {
  generatedAt: string;
  movers: WorkspaceSignal[];
  scorecard: SnapshotMetric[];
  deliveryNotes: DeliveryNote[];
  watchlist: WorkspaceSignal[];
}

export interface PlanningInput {
  profile: PlanningProfile;
  budget: number;
}

export interface BudgetSlice {
  focusArea: FocusArea | "Reserve";
  weight: number;
  amount: number;
  rationale: string;
}

export interface DeliveryPlan {
  headline: string;
  expectedRange: string;
  totalBudget: number;
  profile: PlanningProfile;
  slices: BudgetSlice[];
}

export interface HealthCheck {
  label: string;
  detail: string;
  state: "pass";
}

export interface HealthSnapshot {
  status: "operational";
  boundaryMode: "package-first";
  checkedAt: string;
  packageCount: number;
  routeCount: number;
  checks: HealthCheck[];
}
