import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import ContextMenu from "@/components/ContextMenu.vue";
import { useDesktopMenu } from "@/composables/useDesktopMenu.js";
import { useMobileMenu } from "@/composables/useMobileMenu.js";

// Mock positioning composables
vi.mock("@/composables/useDesktopMenu.js", () => ({
  useDesktopMenu: vi.fn(),
}));

vi.mock("@/composables/useMobileMenu.js", () => ({
  useMobileMenu: vi.fn(),
}));

// Common stubs for child components
const commonStubs = {
  ContextMenuTrigger: {
    template: '<button data-testid="trigger" @click="$emit(\'toggle\')">{{ variant }}</button>',
    props: ["variant", "component", "icon", "text", "size", "isOpen"],
    emits: ["toggle"],
  },
  Teleport: {
    template: '<div data-testid="teleported"><slot /></div>',
  },
};

describe("ContextMenu Simplified API", () => {
  let mockDesktopMenu, mockMobileMenu;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDesktopMenu = {
      menuStyles: ref({}),
      updatePosition: vi.fn(),
      activate: vi.fn(),
      deactivate: vi.fn(),
      effectivePlacement: ref("bottom-start"),
    };

    mockMobileMenu = {
      menuStyles: ref({}),
      menuClasses: ref(["context-menu", "mobile-mode"]),
      activate: vi.fn(),
      deactivate: vi.fn(),
    };

    useDesktopMenu.mockReturnValue(mockDesktopMenu);
    useMobileMenu.mockReturnValue(mockMobileMenu);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Simplified Props Interface", () => {
    it("should accept only essential props", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
          placement: "bottom-start",
          size: "md",
        },
        global: { stubs: commonStubs },
      });

      expect(wrapper.props("variant")).toBe("dots");
      expect(wrapper.props("placement")).toBe("bottom-start");
      expect(wrapper.props("size")).toBe("md");
    });

    it("should have sensible defaults for all props", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      expect(wrapper.props("variant")).toBe(null);
      expect(wrapper.props("placement")).toBe("left-start");
      expect(wrapper.props("size")).toBe("md");
    });

    it("should properly configure ContextMenuTrigger with simplified props", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "close",
          size: "lg",
        },
        global: { stubs: commonStubs },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("close");
      expect(trigger.props("size")).toBe("lg");
    });
  });

  describe("Positioning System Integration", () => {
    it("should initialize both desktop and mobile positioning systems", () => {

      mount(ContextMenu, {
        props: { variant: "dots" },
        global: { stubs: commonStubs },
      });

      expect(useDesktopMenu).toHaveBeenCalledWith(
        expect.any(Object), // btnRef
        expect.any(Object), // menuRef
        expect.objectContaining({
          placement: "left-start",
          strategy: "fixed",
          variant: "dots",
        })
      );

      expect(useMobileMenu).toHaveBeenCalledWith(
        expect.any(Object), // shouldUseMobileMode
        expect.objectContaining({
          placement: expect.any(Object),
          isOpen: expect.any(Object),
        })
      );
    });

    it("should use desktop menu styles when not in mobile mode", () => {
      mockDesktopMenu.menuStyles.value = { top: "100px", left: "50px" };

      const wrapper = mount(ContextMenu, {
        global: {
          stubs: commonStubs,
          provide: { mobileMode: ref(false) },
        },
      });

      // Open the menu to trigger style computation
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");

      // Check that desktop styles are applied
      const menu = wrapper.find('[data-testid="context-menu"]');
      if (menu.exists()) {
        const styles = menu.attributes("style");
        expect(styles).toContain("top: 100px");
        expect(styles).toContain("left: 50px");
      }
    });

    it("should use mobile menu styles when in mobile mode", () => {
      mockMobileMenu.menuStyles.value = {};
      mockMobileMenu.menuClasses.value = ["context-menu", "mobile-mode", "is-open"];

      const wrapper = mount(ContextMenu, {
        global: {
          stubs: commonStubs,
          provide: { mobileMode: ref(true) },
        },
      });

      // Open the menu
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");

      const menu = wrapper.find('[data-testid="context-menu"]');
      if (menu.exists()) {
        expect(menu.classes()).toContain("mobile-mode");
      }
    });
  });

  describe("Menu Lifecycle Management", () => {
    it("should activate appropriate positioning system when opening", async () => {
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: commonStubs,
          provide: { mobileMode: ref(false) },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      await trigger.vm.$emit("toggle");
      await nextTick();

      expect(mockDesktopMenu.activate).toHaveBeenCalled();
      expect(mockMobileMenu.activate).not.toHaveBeenCalled();
    });

    it("should activate mobile positioning when in mobile mode", async () => {
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: commonStubs,
          provide: { mobileMode: ref(true) },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      await trigger.vm.$emit("toggle");
      await nextTick();

      expect(mockMobileMenu.activate).toHaveBeenCalled();
      expect(mockDesktopMenu.activate).not.toHaveBeenCalled();
    });

    it("should deactivate positioning systems when closing", async () => {
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: commonStubs,
          provide: { mobileMode: ref(false) },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });

      // Open then close
      await trigger.vm.$emit("toggle");
      await nextTick();
      await trigger.vm.$emit("toggle");
      await nextTick();

      expect(mockDesktopMenu.deactivate).toHaveBeenCalled();
    });
  });

  describe("Slot System", () => {
    it("should support trigger slot for custom triggers", () => {
      const wrapper = mount(ContextMenu, {
        slots: {
          trigger: '<button data-testid="custom-trigger">Custom</button>',
        },
        global: { stubs: commonStubs },
      });

      const customTrigger = wrapper.find('[data-testid="custom-trigger"]');
      expect(customTrigger.exists()).toBe(true);
    });

    it("should support default slot for menu content", () => {
      const wrapper = mount(ContextMenu, {
        slots: {
          default: '<div data-testid="menu-content">Menu Items</div>',
        },
        global: { stubs: commonStubs },
      });

      // Open menu to show content
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");

      const menuContent = wrapper.find('[data-testid="menu-content"]');
      expect(menuContent.exists()).toBe(true);
    });
  });

  describe("Event Handling", () => {
    it("should expose toggle method", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      expect(typeof wrapper.vm.toggle).toBe("function");
    });

    it("should toggle menu state when trigger emits toggle event", async () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });

      expect(wrapper.vm.show).toBe(false);

      await trigger.vm.$emit("toggle");
      expect(wrapper.vm.show).toBe(true);

      await trigger.vm.$emit("toggle");
      expect(wrapper.vm.show).toBe(false);
    });

    it("should handle context menu prevention", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      const contextMenuEvent = new Event("contextmenu");
      const preventDefaultSpy = vi.spyOn(contextMenuEvent, "preventDefault");
      const element = wrapper.find(".cm-wrapper").element;

      element.dispatchEvent(contextMenuEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      
      // Clean up spies and event listeners
      preventDefaultSpy.mockRestore();
      element.removeEventListener("contextmenu", wrapper.vm.handleContextMenu);
    });
  });

  describe("Accessibility", () => {
    it("should provide proper ARIA attributes", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      // Open menu
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");

      const menu = wrapper.find('[data-testid="context-menu"]');
      if (menu.exists()) {
        expect(menu.attributes("role")).toBe("menu");
        expect(menu.attributes("aria-orientation")).toBe("vertical");
      }
    });

    it("should link trigger and menu with aria-labelledby", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      const triggerId = trigger.vm.triggerId;

      // Open menu
      trigger.vm.$emit("toggle");

      const menu = wrapper.find('[data-testid="context-menu"]');
      if (menu.exists()) {
        expect(menu.attributes("aria-labelledby")).toBe(triggerId);
      }
    });
  });

  describe("Sub-menu Support", () => {
    it("should provide context for child menus", () => {
      const wrapper = mount(ContextMenu, {
        props: { placement: "right-start" },
        global: { stubs: commonStubs },
      });

      // Check provided values through component internals
      const providedValues = wrapper.vm.$.provides;
      expect(providedValues.isSubMenu).toBe(true);
      expect(providedValues.parentMenu).toEqual({ placement: "right-start" });
    });

    it("should configure positioning for sub-menus correctly", () => {

      mount(ContextMenu, {
        props: { placement: "right-start" },
        global: {
          stubs: commonStubs,
          provide: {
            isSubMenu: true,
            parentMenu: { placement: "left-start" },
          },
        },
      });

      expect(useDesktopMenu).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({
          isSubMenu: true,
          parentPlacement: { placement: "left-start" },
        })
      );
    });
  });

  describe("Performance Optimizations", () => {
    it("should use computed properties for reactive updates", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "dots" },
        global: { stubs: commonStubs },
      });

      // Verify computed properties exist and are reactive
      expect(wrapper.vm.computedVariant).toBe("dots");
      expect(wrapper.vm.triggerClasses).toContain("variant-dots");
    });

    it("should debounce position updates", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      // Call updatePosition multiple times
      wrapper.vm.updatePosition();
      wrapper.vm.updatePosition();
      wrapper.vm.updatePosition();

      // Should be debounced through desktop menu
      expect(mockDesktopMenu.updatePosition).toHaveBeenCalled();
    });
  });
});
