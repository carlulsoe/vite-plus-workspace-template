import { createHealthSnapshot } from "@heaven-financial/market";

export async function createHealthRouteResponse() {
  return new Response(JSON.stringify(createHealthSnapshot()), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
