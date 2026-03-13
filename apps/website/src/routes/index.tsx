import { createFileRoute, useRouter } from "@tanstack/react-router";
import { DashboardPage } from "@/components/dashboard-page";
import { getDashboardData, runRebalanceScenario } from "@/lib/dashboard";

export const Route = createFileRoute("/")({
  loader: () => getDashboardData(),
  component: DashboardRoute,
});

function DashboardRoute() {
  const router = useRouter();
  return (
    <DashboardPage
      data={Route.useLoaderData()}
      invalidate={() => router.invalidate()}
      runScenario={(input) => runRebalanceScenario({ data: input })}
    />
  );
}
