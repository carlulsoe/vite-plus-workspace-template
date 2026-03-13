import { createServerFn } from "@tanstack/react-start";
import {
  createDashboardData,
  createScenarioPlan,
  createStatusData,
  validateScenarioInput,
} from "./dashboard-data";

export const getDashboardData = createServerFn({ method: "GET" }).handler(createDashboardData);

export const getStatusData = createServerFn({ method: "GET" }).handler(createStatusData);

export const runRebalanceScenario = createServerFn({ method: "POST" })
  .inputValidator(validateScenarioInput)
  .handler(async ({ data }) => createScenarioPlan(data));
