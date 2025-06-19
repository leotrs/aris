import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import { useMobileMenu } from "@/composables/useMobileMenu.js";

describe("useMobileMenu", () => {
  describe("Initialization", () => {
    it("should initialize and return mobile menu interface", () => {
      const result = useMobileMenu();

      expect(result).toHaveProperty("menuStyles");
      expect(result).toHaveProperty("menuClasses");
      expect(result).toHaveProperty("activate");
      expect(result).toHaveProperty("deactivate");
    });

    it("should accept mobileMode ref as parameter", () => {
      const mobileMode = ref(true);
      const result = useMobileMenu(mobileMode);

      expect(result).toBeDefined();
      expect(typeof result.activate).toBe("function");
    });
  });

  describe("Menu Styles", () => {
    it("should return empty styles for mobile mode", () => {
      const mobileMode = ref(true);
      const { menuStyles } = useMobileMenu(mobileMode);

      expect(menuStyles.value).toEqual({});
    });

    it("should return empty styles when mobile mode is disabled", () => {
      const mobileMode = ref(false);
      const { menuStyles } = useMobileMenu(mobileMode);

      expect(menuStyles.value).toEqual({});
    });

    it("should always return empty object since CSS handles positioning", () => {
      const { menuStyles } = useMobileMenu();

      expect(menuStyles.value).toEqual({});
    });
  });

  describe("Menu Classes", () => {
    it("should include mobile-mode class when mobile mode is enabled", () => {
      const mobileMode = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode);

      expect(menuClasses.value).toContain("mobile-mode");
    });

    it("should include desktop-mode class when mobile mode is disabled", () => {
      const mobileMode = ref(false);
      const { menuClasses } = useMobileMenu(mobileMode);

      expect(menuClasses.value).toContain("desktop-mode");
    });

    it("should include base context-menu class", () => {
      const mobileMode = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode);

      expect(menuClasses.value).toContain("context-menu");
    });

    it("should include placement class when provided", () => {
      const mobileMode = ref(true);
      const placement = ref("bottom-start");
      const { menuClasses } = useMobileMenu(mobileMode, { placement });

      expect(menuClasses.value).toContain("placement-bottom-start");
    });

    it("should include is-open class when menu is open", () => {
      const mobileMode = ref(true);
      const isOpen = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode, { isOpen });

      expect(menuClasses.value).toContain("is-open");
    });

    it("should not include is-open class when menu is closed", () => {
      const mobileMode = ref(true);
      const isOpen = ref(false);
      const { menuClasses } = useMobileMenu(mobileMode, { isOpen });

      expect(menuClasses.value).not.toContain("is-open");
    });

    it("should combine all applicable classes", () => {
      const mobileMode = ref(true);
      const isOpen = ref(true);
      const placement = ref("left-start");

      const { menuClasses } = useMobileMenu(mobileMode, {
        isOpen,
        placement,
      });

      const classes = menuClasses.value;
      expect(classes).toContain("context-menu");
      expect(classes).toContain("mobile-mode");
      expect(classes).toContain("is-open");
      expect(classes).toContain("placement-left-start");
    });
  });

  describe("Activation/Deactivation", () => {
    it("should provide activate function", () => {
      const { activate } = useMobileMenu();

      expect(typeof activate).toBe("function");
    });

    it("should provide deactivate function", () => {
      const { deactivate } = useMobileMenu();

      expect(typeof deactivate).toBe("function");
    });

    it("should handle activation without errors", () => {
      const { activate } = useMobileMenu();

      expect(() => activate()).not.toThrow();
    });

    it("should handle deactivation without errors", () => {
      const { deactivate } = useMobileMenu();

      expect(() => deactivate()).not.toThrow();
    });

    it("should return promises from activate/deactivate for consistency", async () => {
      const { activate, deactivate } = useMobileMenu();

      const activateResult = activate();
      const deactivateResult = deactivate();

      expect(activateResult).toBeInstanceOf(Promise);
      expect(deactivateResult).toBeInstanceOf(Promise);

      await expect(activateResult).resolves.toBeUndefined();
      await expect(deactivateResult).resolves.toBeUndefined();
    });
  });

  describe("Responsive Behavior", () => {
    it("should handle mobile mode toggling", async () => {
      const mobileMode = ref(false);
      const { menuClasses } = useMobileMenu(mobileMode);

      // Initially desktop
      expect(menuClasses.value).toContain("desktop-mode");
      expect(menuClasses.value).not.toContain("mobile-mode");

      // Switch to mobile
      mobileMode.value = true;
      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for reactivity

      expect(menuClasses.value).toContain("mobile-mode");
      expect(menuClasses.value).not.toContain("desktop-mode");
    });

    it("should default to desktop mode when mobileMode is not provided", () => {
      const { menuClasses } = useMobileMenu();

      expect(menuClasses.value).toContain("desktop-mode");
      expect(menuClasses.value).not.toContain("mobile-mode");
    });
  });

  describe("Options Handling", () => {
    it("should handle undefined options gracefully", () => {
      const mobileMode = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode, undefined);

      expect(menuClasses.value).toContain("context-menu");
      expect(menuClasses.value).toContain("mobile-mode");
    });

    it("should handle empty options object", () => {
      const mobileMode = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode, {});

      expect(menuClasses.value).toContain("context-menu");
      expect(menuClasses.value).toContain("mobile-mode");
    });

    it("should handle partial options", () => {
      const mobileMode = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode, {
        placement: ref("right-start"),
      });

      expect(menuClasses.value).toContain("context-menu");
      expect(menuClasses.value).toContain("mobile-mode");
      expect(menuClasses.value).toContain("placement-right-start");
    });
  });

  describe("CSS Integration", () => {
    it("should rely on CSS for mobile modal positioning", () => {
      const { menuStyles } = useMobileMenu(ref(true));

      // Mobile mode should use CSS classes, not inline styles
      expect(menuStyles.value).toEqual({});
    });

    it("should provide correct classes for CSS targeting", () => {
      const mobileMode = ref(true);
      const { menuClasses } = useMobileMenu(mobileMode);

      // These classes should match CSS selectors
      expect(menuClasses.value).toContain("mobile-mode");
      expect(menuClasses.value).toContain("context-menu");
    });
  });

  describe("Performance", () => {
    it("should not perform expensive operations in mobile mode", () => {
      const mobileMode = ref(true);
      const { activate, deactivate } = useMobileMenu(mobileMode);

      // Should resolve quickly since no floating UI calculations
      const start = performance.now();
      activate();
      deactivate();
      const end = performance.now();

      expect(end - start).toBeLessThan(10); // Should be very fast
    });
  });
});
