import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { StatusPage } from "./status-page";
import { siteConfig } from "../config/site";
import { createStatusData } from "../lib/dashboard-data";

vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  const createIcon = (name: string) => (props: Record<string, unknown>) => (
    <svg data-icon={name} {...props} />
  );

  return {
    ...actual,
    Activity: createIcon("Activity"),
    CheckCircle2: createIcon("CheckCircle2"),
    ChevronRight: createIcon("ChevronRight"),
    Clock: createIcon("Clock"),
    Cpu: createIcon("Cpu"),
    Fingerprint: createIcon("Fingerprint"),
    Layers: createIcon("Layers"),
    ShieldCheck: createIcon("ShieldCheck"),
  };
});

async function createCompactStatusFixture() {
  const fullData = await createStatusData();

  return {
    fullData,
    data: {
      ...fullData,
      snapshot: {
        ...fullData.snapshot,
        watchlist: fullData.snapshot.watchlist.slice(0, 1),
      },
    },
  };
}

async function createCompactStatusData() {
  const { data } = await createCompactStatusFixture();
  return data;
}

afterEach(() => {
  cleanup();
});

describe("StatusPage", () => {
  test("renders operational health details without accessibility violations", async () => {
    const { data, fullData } = await createCompactStatusFixture();
    const { container } = render(<StatusPage data={data} />);
    const statusText = screen.getByText(data.health.status);
    const statusPanel = statusText.parentElement;
    const pulseDot = statusPanel?.querySelector("div.h-6.w-6");

    expect(screen.getByRole("heading", { level: 1, name: /system live status/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /runtime signals/i })).toBeTruthy();
    expect(screen.getByText(/signal core snapshot/i)).toBeTruthy();
    expect(statusText.className).toContain("text-emerald-600");
    expect(statusPanel?.className).toContain("bg-emerald-500/10");
    expect(pulseDot?.className).toContain("bg-emerald-500");
    expect(screen.queryByText(fullData.snapshot.watchlist[1]?.label ?? "")).toBeNull();
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

    const degradedText = screen.getByText("Degraded");
    const statusPanel = degradedText.parentElement;
    const pulseDot = statusPanel?.querySelector("div.h-6.w-6");

    expect(degradedText.className).toContain("text-destructive");
    expect(statusPanel?.className).toContain("bg-destructive/10");
    expect(pulseDot?.className).toContain("bg-destructive");
  });

  test("uses the expected icon for each runtime check position", async () => {
    const data = await createStatusData();
    const extendedData = {
      ...data,
      health: {
        ...data.health,
        checks: [
          ...data.health.checks,
          {
            label: "Edge cache",
            detail: "The cache layer is still serving fresh status snapshots.",
            state: "pass" as const,
          },
        ],
      },
    };

    render(<StatusPage data={extendedData} />);

    const iconNames = ["CheckCircle2", "Fingerprint", "Layers", "Activity"];

    for (const [index, check] of extendedData.health.checks.entries()) {
      const card = screen.getByText(check.label).closest("[data-slot='card']");

      expect(card?.querySelector(`svg[data-icon='${iconNames[index]}']`)).toBeTruthy();
    }
  });
});
