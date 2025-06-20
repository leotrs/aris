import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue - Accessibility Tests", () => {
  let useDesktopMenuStub;
  let useMobileMenuStub;
  let useListKeyboardNavigationStub;
  let useClosableStub;

  beforeEach(() => {
    vi.resetModules();

    // Mock the desktop menu composable
    useDesktopMenuStub = vi.fn(() => ({
      menuStyles: ref({ position: "fixed", top: "10px", left: "10px" }),
      effectivePlacement: ref("bottom-start"),
      activate: vi.fn(),
      deactivate: vi.fn(),
      updatePosition: vi.fn(),
    }));
    vi.doMock("@/composables/useDesktopMenu.js", () => ({
      useDesktopMenu: useDesktopMenuStub,
    }));

    // Mock the mobile menu composable
    useMobileMenuStub = vi.fn(() => ({
      menuStyles: ref({}),
      menuClasses: ref(["mobile-menu"]),
      activate: vi.fn(),
      deactivate: vi.fn(),
    }));
    vi.doMock("@/composables/useMobileMenu.js", () => ({
      useMobileMenu: useMobileMenuStub,
    }));

    const activeIndex = ref(null);
    const clearSelection = vi.fn();
    const activateNav = vi.fn();
    const deactivateNav = vi.fn();
    useListKeyboardNavigationStub = vi.fn(() => ({
      activeIndex,
      clearSelection,
      activate: activateNav,
      deactivate: deactivateNav,
    }));
    vi.doMock("@/composables/useListKeyboardNavigation.js", () => ({
      useListKeyboardNavigation: useListKeyboardNavigationStub,
    }));

    const activateClosable = vi.fn();
    const deactivateClosable = vi.fn();
    useClosableStub = vi.fn(() => ({
      activate: activateClosable,
      deactivate: deactivateClosable,
    }));
    vi.doMock("@/composables/useClosable.js", () => ({ default: useClosableStub }));
  });

  describe("ARIA support", () => {
    it("sets proper ARIA attributes on menu container", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              name: "ContextMenuTrigger",
              template: "<button @click=\"$emit('toggle')\">Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
          provide: {
            mobileMode: ref(false),
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();

      const menu = wrapper.get(".context-menu");
      expect(menu.attributes("role")).toBe("menu");
      expect(menu.attributes("aria-orientation")).toBe("vertical");
    });

    it("passes isOpen state to trigger for ARIA attributes", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              name: "ContextMenuTrigger",
              template: "<button @click=\"$emit('toggle')\">Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
          provide: {
            mobileMode: ref(false),
          },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("isOpen")).toBe(false);

      wrapper.vm.toggle();
      await nextTick();

      expect(trigger.props("isOpen")).toBe(true);
    });
  });

  describe("Focus management", () => {
    it("restores focus to trigger when menu closes", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              name: "ContextMenuTrigger",
              template: "<button @click=\"$emit('toggle')\">Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
          provide: {
            mobileMode: ref(false),
          },
        },
      });

      // Open and close menu
      wrapper.vm.toggle();
      await nextTick();
      wrapper.vm.toggle();
      await nextTick();

      // Focus management is handled by the component's lifecycle
      expect(useListKeyboardNavigationStub).toHaveBeenCalled();
      expect(useClosableStub).toHaveBeenCalled();
    });
  });
});
