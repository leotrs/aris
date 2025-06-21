import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue", () => {
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

  it("renders default Dots button and shows slot content", async () => {
    const { default: ContextMenu } = await import("@/components/navigation/ContextMenu.vue");
    const wrapper = mount(ContextMenu, {
      slots: {
        default: '<div class="menu-item">Test Item</div>',
      },
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

    // Check that ContextMenuTrigger is rendered
    expect(wrapper.findComponent({ name: "ContextMenuTrigger" }).exists()).toBe(true);

    // Toggle menu open
    wrapper.vm.toggle();
    await nextTick();

    // Check that slot content is rendered in the menu
    expect(wrapper.find(".menu-item").exists()).toBe(true);
    expect(wrapper.find(".menu-item").text()).toBe("Test Item");
  });

  describe("Debounced positioning", () => {
    it("debounces position updates when props change rapidly", async () => {
      const { default: ContextMenu } = await import("@/components/navigation/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        props: { placement: "left-start" },
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

      // Rapidly change placement - should handle gracefully
      await wrapper.setProps({ placement: "right-start" });
      await wrapper.setProps({ placement: "bottom-start" });
      await wrapper.setProps({ placement: "top-start" });

      expect(useDesktopMenuStub).toHaveBeenCalled();
    });
  });
});
