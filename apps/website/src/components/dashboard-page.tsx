import {
  type DeliveryPlan,
  type PlanningProfile,
  type WorkspaceSignal,
} from "@vite-plus-workspace-template/core";
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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(formData: FormData) {
    const rawProfile = formData.get("profile");
    const rawAmount = formData.get("amount");
    const profile = typeof rawProfile === "string" ? (rawProfile as PlanningProfile) : "balanced";
    const amount = typeof rawAmount === "string" ? Number(rawAmount) : 0;

    setError(null);
    setPending(true);

    startTransition(() => {
      void runScenario({ profile, amount })
        .then((nextPlan) => {
          setPlan(nextPlan);
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
                className="badge-section bg-primary/5 border-primary/10 text-primary"
              >
                Workspace planning starter
              </Badge>
            </div>
            <h1 className="text-6xl leading-[0.9] sm:text-8xl lg:text-9xl">
              The future of <span className="text-primary italic">workspace</span> models.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-2xl font-medium">
              A TanStack Start application with Nitro-backed routes and a shared core package.
              Experience seamless domain model integration across all your surfaces.
            </p>
          </div>

          <Card className="card-section glow-border bg-white/40 dark:bg-white/[0.03] min-w-[320px]">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="badge-section">
                  System health
                </Badge>
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[0.6rem] font-black uppercase tracking-tighter text-emerald-600">
                    Live
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <strong className="text-5xl capitalize text-ink tracking-tighter">
                  {health.status}
                </strong>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  {health.boundaryMode}
                </p>
              </div>
              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <p className="text-xs text-ink-muted font-medium italic">{snapshot.generatedAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3">
          {siteConfig.badges.map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="px-5 py-2 text-sm bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-white hover:scale-105 transition-all cursor-default"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-12">
          {/* Signals Grid */}
          <section className="reveal-up [animation-delay:100ms] space-y-6">
            <div className="flex items-end justify-between px-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <Badge variant="outline" className="badge-section">
                    Live feed
                  </Badge>
                </div>
                <h2 className="text-4xl">Active work signals</h2>
              </div>
              <p className="text-xs font-black text-ink-muted uppercase tracking-[0.2em]">
                Server-side rendered
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {snapshot.movers.map((instrument) => (
                <MoverCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          </section>

          {/* Planning Engine */}
          <section className="reveal-up [animation-delay:200ms]">
            <Card className="card-section border-0 shadow-2xl bg-white/50 dark:bg-white/[0.02]">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center justify-between w-full">
                  <div className="space-y-2">
                    <Badge variant="outline" className="badge-section">
                      Planning engine
                    </Badge>
                    <h2 className="text-5xl">Budget scenario</h2>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-chart-2 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative px-4 py-1.5 rounded-full bg-background border border-border text-[0.65rem] font-black uppercase tracking-widest">
                      v2.4 Core
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 space-y-12">
                <form
                  className="p-8 rounded-[2.5rem] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 shadow-inner"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(new FormData(event.currentTarget));
                  }}
                >
                  <FieldGroup className="grid gap-8 lg:grid-cols-3 lg:items-end">
                    <Field>
                      <FieldLabel
                        htmlFor="profile"
                        className="text-xs uppercase tracking-widest font-black text-ink-muted mb-3"
                      >
                        Delivery profile
                      </FieldLabel>
                      <FieldContent>
                        <NativeSelect
                          id="profile"
                          name="profile"
                          defaultValue={plan.profile}
                          className="w-full"
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
                        className="text-xs uppercase tracking-widest font-black text-ink-muted mb-3"
                      >
                        Planning budget
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          min="100000"
                          step="50000"
                          defaultValue={plan.totalBudget}
                        />
                      </FieldContent>
                    </Field>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-sm font-black uppercase tracking-widest"
                      disabled={pending}
                    >
                      {pending ? <Spinner data-icon="inline-start" /> : null}
                      {pending ? "Recomputing..." : "Run scenario"}
                    </Button>
                  </FieldGroup>
                </form>

                {error && (
                  <Alert
                    variant="destructive"
                    className="card-negative rounded-3xl border-0 shadow-lg"
                  >
                    <AlertTitle className="font-bold">Scenario update failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-10">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-black/5 dark:border-white/5 pb-10">
                    <div className="space-y-3">
                      <Badge
                        variant="outline"
                        className="badge-section bg-primary/5 text-primary border-primary/10"
                      >
                        Recommended split
                      </Badge>
                      <h3 className="text-6xl sm:text-7xl lg:text-8xl tracking-tighter">
                        {plan.headline}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className="h-fit px-6 py-2 font-black text-primary border-primary/20 rounded-full text-sm"
                      >
                        {plan.expectedRange}
                      </Badge>
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink-muted">
                        Confidence: 94.2%
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {plan.slices.map((slice) => (
                      <Card
                        key={slice.focusArea}
                        size="sm"
                        className="card-nested group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-white/40 dark:bg-white/[0.03]"
                      >
                        <CardContent className="p-6 space-y-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <strong className="text-xl text-ink block">{slice.focusArea}</strong>
                              <div className="h-1 w-12 bg-primary/20 rounded-full group-hover:w-24 transition-all duration-500" />
                            </div>
                            <Badge
                              variant="outline"
                              className="font-black text-primary bg-primary/5 border-primary/20 px-3 py-1"
                            >
                              {Math.round(slice.weight * 100)}%
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed text-ink-soft min-h-[4.5rem]">
                            {slice.rationale}
                          </p>
                          <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-baseline gap-2">
                            <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                              Allocation:
                            </span>
                            <span className="text-3xl font-display text-ink">
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
          <section className="reveal-up [animation-delay:300ms] space-y-6">
            <div className="px-2 space-y-2">
              <Badge variant="outline" className="badge-section">
                Scoreboard
              </Badge>
              <h2 className="text-4xl">Delivery posture</h2>
            </div>

            <div className="grid gap-4">
              {snapshot.scorecard.map((item) => (
                <Card
                  key={item.label}
                  size="sm"
                  className={cn(
                    "card-nested group overflow-hidden relative",
                    item.tone === "positive" && "card-positive",
                    item.tone === "negative" && "card-negative",
                    item.tone === "steady" && "card-steady",
                  )}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <CardContent className="p-8 relative">
                    <Badge
                      variant="outline"
                      className="badge-section bg-transparent border-0 px-0 text-ink-muted group-hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Badge>
                    <div className="mt-4 flex items-baseline justify-between">
                      <strong className="text-6xl font-display text-ink group-hover:scale-110 transition-transform origin-left duration-500">
                        {item.value}
                      </strong>
                    </div>
                    <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                      <p className="text-sm leading-relaxed text-ink-soft font-medium">
                        {item.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="reveal-up [animation-delay:400ms] space-y-6">
            <Card className="card-section border-0 shadow-xl bg-white/40 dark:bg-white/[0.02]">
              <CardHeader className="p-8 pb-0">
                <div className="space-y-2">
                  <Badge variant="outline" className="badge-section">
                    Watchlist
                  </Badge>
                  <h2 className="text-3xl">Signals and stance</h2>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-10">
                <div className="space-y-4">
                  {snapshot.watchlist.map((instrument) => (
                    <div
                      key={instrument.id}
                      className="group flex items-center justify-between p-4 rounded-[1.5rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-ink group-hover:text-primary transition-colors">
                          {instrument.label}
                        </p>
                        <p className="text-[0.65rem] font-black uppercase tracking-widest text-ink-muted">
                          {instrument.symbol} · {instrument.focusArea}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-ink tracking-tighter">
                          {instrument.value.toFixed(1)}
                        </p>
                        <div
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[0.6rem] font-black uppercase",
                            instrument.dayChangePct >= 0
                              ? "text-emerald-600 bg-emerald-500/10"
                              : "text-destructive bg-destructive/10",
                          )}
                        >
                          {instrument.dayChangePct >= 0 ? "↑" : "↓"}{" "}
                          {Math.abs(instrument.dayChangePct).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-6 border-t border-black/5 dark:border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ink-muted">
                    Operating Notes
                  </h3>
                  <div className="space-y-6">
                    {snapshot.deliveryNotes.map((note) => (
                      <div key={note.title} className="group space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(166,82,39,0.4)] group-hover:scale-125 transition-transform" />
                          <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary">
                            {note.stance}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-ink leading-tight group-hover:translate-x-1 transition-transform">
                            {note.title}
                          </p>
                          <p className="text-xs text-ink-soft leading-relaxed font-medium">
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
      <section className="mt-24 reveal-up [animation-delay:500ms] grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.stackNotes.map((note) => (
          <Card
            key={note.title}
            className="card-nested border-0 bg-black/[0.02] dark:bg-white/[0.02] group hover:bg-white hover:shadow-2xl transition-all duration-500"
          >
            <CardContent className="p-10 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <span className="text-xl font-display font-black">?</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl">{note.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft font-medium">{note.copy}</p>
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
    <Card className="card-section glow-border group overflow-visible relative h-full bg-white/40 dark:bg-white/[0.03] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      <CardContent className="p-8 space-y-8 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="badge-section bg-white/80 dark:bg-white/10 px-3">
              {instrument.focusArea}
            </Badge>
            <div
              className={cn(
                "flex flex-col items-end",
                isPositive ? "text-emerald-600" : "text-destructive",
              )}
            >
              <span className="text-2xl font-display font-black leading-none">
                {isPositive ? "+" : ""}
                {percentFormatter.format(instrument.dayChangePct)}%
              </span>
              <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-60">
                24h Change
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-4xl group-hover:text-primary transition-colors leading-[0.9] tracking-tighter">
              {instrument.label}
            </h3>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-ink-muted">
              {instrument.symbol}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/5">
          <p className="text-sm leading-relaxed text-ink-soft font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {instrument.note}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
