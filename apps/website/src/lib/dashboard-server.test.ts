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
    const dashboardData = { headline: "Dashboard data" };
    const statusData = { headline: "Status data" };
    mocks.createDashboardData.mockResolvedValue(dashboardData);
    mocks.createStatusData.mockResolvedValue(statusData);

    const dashboardModule = await import("./dashboard");

    expect(mocks.createServerFn).toHaveBeenNthCalledWith(1, { method: "GET" });
    expect(mocks.createServerFn).toHaveBeenNthCalledWith(2, { method: "GET" });
    expect(mocks.createServerFn).toHaveBeenNthCalledWith(3, { method: "POST" });

    const mockedGetDashboardData = dashboardModule.getDashboardData as unknown as {
      handler: () => Promise<typeof dashboardData>;
      inputValidator?: unknown;
      options: { method: string };
    };
    const mockedGetStatusData = dashboardModule.getStatusData as unknown as {
      handler: () => Promise<typeof statusData>;
      inputValidator?: unknown;
      options: { method: string };
    };
    const mockedRunRebalanceScenario = dashboardModule.runRebalanceScenario as unknown as {
      handler: (args: { data: unknown }) => Promise<unknown>;
      inputValidator?: unknown;
      options: { method: string };
    };

    expect(mockedGetDashboardData.handler).toBe(mocks.createDashboardData);
    expect(mockedGetDashboardData.inputValidator).toBeUndefined();
    expect(mockedGetDashboardData.options.method).toBe("GET");
    expect(mockedGetStatusData.handler).toBe(mocks.createStatusData);
    expect(mockedGetStatusData.inputValidator).toBeUndefined();
    expect(mockedGetStatusData.options.method).toBe("GET");
    expect(mockedRunRebalanceScenario.handler).toBeTypeOf("function");
    expect(mockedRunRebalanceScenario.inputValidator).toBe(mocks.validateScenarioInput);
    expect(mockedRunRebalanceScenario.options.method).toBe("POST");

    await expect(mockedGetDashboardData.handler()).resolves.toBe(dashboardData);
    await expect(mockedGetStatusData.handler()).resolves.toBe(statusData);
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
