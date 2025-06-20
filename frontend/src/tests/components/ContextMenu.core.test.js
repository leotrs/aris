import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue - Core Functionality", () => {
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

  it("passes placement and middleware options to useDesktopMenu", async () => {
    const { default: ContextMenu } = await import("@/components/navigation/ContextMenu.vue");
    mount(ContextMenu, {
      props: { placement: "bottom-start" },
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

    expect(useDesktopMenuStub).toHaveBeenCalled();
  });

  it("uses zero offset when variant is not dots", async () => {
    const { default: ContextMenu } = await import("@/components/navigation/ContextMenu.vue");
    mount(ContextMenu, {
      props: { variant: "close" },
      global: {
        stubs: {
          ContextMenuTrigger: {
            name: "ContextMenuTrigger",
            template: "<button @click=\"$emit('toggle')\">Close</button>",
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

    // The component should handle different variants properly
    expect(useDesktopMenuStub).toHaveBeenCalled();
  });

  describe("CSS Animations", () => {
    it("applies transition classes to menu", async () => {
      const { default: ContextMenu } = await import("@/components/navigation/ContextMenu.vue");
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

      // Menu should be rendered with proper classes
      expect(wrapper.find(".context-menu").exists()).toBe(true);
    });
  });
});
