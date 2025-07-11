import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";
import ContextMenu from "@/components/navigation/ContextMenu.vue";

// Mock Floating UI composables
vi.mock("@floating-ui/vue", () => ({
  useFloating: vi.fn(() => ({
    floatingStyles: ref({ position: "absolute", top: "0px", left: "0px" }),
    placement: ref("bottom-start"),
  })),
  autoUpdate: vi.fn(),
  offset: vi.fn(() => ({})),
  flip: vi.fn(() => ({})),
  shift: vi.fn(() => ({})),
}));

// Mock composables
vi.mock("@/composables/useListKeyboardNavigation.js", () => ({
  useListKeyboardNavigation: vi.fn(() => ({
    activeIndex: ref(null),
    clearSelection: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  })),
}));

vi.mock("@/composables/useClosable.js", () => ({
  default: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn(),
  })),
}));

describe("ContextMenu", () => {
  let mockMobileMode;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMobileMode = ref(false);
  });

  // Regression Tests
  describe("Regression Tests", () => {
    it("should not throw error when mobileMode is undefined", () => {
      // This test exposes the current bug where props.mobileMode is referenced
      // but should use injected mobileMode instead
      expect(() => {
        mount(ContextMenu, {
          global: {
            provide: {
              // No mobileMode provided
              isSubMenu: false,
              parentMenu: null,
            },
            stubs: {
              Teleport: false,
            },
          },
          attachTo: document.body,
        });
      }).not.toThrow();
    });

    it("should handle mobile mode classes correctly when mobileMode is injected", async () => {
      const wrapper = mount(ContextMenu, {
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
          stubs: {
            Teleport: false,
          },
        },
        attachTo: document.body,
      });

      // Trigger menu to show
      const trigger = wrapper.find('[data-testid="trigger-button"]');
      await trigger.trigger("click");

      // Find menu in body (because of Teleport)
      const menu = document.querySelector('[data-testid="context-menu"]');
      expect(menu).toBeTruthy();
      expect(menu.classList.contains("context-menu")).toBe(true);
      expect(menu.classList.contains("context-menu--mobile")).toBe(false);

      // Switch to mobile mode
      mockMobileMode.value = true;
      await wrapper.vm.$nextTick();

      // Should now have mobile class
      expect(menu.classList.contains("context-menu--mobile")).toBe(true);
    });
  });

  // Test menuClass prop functionality (behavior-focused)
  describe("Custom Menu Classes", () => {
    it("should accept menuClass prop as string", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          menuClass: "custom-menu-class",
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      expect(wrapper.props("menuClass")).toBe("custom-menu-class");
      expect(() => wrapper.vm.menuClasses).not.toThrow();
    });

    it("should accept menuClass prop as array", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          menuClass: ["class1", "class2"],
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      expect(wrapper.props("menuClass")).toEqual(["class1", "class2"]);
      expect(() => wrapper.vm.menuClasses).not.toThrow();
    });

    it("should accept menuClass prop as object", () => {
      const menuClass = { active: true, disabled: false };
      const wrapper = mount(ContextMenu, {
        props: {
          menuClass,
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      expect(wrapper.props("menuClass")).toEqual(menuClass);
      expect(() => wrapper.vm.menuClasses).not.toThrow();
    });

    it("should generate menuClasses computed property correctly", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          menuClass: "test-class",
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      const menuClasses = wrapper.vm.menuClasses;
      expect(Array.isArray(menuClasses)).toBe(true);
      expect(menuClasses).toContain("context-menu");
      expect(menuClasses).toContain("test-class");
    });

    it("should include mobile class when in mobile mode", () => {
      mockMobileMode.value = true;

      const wrapper = mount(ContextMenu, {
        props: {
          menuClass: "custom-class",
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      const menuClasses = wrapper.vm.menuClasses;
      expect(menuClasses).toContain("context-menu");
      expect(menuClasses).toContain("custom-class");
      // Mobile class should be in an object format in the array
      expect(
        menuClasses.some((cls) => typeof cls === "object" && cls["context-menu--mobile"])
      ).toBe(true);
    });

    it("should handle null/undefined menuClass gracefully", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          menuClass: null,
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      expect(() => wrapper.vm.menuClasses).not.toThrow();
      const menuClasses = wrapper.vm.menuClasses;
      expect(menuClasses).toContain("context-menu");
      // Should not include null in the array
      expect(menuClasses.includes(null)).toBe(false);
    });

    it("should be reactive to menuClass prop changes", async () => {
      const wrapper = mount(ContextMenu, {
        props: {
          menuClass: "initial-class",
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      expect(wrapper.vm.menuClasses).toContain("initial-class");

      await wrapper.setProps({ menuClass: "updated-class" });
      expect(wrapper.vm.menuClasses).toContain("updated-class");
      expect(wrapper.vm.menuClasses).not.toContain("initial-class");
    });
  });

  // Basic functionality tests
  describe("Basic Functionality", () => {
    it("should render dots variant by default", () => {
      const wrapper = mount(ContextMenu, {
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
          stubs: {
            Teleport: false,
          },
        },
        attachTo: document.body,
      });

      expect(wrapper.find('[data-testid="trigger-button"]').exists()).toBe(true);
    });

    it("should toggle menu visibility when trigger is clicked", async () => {
      const wrapper = mount(ContextMenu, {
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
        },
      });

      const trigger = wrapper.find('[data-testid="trigger-button"]');

      // Test component internal state instead of DOM
      expect(wrapper.vm.show).toBe(false);

      // Click to show menu
      await trigger.trigger("click");
      expect(wrapper.vm.show).toBe(true);

      // Click again to hide menu
      await trigger.trigger("click");
      expect(wrapper.vm.show).toBe(false);
    });

    it("should support slot variant", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "slot",
        },
        slots: {
          trigger: '<button class="custom-trigger">Custom Trigger</button>',
        },
        global: {
          provide: {
            mobileMode: mockMobileMode,
            isSubMenu: false,
            parentMenu: null,
          },
          stubs: {
            Teleport: false,
          },
        },
        attachTo: document.body,
      });

      expect(wrapper.find(".custom-trigger").exists()).toBe(true);
      expect(wrapper.find('[data-testid="trigger-button"]').exists()).toBe(false);
    });
  });
});
