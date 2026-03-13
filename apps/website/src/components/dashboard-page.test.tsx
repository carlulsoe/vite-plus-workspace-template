import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, test, vi } from "vite-plus/test";
import { DashboardPage } from "@/components/dashboard-page";
import { createDashboardData, createScenarioPlan } from "@/lib/dashboard-data";

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

describe("DashboardPage", () => {
  test("renders the loader-backed dashboard view without accessibility violations", async () => {
    const data = await createDashboardData();
    const { container } = render(
      <DashboardPage data={data} runScenario={(input) => createScenarioPlan(input)} />,
    );

    expect(screen.getByRole("heading", { level: 1, name: /starter code/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /scenario rebalance/i })).toBeTruthy();
    expect(screen.getByLabelText("Profile")).toBeTruthy();
    expect((await axe(container)).violations).toHaveLength(0);
  });

  test("updates the recommendation after a successful scenario run and invalidates the route", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();
    const nextPlan = await createScenarioPlan({
      profile: "growth",
      amount: 300_000,
    });
    const invalidate = vi.fn();
    const runScenario = vi.fn().mockResolvedValue(nextPlan);

    render(<DashboardPage data={data} invalidate={invalidate} runScenario={runScenario} />);

    await user.selectOptions(screen.getByLabelText("Profile"), "growth");
    await user.clear(screen.getByLabelText("Investable capital"));
    await user.type(screen.getByLabelText("Investable capital"), "300000");
    await user.click(screen.getByRole("button", { name: /run scenario/i }));

    await screen.findByText(nextPlan.headline);

    expect(runScenario).toHaveBeenCalledWith({
      profile: "growth",
      amount: 300_000,
    });
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(screen.getByText(nextPlan.expectedRange)).toBeTruthy();
  });

  test("shows pending feedback while repricing", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();
    const deferred = createDeferredPromise<Awaited<ReturnType<typeof createScenarioPlan>>>();

    render(<DashboardPage data={data} runScenario={vi.fn().mockReturnValue(deferred.promise)} />);

    await user.click(screen.getByRole("button", { name: /run scenario/i }));

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /repricing/i });
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

  test("renders an alert when scenario repricing fails", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();

    render(
      <DashboardPage
        data={data}
        runScenario={vi.fn().mockRejectedValue(new Error("Desk feed unavailable."))}
      />,
    );

    await user.click(screen.getByRole("button", { name: /run scenario/i }));

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain("Scenario pricing failed");
    expect(alert.textContent).toContain("Desk feed unavailable.");
  });

  test("supports keyboard navigation through the scenario form", async () => {
    const user = userEvent.setup();
    const data = await createDashboardData();

    render(<DashboardPage data={data} runScenario={(input) => createScenarioPlan(input)} />);

    const profile = screen.getByLabelText("Profile");
    const amount = screen.getByLabelText("Investable capital");
    const submit = screen.getByRole("button", { name: /run scenario/i });

    await user.tab();
    expect(document.activeElement).toBe(profile);

    await user.tab();
    expect(document.activeElement).toBe(amount);

    await user.tab();
    expect(document.activeElement).toBe(submit);
  });
});
