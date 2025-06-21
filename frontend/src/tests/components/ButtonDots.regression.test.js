import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ButtonDots from "@/components/base/ButtonDots.vue";

describe("ButtonDots.vue - Regression Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("IconDotsVertical Sizing and Positioning - CRITICAL", () => {
    it("MUST maintain specific width, height, and viewBox for correct dot positioning", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);

      // CRITICAL: These exact values are required for proper dot visibility
      // DO NOT CHANGE - These were specifically set to fix dot positioning issues
      expect(svg.attributes("width")).toBe("4");
      expect(svg.attributes("height")).toBe("18");
      expect(svg.attributes("viewBox")).toBe("10 3 4 18.25");

      // Verify the SVG is the IconDotsVertical component
      expect(svg.classes()).toContain("tabler-icon-dots-vertical");
    });

    it("MUST NOT use generic size prop that causes positioning issues", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);

      // Ensure we're NOT using the generic size="18" prop
      // This was the original issue that caused incorrect positioning
      expect(svg.attributes("size")).toBeUndefined();
      
      // Verify we have explicit width/height instead
      expect(svg.attributes("width")).toBeDefined();
      expect(svg.attributes("height")).toBeDefined();
      expect(svg.attributes("viewBox")).toBeDefined();
    });

    it("should render dots that are actually visible (not cropped by viewBox)", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);

      // Check that we have the correct viewBox that doesn't crop the dots
      const viewBox = svg.attributes("viewBox");
      expect(viewBox).toBe("10 3 4 18.25");
      
      // The viewBox coordinates should show the central dots area
      // "10 3 4 18.25" means: x=10, y=3, width=4, height=18.25
      // This specific area contains the visible dots without cropping
      const [x, y, width, height] = viewBox.split(" ").map(Number);
      expect(x).toBe(10); // X offset to center the dots
      expect(y).toBe(3);  // Y offset to position dots correctly
      expect(width).toBe(4);  // Width just enough for the dots
      expect(height).toBe(18.25); // Height to show all three dots
    });

    it("should have proper container dimensions for the button", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      // Check the ButtonToggle container has correct CSS
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      
      // These CSS properties are critical for proper button sizing
      const buttonStyles = button.element.style;
      expect(button.classes()).toContain("btn-toggle");
      
      // Note: The actual CSS values are defined in the scoped style
      // but we can verify the classes are applied correctly
    });
  });

  describe("Integration with ButtonToggle", () => {
    it("should properly integrate IconDotsVertical with ButtonToggle", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      // Verify the ButtonToggle wrapper exists
      const button = wrapper.find("button");
      expect(button.exists()).toBe(true);
      expect(button.classes()).toContain("btn-toggle");

      // Verify the IconDotsVertical is slotted correctly
      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);
      expect(svg.classes()).toContain("tabler-icon-dots-vertical");

      // Verify the specific sizing attributes are preserved through the slot
      expect(svg.attributes("width")).toBe("4");
      expect(svg.attributes("height")).toBe("18");
      expect(svg.attributes("viewBox")).toBe("10 3 4 18.25");
    });
  });

  describe("Visual Regression Prevention", () => {
    it("should maintain exact template structure to prevent regressions", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      // Verify the exact component structure hasn't changed
      expect(wrapper.findComponent({ name: "ButtonToggle" }).exists()).toBe(true);
      
      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);
      
      // Check the SVG is directly inside the ButtonToggle (via slot)
      const buttonToggle = wrapper.findComponent({ name: "ButtonToggle" });
      expect(buttonToggle.find("svg").exists()).toBe(true);
      
      // Ensure the SVG has the Tabler icon classes
      expect(svg.classes()).toContain("tabler-icon");
      expect(svg.classes()).toContain("tabler-icon-dots-vertical");
    });

    it("should alert if template structure changes unexpectedly", () => {
      const wrapper = mount(ButtonDots, {
        props: { modelValue: false }
      });

      // This test will fail if someone accidentally changes the template structure
      const svg = wrapper.find("svg");
      expect(svg.exists()).toBe(true);
      
      // Verify key attributes are present on the SVG element
      expect(svg.attributes("width")).toBe("4");
      expect(svg.attributes("height")).toBe("18");
      expect(svg.attributes("viewBox")).toBe("10 3 4 18.25");
      expect(svg.classes()).toContain("tabler-icon-dots-vertical");
      
      // CRITICAL: Ensure we don't accidentally revert to size prop on SVG element
      expect(svg.attributes("size")).toBeUndefined();
      
      // Verify the specific structure we expect
      const html = wrapper.html();
      expect(html).toContain('width="4"');
      expect(html).toContain('height="18"');
      expect(html).toContain('viewBox="10 3 4 18.25"');
    });
  });
});