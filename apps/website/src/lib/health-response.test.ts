import { describe, expect, test } from "vite-plus/test";
import { createHealthRouteResponse } from "./health-response";

describe("createHealthRouteResponse", () => {
  test("returns a JSON health payload with the expected headers", async () => {
    const response = await createHealthRouteResponse();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(body).toMatchObject({
      boundaryMode: "package-first",
      packageCount: 1,
      routeCount: 3,
      status: "operational",
    });
    expect(Array.isArray(body.checks)).toBe(true);
    expect(typeof body.checkedAt).toBe("string");
  });
});
