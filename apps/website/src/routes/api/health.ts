import { createFileRoute } from "@tanstack/react-router";
import { createHealthRouteResponse } from "@/lib/health-response";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: createHealthRouteResponse,
    },
  },
});
