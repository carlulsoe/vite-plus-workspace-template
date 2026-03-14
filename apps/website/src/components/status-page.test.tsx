import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { StatusPage } from "./status-page";
import { siteConfig } from "../config/site";
import { createStatusData } from "../lib/dashboard-data";

async function createCompactStatusData() {
  const data = await createStatusData();

  return {
    ...data,
    snapshot: {
      ...data.snapshot,
      watchlist: data.snapshot.watchlist.slice(0, 1),
    },
  };
}

afterEach(() => {
  cleanup();
});

describe("StatusPage", () => {
  test("renders operational health details without accessibility violations", async () => {
    const data = await createCompactStatusData();
    const { container } = render(<StatusPage data={data} />);

    expect(screen.getByRole("heading", { level: 1, name: /system live status/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /runtime signals/i })).toBeTruthy();
    expect(screen.getByText(/signal core snapshot/i)).toBeTruthy();
    expect((await axe(container)).violations).toHaveLength(0);
  });

  test("renders diagnostics, principles, and watchlist entries from the status payload", async () => {
    const data = await createStatusData();

    render(<StatusPage data={data} />);

    expect(screen.getByText(`Last check: ${data.health.checkedAt}`)).toBeTruthy();

    for (const check of data.health.checks) {
      expect(screen.getByText(check.label)).toBeTruthy();
      expect(screen.getByText(check.detail)).toBeTruthy();
    }

    for (const principle of siteConfig.operatingPrinciples) {
      expect(screen.getByText(`"${principle}"`)).toBeTruthy();
    }

    for (const instrument of data.snapshot.watchlist) {
      expect(screen.getAllByText(instrument.label).length).toBeGreaterThan(0);
      expect(screen.getAllByText(instrument.symbol).length).toBeGreaterThan(0);
      expect(screen.getAllByText(instrument.signal).length).toBeGreaterThan(0);
    }
  });

  test("uses destructive styling when the system is not operational", async () => {
    const data = await createCompactStatusData();
    const degradedData = {
      ...data,
      health: {
        ...data.health,
        status: "Degraded" as never,
      },
    };

    render(<StatusPage data={degradedData} />);

    expect(screen.getByText("Degraded").className).toContain("text-destructive");
  });
});
