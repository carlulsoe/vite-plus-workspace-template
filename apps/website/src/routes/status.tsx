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
    <main className="page-shell status-page">
      <section className="surface-card status-hero">
        <div>
          <p className="eyebrow">Operational view</p>
          <h1>Thin routes, shared package logic, live health surface.</h1>
        </div>
        <div className="status-chip">{health.status}</div>
      </section>

      <section className="content-grid">
        <article className="surface-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Checks</p>
              <h2>Runtime signals</h2>
            </div>
            <span className="section-meta">{health.checkedAt}</span>
          </div>

          <div className="check-list">
            {health.checks.map((check) => (
              <div key={check.label} className="check-row">
                <strong>{check.label}</strong>
                <p>{check.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Architecture</p>
              <h2>Imported patterns</h2>
            </div>
            <span className="section-meta">From local reference repos</span>
          </div>

          <div className="notes-stack">
            {siteConfig.operatingPrinciples.map((principle) => (
              <article key={principle} className="note-card">
                <span>Principle</span>
                <p>{principle}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="surface-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Watchlist footprint</p>
            <h2>Current package snapshot</h2>
          </div>
          <span className="section-meta">{snapshot.watchlist.length} instruments</span>
        </div>

        <div className="watchlist">
          {snapshot.watchlist.map((instrument) => (
            <div key={instrument.id} className="watchlist-row">
              <div>
                <strong>{instrument.label}</strong>
                <p>{instrument.thesis}</p>
              </div>
              <div className="watchlist-row__metrics">
                <span>{instrument.symbol}</span>
                <strong>{instrument.signal}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
