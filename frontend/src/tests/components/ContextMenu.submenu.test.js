import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue - Sub-menu Tests", () => {
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

  describe("Sub-menu support", () => {
    it("detects nested ContextMenu components as sub-menus", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          provide: { isSubMenu: false },
          stubs: {
            ContextMenuTrigger: {
              template: '<button @click="$emit(\'toggle\')">Trigger</button>',
              props: ['variant', 'size', 'isOpen'],
              emits: ['toggle']
            },
            Teleport: true,
          },
        },
      });

      // Check that this component provides sub-menu context for its children
      expect(wrapper.vm.$.provides.isSubMenu).toBe(true);
    });

    it("provides sub-menu context to child ContextMenu components", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        props: { placement: "right-start" },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button @click="$emit(\'toggle\')">Trigger</button>',
              props: ['variant', 'size', 'isOpen'],
              emits: ['toggle']
            },
            Teleport: true,
          },
        },
      });

      // Check provided values
      expect(wrapper.vm.$.provides.isSubMenu).toBe(true);
      expect(wrapper.vm.$.provides.parentMenu).toEqual({ placement: "right-start" });
    });

    it("uses different placement logic for sub-menus", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        props: { placement: "right-start" },
        global: {
          provide: { 
            isSubMenu: true,
            parentMenu: { placement: "left-start" }
          },
          stubs: {
            ContextMenuTrigger: {
              template: '<button @click="$emit(\'toggle\')">Trigger</button>',
              props: ['variant', 'size', 'isOpen'],
              emits: ['toggle']
            },
            Teleport: true,
          },
        },
      });

      // Verify sub-menu receives parent context
      expect(wrapper.vm.isSubMenu).toBe(true);
      expect(wrapper.vm.parentMenu).toEqual({ placement: "left-start" });
    });
  });
});