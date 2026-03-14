import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";
import { siteConfig } from "@/config/site";
import Header from "./Header";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    activeProps,
    children,
    className,
    to,
    ...props
  }: {
    activeProps?: { className?: string };
    children: React.ReactNode;
    className?: string;
    to: string;
  }) => (
    <a href={to} className={className} data-active-class={activeProps?.className} {...props}>
      {children}
    </a>
  ),
}));

describe("Header", () => {
  test("renders the brand, primary navigation, and external API link", () => {
    render(<Header />);

    expect(screen.getByText(siteConfig.name)).toBeTruthy();
    expect(screen.getByText("Shared core starter")).toBeTruthy();

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    const statusLink = screen.getByRole("link", { name: "Status" });
    const apiHealthLink = screen.getByRole("link", { name: /api health/i });

    expect(dashboardLink.getAttribute("href")).toBe("/");
    expect(dashboardLink.getAttribute("data-active-class")).toContain("rounded-full");
    expect(statusLink.getAttribute("href")).toBe("/status");
    expect(apiHealthLink.getAttribute("href")).toBe("/api/health");
    expect(apiHealthLink.getAttribute("target")).toBe("_blank");
    expect(apiHealthLink.getAttribute("rel")).toBe("noreferrer");
  });
});
