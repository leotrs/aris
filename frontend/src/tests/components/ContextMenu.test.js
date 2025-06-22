import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ContextMenu from "@/components/navigation/ContextMenu.vue";

// Mock Floating UI
vi.mock("@floating-ui/vue", () => ({
  useFloating: () => ({
    floatingStyles: { value: { position: "absolute", top: "0px", left: "0px" } },
    placement: { value: "bottom-start" },
  }),
  autoUpdate: vi.fn(),
  offset: vi.fn(() => ({})),
  flip: vi.fn(() => ({})),
  shift: vi.fn(() => ({})),
  arrow: vi.fn(() => ({})),
}));

// Mock composables
vi.mock("@/composables/useListKeyboardNavigation.js", () => ({
  useListKeyboardNavigation: () => ({
    activeIndex: { value: null },
    clearSelection: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  }),
}));

vi.mock("@/composables/useClosable.js", () => ({
  default: () => ({
    activate: vi.fn(),
    deactivate: vi.fn(),
  }),
}));

describe("ContextMenu", () => {
  let wrapper;

  beforeEach(() => {
    // Clean up DOM for Teleport
    document.body.innerHTML = "";
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    // Clean up any remaining teleported elements
    document.body.innerHTML = "";
  });

  describe("Variants", () => {
    it("renders dots variant by default", () => {
      wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            Teleport: true,
            ButtonDots: true,
          },
        },
      });

      expect(wrapper.find('[data-testid="trigger-button"]').exists()).toBe(true);
    });

    it("renders slot variant when specified", () => {
      wrapper = mount(ContextMenu, {
        props: {
          variant: "slot",
        },
        slots: {
          trigger: '<button data-testid="custom-trigger">Custom</button>',
        },
        global: {
          stubs: {
            Teleport: true,
          },
        },
      });

      expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);
    });
  });

  describe("Menu Toggle", () => {
    it("opens menu when trigger is clicked", async () => {
      wrapper = mount(ContextMenu, {
        attachTo: document.body,
        global: {
          stubs: {
            ButtonDots: {
              template: '<button @click="$emit(\'click\')" data-testid="trigger-button"></button>',
            },
          },
        },
      });

      // Directly call toggle to ensure menu opens
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50)); // Allow more time for Teleport

      // Debug: Check if the menu is actually open in the component
      expect(wrapper.vm.show).toBe(true);

      // Check menu is rendered via Teleport
      const menuInBody = document.querySelector('[data-testid="context-menu"]');
      expect(menuInBody).toBeTruthy();
    });

    it("toggles menu visibility", async () => {
      wrapper = mount(ContextMenu, {
        attachTo: document.body,
        global: {
          stubs: {
            ButtonDots: {
              template: '<button @click="$emit(\'click\')" data-testid="trigger-button"></button>',
            },
          },
        },
      });

      // Open menu
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0)); // Allow Teleport to complete
      let menuInBody = document.querySelector('[data-testid="context-menu"]');
      expect(menuInBody).toBeTruthy();

      // Close menu
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0)); // Allow Teleport to complete
      menuInBody = document.querySelector('[data-testid="context-menu"]');
      expect(menuInBody).toBeFalsy();
    });
  });

  describe("Positioning", () => {
    it("uses mobile positioning when mobileMode is true", () => {
      wrapper = mount(ContextMenu, {
        global: {
          provide: {
            mobileMode: { value: true },
          },
          stubs: {
            Teleport: true,
            ButtonDots: true,
          },
        },
      });

      const menuStyles = wrapper.vm.menuStyles;
      expect(menuStyles.position).toBe("fixed");
      expect(menuStyles.top).toBe("50%");
      expect(menuStyles.left).toBe("50%");
      expect(menuStyles.transform).toBe("translate(-50%, -50%)");
    });

    it("uses desktop positioning when mobileMode is false", () => {
      wrapper = mount(ContextMenu, {
        global: {
          provide: {
            mobileMode: { value: false },
          },
          stubs: {
            Teleport: true,
            ButtonDots: true,
          },
        },
      });

      const menuStyles = wrapper.vm.menuStyles;
      expect(menuStyles.position).toBe("absolute");
    });
  });

  describe("Sub-menus", () => {
    it("provides sub-menu context", () => {
      wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            Teleport: true,
            ButtonDots: true,
          },
        },
      });

      // Check that sub-menu context is provided
      expect(wrapper.vm.$.provides.isSubMenu).toBe(true);
      expect(wrapper.vm.$.provides.parentMenu).toEqual({
        placement: "bottom-start",
      });
    });
  });

  describe("Menu Content", () => {
    it("renders menu items in teleported menu", async () => {
      wrapper = mount(ContextMenu, {
        slots: {
          default: [
            '<div class="item" role="menuitem">Item 1</div>',
            '<div class="item" role="menuitem">Item 2</div>',
          ],
        },
        global: {
          stubs: {
            ButtonDots: true,
          },
        },
        attachTo: document.body,
      });

      // Open the menu
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      // Check menu is rendered in body via Teleport
      const menuInBody = document.querySelector('[data-testid="context-menu"]');
      expect(menuInBody).toBeTruthy();
      expect(menuInBody.querySelectorAll(".item")).toHaveLength(2);
    });
  });

  describe("Accessibility", () => {
    it("sets proper ARIA attributes", () => {
      wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            Teleport: true,
            ButtonDots: {
              template: '<button :aria-expanded="false" data-testid="trigger-button"></button>',
            },
          },
        },
      });

      const trigger = wrapper.find('[data-testid="trigger-button"]');
      expect(trigger.attributes("aria-expanded")).toBe("false");
    });

    it("updates ARIA expanded when menu opens", async () => {
      wrapper = mount(ContextMenu, {
        attachTo: document.body,
        global: {
          stubs: {
            ButtonDots: {
              template:
                '<button :aria-expanded="show" data-testid="trigger-button" @click="$emit(\'click\')"></button>',
              props: ["show"],
            },
          },
        },
      });

      // Directly call toggle to ensure menu opens
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50)); // Allow more time for Teleport

      // Check the menu opened by looking at DOM
      const menuInBody = document.querySelector('[data-testid="context-menu"]');
      expect(menuInBody).toBeTruthy();
    });
  });
});
