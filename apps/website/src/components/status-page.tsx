import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import type { StatusData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export interface StatusPageProps {
  data: StatusData;
}

export function StatusPage({ data }: StatusPageProps) {
  const { health, snapshot } = data;
  const healthBadgeClass = cn(
    "rounded-full px-4 py-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em]",
    health.status.toLowerCase() === "healthy"
      ? "border-emerald-700/20 bg-emerald-500/10 text-emerald-900"
      : "border-destructive/20 bg-destructive/10 text-destructive",
  );

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-2rem))] py-8 pb-16">
      <Card className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted"
            >
              Operational view
            </Badge>
            <h1 className="mt-3 font-display text-5xl leading-[0.92] tracking-[-0.04em] text-ink sm:text-7xl">
              Thin routes, shared package logic, live health surface.
            </h1>
          </div>
          <Badge variant="outline" className={healthBadgeClass}>
            {health.status}
          </Badge>
        </CardContent>
      </Card>

      <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <Card className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel">
          <CardHeader className="px-6 pt-6 sm:px-6 sm:pt-6">
            <div>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted"
              >
                Checks
              </Badge>
              <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                Runtime signals
              </h2>
            </div>
            <CardAction className="text-sm font-semibold text-ink-muted">
              {health.checkedAt}
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6">
            {health.checks.map((check) => (
              <Card
                key={check.label}
                size="sm"
                className="rounded-[1.15rem] border border-black/10 bg-white/55 py-0"
              >
                <CardContent className="px-4 py-4">
                  <strong className="text-base text-ink">{check.label}</strong>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">{check.detail}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel">
          <CardHeader className="px-6 pt-6 sm:px-6 sm:pt-6">
            <div>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted"
              >
                Architecture
              </Badge>
              <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
                Imported patterns
              </h2>
            </div>
            <CardAction className="text-sm font-semibold text-ink-muted">
              From local reference repos
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6">
            {siteConfig.operatingPrinciples.map((principle) => (
              <Card
                key={principle}
                size="sm"
                className="rounded-[1.3rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel"
              >
                <CardContent className="px-5 py-5">
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-[#8c3f19]"
                  >
                    Principle
                  </Badge>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">{principle}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="mt-5 rounded-[1.7rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(248,244,236,0.94))] py-0 shadow-panel">
        <CardHeader className="px-6 pt-6 sm:px-6 sm:pt-6">
          <div>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-ink-muted"
            >
              Watchlist footprint
            </Badge>
            <h2 className="mt-2 font-display text-3xl leading-none tracking-[-0.03em] text-ink">
              Current package snapshot
            </h2>
          </div>
          <CardAction className="text-sm font-semibold text-ink-muted">
            {snapshot.watchlist.length} instruments
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3 px-6 pb-6">
          {snapshot.watchlist.map((instrument, index) => (
            <div key={instrument.id}>
              {index > 0 ? <Separator className="mb-3 bg-black/8" /> : null}
              <div className="flex flex-col gap-3 rounded-[1.15rem] border border-black/10 bg-white/55 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <strong className="text-base text-ink">{instrument.label}</strong>
                  <p className="mt-1 text-sm leading-7 text-ink-soft">{instrument.thesis}</p>
                </div>
                <div className="grid gap-1 sm:justify-items-end sm:text-right">
                  <Badge
                    variant="outline"
                    className="justify-self-start rounded-full px-2.5 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted sm:justify-self-end"
                  >
                    {instrument.symbol}
                  </Badge>
                  <strong className="text-ink">{instrument.signal}</strong>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
