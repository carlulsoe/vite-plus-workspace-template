import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { StatusPage } from "./status-page";
import { createStatusData } from "../lib/dashboard-data";

afterEach(() => {
  cleanup();
});

describe("StatusPage", () => {
  test("renders operational health details without accessibility violations", async () => {
    const data = await createStatusData();
    const { container } = render(<StatusPage data={data} />);

    expect(screen.getByRole("heading", { level: 1, name: /live health surface/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /runtime signals/i })).toBeTruthy();
    expect(screen.getByText(/current core snapshot/i)).toBeTruthy();
    expect((await axe(container)).violations).toHaveLength(0);
  });
});
