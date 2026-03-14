import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { DashboardPage } from "./dashboard-page";
import { siteConfig } from "../config/site";
import { createDashboardData, createScenarioPlan } from "../lib/dashboard-data";

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

async function createCompactDashboardData() {
  const data = await createDashboardData();

  return {
    ...data,
    defaultPlan: {
      ...data.defaultPlan,
      slices: data.defaultPlan.slices.slice(0, 2),
    },
    health: {
      ...data.health,
      checks: data.health.checks.slice(0, 1),
    },
    snapshot: {
      ...data.snapshot,
      movers: data.snapshot.movers.slice(0, 1),
      scorecard: data.snapshot.scorecard.slice(0, 1),
      deliveryNotes: data.snapshot.deliveryNotes.slice(0, 1),
      watchlist: data.snapshot.watchlist.slice(0, 1),
    },
  };
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
  cleanup();
});

describe("DashboardPage", () => {
  test("renders the loader-backed dashboard view without accessibility violations", async () => {
    const data = await createCompactDashboardData();
    const { container } = renderDashboard(data);

    expect(
      screen.getByRole("heading", { level: 1, name: /future of workspace models/i }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /budget scenario/i })).toBeTruthy();
    expect(screen.getByLabelText("Delivery profile")).toBeTruthy();
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
    submitScenario();

    await screen.findByText(nextPlan.headline);

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

    renderDashboard(data);

    expect(screen.getByText(data.health.boundaryMode)).toBeTruthy();
    expect(screen.getByText(data.snapshot.generatedAt)).toBeTruthy();

    for (const badge of siteConfig.badges) {
      expect(screen.getByText(badge)).toBeTruthy();
    }

    const mover = data.snapshot.movers[0];
    expect(screen.getAllByText(mover.label).length).toBeGreaterThan(0);
    expect(screen.getAllByText(mover.symbol).length).toBeGreaterThan(0);
    expect(screen.getByText(`"${mover.note}"`)).toBeTruthy();

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

    for (const note of siteConfig.stackNotes) {
      expect(screen.getByText(note.title)).toBeTruthy();
      expect(screen.getByText(note.copy)).toBeTruthy();
    }
  });
});
