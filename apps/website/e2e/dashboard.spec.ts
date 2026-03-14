import { expect, test, type Page } from "@playwright/test";

const isoTimestamp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
const screenshotStyle = `
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }

  html {
    scroll-behavior: auto !important;
  }

  body::before,
  body::after,
  .grid-overlay {
    display: none !important;
  }
`;

function screenshotOptions(fullPage: boolean) {
  return {
    animations: "disabled" as const,
    caret: "hide" as const,
    fullPage,
    maxDiffPixelRatio: 0.02,
    scale: "css" as const,
  };
}

async function normalizeTimestamps(page: Page) {
  await page.getByText(isoTimestamp).evaluateAll((elements) => {
    for (const element of elements) {
      if (element instanceof HTMLElement) {
        element.style.visibility = "hidden";
      }
    }
  });
}

async function expectScreenshot(page: Page, name: string, fullPage: boolean) {
  await page.addStyleTag({ content: screenshotStyle });
  await normalizeTimestamps(page);
  await expect(page).toHaveScreenshot(name, screenshotOptions(fullPage));
}

test("dashboard renders the primary starter surfaces", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Workspace Starter");
  await expect(
    page.getByRole("heading", {
      name: "The future of workspace models.",
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
      name: "System Live Status.",
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

  await expectScreenshot(page, "dashboard-page.png", false);
});

test("dashboard full-page layout stays stable", async ({ page }) => {
  await page.goto("/");

  await expectScreenshot(page, "dashboard-page-full.png", true);
});

test("status visual layout stays stable", async ({ page }) => {
  await page.goto("/status");

  await expectScreenshot(page, "status-page.png", false);
});

test("status full-page layout stays stable", async ({ page }) => {
  await page.goto("/status");

  await expectScreenshot(page, "status-page-full.png", true);
});
