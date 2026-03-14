import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { DashboardPage } from "./dashboard-page";
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
});
