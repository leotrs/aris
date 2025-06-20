import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue - Core Functionality", () => {
  let useFloatingUIStub;
  let useListKeyboardNavigationStub;
  let useClosableStub;

  beforeEach(() => {
    vi.resetModules();

    useFloatingUIStub = vi.fn(() => ({
      floatingStyles: ref({ position: "fixed", top: "10px" }),
      update: vi.fn(),
    }));
    vi.doMock("@/composables/useFloatingUI.js", () => ({
      useFloatingUI: useFloatingUIStub,
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

  it("passes placement and middleware options to useFloatingUI", async () => {
    const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
    mount(ContextMenu, {
      props: { placement: "bottom-start" },
      global: {
        stubs: {
          ContextMenuTrigger: {
            template: "<button @click=\"$emit('toggle')\">Trigger</button>",
            props: ["variant", "size", "isOpen"],
            emits: ["toggle"],
          },
          Teleport: true,
        },
      },
    });

    expect(useFloatingUIStub).toHaveBeenCalledWith(
      expect.any(Object), // btnRef
      expect.any(Object), // menuRef
      expect.objectContaining({
        placement: "bottom-start",
        strategy: "fixed",
      })
    );
  });

  it("uses zero offset when variant is not dots", async () => {
    const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
    mount(ContextMenu, {
      props: { variant: "close" },
      global: {
        stubs: {
          ContextMenuTrigger: {
            template: "<button @click=\"$emit('toggle')\">Close</button>",
            props: ["variant", "size", "isOpen"],
            emits: ["toggle"],
          },
          Teleport: true,
        },
      },
    });

    expect(useFloatingUIStub).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      expect.objectContaining({
        offset: 0,
      })
    );
  });

  describe("CSS Animations", () => {
    it("applies transition classes to menu", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: "<button @click=\"$emit('toggle')\">Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Find the Transition component
      const transition = wrapper.findComponent({ name: "Transition" });
      expect(transition.exists()).toBe(true);
      expect(transition.props("name")).toBe("cm-menu");
      expect(transition.props("enterActiveClass")).toBe("cm-menu-enter-active");
      expect(transition.props("leaveActiveClass")).toBe("cm-menu-leave-active");
    });
  });

  describe("Touch interactions", () => {
    it("prevents context menu on long press", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: "<button @click=\"$emit('toggle')\">Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const contextMenuEvent = new Event("contextmenu");
      const preventDefaultSpy = vi.spyOn(contextMenuEvent, "preventDefault");

      wrapper.find(".cm-wrapper").element.dispatchEvent(contextMenuEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      preventDefaultSpy.mockRestore();
    });
  });
});
