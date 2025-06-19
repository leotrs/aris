import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("ContextMenu.vue - Legacy API Tests", () => {
  let useFloatingUIStub;
  let useListKeyboardNavigationStub;
  let useClosableStub;

  beforeEach(() => {
    vi.resetModules();

    // Mock the new useFloatingUI composable
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

  it("toggles menu visibility and calls composables on open/close", async () => {
    const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
    const wrapper = mount(ContextMenu, {
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

    expect(wrapper.find(".context-menu").exists()).toBe(false);

    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.find(".context-menu").exists()).toBe(true);
    const closableInstance = useClosableStub.mock.results[0].value;
    expect(closableInstance.activate).toHaveBeenCalled();
    const navInstance = useListKeyboardNavigationStub.mock.results[0].value;
    expect(navInstance.activate).toHaveBeenCalled();

    wrapper.vm.toggle();
    await nextTick();
    expect(wrapper.find(".context-menu").exists()).toBe(false);
    expect(closableInstance.deactivate).toHaveBeenCalled();
    expect(navInstance.deactivate).toHaveBeenCalled();
  });

  it("uses custom trigger slot to toggle menu", async () => {
    const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
    const wrapper = mount(ContextMenu, {
      slots: {
        trigger: '<button class="custom-trigger">Custom</button>',
      },
      global: {
        stubs: {
          ContextMenuTrigger: {
            template: '<div><slot /></div>',
            props: ['variant', 'size', 'isOpen'],
            emits: ['toggle']
          },
          Teleport: true,
        },
      },
    });

    expect(wrapper.find(".custom-trigger").exists()).toBe(true);
    
    wrapper.findComponent({ name: 'ContextMenuTrigger' }).vm.$emit('toggle');
    await nextTick();
    expect(wrapper.find(".context-menu").exists()).toBe(true);
  });

  it("applies floatingStyles to the menu element", async () => {
    const mockStyles = { position: "fixed", top: "10px", left: "20px" };
    useFloatingUIStub.mockReturnValue({
      floatingStyles: ref(mockStyles),
      update: vi.fn(),
    });

    const { default: ContextMenu } = await import("@/components/ContextMenu.vue");
    const wrapper = mount(ContextMenu, {
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

    wrapper.vm.toggle();
    await nextTick();

    const menu = wrapper.get(".context-menu");
    const style = menu.attributes("style");
    expect(style).toContain("position: fixed");
    expect(style).toContain("top: 10px");
    expect(style).toContain("left: 20px");
  });
});