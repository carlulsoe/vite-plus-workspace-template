import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import type { StatusData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export interface StatusPageProps {
  data: StatusData;
}

export function StatusPage({ data }: StatusPageProps) {
  const { health, snapshot } = data;
  const isOperational = health.status.toLowerCase() === "operational";

  return (
    <main className="section-container py-12 pb-24">
      {/* Page Header */}
      <section className="reveal-up">
        <Card className="card-section border-0 bg-primary/5 dark:bg-primary/10 shadow-2xl overflow-hidden">
          <CardContent className="flex flex-col gap-8 p-8 sm:p-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <Badge variant="outline" className="badge-section">
                Operational view
              </Badge>
              <h1 className="text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
                System <span className="text-primary italic">Live</span> Status.
              </h1>
              <p className="max-w-2xl text-lg text-ink-soft">
                Real-time monitoring of shared package logic, Nitro-backed routes, and core domain
                service health.
              </p>
            </div>

            <div
              className={cn(
                "flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 aspect-square min-w-[200px] transition-all duration-500",
                isOperational
                  ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                  : "bg-destructive/10 border-destructive/20 shadow-[0_0_40px_rgba(224,108,77,0.1)]",
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full mb-4 animate-pulse",
                  isOperational
                    ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "bg-destructive shadow-[0_0_15px_rgba(224,108,77,0.5)]",
                )}
              />
              <strong
                className={cn(
                  "text-2xl font-black uppercase tracking-widest",
                  isOperational ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
                )}
              >
                {health.status}
              </strong>
              <p className="text-[0.65rem] font-bold text-ink-muted uppercase tracking-widest mt-1">
                Status
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Runtime Signals */}
        <section className="reveal-up [animation-delay:100ms] space-y-6">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-1">
              <Badge variant="outline" className="badge-section">
                Diagnostics
              </Badge>
              <h2 className="text-4xl">Runtime signals</h2>
            </div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              Last check: {health.checkedAt}
            </p>
          </div>

          <div className="grid gap-4">
            {health.checks.map((check) => (
              <Card
                key={check.label}
                className="card-nested hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6 flex items-start gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center shrink-0">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xl text-ink">{check.label}</strong>
                    <p className="text-sm leading-relaxed text-ink-soft">{check.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-8">
          <section className="reveal-up [animation-delay:200ms] space-y-4">
            <div className="px-2">
              <Badge variant="outline" className="badge-section">
                Architecture
              </Badge>
              <h2 className="text-3xl mt-1">Imported patterns</h2>
            </div>

            <div className="space-y-4">
              {siteConfig.operatingPrinciples.map((principle) => (
                <Card
                  key={principle}
                  size="sm"
                  className="card-section border-0 bg-black/[0.02] dark:bg-white/[0.02]"
                >
                  <CardContent className="p-6 space-y-4">
                    <Badge
                      variant="outline"
                      className="badge-section border-primary/20 text-primary bg-primary/5"
                    >
                      Principle
                    </Badge>
                    <p className="text-base font-bold leading-relaxed text-ink-soft italic">
                      "{principle}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="reveal-up [animation-delay:300ms]">
            <Card className="card-section border-0 shadow-2xl">
              <CardHeader className="p-8 pb-0">
                <div className="space-y-1">
                  <Badge variant="outline" className="badge-section">
                    Footprint
                  </Badge>
                  <h2 className="text-2xl">Signal core snapshot</h2>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  {snapshot.watchlist.map((instrument) => (
                    <div
                      key={instrument.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5"
                    >
                      <div>
                        <p className="text-sm font-bold text-ink">{instrument.label}</p>
                        <p className="text-xs text-ink-muted">{instrument.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-ink">{instrument.signal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </aside>
      </div>
    </main>
  );
}
