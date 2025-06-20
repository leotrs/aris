import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue - Accessibility Tests", () => {
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

  describe("ARIA support", () => {
    it("sets proper ARIA attributes on menu container", async () => {
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

      wrapper.vm.toggle();
      await nextTick();

      const menu = wrapper.get(".context-menu");
      expect(menu.attributes("role")).toBe("menu");
      expect(menu.attributes("aria-orientation")).toBe("vertical");
    });

    it("generates unique ID for trigger and references it in menu", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button :id="triggerId" @click="$emit(\'toggle\')">Trigger</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
              setup() {
                return {
                  triggerId: "test-trigger-id",
                };
              },
            },
            Teleport: true,
          },
        },
      });

      wrapper.vm.toggle();
      await nextTick();

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      const menu = wrapper.get(".context-menu");

      expect(trigger.vm.triggerId).toBeDefined();
      expect(menu.attributes("aria-labelledby")).toBe(trigger.vm.triggerId);
    });

    it("sets aria-expanded on trigger button", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              template:
                '<button :aria-expanded="isOpen" @click="$emit(\'toggle\')">Trigger</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
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
    it("focuses first menu item when menu opens", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const focusSpy = vi.fn();

      const wrapper = mount(ContextMenu, {
        slots: {
          default:
            '<div class="item" tabindex="0">Item 1</div><div class="item" tabindex="-1">Item 2</div>',
        },
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

      // Mock querySelector and focus
      const mockFirstItem = { focus: focusSpy };
      const mockQuerySelector = vi.fn().mockReturnValue(mockFirstItem);

      // Mock the menu ref
      Object.defineProperty(wrapper.vm, "menuRef", {
        value: ref({ querySelector: mockQuerySelector }),
        writable: true,
      });

      wrapper.vm.toggle();
      await nextTick();

      expect(focusSpy).toHaveBeenCalled();
    });

    it("restores focus to trigger when menu closes", async () => {
      const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
      const focusSpy = vi.fn();
      const mockTriggerElement = { focus: focusSpy };

      // Mock document.activeElement
      Object.defineProperty(document, "activeElement", {
        value: mockTriggerElement,
        writable: true,
      });

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

      // Open and close menu
      wrapper.vm.toggle();
      await nextTick();
      wrapper.vm.toggle();
      await nextTick();

      expect(focusSpy).toHaveBeenCalled();
    });
  });
});
