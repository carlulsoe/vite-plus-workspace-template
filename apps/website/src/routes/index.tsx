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
    <main className="page-shell dashboard">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Cross-asset morning brief</p>
          <h1>The market shell is no longer starter code.</h1>
          <p className="hero-copy">
            This app now runs as a TanStack Start application with Nitro-backed routes and a shared
            market package. The dashboard and scenario engine are both reading from the same domain
            API.
          </p>
        </div>

        <div className="hero-sidecard">
          <span className="hero-sidecard__label">Desk health</span>
          <strong>{health.status}</strong>
          <p>{health.boundaryMode}</p>
          <p>{snapshot.generatedAt}</p>
        </div>
      </section>

      <section className="badge-row" aria-label="Stack highlights">
        {siteConfig.badges.map((badge) => (
          <span key={badge} className="badge-pill">
            {badge}
          </span>
        ))}
      </section>

      <section className="content-grid">
        <div className="stack-column">
          <article className="surface-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Market tape</p>
                <h2>Highest-conviction movers</h2>
              </div>
              <span className="section-meta">Generated server-side</span>
            </div>

            <div className="mover-grid">
              {snapshot.movers.map((instrument) => (
                <MoverCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          </article>

          <article className="surface-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Allocation engine</p>
                <h2>Scenario rebalance</h2>
              </div>
              <span className="section-meta">Server action</span>
            </div>

            <form
              className="scenario-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(new FormData(event.currentTarget));
              }}
            >
              <label>
                Profile
                <select name="profile" defaultValue={plan.profile} className="field-control">
                  <option value="defensive">Defensive</option>
                  <option value="balanced">Balanced</option>
                  <option value="growth">Growth</option>
                </select>
              </label>

              <label>
                Investable capital
                <input
                  className="field-control"
                  name="amount"
                  type="number"
                  min="100000"
                  step="50000"
                  defaultValue={plan.investableAmount}
                />
              </label>

              <button type="submit" className="primary-action" disabled={pending}>
                {pending ? "Repricing..." : "Run scenario"}
              </button>
            </form>

            {error ? <p className="status-message status-message--error">{error}</p> : null}

            <div className="plan-header">
              <div>
                <p className="eyebrow">Recommended mix</p>
                <h3>{plan.headline}</h3>
              </div>
              <span className="section-meta">{plan.expectedRange}</span>
            </div>

            <div className="allocation-list">
              {plan.slices.map((slice) => (
                <div key={slice.assetClass} className="allocation-row">
                  <div>
                    <strong>{slice.assetClass}</strong>
                    <p>{slice.rationale}</p>
                  </div>
                  <div className="allocation-row__numbers">
                    <span>{Math.round(slice.weight * 100)}%</span>
                    <strong>{currencyFormatter.format(slice.amount)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="stack-column">
          <article className="surface-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Scoreboard</p>
                <h2>Market posture</h2>
              </div>
              <span className="section-meta">Shared package service</span>
            </div>

            <div className="score-grid">
              {snapshot.scorecard.map((item) => (
                <div key={item.label} className={`score-tile score-tile--${item.tone}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Desk notes</p>
                <h2>Watchlist and operating stance</h2>
              </div>
              <span className="section-meta">Package-first model</span>
            </div>

            <div className="watchlist">
              {snapshot.watchlist.map((instrument) => (
                <div key={instrument.id} className="watchlist-row">
                  <div>
                    <strong>{instrument.label}</strong>
                    <p>
                      {instrument.symbol} · {instrument.assetClass}
                    </p>
                  </div>
                  <div className="watchlist-row__metrics">
                    <span>{instrument.price.toFixed(2)}</span>
                    <strong
                      className={instrument.dayChangePct >= 0 ? "is-positive" : "is-negative"}
                    >
                      {percentFormatter.format(instrument.dayChangePct)}%
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="notes-stack">
              {snapshot.strategyNotes.map((note) => (
                <article key={note.title} className="note-card">
                  <span>{note.stance}</span>
                  <strong>{note.title}</strong>
                  <p>{note.summary}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="principles-grid">
        {siteConfig.stackNotes.map((note) => (
          <article key={note.title} className="principle-card">
            <h3>{note.title}</h3>
            <p>{note.copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function MoverCard({ instrument }: { instrument: MarketInstrument }) {
  return (
    <article className="mover-card">
      <div className="mover-card__header">
        <span>{instrument.assetClass}</span>
        <strong className={instrument.dayChangePct >= 0 ? "is-positive" : "is-negative"}>
          {percentFormatter.format(instrument.dayChangePct)}%
        </strong>
      </div>
      <h3>{instrument.label}</h3>
      <p className="mover-card__symbol">{instrument.symbol}</p>
      <p>{instrument.thesis}</p>
    </article>
  );
}
