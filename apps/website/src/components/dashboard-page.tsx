import {
  type DeliveryPlan,
  type PlanningProfile,
  type WorkspaceSignal,
} from "@vite-plus-workspace-template/core";
import {
  Activity,
  ArrowRight,
  BarChart3,
  ChevronRight,
  Cpu,
  Globe,
  Layers,
  LayoutDashboard,
  TrendingUp,
  Zap,
} from "lucide-react";
import { startTransition, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { siteConfig } from "@/config/site";
import type { DashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
  maximumFractionDigits: 2,
});

export interface DashboardPageProps {
  data: DashboardData;
  invalidate?: () => void | Promise<void>;
  runScenario: (input: { profile: PlanningProfile; amount: number }) => Promise<DeliveryPlan>;
}

export function DashboardPage({ data, invalidate, runScenario }: DashboardPageProps) {
  const { defaultPlan, health, snapshot } = data;
  const [plan, setPlan] = useState<DeliveryPlan>(defaultPlan);
  const [profile, setProfile] = useState<PlanningProfile>(defaultPlan.profile);
  const [amountInput, setAmountInput] = useState(() => String(defaultPlan.totalBudget));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit() {
    const amount = Number(amountInput);
    setError(null);
    setPending(true);

    startTransition(() => {
      void runScenario({ profile, amount })
        .then((nextPlan) => {
          setPlan(nextPlan);
          setProfile(nextPlan.profile);
          setAmountInput(String(nextPlan.totalBudget));
          return invalidate?.();
        })
        .catch((caughtError) => {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to recompute the scenario.",
          );
        })
        .finally(() => {
          setPending(false);
        });
    });
  }

  return (
    <main className="section-container py-12 pb-24">
      {/* Hero Section */}
      <section className="reveal-up space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary/40" />
              <Badge
                variant="outline"
                className="badge-section bg-primary/5 border-primary/10 text-primary flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-3 w-3" />
                Workspace planning starter
              </Badge>
            </div>
            <h1 className="text-6xl leading-[1] sm:text-8xl lg:text-9xl font-display font-medium tracking-tight">
              The future of <span className="text-primary italic">workspace</span> models.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-2xl font-medium">
              A TanStack Start application with Nitro-backed routes and a shared core package.
              Experience seamless domain model integration across all your surfaces.
            </p>
          </div>

          <Card className="card-section glow-border bg-white/40 dark:bg-white/[0.03] min-w-[320px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="h-24 w-24 text-primary" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="badge-section">
                  System health
                </Badge>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[0.65rem] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <strong className="text-5xl capitalize text-ink tracking-tighter block">
                  {health.status}
                </strong>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                  {health.boundaryMode}
                </p>
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-ink-muted font-medium italic">{snapshot.generatedAt}</p>
                <Cpu className="h-3.5 w-3.5 text-ink-muted/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          {siteConfig.badges.map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="px-5 py-2 text-sm bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:scale-105 transition-all cursor-default shadow-sm"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-16">
          {/* Signals Grid */}
          <section className="reveal-up [animation-delay:100ms] space-y-8">
            <div className="flex items-end justify-between px-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(166,82,39,0.4)]" />
                  <Badge variant="outline" className="badge-section">
                    Live feed
                  </Badge>
                </div>
                <h2 className="text-4xl sm:text-5xl font-display">Active work signals</h2>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                <p className="text-[0.6rem] font-black text-ink-muted uppercase tracking-[0.2em]">
                  Server-side rendered
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent to-primary/20 rounded-full" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {snapshot.movers.map((instrument) => (
                <MoverCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          </section>

          {/* Planning Engine */}
          <section className="reveal-up [animation-delay:200ms]">
            <Card className="card-section border-0 shadow-2xl bg-white/50 dark:bg-white/[0.02] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-chart-2/40 to-primary/40" />
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center justify-between w-full">
                  <div className="space-y-3">
                    <Badge
                      variant="outline"
                      className="badge-section flex items-center gap-1.5 w-fit"
                    >
                      <Layers className="h-3 w-3" />
                      Planning engine
                    </Badge>
                    <h2 className="text-5xl sm:text-6xl font-display">Budget scenario</h2>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-chart-2 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative px-5 py-2 rounded-full bg-background border border-border text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      v2.4 Core
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 space-y-12">
                <form
                  className="p-8 rounded-[2.5rem] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 shadow-inner backdrop-blur-sm"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                >
                  <FieldGroup className="grid gap-8 lg:grid-cols-3 lg:items-end">
                    <Field>
                      <FieldLabel
                        htmlFor="profile"
                        className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-ink-muted mb-3 flex items-center gap-2"
                      >
                        <Zap className="h-3 w-3 text-primary/60" />
                        Delivery profile
                      </FieldLabel>
                      <FieldContent>
                        <NativeSelect
                          id="profile"
                          name="profile"
                          value={profile}
                          onChange={(event) => {
                            setProfile(event.target.value as PlanningProfile);
                          }}
                          className="w-full h-12 bg-white/50 dark:bg-white/5"
                        >
                          <NativeSelectOption value="steady">Steady</NativeSelectOption>
                          <NativeSelectOption value="balanced">Balanced</NativeSelectOption>
                          <NativeSelectOption value="acceleration">Acceleration</NativeSelectOption>
                        </NativeSelect>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel
                        htmlFor="amount"
                        className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-ink-muted mb-3 flex items-center gap-2"
                      >
                        <Globe className="h-3 w-3 text-primary/60" />
                        Planning budget
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          min="100000"
                          step="50000"
                          value={amountInput}
                          onChange={(event) => {
                            setAmountInput(event.target.value);
                          }}
                          className="h-12 bg-white/50 dark:bg-white/5"
                        />
                      </FieldContent>
                    </Field>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                      disabled={pending}
                    >
                      {pending ? (
                        <Spinner data-icon="inline-start" />
                      ) : (
                        <BarChart3 className="mr-2 h-4 w-4" />
                      )}
                      {pending ? "Recomputing..." : "Run scenario"}
                    </Button>
                  </FieldGroup>
                </form>

                {error && (
                  <Alert
                    variant="destructive"
                    className="card-negative rounded-3xl border-0 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300"
                  >
                    <AlertTitle className="font-bold">Scenario update failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-12">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between border-b border-black/5 dark:border-white/5 pb-12">
                    <div className="space-y-4">
                      <Badge
                        variant="outline"
                        className="badge-section bg-primary/5 text-primary border-primary/10 px-4"
                      >
                        Recommended split
                      </Badge>
                      <h3 className="text-6xl sm:text-7xl lg:text-8xl tracking-tighter font-display leading-[0.85]">
                        {plan.headline}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <Badge
                        variant="outline"
                        className="h-fit px-8 py-3 font-black text-primary border-primary/20 rounded-full text-base bg-primary/5 shadow-sm"
                      >
                        {plan.expectedRange}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-muted">
                          Confidence: 94.2%
                        </p>
                        <div className="h-1 w-12 bg-emerald-500/20 rounded-full overflow-hidden">
                          <div className="h-full w-[94.2%] bg-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {plan.slices.map((slice) => (
                      <Card
                        key={slice.focusArea}
                        size="sm"
                        className="card-nested group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-white/40 dark:bg-white/[0.03] overflow-hidden"
                      >
                        <CardContent className="p-8 space-y-6 relative">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ChevronRight className="h-12 w-12" />
                          </div>
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <strong className="text-2xl text-ink block font-display">
                                {slice.focusArea}
                              </strong>
                              <div className="h-1 w-12 bg-primary/20 rounded-full group-hover:w-32 transition-all duration-500" />
                            </div>
                            <Badge
                              variant="outline"
                              className="font-black text-primary bg-primary/5 border-primary/20 px-4 py-1.5 text-xs rounded-lg"
                            >
                              {Math.round(slice.weight * 100)}%
                            </Badge>
                          </div>
                          <p className="text-base leading-relaxed text-ink-soft min-h-[4.5rem] font-medium">
                            {slice.rationale}
                          </p>
                          <div className="pt-8 border-t border-black/5 dark:border-white/5 flex items-baseline justify-between">
                            <span className="text-[0.65rem] font-black text-ink-muted uppercase tracking-[0.2em]">
                              Allocation
                            </span>
                            <span className="text-4xl font-display text-ink group-hover:text-primary transition-colors">
                              {currencyFormatter.format(slice.amount)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar Content */}
        <aside className="space-y-12">
          <section className="reveal-up [animation-delay:300ms] space-y-8">
            <div className="px-2 space-y-3">
              <Badge variant="outline" className="badge-section flex items-center gap-1.5 w-fit">
                <BarChart3 className="h-3 w-3" />
                Scoreboard
              </Badge>
              <h2 className="text-4xl font-display">Delivery posture</h2>
            </div>

            <div className="grid gap-5">
              {snapshot.scorecard.map((item) => (
                <Card
                  key={item.label}
                  size="sm"
                  className={cn(
                    "card-nested group overflow-hidden relative border-0 shadow-lg",
                    item.tone === "positive" && "card-positive shadow-emerald-500/5",
                    item.tone === "negative" && "card-negative shadow-destructive/5",
                    item.tone === "steady" && "card-steady shadow-sky-500/5",
                  )}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="badge-section bg-transparent border-0 px-0 text-ink-muted group-hover:text-ink transition-colors"
                      >
                        {item.label}
                      </Badge>
                      {item.tone === "positive" && (
                        <Activity className="h-4 w-4 text-emerald-500/40" />
                      )}
                      {item.tone === "negative" && (
                        <Activity className="h-4 w-4 text-destructive/40" />
                      )}
                      {item.tone === "steady" && <Activity className="h-4 w-4 text-sky-500/40" />}
                    </div>
                    <div className="mt-5 flex items-baseline justify-between">
                      <strong className="text-6xl font-display text-ink group-hover:scale-105 transition-transform origin-left duration-500 leading-none">
                        {item.value}
                      </strong>
                    </div>
                    <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
                      <p className="text-sm leading-relaxed text-ink-soft font-semibold italic">
                        {item.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="reveal-up [animation-delay:400ms] space-y-8">
            <Card className="card-section border-0 shadow-xl bg-white/40 dark:bg-white/[0.02] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <div className="space-y-3">
                  <Badge
                    variant="outline"
                    className="badge-section flex items-center gap-1.5 w-fit"
                  >
                    <Activity className="h-3 w-3" />
                    Watchlist
                  </Badge>
                  <h2 className="text-3xl font-display">Signals and stance</h2>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-12">
                <div className="space-y-4">
                  {snapshot.watchlist.map((instrument) => (
                    <div
                      key={instrument.id}
                      className="group flex items-center justify-between p-5 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-x-1"
                    >
                      <div className="space-y-1.5">
                        <p className="text-base font-bold text-ink group-hover:text-primary transition-colors">
                          {instrument.label}
                        </p>
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-ink-muted flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-primary/40" />
                          {instrument.symbol} · {instrument.focusArea}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-ink tracking-tighter">
                          {instrument.value.toFixed(1)}
                        </p>
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider mt-1",
                            instrument.dayChangePct >= 0
                              ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
                              : "text-destructive bg-destructive/10 border border-destructive/20",
                          )}
                        >
                          {instrument.dayChangePct >= 0 ? "↑" : "↓"}{" "}
                          {Math.abs(instrument.dayChangePct).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-8 pt-8 border-t border-black/5 dark:border-white/5 relative">
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-ink-muted flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-primary" />
                    Operating Notes
                  </h3>
                  <div className="space-y-8">
                    {snapshot.deliveryNotes.map((note) => (
                      <div key={note.title} className="group space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(166,82,39,0.4)] group-hover:scale-150 transition-transform duration-500" />
                          <Badge
                            variant="outline"
                            className="text-[0.65rem] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5 px-2 py-0"
                          >
                            {note.stance}
                          </Badge>
                        </div>
                        <div className="space-y-1.5 pl-5 border-l border-black/5 dark:border-white/5 group-hover:border-primary/30 transition-colors">
                          <p className="text-base font-black text-ink leading-tight group-hover:text-primary transition-colors">
                            {note.title}
                          </p>
                          <p className="text-sm text-ink-soft leading-relaxed font-medium">
                            {note.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </aside>
      </div>

      {/* Footer Notes */}
      <section className="mt-32 reveal-up [animation-delay:500ms] grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.stackNotes.map((note, idx) => (
          <Card
            key={note.title}
            className="card-nested border-0 bg-black/[0.02] dark:bg-white/[0.02] group hover:bg-white dark:hover:bg-white/5 hover:shadow-2xl transition-all duration-700 overflow-hidden relative"
          >
            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <CardContent className="p-12 space-y-8 relative z-10">
              <div className="h-14 w-14 rounded-[1.25rem] bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                {idx === 0 && <Layers className="h-6 w-6" />}
                {idx === 1 && <Cpu className="h-6 w-6" />}
                {idx === 2 && <Globe className="h-6 w-6" />}
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-display">{note.title}</h3>
                <p className="text-base leading-relaxed text-ink-soft font-medium">{note.copy}</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-primary font-black text-[0.65rem] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                Read architecture <ArrowRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

function MoverCard({ instrument }: { instrument: WorkspaceSignal }) {
  const isPositive = instrument.dayChangePct >= 0;

  return (
    <Card className="card-section glow-border group overflow-hidden relative h-full bg-white/40 dark:bg-white/[0.03] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-700">
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
          isPositive ? "bg-emerald-500" : "bg-destructive",
        )}
      />
      <CardContent className="p-10 space-y-10 h-full flex flex-col justify-between relative z-10">
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <Badge
              variant="outline"
              className="badge-section bg-white/80 dark:bg-white/10 px-4 py-1.5 shadow-sm"
            >
              {instrument.focusArea}
            </Badge>
            <div
              className={cn(
                "flex flex-col items-end",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              <div className="flex items-center gap-1.5">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <Activity className="h-5 w-5 rotate-180" />
                )}
                <span className="text-3xl font-display font-black leading-none tracking-tighter">
                  {percentFormatter.format(instrument.dayChangePct)}%
                </span>
              </div>
              <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] opacity-60 mt-1">
                24h Change
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-5xl group-hover:text-primary transition-colors leading-[0.9] tracking-tighter font-display">
              {instrument.label}
            </h3>
            <p className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-ink-muted flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/30" />
              {instrument.symbol}
            </p>
          </div>
        </div>

        <div className="pt-10 border-t border-black/5 dark:border-white/5 group-hover:border-primary/20 transition-colors">
          <p className="text-base leading-relaxed text-ink-soft font-semibold line-clamp-3 group-hover:line-clamp-none transition-all duration-500 italic">
            "{instrument.note}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
