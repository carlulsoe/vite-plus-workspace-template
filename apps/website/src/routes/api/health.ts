import { createHealthSnapshot } from "@heaven-financial/market";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        new Response(JSON.stringify(createHealthSnapshot()), {
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        }),
    },
  },
});
