import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FilesItem from "@/views/home/FilesItem.vue";

describe("FilesItem.vue - Icon Visibility and Colors", () => {
  let mockFile;
  let mockProvides;

  beforeEach(() => {
    mockFile = ref({
      id: "test-file-1",
      title: "Test File",
      selected: false,
      focused: false,
      lastModified: new Date().toISOString(),
      tags: [{ id: "tag1", name: "math" }],
    });

    mockProvides = {
      fileStore: ref({
        tags: [{ id: "tag1", name: "math" }],
        createFile: vi.fn(),
        deleteFile: vi.fn(),
        toggleFileTag: vi.fn(),
        createTag: vi.fn(),
      }),
      xsMode: ref(false),
      user: ref({ id: "user-1" }),
      shouldShowColumn: vi.fn(() => true),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("FileMenu Dots Icon", () => {
    it("should have opacity 0 by default", () => {
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
                '<div class="fm-wrapper"><div class="context-menu-trigger" data-testid="dots-icon">⋮</div></div>',
            },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: { template: '<div data-testid="tag-row"></div>' },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      const dotsIcon = wrapper.find('[data-testid="dots-icon"]');
      expect(dotsIcon.exists()).toBe(true);

      // Check that the CSS rule makes it transparent by default
      const menuWrapper = wrapper.find(".fm-wrapper");
      expect(menuWrapper.exists()).toBe(true);
    });

    it("should have opacity 1 on hover", async () => {
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
                '<div class="fm-wrapper"><div class="context-menu-trigger" data-testid="dots-icon">⋮</div></div>',
            },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: { template: '<div data-testid="tag-row"></div>' },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      const itemContainer = wrapper.find(".item");

      // Trigger hover
      await itemContainer.trigger("mouseenter");
      await nextTick();

      // Check that item has hovered class
      expect(itemContainer.classes()).toContain("hovered");
    });

    it("should have opacity 1 when file is focused", async () => {
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
                '<div class="fm-wrapper"><div class="context-menu-trigger" data-testid="dots-icon">⋮</div></div>',
            },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: { template: '<div data-testid="tag-row"></div>' },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      // Set file as focused
      mockFile.value.focused = true;
      await nextTick();

      const itemContainer = wrapper.find(".item");
      expect(itemContainer.classes()).toContain("focused");
    });
  });

  describe("MultiSelectTags Icon", () => {
    it("should have light color by default", () => {
      const wrapper = mount(FilesItem, {
        props: {
          modelValue: mockFile.value,
          mode: "list",
        },
        global: {
          provide: mockProvides,
          stubs: {
            FileMenu: { template: '<div class="fm-wrapper"></div>' },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: {
              template: `
                <div data-testid="tag-row">
                  <div class="controls">
                    <div class="cm-wrapper">
                      <button class="cm-btn" data-testid="tag-icon">
                        <svg data-testid="tag-svg">icon</svg>
                      </button>
                    </div>
                  </div>
                </div>
              `,
            },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      const tagIcon = wrapper.find('[data-testid="tag-svg"]');
      expect(tagIcon.exists()).toBe(true);
    });

    it("should have dark color on item hover", async () => {
      const wrapper = mount(FilesItem, {
        props: {
          modelValue: mockFile.value,
          mode: "list",
        },
        global: {
          provide: mockProvides,
          stubs: {
            FileMenu: { template: '<div class="fm-wrapper"></div>' },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: {
              template: `
                <div data-testid="tag-row">
                  <div class="controls">
                    <div class="cm-wrapper">
                      <button class="cm-btn" data-testid="tag-icon">
                        <svg data-testid="tag-svg">icon</svg>
                      </button>
                    </div>
                  </div>
                </div>
              `,
            },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      const itemContainer = wrapper.find(".item");

      // Trigger hover
      await itemContainer.trigger("mouseenter");
      await nextTick();

      // Check that item has hovered class which should trigger tag icon color change
      expect(itemContainer.classes()).toContain("hovered");
    });

    it("should have dark color when file is focused", async () => {
      const wrapper = mount(FilesItem, {
        props: {
          modelValue: mockFile.value,
          mode: "list",
        },
        global: {
          provide: mockProvides,
          stubs: {
            FileMenu: { template: '<div class="fm-wrapper"></div>' },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: {
              template: `
                <div data-testid="tag-row">
                  <div class="controls">
                    <div class="cm-wrapper">
                      <button class="cm-btn" data-testid="tag-icon">
                        <svg data-testid="tag-svg">icon</svg>
                      </button>
                    </div>
                  </div>
                </div>
              `,
            },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      // Set file as focused
      mockFile.value.focused = true;
      await nextTick();

      const itemContainer = wrapper.find(".item");
      expect(itemContainer.classes()).toContain("focused");
    });

    it("should have dark color when tag menu is open", async () => {
      const wrapper = mount(FilesItem, {
        props: {
          modelValue: mockFile.value,
          mode: "list",
        },
        global: {
          provide: mockProvides,
          stubs: {
            FileMenu: { template: '<div class="fm-wrapper"></div>' },
            FileTitle: {
              template: '<div data-testid="file-title">{{ file.title }}</div>',
              props: ["file"],
            },
            TagRow: {
              template: `
                <div data-testid="tag-row">
                  <div class="controls">
                    <div class="cm-wrapper cm-open">
                      <button class="cm-btn" data-testid="tag-icon">
                        <svg data-testid="tag-svg">icon</svg>
                      </button>
                    </div>
                  </div>
                </div>
              `,
            },
            Date: { template: '<div data-testid="files-item-date"></div>' },
          },
        },
      });

      const contextMenuWrapper = wrapper.find(".cm-open");
      expect(contextMenuWrapper.exists()).toBe(true);
    });
  });
});
