import { cleanup, render, screen, waitFor } from "@testing-library/react";
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

afterEach(() => {
  cleanup();
});

describe("DashboardPage", () => {
  test("renders the loader-backed dashboard view without accessibility violations", async () => {
    const data = await createDashboardData();
    const { container } = render(
      <DashboardPage data={data} runScenario={(input) => createScenarioPlan(input)} />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /future of workspace models/i }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /budget scenario/i })).toBeTruthy();
    expect(screen.getByLabelText("Delivery profile")).toBeTruthy();
    expect((await axe(container)).violations).toHaveLength(0);
  });

  test("updates the recommendation after a successful scenario run and invalidates the route", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();
    const nextPlan = await createScenarioPlan({
      profile: "acceleration",
      amount: 300_000,
    });
    const invalidate = vi.fn();
    const runScenario = vi.fn().mockResolvedValue(nextPlan);

    render(<DashboardPage data={data} invalidate={invalidate} runScenario={runScenario} />);

    await user.selectOptions(screen.getByLabelText("Delivery profile"), "acceleration");
    await user.clear(screen.getByLabelText("Planning budget"));
    await user.type(screen.getByLabelText("Planning budget"), "300000");
    await user.click(screen.getByRole("button", { name: /run scenario/i }));

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
    const user = userEvent.setup();
    const data = await createDashboardData();
    const deferred = createDeferredPromise<Awaited<ReturnType<typeof createScenarioPlan>>>();

    render(<DashboardPage data={data} runScenario={vi.fn().mockReturnValue(deferred.promise)} />);

    await user.click(screen.getByRole("button", { name: /run scenario/i }));

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /recomputing/i });
      expect(button).toBeTruthy();
      expect(button).toHaveProperty("disabled", true);
    });

    deferred.resolve(
      await createScenarioPlan({
        profile: "balanced",
        amount: 2_500_000,
      }),
    );

    await screen.findByRole("button", { name: /run scenario/i });
  });

  test("renders an alert when scenario recomputing fails", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();

    render(
      <DashboardPage
        data={data}
        runScenario={vi.fn().mockRejectedValue(new Error("Scenario service unavailable."))}
      />,
    );

    await user.click(screen.getByRole("button", { name: /run scenario/i }));

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain("Scenario update failed");
    expect(alert.textContent).toContain("Scenario service unavailable.");
  });

  test("falls back to a generic error for non-Error failures", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();

    render(
      <DashboardPage data={data} runScenario={vi.fn().mockRejectedValue("network unavailable")} />,
    );

    await user.click(screen.getByRole("button", { name: /run scenario/i }));

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain("Unable to recompute the scenario.");
  });

  test("supports keyboard navigation through the scenario form", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();

    render(<DashboardPage data={data} runScenario={(input) => createScenarioPlan(input)} />);

    const profile = screen.getByLabelText("Delivery profile");
    const amount = screen.getByLabelText("Planning budget");
    const submit = screen.getByRole("button", { name: /run scenario/i });

    await user.tab();
    expect(document.activeElement).toBe(profile);

    await user.tab();
    expect(document.activeElement).toBe(amount);

    await user.tab();
    expect(document.activeElement).toBe(submit);
  });

  test("renders snapshot-driven content from the dashboard payload", async () => {
    const data = await createDashboardData();

    render(<DashboardPage data={data} runScenario={(input) => createScenarioPlan(input)} />);

    expect(screen.getByText(data.health.boundaryMode)).toBeTruthy();
    expect(screen.getByText(data.snapshot.generatedAt)).toBeTruthy();

    for (const badge of siteConfig.badges) {
      expect(screen.getByText(badge)).toBeTruthy();
    }

    for (const mover of data.snapshot.movers) {
      expect(screen.getAllByText(mover.label).length).toBeGreaterThan(0);
      expect(screen.getAllByText(mover.symbol).length).toBeGreaterThan(0);
      expect(screen.getByText(`"${mover.note}"`)).toBeTruthy();
    }

    for (const item of data.snapshot.scorecard) {
      expect(screen.getByText(item.label)).toBeTruthy();
      expect(screen.getByText(item.value)).toBeTruthy();
    }

    for (const note of data.snapshot.deliveryNotes) {
      expect(screen.getByText(note.title)).toBeTruthy();
      expect(screen.getByText(note.summary)).toBeTruthy();
      expect(screen.getByText(note.stance)).toBeTruthy();
    }

    for (const instrument of data.snapshot.watchlist) {
      expect(screen.getAllByText(instrument.label).length).toBeGreaterThan(0);
      expect(
        screen.getByText(
          (content) =>
            content.includes(instrument.symbol) && content.includes(instrument.focusArea),
        ),
      ).toBeTruthy();
      expect(screen.getByText(instrument.value.toFixed(1))).toBeTruthy();
    }

    for (const note of siteConfig.stackNotes) {
      expect(screen.getByText(note.title)).toBeTruthy();
      expect(screen.getByText(note.copy)).toBeTruthy();
    }
  });
});
