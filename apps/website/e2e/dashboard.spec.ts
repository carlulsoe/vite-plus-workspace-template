import { expect, test } from "@playwright/test";

const isoTimestamp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

test("dashboard renders the primary starter surfaces", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Workspace Starter");
  await expect(
    page.getByRole("heading", {
      name: "A starter dashboard with a real domain model.",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "Balanced roadmap across product, platform, and growth",
    }),
  ).toBeVisible();
  await expect(page.getByText("operational", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run scenario" })).toBeEnabled();
  await expect(page.getByRole("heading", { level: 2, name: "Delivery posture" })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Self-Serve Onboarding" }),
  ).toBeVisible();
});

test("status page and health endpoint stay reachable", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Status" }).click();

  await expect(page).toHaveURL(/\/status$/);
  await expect(
    page.getByRole("heading", {
      name: "Thin routes, shared package logic, live health surface.",
    }),
  ).toBeVisible();
  await expect(page.getByText("operational", { exact: true })).toBeVisible();

  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);

  const body = await response.json();

  expect(body).toMatchObject({
    boundaryMode: "package-first",
    packageCount: 1,
    routeCount: 3,
    status: "operational",
  });
  expect(Array.isArray(body.checks)).toBe(true);
  expect(typeof body.checkedAt).toBe("string");
});

test("dashboard visual layout stays stable", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("main")).toHaveScreenshot("dashboard-page.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 100,
    mask: [page.getByText(isoTimestamp)],
  });
});

test("status visual layout stays stable", async ({ page }) => {
  await page.goto("/status");

  await expect(page.locator("main")).toHaveScreenshot("status-page.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 100,
    mask: [page.getByText(isoTimestamp)],
  });
});
