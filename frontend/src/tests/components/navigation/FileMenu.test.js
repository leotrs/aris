import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import FileMenu from "@/components/navigation/FileMenu.vue";

describe("FileMenu.vue - Isolated Testing", () => {
  let mockProvides;

  beforeEach(() => {
    mockProvides = {
      mobileMode: ref(false),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render FileMenu component with dots trigger", () => {
    const wrapper = mount(FileMenu, {
      global: {
        provide: mockProvides,
      },
    });

    console.log("FileMenu HTML:", wrapper.html());

    const fmWrapper = wrapper.find(".fm-wrapper");
    console.log("fm-wrapper exists:", fmWrapper.exists());

    expect(fmWrapper.exists()).toBe(true);
  });

  it("should contain ContextMenu component", () => {
    const wrapper = mount(FileMenu, {
      global: {
        provide: mockProvides,
      },
    });

    const contextMenu = wrapper.findComponent({ name: "ContextMenu" });
    console.log("ContextMenu exists:", contextMenu.exists());

    expect(contextMenu.exists()).toBe(true);
  });
});

describe("FileMenu.vue - TDD ContextMenu Dots Variant", () => {
  let mockProvides;

  beforeEach(() => {
    mockProvides = {
      mobileMode: ref(false),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should use ContextMenu with dots variant correctly", () => {
    const wrapper = mount(FileMenu, {
      props: {
        mode: "ContextMenu",
      },
      global: {
        provide: mockProvides,
        stubs: {
          ContextMenu: {
            template: '<div data-testid="context-menu" :variant="variant"><slot /></div>',
            props: ["variant"],
          },
          ContextMenuItem: {
            template: '<div data-testid="context-menu-item" :class="$attrs.class"><slot /></div>',
            props: ["icon", "caption"],
          },
          Separator: {
            template: '<hr data-testid="separator" />',
          },
        },
      },
    });

    const contextMenu = wrapper.find('[data-testid="context-menu"]');
    expect(contextMenu.exists()).toBe(true);
    expect(contextMenu.attributes("variant")).toBe("dots");
  });

  it("should render menu items directly inside ContextMenu", () => {
    const wrapper = mount(FileMenu, {
      props: {
        mode: "ContextMenu",
      },
      global: {
        provide: mockProvides,
        stubs: {
          ContextMenu: {
            template: '<div data-testid="context-menu" variant="dots"><slot /></div>',
          },
          ContextMenuItem: {
            template: '<div data-testid="context-menu-item"><slot /></div>',
            props: ["icon", "caption"],
          },
          Separator: {
            template: '<hr data-testid="separator" />',
          },
        },
      },
    });

    const contextMenu = wrapper.find('[data-testid="context-menu"]');
    const menuItems = contextMenu.findAll('[data-testid="context-menu-item"]');

    // Should have Share, Download, Rename, Duplicate, Delete items
    expect(menuItems.length).toBe(5);

    // Should have separators
    const separators = contextMenu.findAll('[data-testid="separator"]');
    expect(separators.length).toBeGreaterThan(0);
  });

  it("should expose toggle method from ContextMenu ref", () => {
    const mockToggle = vi.fn();

    const wrapper = mount(FileMenu, {
      props: {
        mode: "ContextMenu",
      },
      global: {
        provide: mockProvides,
        stubs: {
          ContextMenu: {
            template: '<div data-testid="context-menu"><slot /></div>',
            setup() {
              return { toggle: mockToggle };
            },
            expose: ["toggle"],
          },
          ContextMenuItem: {
            template: '<div data-testid="context-menu-item"></div>',
          },
          Separator: {
            template: '<hr data-testid="separator" />',
          },
        },
      },
    });

    expect(typeof wrapper.vm.toggle).toBe("function");

    // Call the exposed toggle method
    wrapper.vm.toggle();
    expect(mockToggle).toHaveBeenCalled();
  });

  it("should emit events when menu items are clicked", async () => {
    const wrapper = mount(FileMenu, {
      props: {
        mode: "ContextMenu",
      },
      global: {
        provide: mockProvides,
        stubs: {
          ContextMenu: {
            template: '<div data-testid="context-menu"><slot /></div>',
          },
          ContextMenuItem: {
            template: '<div data-testid="context-menu-item" @click="$attrs.onClick"><slot /></div>',
            props: ["icon", "caption"],
          },
          Separator: {
            template: '<hr data-testid="separator" />',
          },
        },
      },
    });

    const menuItems = wrapper.findAll('[data-testid="context-menu-item"]');

    // Test rename button (3rd item - Share, Download, Rename)
    await menuItems[2].trigger("click");
    expect(wrapper.emitted("rename")).toBeTruthy();

    // Test duplicate button (4th item)
    await menuItems[3].trigger("click");
    expect(wrapper.emitted("duplicate")).toBeTruthy();

    // Test delete button (5th item)
    await menuItems[4].trigger("click");
    expect(wrapper.emitted("delete")).toBeTruthy();
  });
});
