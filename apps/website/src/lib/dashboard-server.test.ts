import { beforeEach, describe, expect, test, vi } from "vite-plus/test";

const mocks = vi.hoisted(() => ({
  createDashboardData: vi.fn(),
  createScenarioPlan: vi.fn(),
  createServerFn: vi.fn((options: { method: string }) => {
    const state: { inputValidator?: unknown } = {};

    return {
      inputValidator(validator: unknown) {
        state.inputValidator = validator;
        return this;
      },
      handler(handler: unknown) {
        return {
          handler,
          inputValidator: state.inputValidator,
          options,
        };
      },
    };
  }),
  createStatusData: vi.fn(),
  validateScenarioInput: vi.fn(),
}));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: mocks.createServerFn,
}));

vi.mock("./dashboard-data", () => ({
  createDashboardData: mocks.createDashboardData,
  createScenarioPlan: mocks.createScenarioPlan,
  createStatusData: mocks.createStatusData,
  validateScenarioInput: mocks.validateScenarioInput,
}));

describe("dashboard server functions", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.createDashboardData.mockReset();
    mocks.createScenarioPlan.mockReset();
    mocks.createServerFn.mockClear();
    mocks.createStatusData.mockReset();
    mocks.validateScenarioInput.mockReset();
  });

  test("wires each server function to the expected method and handler", async () => {
    const dashboardModule = await import("./dashboard");

    expect(mocks.createServerFn).toHaveBeenNthCalledWith(1, { method: "GET" });
    expect(mocks.createServerFn).toHaveBeenNthCalledWith(2, { method: "GET" });
    expect(mocks.createServerFn).toHaveBeenNthCalledWith(3, { method: "POST" });

    expect(dashboardModule.getDashboardData).toMatchObject({
      handler: mocks.createDashboardData,
      options: { method: "GET" },
    });
    expect(dashboardModule.getStatusData).toMatchObject({
      handler: mocks.createStatusData,
      options: { method: "GET" },
    });
    expect(dashboardModule.runRebalanceScenario).toMatchObject({
      inputValidator: mocks.validateScenarioInput,
      options: { method: "POST" },
    });
  });

  test("passes server input data through to scenario generation", async () => {
    const plan = { headline: "Rebalanced" };
    const input = { amount: 250_000, profile: "balanced" };
    mocks.createScenarioPlan.mockResolvedValue(plan);

    const dashboardModule = await import("./dashboard");
    const mockedRunScenario = dashboardModule.runRebalanceScenario as unknown as {
      handler: (args: { data: typeof input }) => Promise<typeof plan>;
    };

    await expect(mockedRunScenario.handler({ data: input })).resolves.toBe(plan);
    expect(mocks.createScenarioPlan).toHaveBeenCalledWith(input);
  });
});
