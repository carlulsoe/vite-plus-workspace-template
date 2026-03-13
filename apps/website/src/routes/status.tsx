import { createFileRoute } from "@tanstack/react-router";
import { StatusPage } from "@/components/status-page";
import { getStatusData } from "@/lib/dashboard";

export const Route = createFileRoute("/status")({
  loader: () => getStatusData(),
  component: StatusRoute,
});

function StatusRoute() {
  return <StatusPage data={Route.useLoaderData()} />;
}
