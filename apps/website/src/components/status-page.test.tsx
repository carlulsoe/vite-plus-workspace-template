import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, test } from "vite-plus/test";
import { StatusPage } from "@/components/status-page";
import { createStatusData } from "@/lib/dashboard-data";

describe("StatusPage", () => {
  test("renders operational health details without accessibility violations", async () => {
    const data = await createStatusData();
    const { container } = render(<StatusPage data={data} />);

    expect(screen.getByRole("heading", { level: 1, name: /live health surface/i })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /runtime signals/i })).toBeTruthy();
    expect(screen.getByText(/current package snapshot/i)).toBeTruthy();
    expect((await axe(container)).violations).toHaveLength(0);
  });
});
