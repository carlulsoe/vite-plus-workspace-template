import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "../config/site";
import { getStatusData } from "../lib/dashboard";

export const Route = createFileRoute("/status")({
  loader: () => getStatusData(),
  component: StatusPage,
});

function StatusPage() {
  const { health, snapshot } = Route.useLoaderData();

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] py-8 pb-16">
      <section className="flex flex-col gap-4 rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
            Operational view
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl">
            Thin routes, shared package logic, live health surface.
          </h1>
        </div>
        <div className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#116149]">
          {health.status}
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <article className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                Checks
              </p>
              <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                Runtime signals
              </h2>
            </div>
            <span className="text-sm font-semibold text-ink-muted">{health.checkedAt}</span>
          </div>

          <div className="mt-5 grid gap-3">
            {health.checks.map((check) => (
              <div
                key={check.label}
                className="rounded-[1.15rem] border border-black/10 bg-white/55 px-4 py-4"
              >
                <strong className="text-base text-ink">{check.label}</strong>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{check.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                Architecture
              </p>
              <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
                Imported patterns
              </h2>
            </div>
            <span className="text-sm font-semibold text-ink-muted">From local reference repos</span>
          </div>

          <div className="mt-5 grid gap-3">
            {siteConfig.operatingPrinciples.map((principle) => (
              <article
                key={principle}
                className="rounded-[1.3rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-5 shadow-panel"
              >
                <span className="inline-flex text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-[#8c3f19]">
                  Principle
                </span>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{principle}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] p-6 shadow-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              Watchlist footprint
            </p>
            <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em]">
              Current package snapshot
            </h2>
          </div>
          <span className="text-sm font-semibold text-ink-muted">
            {snapshot.watchlist.length} instruments
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {snapshot.watchlist.map((instrument) => (
            <div
              key={instrument.id}
              className="flex flex-col gap-3 rounded-[1.15rem] border border-black/10 bg-white/55 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <strong className="text-base text-ink">{instrument.label}</strong>
                <p className="mt-1 text-sm leading-7 text-ink-soft">{instrument.thesis}</p>
              </div>
              <div className="grid gap-1 sm:justify-items-end sm:text-right">
                <span className="text-sm font-semibold text-ink-muted">{instrument.symbol}</span>
                <strong className="text-ink">{instrument.signal}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
