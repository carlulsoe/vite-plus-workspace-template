import type {
  AllocationProfile,
  AllocationSlice,
  AssetClass,
  MarketScore,
  StrategyNote,
} from "./types";

type AllocationTargetMap = Record<AllocationProfile, Record<AssetClass | "Cash", number>>;

export const allocationTargets: AllocationTargetMap = {
  defensive: {
    Rates: 0.3,
    Credit: 0.24,
    FX: 0.12,
    Commodities: 0.1,
    Equities: 0.14,
    Cash: 0.1,
  },
  balanced: {
    Rates: 0.24,
    Credit: 0.22,
    FX: 0.11,
    Commodities: 0.13,
    Equities: 0.22,
    Cash: 0.08,
  },
  growth: {
    Rates: 0.14,
    Credit: 0.18,
    FX: 0.13,
    Commodities: 0.14,
    Equities: 0.33,
    Cash: 0.08,
  },
};

export const allocationRationales: Record<AllocationSlice["assetClass"], string> = {
  Rates: "Anchor portfolio duration while inflation momentum cools without breaking.",
  Credit: "Harvest carry where spreads still pay for slower growth risk.",
  FX: "Keep dry powder in liquid macro expressions for policy divergence.",
  Commodities: "Hold inflation and shipping hedges where supply remains constrained.",
  Equities: "Stay exposed to upside beta, but only where earnings breadth is improving.",
  Cash: "Preserve optionality for repricing windows and deployment on dislocations.",
};

export const baselineScorecard: MarketScore[] = [
  {
    label: "Risk Pulse",
    value: "62",
    tone: "positive",
    detail: "Broad risk appetite is constructive, but leadership is narrow.",
  },
  {
    label: "Liquidity",
    value: "Tight",
    tone: "steady",
    detail: "Funding is orderly, though overnight conditions still demand respect.",
  },
  {
    label: "Carry",
    value: "+148bp",
    tone: "positive",
    detail: "Credit and rates still compensate patient capital.",
  },
];

export const strategyNotes: StrategyNote[] = [
  {
    title: "Favor curve quality over pure beta",
    summary:
      "Duration is useful again, but ladder exposure rather than reaching for one macro call.",
    stance: "Overweight",
  },
  {
    title: "Keep commodities as policy insurance",
    summary:
      "Energy and metals still diversify the portfolio if inflation reaccelerates unexpectedly.",
    stance: "Hedge",
  },
  {
    title: "Use FX as the cleanest expression layer",
    summary: "Rates and equities both carry balance sheet noise; major FX crosses stay cleaner.",
    stance: "Neutral",
  },
];
