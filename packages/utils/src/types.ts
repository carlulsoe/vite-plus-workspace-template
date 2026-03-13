export type AssetClass = "Rates" | "FX" | "Credit" | "Commodities" | "Equities";

export type SignalStrength = "Cooling" | "Balanced" | "Heating";

export type AllocationProfile = "defensive" | "balanced" | "growth";

export interface MarketInstrument {
  id: string;
  label: string;
  symbol: string;
  assetClass: AssetClass;
  price: number;
  dayChangePct: number;
  monthChangePct: number;
  signal: SignalStrength;
  thesis: string;
}

export interface MarketScore {
  label: string;
  value: string;
  tone: "positive" | "steady" | "negative";
  detail: string;
}

export interface StrategyNote {
  title: string;
  summary: string;
  stance: "Overweight" | "Neutral" | "Hedge";
}

export interface MarketSnapshot {
  generatedAt: string;
  movers: MarketInstrument[];
  scorecard: MarketScore[];
  strategyNotes: StrategyNote[];
  watchlist: MarketInstrument[];
}

export interface RebalanceInput {
  profile: AllocationProfile;
  amount: number;
}

export interface AllocationSlice {
  assetClass: AssetClass | "Cash";
  weight: number;
  amount: number;
  rationale: string;
}

export interface RebalancePlan {
  headline: string;
  expectedRange: string;
  investableAmount: number;
  profile: AllocationProfile;
  slices: AllocationSlice[];
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
