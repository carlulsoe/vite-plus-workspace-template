import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { DashboardPage } from "./dashboard-page";
import { siteConfig } from "../config/site";
import { createDashboardData, createScenarioPlan } from "../lib/dashboard-data";

const reactMocks = vi.hoisted(() => ({
  startTransition: vi.fn((callback: () => void) => callback()),
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    startTransition: reactMocks.startTransition,
  };
});

vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  const createIcon = (name: string) => (props: Record<string, unknown>) => (
    <svg data-icon={name} {...props} />
  );

  return {
    ...actual,
    Activity: createIcon("Activity"),
    ArrowRight: createIcon("ArrowRight"),
    BarChart3: createIcon("BarChart3"),
    ChevronRight: createIcon("ChevronRight"),
    Cpu: createIcon("Cpu"),
    Globe: createIcon("Globe"),
    Layers: createIcon("Layers"),
    LayoutDashboard: createIcon("LayoutDashboard"),
    TrendingUp: createIcon("TrendingUp"),
    Zap: createIcon("Zap"),
  };
});

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

async function createCompactDashboardFixture() {
  const fullData = await createDashboardData();

  return {
    fullData,
    data: {
      ...fullData,
      defaultPlan: {
        ...fullData.defaultPlan,
        slices: fullData.defaultPlan.slices.slice(0, 2),
      },
      health: {
        ...fullData.health,
        checks: fullData.health.checks.slice(0, 1),
      },
      snapshot: {
        ...fullData.snapshot,
        movers: fullData.snapshot.movers.slice(0, 1),
        scorecard: fullData.snapshot.scorecard.slice(0, 1),
        deliveryNotes: fullData.snapshot.deliveryNotes.slice(0, 1),
        watchlist: fullData.snapshot.watchlist.slice(0, 1),
      },
    },
  };
}

async function createCompactDashboardData() {
  const { data } = await createCompactDashboardFixture();
  return data;
}

async function createCompactScenarioPlan(input: Parameters<typeof createScenarioPlan>[0]) {
  const plan = await createScenarioPlan(input);

  return {
    ...plan,
    slices: plan.slices.slice(0, 2),
  };
}

function renderDashboard(
  data: Awaited<ReturnType<typeof createDashboardData>>,
  runScenario = createScenarioPlan,
) {
  return render(<DashboardPage data={data} runScenario={runScenario} />);
}

function getScenarioForm() {
  return {
    amount: screen.getByLabelText("Planning budget"),
    profile: screen.getByLabelText("Delivery profile"),
    submit: screen.getByRole("button", { name: /run scenario/i }),
  };
}

function setScenarioAmount(value: string) {
  fireEvent.change(screen.getByLabelText("Planning budget"), {
    target: { value },
  });
}

function setScenarioProfile(value: string) {
  fireEvent.change(screen.getByLabelText("Delivery profile"), {
    target: { value },
  });
}

function submitScenario() {
  fireEvent.click(screen.getByRole("button", { name: /run scenario/i }));
}

afterEach(() => {
  reactMocks.startTransition.mockClear();
  cleanup();
});

