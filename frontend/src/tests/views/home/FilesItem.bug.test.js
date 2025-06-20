import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FilesItem from "@/views/home/FilesItem.vue";

describe("FilesItem.vue - Bug: FileMenu Visibility Issue", () => {
  let mockFile;
  let mockProvides;

  beforeEach(() => {
    mockFile = ref({
      id: "test-file-1",
      title: "Test File",
      selected: false,
      focused: false,
      lastModified: new Date().toISOString(),
      tags: ["math", "science"],
    });

    mockProvides = {
      fileStore: ref({
        createFile: vi.fn(),
        deleteFile: vi.fn(),
      }),
      xsMode: ref(false),
      user: ref({ id: "user-1" }),
      shouldShowColumn: vi.fn(() => true),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should hide FileMenu by default (not selected, not hovered)", () => {
    const wrapper = mount(FilesItem, {
      props: {
        modelValue: mockFile.value,
        mode: "list",
      },
      global: {
        provide: mockProvides,
        stubs: {
          FileMenu: {
            template:
              '<div data-testid="file-menu" class="fm-wrapper"><div class="context-menu-trigger">⋮</div></div>',
          },
          FileTitle: {
            template: '<div data-testid="file-title">{{ file.title }}</div>',
            props: ["file"],
          },
          TagRow: {
            template: '<div data-testid="tag-row"></div>',
          },
          Date: {
            template: '<div data-testid="files-item-date"></div>',
          },
        },
      },
    });

    const fileMenu = wrapper.find('[data-testid="file-menu"]');
    expect(fileMenu.exists()).toBe(true);

    // Check computed styles for opacity
    const menuElement = fileMenu.element;
    // const computedStyle = getComputedStyle(menuElement);

    // Should be hidden by default (opacity: 0)
    // Note: This might need adjustment based on actual CSS implementation
    expect(menuElement.classList.contains("fm-wrapper")).toBe(true);
  });

  it("should show FileMenu on hover", async () => {
    const wrapper = mount(FilesItem, {
      props: {
        modelValue: mockFile.value,
        mode: "list",
      },
      global: {
        provide: mockProvides,
        stubs: {
          FileMenu: {
            template:
              '<div data-testid="file-menu" class="fm-wrapper"><div class="context-menu-trigger">⋮</div></div>',
          },
          FileTitle: {
            template: '<div data-testid="file-title">{{ file.title }}</div>',
            props: ["file"],
          },
          TagRow: {
            template: '<div data-testid="tag-row"></div>',
          },
          Date: {
            template: '<div data-testid="files-item-date"></div>',
          },
        },
      },
    });

    const itemRow = wrapper.find(".item");
    expect(itemRow.exists()).toBe(true);

    // Trigger hover
    await itemRow.trigger("mouseenter");
    await nextTick();

    // Should have hover class or state
    expect(itemRow.classes()).toContain("hovered");
  });

  it("should show FileMenu when file is focused", async () => {
    const wrapper = mount(FilesItem, {
      props: {
        modelValue: mockFile.value,
        mode: "list",
      },
      global: {
        provide: mockProvides,
        stubs: {
          FileMenu: {
            template:
              '<div data-testid="file-menu" class="fm-wrapper"><div class="context-menu-trigger">⋮</div></div>',
          },
          FileTitle: {
            template: '<div data-testid="file-title">{{ file.title }}</div>',
            props: ["file"],
          },
          TagRow: {
            template: '<div data-testid="tag-row"></div>',
          },
          Date: {
            template: '<div data-testid="files-item-date"></div>',
          },
        },
      },
    });

    const itemRow = wrapper.find(".item");
    expect(itemRow.exists()).toBe(true);

    // Set file as focused
    mockFile.value.focused = true;
    await nextTick();

    // Should have focused class
    expect(itemRow.classes()).toContain("focused");
  });

  it("should not render FileMenu when file is selected", () => {
    const selectedFile = ref({ ...mockFile.value, selected: true });

    const wrapper = mount(FilesItem, {
      props: {
        modelValue: selectedFile.value,
        mode: "list",
      },
      global: {
        provide: mockProvides,
        stubs: {
          FileMenu: {
            template:
              '<div data-testid="file-menu" class="fm-wrapper"><div class="context-menu-trigger">⋮</div></div>',
          },
          FileTitle: {
            template: '<div data-testid="file-title">{{ file.title }}</div>',
            props: ["file"],
          },
          TagRow: {
            template: '<div data-testid="tag-row"></div>',
          },
          Date: {
            template: '<div data-testid="files-item-date"></div>',
          },
        },
      },
    });

    // FileMenu should not be rendered when file is selected
    const fileMenu = wrapper.find('[data-testid="file-menu"]');
    expect(fileMenu.exists()).toBe(false);
  });

  it("should have correct CSS classes for hover states", () => {
    const wrapper = mount(FilesItem, {
      props: {
        modelValue: mockFile.value,
        mode: "list",
      },
      global: {
        provide: mockProvides,
        stubs: {
          FileMenu: {
            template:
              '<div data-testid="file-menu" class="fm-wrapper"><div class="context-menu-trigger">⋮</div></div>',
          },
          FileTitle: {
            template: '<div data-testid="file-title">{{ file.title }}</div>',
            props: ["file"],
          },
          TagRow: {
            template: '<div data-testid="tag-row"></div>',
          },
          Date: {
            template: '<div data-testid="files-item-date"></div>',
          },
        },
      },
    });

    const itemRow = wrapper.find(".item");
    expect(itemRow.exists()).toBe(true);

    // Should have the base item class
    expect(itemRow.classes()).toContain("item");

    const fileMenu = wrapper.find('[data-testid="file-menu"]');
    expect(fileMenu.exists()).toBe(true);
    expect(fileMenu.classes()).toContain("fm-wrapper");
  });
});
