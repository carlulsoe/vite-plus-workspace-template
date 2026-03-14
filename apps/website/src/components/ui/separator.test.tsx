import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";

import { Separator } from "./separator";

describe("Separator", () => {
  test("renders a horizontal separator by default", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");

    expect(separator.getAttribute("data-slot")).toBe("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
    expect(separator.className).toContain("bg-border");
    expect(separator.className).toContain("data-horizontal:h-px");
  });

  test("renders a vertical separator and forwards custom props", () => {
    render(
      <Separator
        aria-label="Timeline divider"
        className="custom-separator"
        orientation="vertical"
      />,
    );

    const separator = screen.getByLabelText("Timeline divider");

    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(separator.className).toContain("custom-separator");
    expect(separator.className).toContain("data-vertical:w-px");
  });
});
