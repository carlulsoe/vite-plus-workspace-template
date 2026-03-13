import {
  type AllocationProfile,
  type MarketInstrument,
  type RebalancePlan,
} from "@heaven-financial/market";
import { startTransition, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
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

const sectionCardClass =
  "rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel";

const nestedCardClass = "rounded-[1.15rem] border border-black/10 bg-white/55 py-0";

const sectionBadgeClass =
  "rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted";

export interface DashboardPageProps {
  data: DashboardData;
  invalidate?: () => void | Promise<void>;
  runScenario: (input: { profile: AllocationProfile; amount: number }) => Promise<RebalancePlan>;
}

export function DashboardPage({ data, invalidate, runScenario }: DashboardPageProps) {
  const { defaultPlan, health, snapshot } = data;
  const [plan, setPlan] = useState<RebalancePlan>(defaultPlan);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(formData: FormData) {
    const rawProfile = formData.get("profile");
    const rawAmount = formData.get("amount");
    const profile = typeof rawProfile === "string" ? (rawProfile as AllocationProfile) : "balanced";
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
            caughtError instanceof Error ? caughtError.message : "Unable to price the scenario.",
          );
        })
        .finally(() => {
          setPending(false);
        });
    });
  }

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] py-8 pb-16">
      <Card className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel">
        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
          <div>
            <Badge variant="outline" className={sectionBadgeClass}>
              Cross-asset morning brief
            </Badge>
            <h1 className="mt-3 font-display text-5xl leading-[0.92] tracking-[-0.04em] text-ink sm:text-7xl">
              The market shell is no longer starter code.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
              This app now runs as a TanStack Start application with Nitro-backed routes and a
              shared market package. The dashboard and scenario engine are both reading from the
              same domain API.
            </p>
          </div>

          <Card className="rounded-[1.6rem] border border-black/10 bg-[linear-gradient(160deg,rgba(17,97,73,0.09),transparent_44%),rgba(253,250,245,0.72)] py-0">
            <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
              <Badge variant="outline" className={sectionBadgeClass}>
                Desk health
              </Badge>
              <strong className="text-3xl capitalize text-ink">{health.status}</strong>
              <p className="text-sm text-ink-soft">{health.boundaryMode}</p>
              <p className="text-sm text-ink-muted">{snapshot.generatedAt}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <section className="mt-5 flex flex-wrap gap-3" aria-label="Stack highlights">
        {siteConfig.badges.map((badge) => (
          <Badge
            key={badge}
            variant="outline"
            className="rounded-full bg-white/60 px-4 py-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-ink"
          >
            {badge}
          </Badge>
        ))}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <div className="grid gap-4">
          <Card className={sectionCardClass}>
            <CardHeader className="px-6 pt-6">
              <div>
                <Badge variant="outline" className={sectionBadgeClass}>
                  Market tape
                </Badge>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                  Highest-conviction movers
                </h2>
              </div>
              <CardAction className="text-sm font-semibold text-ink-muted">
                Generated server-side
              </CardAction>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
              {snapshot.movers.map((instrument) => (
                <MoverCard key={instrument.id} instrument={instrument} />
              ))}
            </CardContent>
          </Card>

          <Card className={sectionCardClass}>
            <CardHeader className="px-6 pt-6">
              <div>
                <Badge variant="outline" className={sectionBadgeClass}>
                  Allocation engine
                </Badge>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                  Scenario rebalance
                </h2>
              </div>
              <CardAction className="text-sm font-semibold text-ink-muted">
                Server action
              </CardAction>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(new FormData(event.currentTarget));
                }}
              >
                <FieldGroup className="mt-1 gap-4 lg:grid lg:grid-cols-3 lg:items-end">
                  <Field>
                    <FieldLabel htmlFor="profile">Profile</FieldLabel>
                    <FieldContent>
                      <NativeSelect id="profile" name="profile" defaultValue={plan.profile}>
                        <NativeSelectOption value="defensive">Defensive</NativeSelectOption>
                        <NativeSelectOption value="balanced">Balanced</NativeSelectOption>
                        <NativeSelectOption value="growth">Growth</NativeSelectOption>
                      </NativeSelect>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="amount">Investable capital</FieldLabel>
                    <FieldContent>
                      <Input
                        id="amount"
                        className="h-12 rounded-2xl border-black/10 bg-white/80 px-4 text-sm text-ink"
                        name="amount"
                        type="number"
                        min="100000"
                        step="50000"
                        defaultValue={plan.investableAmount}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 self-end rounded-full px-5 text-sm tracking-[0.04em]"
                      disabled={pending}
                    >
                      {pending ? <Spinner data-icon="inline-start" /> : null}
                      {pending ? "Repricing..." : "Run scenario"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>

              {error ? (
                <Alert
                  variant="destructive"
                  className="mt-4 rounded-2xl border-destructive/20 bg-destructive/10 px-4 py-3"
                >
                  <AlertTitle>Scenario pricing failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant="outline" className={sectionBadgeClass}>
                    Recommended mix
                  </Badge>
                  <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                    {plan.headline}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted"
                >
                  {plan.expectedRange}
                </Badge>
              </div>

              <div className="mt-5 grid gap-3">
                {plan.slices.map((slice) => (
                  <Card key={slice.assetClass} size="sm" className={nestedCardClass}>
                    <CardContent className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <strong className="text-base text-ink">{slice.assetClass}</strong>
                        <p className="mt-1 text-sm leading-7 text-ink-soft">{slice.rationale}</p>
                      </div>
                      <div className="grid gap-1 sm:justify-items-end sm:text-right">
                        <Badge
                          variant="outline"
                          className="justify-self-start rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted sm:justify-self-end"
                        >
                          {Math.round(slice.weight * 100)}%
                        </Badge>
                        <strong>{currencyFormatter.format(slice.amount)}</strong>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className={sectionCardClass}>
            <CardHeader className="px-6 pt-6">
              <div>
                <Badge variant="outline" className={sectionBadgeClass}>
                  Scoreboard
                </Badge>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                  Market posture
                </h2>
              </div>
              <CardAction className="text-sm font-semibold text-ink-muted">
                Shared package service
              </CardAction>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 pb-6 sm:grid-cols-2 xl:grid-cols-3">
              {snapshot.scorecard.map((item) => (
                <Card
                  key={item.label}
                  size="sm"
                  className={cn(
                    "rounded-[1.2rem] border py-0",
                    item.tone === "positive" && "border-emerald-700/20 bg-emerald-500/10",
                    item.tone === "negative" && "border-destructive/20 bg-destructive/10",
                    item.tone === "steady" && "border-sky-900/10 bg-sky-900/5",
                  )}
                >
                  <CardContent className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className="rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted"
                    >
                      {item.label}
                    </Badge>
                    <strong className="mt-3 block font-display text-4xl text-ink">
                      {item.value}
                    </strong>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className={sectionCardClass}>
            <CardHeader className="px-6 pt-6">
              <div>
                <Badge variant="outline" className={sectionBadgeClass}>
                  Desk notes
                </Badge>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                  Watchlist and operating stance
                </h2>
              </div>
              <CardAction className="text-sm font-semibold text-ink-muted">
                Package-first model
              </CardAction>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="grid gap-3">
                {snapshot.watchlist.map((instrument) => (
                  <Card key={instrument.id} size="sm" className={nestedCardClass}>
                    <CardContent className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <strong className="text-base text-ink">{instrument.label}</strong>
                        <p className="mt-1 text-sm text-ink-soft">
                          {instrument.symbol} · {instrument.assetClass}
                        </p>
                      </div>
                      <div className="grid gap-1 sm:justify-items-end sm:text-right">
                        <Badge
                          variant="outline"
                          className="justify-self-start rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted sm:justify-self-end"
                        >
                          {instrument.price.toFixed(2)}
                        </Badge>
                        <strong className={getDayChangeClass(instrument.dayChangePct)}>
                          {percentFormatter.format(instrument.dayChangePct)}%
                        </strong>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-5 bg-black/8" />

              <div className="grid gap-3">
                {snapshot.strategyNotes.map((note) => (
                  <Card
                    key={note.title}
                    size="sm"
                    className="rounded-[1.3rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel"
                  >
                    <CardContent className="px-5 py-5">
                      <Badge
                        variant="outline"
                        className="rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-[#8c3f19]"
                      >
                        {note.stance}
                      </Badge>
                      <strong className="mt-3 block text-base text-ink">{note.title}</strong>
                      <p className="mt-2 text-sm leading-7 text-ink-soft">{note.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {siteConfig.stackNotes.map((note) => (
          <Card key={note.title} className={sectionCardClass}>
            <CardContent className="px-5 py-5">
              <h3 className="font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                {note.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{note.copy}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

function MoverCard({ instrument }: { instrument: MarketInstrument }) {
  return (
    <Card className="min-h-56 rounded-[1.4rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(249,243,234,0.82))] py-0 shadow-panel">
      <CardContent className="px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <Badge
            variant="outline"
            className="rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted"
          >
            {instrument.assetClass}
          </Badge>
          <strong className={getDayChangeClass(instrument.dayChangePct)}>
            {percentFormatter.format(instrument.dayChangePct)}%
          </strong>
        </div>
        <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
          {instrument.label}
        </h3>
        <p className="mt-2 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
          {instrument.symbol}
        </p>
        <p className="mt-3 text-sm leading-7 text-ink-soft">{instrument.thesis}</p>
      </CardContent>
    </Card>
  );
}

function getDayChangeClass(dayChangePct: number) {
  return dayChangePct >= 0 ? "text-emerald-900" : "text-destructive";
}
