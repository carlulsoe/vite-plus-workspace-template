import {
  type AllocationProfile,
  type MarketInstrument,
  type RebalancePlan,
} from "@heaven-financial/market";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { startTransition, useState } from "react";
import { siteConfig } from "../config/site";
import { getDashboardData, runRebalanceScenario } from "../lib/dashboard";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
  maximumFractionDigits: 2,
});

export const Route = createFileRoute("/")({
  loader: () => getDashboardData(),
  component: DashboardPage,
});

function DashboardPage() {
  const router = useRouter();
  const { defaultPlan, health, snapshot } = Route.useLoaderData();
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
      void runRebalanceScenario({ data: { profile, amount } })
        .then((nextPlan) => {
          setPlan(nextPlan);
          void router.invalidate();
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
      <section className="grid gap-6 rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel sm:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
        <div>
          <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
            Cross-asset morning brief
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl">
            The market shell is no longer starter code.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
            This app now runs as a TanStack Start application with Nitro-backed routes and a shared
            market package. The dashboard and scenario engine are both reading from the same domain
            API.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-black/10 bg-[linear-gradient(160deg,rgba(17,97,73,0.09),transparent_44%),rgba(253,250,245,0.72)] p-6">
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
            Desk health
          </span>
          <strong className="text-3xl capitalize text-ink">{health.status}</strong>
          <p className="text-sm text-ink-soft">{health.boundaryMode}</p>
          <p className="text-sm text-ink-muted">{snapshot.generatedAt}</p>
        </div>
      </section>

      <section className="mt-5 flex flex-wrap gap-3" aria-label="Stack highlights">
        {siteConfig.badges.map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-ink"
          >
            {badge}
          </span>
        ))}
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <div className="grid gap-4">
          <article className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                  Market tape
                </p>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                  Highest-conviction movers
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">Generated server-side</span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {snapshot.movers.map((instrument) => (
                <MoverCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          </article>

          <article className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                  Allocation engine
                </p>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                  Scenario rebalance
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">Server action</span>
            </div>

            <form
              className="mt-5 grid gap-4 lg:grid-cols-3"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(new FormData(event.currentTarget));
              }}
            >
              <label className="grid gap-2 text-sm font-bold text-ink">
                Profile
                <select
                  name="profile"
                  defaultValue={plan.profile}
                  className="min-h-12 rounded-2xl border border-black/10 bg-white/80 px-4 text-ink outline-none ring-0 transition focus:border-[#c96c3c] focus:outline-none"
                >
                  <option value="defensive">Defensive</option>
                  <option value="balanced">Balanced</option>
                  <option value="growth">Growth</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-ink">
                Investable capital
                <input
                  className="min-h-12 rounded-2xl border border-black/10 bg-white/80 px-4 text-ink outline-none ring-0 transition focus:border-[#c96c3c] focus:outline-none"
                  name="amount"
                  type="number"
                  min="100000"
                  step="50000"
                  defaultValue={plan.investableAmount}
                />
              </label>

              <button
                type="submit"
                className="min-h-12 self-end rounded-full bg-[linear-gradient(135deg,#8c3f19,#c96c3c)] px-5 text-sm font-extrabold tracking-[0.04em] text-white transition hover:-translate-y-0.5 disabled:cursor-progress disabled:opacity-70"
                disabled={pending}
              >
                {pending ? "Repricing..." : "Run scenario"}
              </button>
            </form>

            {error ? (
              <p className="mt-4 rounded-2xl bg-[rgba(161,67,44,0.12)] px-4 py-3 font-bold text-[#a1432c]">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                  Recommended mix
                </p>
                <h3 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                  {plan.headline}
                </h3>
              </div>
              <span className="text-sm font-semibold text-ink-muted">{plan.expectedRange}</span>
            </div>

            <div className="mt-5 grid gap-3">
              {plan.slices.map((slice) => (
                <div
                  key={slice.assetClass}
                  className="flex flex-col gap-3 rounded-[1.15rem] border border-black/10 bg-white/55 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <strong className="text-base text-ink">{slice.assetClass}</strong>
                    <p className="mt-1 text-sm leading-7 text-ink-soft">{slice.rationale}</p>
                  </div>
                  <div className="grid gap-1 sm:justify-items-end sm:text-right">
                    <span className="text-sm font-semibold text-ink-muted">
                      {Math.round(slice.weight * 100)}%
                    </span>
                    <strong>{currencyFormatter.format(slice.amount)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-4">
          <article className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                  Scoreboard
                </p>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                  Market posture
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">Shared package service</span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {snapshot.scorecard.map((item) => (
                <div
                  key={item.label}
                  className={[
                    "rounded-[1.2rem] border border-black/10 p-4",
                    item.tone === "positive" && "bg-[rgba(17,97,73,0.1)]",
                    item.tone === "negative" && "bg-[rgba(161,67,44,0.1)]",
                    item.tone === "steady" && "bg-[rgba(41,79,109,0.1)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="block text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
                    {item.label}
                  </span>
                  <strong className="mt-2 block font-display text-4xl">{item.value}</strong>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                  Desk notes
                </p>
                <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                  Watchlist and operating stance
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-muted">Package-first model</span>
            </div>

            <div className="mt-5 grid gap-3">
              {snapshot.watchlist.map((instrument) => (
                <div
                  key={instrument.id}
                  className="flex flex-col gap-3 rounded-[1.15rem] border border-black/10 bg-white/55 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <strong className="text-base text-ink">{instrument.label}</strong>
                    <p className="mt-1 text-sm text-ink-soft">
                      {instrument.symbol} · {instrument.assetClass}
                    </p>
                  </div>
                  <div className="grid gap-1 sm:justify-items-end sm:text-right">
                    <span className="text-sm font-semibold text-ink-muted">
                      {instrument.price.toFixed(2)}
                    </span>
                    <strong
                      className={instrument.dayChangePct >= 0 ? "text-[#116149]" : "text-[#a1432c]"}
                    >
                      {percentFormatter.format(instrument.dayChangePct)}%
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              {snapshot.strategyNotes.map((note) => (
                <article
                  key={note.title}
                  className="rounded-[1.3rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-5 shadow-panel"
                >
                  <span className="inline-flex text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#8c3f19]">
                    {note.stance}
                  </span>
                  <strong className="mt-2 block text-base text-ink">{note.title}</strong>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{note.summary}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {siteConfig.stackNotes.map((note) => (
          <article
            key={note.title}
            className="rounded-[1.3rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-5 shadow-panel"
          >
            <h3 className="font-display text-3xl leading-none tracking-[-0.03em]">{note.title}</h3>
            <p className="mt-3 text-sm leading-7 text-ink-soft">{note.copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function MoverCard({ instrument }: { instrument: MarketInstrument }) {
  return (
    <article className="min-h-56 rounded-[1.4rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(249,243,234,0.82))] p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <span className="text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
          {instrument.assetClass}
        </span>
        <strong className={instrument.dayChangePct >= 0 ? "text-[#116149]" : "text-[#a1432c]"}>
          {percentFormatter.format(instrument.dayChangePct)}%
        </strong>
      </div>
      <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.03em]">
        {instrument.label}
      </h3>
      <p className="mt-2 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
        {instrument.symbol}
      </p>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{instrument.thesis}</p>
    </article>
  );
}
