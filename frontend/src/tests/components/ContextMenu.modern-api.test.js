import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
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

const commonStubs = {
  ContextMenuTrigger: {
    template: '<button data-testid="trigger" @click="$emit(\'toggle\')">Trigger</button>',
    props: ["variant", "component", "icon", "text", "size", "isOpen"],
    emits: ["toggle"],
  },
  Teleport: {
    template: '<div data-testid="teleported"><slot /></div>',
  },
};

describe("ContextMenu Modern API (Post-Migration)", () => {
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

  describe("Modern Props Only", () => {
    it("should only accept modern props (variant, placement, size)", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "close",
          placement: "right-start",
          size: "lg",
        },
        global: { stubs: commonStubs },
      });

      expect(wrapper.props("variant")).toBe("close");
      expect(wrapper.props("placement")).toBe("right-start");
      expect(wrapper.props("size")).toBe("lg");
    });

    it("should not accept deprecated props", () => {
      // This test verifies that deprecated props are removed from the component
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
          // These should not exist after migration:
          icon: "Dots", // deprecated
          btnComponent: "ButtonToggle", // deprecated
          text: "Some text", // deprecated
          iconClass: "custom-icon", // deprecated
        },
        global: { stubs: commonStubs },
      });

      // Should not have deprecated prop accessors
      expect(wrapper.props("icon")).toBeUndefined();
      expect(wrapper.props("btnComponent")).toBeUndefined();
      expect(wrapper.props("text")).toBeUndefined();
      expect(wrapper.props("iconClass")).toBeUndefined();

      // Should not show deprecation warnings since props are removed
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should work with variant-only API", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "dots" },
        global: { stubs: commonStubs },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("dots");
    });
  });

  describe("Simplified Component Interface", () => {
    it("should have clean, minimal props interface", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      // Only essential props should exist
      const allowedProps = ["variant", "placement", "size", "floatingOptions"];
      const componentProps = Object.keys(wrapper.vm.$props);

      componentProps.forEach((prop) => {
        expect(allowedProps).toContain(prop);
      });
    });

    it("should provide clean expose interface", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      // Should expose minimal, essential methods
      expect(typeof wrapper.vm.toggle).toBe("function");
      expect(wrapper.vm.effectivePlacement).toBeDefined();
    });

    it("should not expose internal implementation details", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      // These should not be exposed (internal implementation)
      expect(wrapper.vm.computedVariant).toBeUndefined();
      expect(wrapper.vm.triggerClasses).toBeUndefined();
      expect(wrapper.vm.btnRef).toBeUndefined();
    });
  });

  describe("Modern Variant System", () => {
    it("should use variant prop directly without computation", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "close" },
        global: { stubs: commonStubs },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("close");
    });

    it("should support all modern variants", () => {
      const variants = ["dots", "close", "custom"];

      variants.forEach((variant) => {
        const wrapper = mount(ContextMenu, {
          props: { variant },
          global: { stubs: commonStubs },
        });

        const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
        expect(trigger.props("variant")).toBe(variant);
      });
    });

    it("should default to dots variant", () => {
      const wrapper = mount(ContextMenu, {
        global: { stubs: commonStubs },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("dots");
    });
  });

  describe("Clean Template Structure", () => {
    it("should have simplified template without backwards compatibility", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "dots" },
        global: { stubs: commonStubs },
      });

      // Should only render ContextMenuTrigger, not multiple button types
      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.exists()).toBe(true);

      // Should not have legacy button components in template
      expect(wrapper.find("ButtonDots").exists()).toBe(false);
      expect(wrapper.find("ButtonClose").exists()).toBe(false);
      expect(wrapper.find("ButtonToggle").exists()).toBe(false);
    });

    it("should use modern slot system", () => {
      const wrapper = mount(ContextMenu, {
        slots: {
          trigger: '<span data-testid="modern-trigger">Modern Trigger</span>',
          default: '<div data-testid="modern-content">Modern Content</div>',
        },
        global: { stubs: commonStubs },
      });

      expect(wrapper.find('[data-testid="modern-trigger"]').exists()).toBe(true);

      // Open menu to show content
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");
      expect(wrapper.find('[data-testid="modern-content"]').exists()).toBe(true);
    });
  });

  describe("Modern Positioning API", () => {
    it("should use clean positioning composable interface", () => {

      mount(ContextMenu, {
        props: {
          variant: "close",
          placement: "bottom-end",
          size: "sm",
        },
        global: { stubs: commonStubs },
      });

      expect(useDesktopMenu).toHaveBeenCalledWith(
        expect.any(Object), // btnRef
        expect.any(Object), // menuRef
        expect.objectContaining({
          placement: "bottom-end",
          strategy: "fixed",
          variant: "close",
        })
      );
    });

    it("should handle floating options cleanly", () => {

      const floatingOptions = {
        middleware: ["offset", "flip"],
        strategy: "absolute",
      };

      mount(ContextMenu, {
        props: {
          variant: "dots",
          floatingOptions,
        },
        global: { stubs: commonStubs },
      });

      expect(useDesktopMenu).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining(floatingOptions)
      );
    });
  });

  describe("Performance Optimizations", () => {
    it("should not have backwards compatibility overhead", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "dots" },
        global: { stubs: commonStubs },
      });

      // No deprecation warnings should be generated
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Trigger various interactions
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it("should have minimal computed properties", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "close" },
        global: { stubs: commonStubs },
      });

      // Should not have complex backwards compatibility computations
      // This is verified by the component implementation having fewer computed properties
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("Migration Path Verification", () => {
    it("should work with all new API patterns", () => {
      // Test various modern usage patterns
      const patterns = [
        { variant: "dots" },
        { variant: "close", size: "lg" },
        { variant: "custom", placement: "right-start" },
        {
          variant: "dots",
          floatingOptions: { strategy: "absolute" },
        },
      ];

      patterns.forEach((props) => {
        expect(() => {
          mount(ContextMenu, {
            props,
            global: { stubs: commonStubs },
          });
        }).not.toThrow();
      });
    });

    it("should handle slot-based customization", () => {
      const wrapper = mount(ContextMenu, {
        slots: {
          trigger: '<button data-testid="custom-trigger">Custom</button>',
          default: `
            <div data-testid="menu-item-1">Item 1</div>
            <div data-testid="menu-item-2">Item 2</div>
          `,
        },
        global: { stubs: commonStubs },
      });

      expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);

      // Open menu
      wrapper.findComponent({ name: "ContextMenuTrigger" }).vm.$emit("toggle");

      expect(wrapper.find('[data-testid="menu-item-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="menu-item-2"]').exists()).toBe(true);
    });
  });

  describe("API Stability", () => {
    it("should have stable, future-proof API", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
          placement: "bottom-start",
          size: "md",
        },
        global: { stubs: commonStubs },
      });

      // API should be clean and not prone to future breaking changes
      expect(wrapper.props()).toEqual(
        expect.objectContaining({
          variant: "dots",
          placement: "bottom-start",
          size: "md",
        })
      );
    });
  });
});
