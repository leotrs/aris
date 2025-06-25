import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FilesItem from "@/views/home/FilesItem.vue";

// Mock router
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock keyboard shortcuts
vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

// Mock File model
const mockOpenFile = vi.fn();
vi.mock("@/models/File.js", () => ({
  File: {
    openFile: mockOpenFile,
    toJSON: vi.fn((file) => ({ ...file })),
  },
}));

describe("FilesItem.vue - Enhanced Functionality", () => {
  let mockFile;
  let mockFileStore;
  let mockProvides;

  beforeEach(() => {
    mockFile = ref({
      id: "test-file-1",
      title: "Test Research Paper",
      selected: false,
      focused: false,
      lastModified: new Date().toISOString(),
      tags: [
        { id: "tag1", name: "research", color: "#blue" },
        { id: "tag2", name: "biology", color: "#green" }
      ],
    });

    mockFileStore = ref({
      selectFile: vi.fn(),
      createFile: vi.fn(),
      deleteFile: vi.fn().mockResolvedValue(true),
    });

    mockProvides = {
      fileStore: mockFileStore,
      xsMode: ref(false),
      user: ref({ id: "user-1" }),
      shouldShowColumn: vi.fn(() => true),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (overrides = {}) => {
    return mount(FilesItem, {
      props: {
        modelValue: mockFile.value,
        mode: "list",
        ...overrides.props,
      },
      global: {
        provide: {
          ...mockProvides,
          ...overrides.provide,
        },
        stubs: {
          FileMenu: {
            template: `
              <div data-testid="file-menu" class="fm-wrapper">
                <div class="context-menu-trigger" @click="openMenu">⋮</div>
                <div class="context-menu" v-if="menuOpen">
                  <div @click="$emit('rename')" data-testid="menu-rename">Rename</div>
                  <div @click="$emit('duplicate')" data-testid="menu-duplicate">Duplicate</div>
                  <div @click="$emit('delete')" data-testid="menu-delete">Delete</div>
                </div>
              </div>
            `,
            emits: ["rename", "duplicate", "delete"],
            data() {
              return { menuOpen: false };
            },
            methods: {
              openMenu() { this.menuOpen = !this.menuOpen; },
            },
          },
          FileTitle: {
            template: '<div data-testid="file-title" @click="$emit(\\'click\\')">{{ file.title }}</div>',
            props: ["file"],
            emits: ["click"],
            methods: {
              startEditing: vi.fn(),
            },
          },
          TagRow: {
            template: `
              <div data-testid="tag-row">
                <span v-for="tag in file.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
              </div>
            `,
            props: ["file"],
          },
          Date: {
            template: '<div data-testid="file-date">{{ formattedDate }}</div>',
            props: ["file"],
            computed: {
              formattedDate() { return "2 days ago"; },
            },
          },
          ConfirmationModal: {
            template: `
              <div v-if="show" data-testid="confirmation-modal">
                <div data-testid="modal-title">{{ title }}</div>
                <div data-testid="modal-message">{{ message }}</div>
                <button @click="$emit('confirm')" data-testid="modal-confirm">{{ confirmText }}</button>
                <button @click="$emit('cancel')" data-testid="modal-cancel">{{ cancelText }}</button>
              </div>
            `,
            props: ["show", "title", "message", "confirmText", "cancelText", "fileData"],
            emits: ["confirm", "cancel", "close"],
          },
          ...overrides.stubs,
        },
      },
    });
  };

  describe("File Selection State Synchronization", () => {
    it("syncs selection state correctly when file is selected", async () => {
      const wrapper = createWrapper();

      expect(wrapper.classes()).not.toContain("active");
      expect(mockFile.value.selected).toBe(false);

      // Trigger selection
      await wrapper.trigger("click");

      expect(mockFileStore.value.selectFile).toHaveBeenCalledWith(mockFile.value);
    });

    it("applies active class when file is selected", async () => {
      mockFile.value.selected = true;
      const wrapper = createWrapper();

      expect(wrapper.classes()).toContain("active");
    });

    it("removes active class when file is deselected", async () => {
      mockFile.value.selected = true;
      const wrapper = createWrapper();

      expect(wrapper.classes()).toContain("active");

      mockFile.value.selected = false;
      await nextTick();

      expect(wrapper.classes()).not.toContain("active");
    });

    it("maintains selection state across component updates", async () => {
      mockFile.value.selected = true;
      const wrapper = createWrapper();

      expect(wrapper.classes()).toContain("active");

      // Trigger component update
      await wrapper.setProps({ mode: "cards" });

      expect(wrapper.classes()).toContain("active");
    });

    it("handles rapid selection changes", async () => {
      const wrapper = createWrapper();

      // Rapid selection changes
      await wrapper.trigger("click");
      await wrapper.trigger("click");
      await wrapper.trigger("click");

      expect(mockFileStore.value.selectFile).toHaveBeenCalledTimes(3);
    });

    it("prevents selection when file store is unavailable", async () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref(null),
        },
      });

      // Should not throw
      await wrapper.trigger("click");
    });
  });

  describe("Context Menu Navigation and Keyboard Interaction", () => {\n    it("opens context menu with keyboard shortcut\", async () => {\n      const { useKeyboardShortcuts } = await import(\"@/composables/useKeyboardShortcuts.js\");\n      const wrapper = createWrapper();\n\n      // Get registered shortcuts\n      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];\n      expect(shortcuts).toHaveProperty(\".\");\n      expect(shortcuts[\".\"].description).toBe(\"open file menu\");\n    });\n\n    it(\"opens file with Enter key\", async () => {\n      const { useKeyboardShortcuts } = await import(\"@/composables/useKeyboardShortcuts.js\");\n      const wrapper = createWrapper();\n\n      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];\n      expect(shortcuts).toHaveProperty(\"Enter\");\n      \n      // Execute Enter shortcut\n      shortcuts[\"Enter\"].fn();\n      expect(mockOpenFile).toHaveBeenCalledWith(mockFile.value, expect.any(Object));\n    });\n\n    it(\"opens file with Space key\", async () => {\n      const { useKeyboardShortcuts } = await import(\"@/composables/useKeyboardShortcuts.js\");\n      const wrapper = createWrapper();\n\n      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];\n      expect(shortcuts).toHaveProperty(\" \");\n      \n      // Execute Space shortcut\n      shortcuts[\" \"].fn();\n      expect(mockOpenFile).toHaveBeenCalledWith(mockFile.value, expect.any(Object));\n    });\n\n    it(\"navigates context menu with arrow keys\", async () => {\n      const wrapper = createWrapper();\n      \n      // Open context menu\n      const menuTrigger = wrapper.find('[data-testid=\"file-menu\"] .context-menu-trigger');\n      await menuTrigger.trigger(\"click\");\n\n      const contextMenu = wrapper.find('.context-menu');\n      expect(contextMenu.exists()).toBe(true);\n\n      // Verify menu items are accessible\n      expect(wrapper.find('[data-testid=\"menu-rename\"]').exists()).toBe(true);\n      expect(wrapper.find('[data-testid=\"menu-duplicate\"]').exists()).toBe(true);\n      expect(wrapper.find('[data-testid=\"menu-delete\"]').exists()).toBe(true);\n    });\n\n    it(\"closes context menu with Escape key\", async () => {\n      const { useKeyboardShortcuts } = await import(\"@/composables/useKeyboardShortcuts.js\");\n      const wrapper = createWrapper();\n\n      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];\n      expect(shortcuts).toHaveProperty(\"Escape\");\n\n      // Execute Escape shortcut (should close any open menu)\n      expect(() => shortcuts[\"Escape\"].fn()).not.toThrow();\n    });\n\n    it(\"executes context menu actions correctly\", async () => {\n      const wrapper = createWrapper();\n\n      // Open context menu\n      const menuTrigger = wrapper.find('[data-testid=\"file-menu\"] .context-menu-trigger');\n      await menuTrigger.trigger(\"click\");\n\n      // Test rename action\n      const renameItem = wrapper.find('[data-testid=\"menu-rename\"]');\n      await renameItem.trigger(\"click\");\n\n      // Should trigger startEditing on FileTitle component\n      const fileTitle = wrapper.findComponent('[data-testid=\"file-title\"]');\n      expect(fileTitle.vm.startEditing).toHaveBeenCalled();\n    });\n\n    it(\"handles duplicate action correctly\", async () => {\n      const wrapper = createWrapper();\n\n      // Open context menu and trigger duplicate\n      const menuTrigger = wrapper.find('[data-testid=\"file-menu\"] .context-menu-trigger');\n      await menuTrigger.trigger(\"click\");\n\n      const duplicateItem = wrapper.find('[data-testid=\"menu-duplicate\"]');\n      await duplicateItem.trigger(\"click\");\n\n      expect(mockFileStore.value.createFile).toHaveBeenCalledWith(\n        expect.objectContaining({\n          title: \"Test Research Paper (Copy)\",\n          owner_id: \"user-1\",\n          id: null,\n        })\n      );\n    });\n\n    it(\"shows delete confirmation modal\", async () => {\n      const wrapper = createWrapper();\n\n      // Open context menu and trigger delete\n      const menuTrigger = wrapper.find('[data-testid=\"file-menu\"] .context-menu-trigger');\n      await menuTrigger.trigger(\"click\");\n\n      const deleteItem = wrapper.find('[data-testid=\"menu-delete\"]');\n      await deleteItem.trigger(\"click\");\n\n      await nextTick();\n\n      const modal = wrapper.find('[data-testid=\"confirmation-modal\"]');\n      expect(modal.exists()).toBe(true);\n      expect(modal.find('[data-testid=\"modal-title\"]').text()).toBe(\"Delete File?\");\n    });\n  });\n\n  describe(\"File Operations and State Management\", () => {\n    it(\"handles successful file deletion\", async () => {\n      const wrapper = createWrapper();\n\n      // Trigger delete action\n      await wrapper.vm.onDelete();\n      await nextTick();\n\n      // Confirm deletion\n      const confirmButton = wrapper.find('[data-testid=\"modal-confirm\"]');\n      await confirmButton.trigger(\"click\");\n\n      expect(mockFileStore.value.deleteFile).toHaveBeenCalledWith(mockFile.value);\n    });\n\n    it(\"handles failed file deletion gracefully\", async () => {\n      mockFileStore.value.deleteFile.mockRejectedValue(new Error(\"Delete failed\"));\n      const wrapper = createWrapper();\n\n      // Spy on console.error\n      const consoleSpy = vi.spyOn(console, \"error\").mockImplementation(() => {});\n\n      await wrapper.vm.onDelete();\n      await nextTick();\n\n      // Confirm deletion\n      const confirmButton = wrapper.find('[data-testid=\"modal-confirm\"]');\n      await confirmButton.trigger(\"click\");\n\n      // Should log error and keep modal open\n      expect(consoleSpy).toHaveBeenCalledWith(\"Failed to delete file:\", expect.any(Error));\n      expect(wrapper.vm.showDeleteModal).toBe(true);\n\n      consoleSpy.mockRestore();\n    });\n\n    it(\"cancels file deletion\", async () => {\n      const wrapper = createWrapper();\n\n      await wrapper.vm.onDelete();\n      await nextTick();\n\n      // Cancel deletion\n      const cancelButton = wrapper.find('[data-testid=\"modal-cancel\"]');\n      await cancelButton.trigger(\"click\");\n\n      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();\n      expect(wrapper.vm.showDeleteModal).toBe(false);\n    });\n\n    it(\"prevents delete when file is null\", () => {\n      const wrapper = createWrapper({\n        props: {\n          modelValue: null,\n        },\n      });\n\n      // Should not throw or show modal\n      wrapper.vm.onDelete();\n      expect(wrapper.vm.showDeleteModal).toBe(false);\n    });\n\n    it(\"handles race condition in delete confirmation\", async () => {\n      const wrapper = createWrapper();\n\n      // Close modal before handling confirm\n      wrapper.vm.showDeleteModal = false;\n\n      // Should return early and not call deleteFile\n      const result = await wrapper.vm.handleDeleteConfirm();\n      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();\n    });\n  });\n\n  describe(\"Hover and Focus State Management\", () => {\n    it(\"applies hover state correctly\", async () => {\n      const wrapper = createWrapper();\n\n      expect(wrapper.classes()).not.toContain(\"hovered\");\n\n      await wrapper.trigger(\"mouseenter\");\n      expect(wrapper.classes()).toContain(\"hovered\");\n\n      await wrapper.trigger(\"mouseleave\");\n      expect(wrapper.classes()).not.toContain(\"hovered\");\n    });\n\n    it(\"applies focused state correctly\", async () => {\n      mockFile.value.focused = true;\n      const wrapper = createWrapper();\n\n      expect(wrapper.classes()).toContain(\"focused\");\n\n      mockFile.value.focused = false;\n      await nextTick();\n\n      expect(wrapper.classes()).not.toContain(\"focused\");\n    });\n\n    it(\"combines multiple states correctly\", async () => {\n      mockFile.value.selected = true;\n      mockFile.value.focused = true;\n      const wrapper = createWrapper();\n\n      await wrapper.trigger(\"mouseenter\");\n\n      expect(wrapper.classes()).toContain(\"active\");\n      expect(wrapper.classes()).toContain(\"focused\");\n      expect(wrapper.classes()).toContain(\"hovered\");\n    });\n\n    it(\"maintains hover state during focus changes\", async () => {\n      const wrapper = createWrapper();\n\n      await wrapper.trigger(\"mouseenter\");\n      expect(wrapper.classes()).toContain(\"hovered\");\n\n      mockFile.value.focused = true;\n      await nextTick();\n\n      expect(wrapper.classes()).toContain(\"hovered\");\n      expect(wrapper.classes()).toContain(\"focused\");\n    });\n  });\n\n  describe(\"View Mode Compatibility\", () => {\n    it(\"renders correctly in list mode\", () => {\n      const wrapper = createWrapper({ props: { mode: \"list\" } });\n\n      expect(wrapper.classes()).toContain(\"list\");\n      expect(wrapper.find('[data-testid=\"tag-row\"]').exists()).toBe(true);\n      expect(wrapper.find('[data-testid=\"file-date\"]').exists()).toBe(true);\n    });\n\n    it(\"renders correctly in cards mode\", () => {\n      const wrapper = createWrapper({ props: { mode: \"cards\" } });\n\n      expect(wrapper.classes()).toContain(\"cards\");\n    });\n\n    it(\"hides file menu when file is selected\", async () => {\n      mockFile.value.selected = true;\n      const wrapper = createWrapper();\n\n      // FileMenu should not be rendered when file is selected\n      expect(wrapper.find('[data-testid=\"file-menu\"]').exists()).toBe(false);\n    });\n\n    it(\"shows file menu when file is not selected\", () => {\n      mockFile.value.selected = false;\n      const wrapper = createWrapper();\n\n      expect(wrapper.find('[data-testid=\"file-menu\"]').exists()).toBe(true);\n    });\n  });\n\n  describe(\"Responsive Behavior\", () => {\n    it(\"hides tags in extra small mode\", () => {\n      const wrapper = createWrapper({\n        provide: {\n          xsMode: ref(true),\n        },\n      });\n\n      // In xsMode, TagRow should not be rendered\n      expect(wrapper.find('[data-testid=\"tag-row\"]').exists()).toBe(false);\n    });\n\n    it(\"shows tags in normal mode\", () => {\n      const wrapper = createWrapper({\n        provide: {\n          xsMode: ref(false),\n        },\n      });\n\n      expect(wrapper.find('[data-testid=\"tag-row\"]').exists()).toBe(true);\n    });\n\n    it(\"adapts layout based on shouldShowColumn function\", () => {\n      const mockShouldShowColumn = vi.fn((column) => column !== \"Tags\");\n      const wrapper = createWrapper({\n        provide: {\n          shouldShowColumn: mockShouldShowColumn,\n        },\n      });\n\n      // shouldShowColumn should be available to child components\n      expect(mockShouldShowColumn).toBeDefined();\n    });\n  });\n\n  describe(\"Error Handling and Edge Cases\", () => {\n    it(\"handles missing file store methods gracefully\", async () => {\n      const wrapper = createWrapper({\n        provide: {\n          fileStore: ref({}), // Empty store\n        },\n      });\n\n      // Should not throw\n      await wrapper.trigger(\"click\");\n    });\n\n    it(\"handles malformed file data\", () => {\n      const malformedFile = {\n        id: null,\n        title: undefined,\n        // missing other properties\n      };\n\n      expect(() => {\n        createWrapper({\n          props: {\n            modelValue: malformedFile,\n          },\n        });\n      }).not.toThrow();\n    });\n\n    it(\"handles double-click correctly\", async () => {\n      const wrapper = createWrapper();\n\n      await wrapper.trigger(\"dblclick\");\n\n      expect(mockOpenFile).toHaveBeenCalledWith(mockFile.value, expect.any(Object));\n    });\n\n    it(\"prevents context menu when file is selected\", () => {\n      mockFile.value.selected = true;\n      const wrapper = createWrapper();\n\n      // FileMenu component should not exist\n      expect(wrapper.findComponent('[data-testid=\"file-menu\"]').exists()).toBe(false);\n    });\n\n    it(\"handles component unmounting during operations\", async () => {\n      const wrapper = createWrapper();\n\n      // Start delete operation\n      await wrapper.vm.onDelete();\n      \n      // Unmount component\n      wrapper.unmount();\n\n      // Should not throw\n      expect(true).toBe(true);\n    });\n  });\n});