describe("DashboardPage", () => {
  test("renders the loader-backed dashboard view without accessibility violations", async () => {
    const { data, fullData } = await createCompactDashboardFixture();
    const { container } = renderDashboard(data);

    expect(
      screen.getByRole("heading", { level: 1, name: /future of workspace models/i }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /budget scenario/i })).toBeTruthy();
    expect(screen.getByLabelText("Delivery profile")).toBeTruthy();
    expect(screen.getAllByText("24h Change")).toHaveLength(data.snapshot.movers.length);
    expect(screen.queryByText(`"${fullData.snapshot.movers[1]?.note ?? ""}"`)).toBeNull();
    expect(screen.queryByText(fullData.snapshot.scorecard[1]?.label ?? "")).toBeNull();
    expect(screen.queryByText(fullData.snapshot.deliveryNotes[1]?.title ?? "")).toBeNull();
    expect(screen.queryByText(fullData.snapshot.watchlist[1]?.label ?? "")).toBeNull();
    expect((await axe(container)).violations).toHaveLength(0);
  });

  test("updates the recommendation after a successful scenario run and invalidates the route", async () => {
    const data = await createCompactDashboardData();
    const nextPlan = await createCompactScenarioPlan({
      profile: "acceleration",
      amount: 300_000,
    });
    const invalidate = vi.fn();
    const runScenario = vi.fn().mockResolvedValue(nextPlan);

    render(<DashboardPage data={data} invalidate={invalidate} runScenario={runScenario} />);

    setScenarioProfile("acceleration");
    setScenarioAmount("300000");

    expect(screen.getByLabelText("Delivery profile")).toHaveProperty("value", "acceleration");
    expect(screen.getByLabelText("Planning budget")).toHaveProperty("value", "300000");

    submitScenario();

    await screen.findByText(nextPlan.headline);

    expect(reactMocks.startTransition).toHaveBeenCalledTimes(1);
    expect(runScenario).toHaveBeenCalledWith({
      profile: "acceleration",
      amount: 300_000,
    });
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(screen.getByText(nextPlan.expectedRange)).toBeTruthy();
    expect(screen.getByLabelText("Delivery profile")).toHaveProperty("value", nextPlan.profile);
    expect(screen.getByLabelText("Planning budget")).toHaveProperty(
      "value",
      String(nextPlan.totalBudget),
    );
    expect(screen.getAllByText("Allocation")).toHaveLength(nextPlan.slices.length);
    expect(screen.queryByText(data.defaultPlan.headline)).toBeNull();
  });

  test("updates the recommendation after a successful scenario run without invalidation", async () => {
    const data = await createCompactDashboardData();
    const nextPlan = await createCompactScenarioPlan({
      profile: "steady",
      amount: 100_000,
    });
    const runScenario = vi.fn().mockResolvedValue(nextPlan);

    renderDashboard(data, runScenario);

    setScenarioProfile("steady");
    setScenarioAmount("100000");
    submitScenario();

    await screen.findByText(nextPlan.headline);

    expect(runScenario).toHaveBeenCalledWith({
      profile: "steady",
      amount: 100_000,
    });
    expect(screen.getByText(nextPlan.expectedRange)).toBeTruthy();
  });

  test("shows pending feedback while recomputing", async () => {
    const data = await createCompactDashboardData();
    const deferred = createDeferredPromise<Awaited<ReturnType<typeof createScenarioPlan>>>();

    renderDashboard(data, vi.fn().mockReturnValue(deferred.promise));

    submitScenario();

    const button = await screen.findByRole("button", { name: /recomputing/i });

    expect(button).toHaveProperty("disabled", true);

    deferred.resolve(
      await createCompactScenarioPlan({
        profile: "balanced",
        amount: 2_500_000,
      }),
    );

    await screen.findByRole("button", { name: /run scenario/i });
  });

  test("renders an alert when scenario recomputing fails", async () => {
    const data = await createCompactDashboardData();

    renderDashboard(data, vi.fn().mockRejectedValue(new Error("Scenario service unavailable.")));

    submitScenario();

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain("Scenario update failed");
    expect(alert.textContent).toContain("Scenario service unavailable.");
  });

  test("falls back to a generic error for non-Error failures", async () => {
    const data = await createCompactDashboardData();

    renderDashboard(data, vi.fn().mockRejectedValue("network unavailable"));

    submitScenario();

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain("Unable to recompute the scenario.");
    expect(alert.textContent).not.toContain("network unavailable");
  });

  test("supports keyboard navigation through the scenario form", async () => {
    const user = userEvent.setup();
    const data = await createCompactDashboardData();

    renderDashboard(data);

    const { amount, profile, submit } = getScenarioForm();

    await user.tab();
    expect(document.activeElement).toBe(profile);

    await user.tab();
    expect(document.activeElement).toBe(amount);

    await user.tab();
    expect(document.activeElement).toBe(submit);
  });

  test("renders snapshot-driven content from the dashboard payload", async () => {
    const data = await createCompactDashboardData();
    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    const percentFormatter = new Intl.NumberFormat("en-US", {
      signDisplay: "exceptZero",
      maximumFractionDigits: 2,
    });

    renderDashboard(data);

    expect(screen.getByText(data.health.boundaryMode)).toBeTruthy();
    expect(screen.getByText(data.snapshot.generatedAt)).toBeTruthy();
    expect(screen.getAllByText("24h Change")).toHaveLength(data.snapshot.movers.length);
    expect(screen.getAllByText("Allocation")).toHaveLength(data.defaultPlan.slices.length);
    expect(screen.getAllByText("Read architecture")).toHaveLength(siteConfig.stackNotes.length);

    for (const badge of siteConfig.badges) {
      expect(screen.getByText(badge)).toBeTruthy();
    }

    const mover = data.snapshot.movers[0];
    const moverCard = screen.getByText(`"${mover.note}"`).closest("[data-slot='card']");
    expect(screen.getAllByText(mover.label).length).toBeGreaterThan(0);
    expect(screen.getAllByText(mover.symbol).length).toBeGreaterThan(0);
    expect(screen.getByText(`"${mover.note}"`)).toBeTruthy();
    expect(moverCard?.textContent).toContain(`${percentFormatter.format(mover.dayChangePct)}%`);
    expect(moverCard?.textContent).not.toContain(
      `+${percentFormatter.format(mover.dayChangePct)}%`,
    );

    const scorecardItem = data.snapshot.scorecard[0];
    expect(screen.getByText(scorecardItem.label)).toBeTruthy();
    expect(screen.getByText(scorecardItem.value)).toBeTruthy();

    const deliveryNote = data.snapshot.deliveryNotes[0];
    expect(screen.getByText(deliveryNote.title)).toBeTruthy();
    expect(screen.getByText(deliveryNote.summary)).toBeTruthy();
    expect(screen.getByText(deliveryNote.stance)).toBeTruthy();

    const instrument = data.snapshot.watchlist[0];
    expect(screen.getAllByText(instrument.label).length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        (content) => content.includes(instrument.symbol) && content.includes(instrument.focusArea),
      ),
    ).toBeTruthy();
    expect(screen.getByText(instrument.value.toFixed(1))).toBeTruthy();

    const watchlistRow = screen.getAllByText(instrument.label)[0]?.closest("div.group");
    const watchlistPill = watchlistRow?.querySelector("div.inline-flex");

    expect(watchlistPill?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      `↑ ${Math.abs(instrument.dayChangePct).toFixed(2)}%`,
    );

    const slice = data.defaultPlan.slices[0];
    expect(screen.getByText(`${Math.round(slice.weight * 100)}%`)).toBeTruthy();
    expect(screen.getByText(currencyFormatter.format(slice.amount))).toBeTruthy();

    for (const note of siteConfig.stackNotes) {
      expect(screen.getByText(note.title)).toBeTruthy();
      expect(screen.getByText(note.copy)).toBeTruthy();
    }
  });

  test("maps tone, change direction, and footer icon visuals from the payload", async () => {
    const data = await createDashboardData();
    const positiveWatch = data.snapshot.watchlist.find((instrument) => instrument.dayChangePct > 0);
    const negativeWatch = data.snapshot.watchlist.find((instrument) => instrument.dayChangePct < 0);

    expect(positiveWatch).toBeTruthy();
    expect(negativeWatch).toBeTruthy();

    const customData = {
      ...data,
      snapshot: {
        ...data.snapshot,
        movers: [positiveWatch!, negativeWatch!],
        scorecard: [
          ...data.snapshot.scorecard,
          {
            label: "Incident Load",
            value: "High",
            tone: "negative" as const,
            detail: "Escalations are rising faster than automation can absorb them.",
          },
        ],
      },
    };

    const { container } = renderDashboard(customData);
    const positiveScorecard = screen.getByText("Delivery Confidence").closest("[data-slot='card']");
    const steadyScorecard = screen.getByText("Platform Health").closest("[data-slot='card']");
    const negativeScorecard = screen.getByText("Incident Load").closest("[data-slot='card']");
    const positiveMoverCard = screen
      .getByText(`"${positiveWatch!.note}"`)
      .closest("[data-slot='card']");
    const negativeMoverCard = screen
      .getByText(`"${negativeWatch!.note}"`)
      .closest("[data-slot='card']");
    const positiveWatchRow = screen.getAllByText(positiveWatch!.label)[1]?.closest("div.group");
    const negativeWatchRow = screen.getAllByText(negativeWatch!.label)[1]?.closest("div.group");
    const positiveWatchPill = positiveWatchRow?.querySelector("div.inline-flex");
    const negativeWatchPill = negativeWatchRow?.querySelector("div.inline-flex");
    const positiveWatchPillText = positiveWatchPill?.textContent?.replace(/\s+/g, " ").trim();
    const negativeWatchPillText = negativeWatchPill?.textContent?.replace(/\s+/g, " ").trim();
    const positiveWatchChange = `${Math.abs(positiveWatch!.dayChangePct).toFixed(2)}%`;
    const negativeWatchChange = `${Math.abs(negativeWatch!.dayChangePct).toFixed(2)}%`;
    const positiveMoverChange = `${positiveWatch!.dayChangePct.toFixed(1)}%`;
    const negativeMoverChange = `${negativeWatch!.dayChangePct.toFixed(1)}%`;

    expect(positiveScorecard?.className).toContain("card-positive");
    expect(positiveScorecard?.className).not.toContain("card-negative");
    expect(positiveScorecard?.className).not.toContain("card-steady");
    expect(
      positiveScorecard?.querySelector("svg[data-icon='Activity']")?.getAttribute("class"),
    ).toContain("text-emerald-500/40");
    expect(steadyScorecard?.className).toContain("card-steady");
    expect(steadyScorecard?.className).not.toContain("card-positive");
    expect(steadyScorecard?.className).not.toContain("card-negative");
    expect(
      steadyScorecard?.querySelector("svg[data-icon='Activity']")?.getAttribute("class"),
    ).toContain("text-sky-500/40");
    expect(negativeScorecard?.className).toContain("card-negative");
    expect(negativeScorecard?.className).not.toContain("card-positive");
    expect(negativeScorecard?.className).not.toContain("card-steady");
    expect(
      negativeScorecard?.querySelector("svg[data-icon='Activity']")?.getAttribute("class"),
    ).toContain("text-destructive/40");

    expect(positiveMoverCard?.querySelector("svg[data-icon='TrendingUp']")).toBeTruthy();
    expect(positiveMoverCard?.querySelector("svg[data-icon='Activity']")).toBeNull();
    expect(
      positiveMoverCard?.querySelector("[class*='text-emerald-600'], [class*='text-emerald-400']"),
    ).toBeTruthy();
    expect(positiveMoverCard?.textContent).toContain(positiveMoverChange);
    expect(positiveMoverCard?.textContent).not.toContain(
      `++${positiveWatch!.dayChangePct.toFixed(1)}%`,
    );
    expect(positiveMoverCard?.querySelector("[class*='bg-emerald-500']")).toBeTruthy();
    expect(
      negativeMoverCard?.querySelector("svg[data-icon='Activity']")?.getAttribute("class"),
    ).toContain("rotate-180");
    expect(negativeMoverCard?.querySelector("svg[data-icon='TrendingUp']")).toBeNull();
    expect(negativeMoverCard?.querySelector("[class*='text-destructive']")).toBeTruthy();
    expect(negativeMoverCard?.textContent).toContain(negativeMoverChange);
    expect(negativeMoverCard?.textContent).not.toContain(`+${negativeMoverChange}`);
    expect(negativeMoverCard?.querySelector("[class*='bg-destructive']")).toBeTruthy();

    expect(positiveWatchPillText).toBe(`↑ ${positiveWatchChange}`);
    expect(positiveWatchPill?.className).toContain("text-emerald-600");
    expect(positiveWatchPill?.className).not.toContain("text-destructive");
    expect(negativeWatchPillText).toBe(`↓ ${negativeWatchChange}`);
    expect(negativeWatchPill?.className).toContain("text-destructive");
    expect(negativeWatchPill?.className).not.toContain("text-emerald-600");

    for (const [index, note] of siteConfig.stackNotes.entries()) {
      const footerCard = screen.getByText(note.title).closest("[data-slot='card']") as HTMLElement;
      const iconName = index === 0 ? "Layers" : index === 1 ? "Cpu" : "Globe";

      expect(footerCard.querySelector(`svg[data-icon='${iconName}']`)).toBeTruthy();
      expect(footerCard.querySelector("svg[data-icon='Layers']") !== null).toBe(index === 0);
      expect(footerCard.querySelector("svg[data-icon='Cpu']") !== null).toBe(index === 1);
      expect(footerCard.querySelector("svg[data-icon='Globe']") !== null).toBe(index === 2);
    }

    expect(container.querySelectorAll("svg[data-icon='ArrowRight']")).toHaveLength(
      siteConfig.stackNotes.length,
    );
  });
});
