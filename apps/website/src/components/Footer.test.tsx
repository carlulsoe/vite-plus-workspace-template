import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import { siteConfig } from "@/config/site";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders the configured footer content", () => {
    const { container } = render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const tagline = screen.getByText(siteConfig.footerTagline);

    expect(footer.className).toContain("reveal-up");
    expect(footer.textContent).toContain(siteConfig.name);
    expect(footer.textContent).toContain(siteConfig.description);
    expect(tagline.className).toContain("badge-section");
    expect(tagline.getAttribute("data-variant")).toBe("outline");
    expect(container.querySelector('[data-slot="separator"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="separator"]')?.className).toContain("bg-black/5");
  });
});
