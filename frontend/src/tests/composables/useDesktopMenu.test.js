import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { useDesktopMenu } from "@/composables/useDesktopMenu.js";

// Mock useFloatingUI composable
vi.mock("@/composables/useFloatingUI.js", () => ({
  useFloatingUI: vi.fn(),
}));

// Mock useDebounceFn from VueUse
vi.mock("@vueuse/core", () => ({
  useDebounceFn: vi.fn((fn, delay) => fn),
}));

describe("useDesktopMenu", () => {
  let mockFloatingStyles, mockUpdate;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockFloatingStyles = ref({ top: "100px", left: "50px" });
    mockUpdate = vi.fn();

    const { useFloatingUI } = await import("@/composables/useFloatingUI.js");
    useFloatingUI.mockReturnValue({
      floatingStyles: mockFloatingStyles,
      update: mockUpdate,
    });
  });

  describe("Initialization", () => {
    it("should initialize with floating UI composable", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);
      const options = { placement: "bottom-start" };

      const result = useDesktopMenu(triggerRef, menuRef, options);

      expect(result).toHaveProperty("menuStyles");
      expect(result).toHaveProperty("updatePosition");
      expect(result).toHaveProperty("activate");
      expect(result).toHaveProperty("deactivate");
    });

    it("should pass correct options to useFloatingUI", async () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);
      const options = {
        placement: "left-start",
        offset: 8,
        strategy: "fixed",
      };

      const { useFloatingUI } = await import("@/composables/useFloatingUI.js");
      useDesktopMenu(triggerRef, menuRef, options);

      expect(useFloatingUI).toHaveBeenCalledWith(triggerRef, menuRef, {
        placement: "left-start",
        strategy: "fixed",
        offset: 8,
      });
    });
  });

  describe("Menu Styles", () => {
    it("should return floating styles as menu styles", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { menuStyles } = useDesktopMenu(triggerRef, menuRef, {});

      expect(menuStyles.value).toEqual({ top: "100px", left: "50px" });
    });

    it("should update menu styles when floating styles change", async () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { menuStyles } = useDesktopMenu(triggerRef, menuRef, {});

      // Change floating styles
      mockFloatingStyles.value = { top: "200px", left: "100px" };
      await nextTick();

      expect(menuStyles.value).toEqual({ top: "200px", left: "100px" });
    });

    it("should return empty object when floating styles are null", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      mockFloatingStyles.value = null;
      const { menuStyles } = useDesktopMenu(triggerRef, menuRef, {});

      expect(menuStyles.value).toEqual({});
    });
  });

  describe("Position Updates", () => {
    it("should provide updatePosition function", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { updatePosition } = useDesktopMenu(triggerRef, menuRef, {});

      expect(typeof updatePosition).toBe("function");
    });

    it("should call floating UI update when updatePosition is called", () => {
      const triggerRef = ref(document.createElement("button"));
      const menuRef = ref(document.createElement("div"));

      const { updatePosition } = useDesktopMenu(triggerRef, menuRef, {});

      updatePosition();

      expect(mockUpdate).toHaveBeenCalled();
    });

    it("should not call update when refs are null", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { updatePosition } = useDesktopMenu(triggerRef, menuRef, {});

      updatePosition();

      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should debounce position updates", async () => {
      const { useDebounceFn } = await import("@vueuse/core");
      const triggerRef = ref(null);
      const menuRef = ref(null);

      useDesktopMenu(triggerRef, menuRef, {});

      expect(useDebounceFn).toHaveBeenCalledWith(expect.any(Function), 100);
    });
  });

  describe("Activation/Deactivation", () => {
    it("should provide activate function", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { activate } = useDesktopMenu(triggerRef, menuRef, {});

      expect(typeof activate).toBe("function");
    });

    it("should provide deactivate function", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { deactivate } = useDesktopMenu(triggerRef, menuRef, {});

      expect(typeof deactivate).toBe("function");
    });

    it("should update position when activated", async () => {
      const triggerRef = ref(document.createElement("button"));
      const menuRef = ref(document.createElement("div"));

      const { activate } = useDesktopMenu(triggerRef, menuRef, {});

      await activate();

      expect(mockUpdate).toHaveBeenCalled();
    });

    it("should handle activation with double nextTick for DOM settling", async () => {
      const triggerRef = ref(document.createElement("button"));
      const menuRef = ref(document.createElement("div"));

      const { activate } = useDesktopMenu(triggerRef, menuRef, {});

      // Just test that activation completes successfully with DOM refs
      await expect(activate()).resolves.toBeUndefined();

      // Verify update was called after activation
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("Smart Placement for Sub-menus", () => {
    it("should handle effective placement computation", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);
      const parentPlacement = ref("right-start");

      const { effectivePlacement } = useDesktopMenu(triggerRef, menuRef, {
        placement: "bottom-start",
        isSubMenu: true,
        parentPlacement,
      });

      expect(effectivePlacement.value).toBe("right-start");
    });

    it("should fallback to provided placement when not sub-menu", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { effectivePlacement } = useDesktopMenu(triggerRef, menuRef, {
        placement: "left-start",
        isSubMenu: false,
      });

      expect(effectivePlacement.value).toBe("left-start");
    });

    it("should compute sub-menu placement based on parent", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);
      const parentPlacement = ref("left-start");

      const { effectivePlacement } = useDesktopMenu(triggerRef, menuRef, {
        placement: "bottom-start",
        isSubMenu: true,
        parentPlacement,
      });

      expect(effectivePlacement.value).toBe("left-start");
    });

    it("should default to right-start for sub-menus when parent placement is unclear", () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);
      const parentPlacement = ref("top");

      const { effectivePlacement } = useDesktopMenu(triggerRef, menuRef, {
        placement: "bottom-start",
        isSubMenu: true,
        parentPlacement,
      });

      expect(effectivePlacement.value).toBe("right-start");
    });
  });

  describe("Dynamic Options", () => {
    it("should handle variant-based offset computation", async () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { useFloatingUI } = await import("@/composables/useFloatingUI.js");

      useDesktopMenu(triggerRef, menuRef, {
        variant: "dots",
        offset: 0,
      });

      expect(useFloatingUI).toHaveBeenCalledWith(triggerRef, menuRef, {
        placement: "bottom-start",
        strategy: "fixed",
        offset: 4, // Should be 4 for dots variant
      });
    });

    it("should use provided offset when not dots variant", async () => {
      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { useFloatingUI } = await import("@/composables/useFloatingUI.js");

      useDesktopMenu(triggerRef, menuRef, {
        variant: "close",
        offset: 8,
      });

      expect(useFloatingUI).toHaveBeenCalledWith(triggerRef, menuRef, {
        placement: "bottom-start",
        strategy: "fixed",
        offset: 8,
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle missing floating UI gracefully", async () => {
      const { useFloatingUI } = await import("@/composables/useFloatingUI.js");
      useFloatingUI.mockReturnValue({
        floatingStyles: null,
        update: null,
      });

      const triggerRef = ref(null);
      const menuRef = ref(null);

      const { menuStyles, updatePosition } = useDesktopMenu(triggerRef, menuRef, {});

      expect(menuStyles.value).toEqual({});
      expect(() => updatePosition()).not.toThrow();
    });
  });
});
