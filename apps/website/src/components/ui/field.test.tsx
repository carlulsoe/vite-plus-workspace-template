import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";

afterEach(() => {
  cleanup();
});

describe("Field primitives", () => {
  test("renders the composed field structure with responsive layout metadata", () => {
    const { container } = render(
      <FieldSet className="field-set">
        <FieldLegend variant="label">Deployment settings</FieldLegend>
        <FieldGroup className="field-group" data-variant="outline">
          <Field orientation="responsive" className="field-root">
            <FieldLabel className="field-label" htmlFor="field-input">
              <FieldTitle className="field-title">Rollout window</FieldTitle>
            </FieldLabel>
            <FieldContent className="field-content">
              <input id="field-input" />
              <FieldDescription className="field-description">
                Choose when the change can ship.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );

    const fieldSet = container.querySelector('[data-slot="field-set"]');
    const legend = container.querySelector('[data-slot="field-legend"]');
    const group = container.querySelector('[data-slot="field-group"]');
    const field = container.querySelector('[data-slot="field"]');
    const label = screen.getByText("Rollout window").closest("label");
    const title = screen.getByText("Rollout window");
    const content = container.querySelector('[data-slot="field-content"]');
    const description = container.querySelector('[data-slot="field-description"]');

    expect(fieldSet?.className).toContain("field-set");
    expect(fieldSet?.className).toContain("flex-col");
    expect(legend?.getAttribute("data-variant")).toBe("label");
    expect(legend?.className).toContain("font-medium");
    expect(group?.className).toContain("field-group");
    expect(group?.className).toContain("group/field-group");
    expect(field?.getAttribute("data-slot")).toBe("field");
    expect(field?.getAttribute("data-orientation")).toBe("responsive");
    expect(field?.className).toContain("field-root");
    expect(field?.className).toContain("@md/field-group:flex-row");
    expect(label?.className).toContain("field-label");
    expect(label?.className).toContain("peer/field-label");
    expect(title?.textContent).toBe("Rollout window");
    expect(title?.className).toContain("text-xs/relaxed");
    expect(content?.className).toContain("field-content");
    expect(content?.className).toContain("group/field-content");
    expect(description?.textContent).toContain("Choose when the change can ship.");
    expect(description?.className).toContain("text-muted-foreground");
  });

  test("uses vertical orientation and legend styling by default", () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Default legend</FieldLegend>
        <Field>
          <FieldContent>Vertical field</FieldContent>
        </Field>
      </FieldSet>,
    );

    const legend = container.querySelector('[data-slot="field-legend"]');
    const field = container.querySelector('[data-slot="field"]');

    expect(legend?.getAttribute("data-variant")).toBe("legend");
    expect(legend?.className).toContain("text-sm");
    expect(field?.getAttribute("data-orientation")).toBe("vertical");
    expect(field?.className).toContain("group/field");
    expect(field?.className).toContain("flex-col");
  });

  test("renders horizontal orientation classes when requested", () => {
    const { container } = render(
      <Field orientation="horizontal">
        <FieldLabel htmlFor="horizontal-input">Horizontal</FieldLabel>
        <FieldContent>
          <input id="horizontal-input" />
        </FieldContent>
      </Field>,
    );

    const field = container.querySelector('[data-slot="field"]');

    expect(field?.getAttribute("data-orientation")).toBe("horizontal");
    expect(field?.className).toContain("flex-row");
    expect(field?.className).toContain("items-center");
  });

  test("renders separator content only when children are provided", () => {
    const { container, rerender } = render(<FieldSeparator className="plain-separator" />);

    const emptySeparator = container.querySelector('[data-slot="field-separator"]');
    const emptySeparatorRule = container.querySelector('[data-slot="separator"]');

    expect(emptySeparator?.getAttribute("data-content")).toBe("false");
    expect(emptySeparator?.className).toContain("plain-separator");
    expect(emptySeparator?.className).toContain("relative");
    expect(emptySeparatorRule?.className).toContain("top-1/2");
    expect(container.querySelector('[data-slot="field-separator-content"]')).toBeNull();

    rerender(<FieldSeparator className="labeled-separator">Optional settings</FieldSeparator>);

    const labeledSeparator = container.querySelector('[data-slot="field-separator"]');
    const labeledContent = container.querySelector('[data-slot="field-separator-content"]');

    expect(labeledSeparator?.getAttribute("data-content")).toBe("true");
    expect(labeledContent?.textContent).toBe("Optional settings");
  });

  test("renders no error output when there is no content", () => {
    const { container, rerender } = render(<FieldError className="field-error" />);

    expect(container.firstChild).toBeNull();

    rerender(<FieldError errors={[undefined]} />);

    expect(container.firstChild).toBeNull();
  });

  test("renders a single deduplicated error message when repeated messages are provided", () => {
    const { container } = render(
      <FieldError
        className="field-error"
        errors={[{ message: "A title is required." }, { message: "A title is required." }]}
      />,
    );

    const error = container.querySelector('[data-slot="field-error"]');

    expect(error?.getAttribute("role")).toBe("alert");
    expect(error?.className).toContain("field-error");
    expect(error?.className).toContain("text-destructive");
    expect(error?.textContent).toBe("A title is required.");
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  test("renders a unique list when multiple different errors are present", () => {
    const { container } = render(
      <FieldError
        errors={[
          { message: "Name is required." },
          { message: "Name is required." },
          { message: "Name must be at least 3 characters." },
          undefined,
        ]}
      />,
    );

    const error = container.querySelector('[data-slot="field-error"]');
    const items = Array.from(error?.querySelectorAll("li") ?? []).map((item) => item.textContent);

    expect(error).toBeTruthy();
    expect(error?.getAttribute("role")).toBe("alert");
    expect(error?.querySelector("ul")).toBeTruthy();
    expect(items).toEqual(["Name is required.", "Name must be at least 3 characters."]);
  });

  test("prefers explicit children over derived errors", () => {
    const { container } = render(
      <FieldError id="explicit-error" errors={[{ message: "Derived error" }]}>
        <span>Explicit content</span>
      </FieldError>,
    );

    const error = container.querySelector('[data-slot="field-error"]');

    expect(error?.getAttribute("id")).toBe("explicit-error");
    expect(error?.getAttribute("role")).toBe("alert");
    expect(error?.textContent).toContain("Explicit content");
    expect(error?.textContent).not.toContain("Derived error");
  });

  test("updates derived error content when the errors prop changes", () => {
    const { container, rerender } = render(<FieldError errors={[{ message: "First error" }]} />);

    expect(container.textContent).toBe("First error");

    rerender(<FieldError errors={[{ message: "Second error" }]} />);

    const error = container.querySelector('[data-slot="field-error"]');

    expect(error?.textContent).toBe("Second error");
    expect(error?.className).toContain("text-destructive");
  });
});
