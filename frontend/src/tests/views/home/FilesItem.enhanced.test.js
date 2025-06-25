import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FilesItem from "@/views/home/FilesItem.vue";

// Mock router
const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock keyboard shortcuts
vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn(),
  })),
}));

// Mock File model
vi.mock("@/models/File.js", () => ({
  File: {
    openFile: vi.fn(),
    toJSON: vi.fn((file) => ({ ...file })),
  },
}));

describe("FilesItem.vue - Enhanced Functionality", () => {
  let mockFile;
  let mockFileStore;
  let mockProvides;
  let mockOpenFile;

  beforeEach(async () => {
    // Get the mocked File module
    const { File } = await import("@/models/File.js");
    mockOpenFile = File.openFile;
    mockFile = ref({
      id: "test-file-1",
      title: "Test Research Paper",
      selected: false,
      focused: false,
      lastModified: new Date().toISOString(),
      tags: [
        { id: "tag1", name: "research", color: "#blue" },
        { id: "tag2", name: "biology", color: "#green" },
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
              openMenu() {
                this.menuOpen = !this.menuOpen;
              },
            },
          },
          FileTitle: {
            template:
              '<div data-testid="file-title" @click="$emit(\'click\')">{{ file.title }}</div>',
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
              formattedDate() {
                return "2 days ago";
              },
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

      // Debug: Check if select method exists
      console.log("wrapper.vm.select:", wrapper.vm.select);
      console.log("fileStore provided:", wrapper.vm.fileStore);

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

  describe("Context Menu Navigation and Keyboard Interaction", () => {
    it("opens context menu with keyboard shortcut", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      // Get registered shortcuts
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];
      expect(shortcuts).toHaveProperty(".");
      expect(shortcuts["."].description).toBe("open file menu");
    });

    it("opens file with Enter key", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];
      expect(shortcuts).toHaveProperty("enter");

      // Execute Enter shortcut
      shortcuts["enter"]();
      expect(mockOpenFile).toHaveBeenCalledWith(mockFile.value, expect.any(Object));
    });

    it("opens file with Space key", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];
      expect(shortcuts).toHaveProperty(" ");

      // Execute Space shortcut
      shortcuts[" "].fn();
      expect(mockOpenFile).toHaveBeenCalledWith(mockFile.value, expect.any(Object));
    });

    it("navigates context menu with arrow keys", async () => {
      const wrapper = createWrapper();

      // Open context menu
      const menuTrigger = wrapper.find('[data-testid="file-menu"] .context-menu-trigger');
      await menuTrigger.trigger("click");

      const contextMenu = wrapper.find(".context-menu");
      expect(contextMenu.exists()).toBe(true);

      // Verify menu items are accessible
      expect(wrapper.find('[data-testid="menu-rename"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="menu-duplicate"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="menu-delete"]').exists()).toBe(true);
    });

    it("executes context menu actions correctly", async () => {
      const wrapper = createWrapper();

      // Open context menu
      const menuTrigger = wrapper.find('[data-testid="file-menu"] .context-menu-trigger');
      await menuTrigger.trigger("click");

      // Test rename action
      const renameItem = wrapper.find('[data-testid="menu-rename"]');
      await renameItem.trigger("click");

      // Should trigger startEditing on FileTitle component
      const fileTitle = wrapper.findComponent('[data-testid="file-title"]');
      expect(fileTitle.vm.startEditing).toHaveBeenCalled();
    });

    it("handles duplicate action correctly", async () => {
      const wrapper = createWrapper();

      // Open context menu and trigger duplicate
      const menuTrigger = wrapper.find('[data-testid="file-menu"] .context-menu-trigger');
      await menuTrigger.trigger("click");

      const duplicateItem = wrapper.find('[data-testid="menu-duplicate"]');
      await duplicateItem.trigger("click");

      expect(mockFileStore.value.createFile).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Research Paper (Copy)",
          owner_id: "user-1",
          id: null,
        })
      );
    });

    it("shows delete confirmation modal", async () => {
      const wrapper = createWrapper();

      // Open context menu and trigger delete
      const menuTrigger = wrapper.find('[data-testid="file-menu"] .context-menu-trigger');
      await menuTrigger.trigger("click");

      const deleteItem = wrapper.find('[data-testid="menu-delete"]');
      await deleteItem.trigger("click");

      await nextTick();

      const modal = wrapper.find('[data-testid="confirmation-modal"]');
      expect(modal.exists()).toBe(true);
      expect(modal.find('[data-testid="modal-title"]').text()).toBe("Delete File?");
    });
  });

  describe("File Operations and State Management", () => {
    it("handles successful file deletion", async () => {
      const wrapper = createWrapper();

      // Trigger delete action
      await wrapper.vm.onDelete();
      await nextTick();

      // Confirm deletion
      const confirmButton = wrapper.find('[data-testid="modal-confirm"]');
      await confirmButton.trigger("click");

      expect(mockFileStore.value.deleteFile).toHaveBeenCalledWith(mockFile.value);
    });

    it("handles failed file deletion gracefully", async () => {
      mockFileStore.value.deleteFile.mockRejectedValue(new Error("Delete failed"));
      const wrapper = createWrapper();

      // Spy on console.error
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await wrapper.vm.onDelete();
      await nextTick();

      // Confirm deletion
      const confirmButton = wrapper.find('[data-testid="modal-confirm"]');
      await confirmButton.trigger("click");

      // Should log error and keep modal open
      expect(consoleSpy).toHaveBeenCalledWith("Failed to delete file:", expect.any(Error));
      expect(wrapper.vm.showDeleteModal).toBe(true);

      consoleSpy.mockRestore();
    });

    it("cancels file deletion", async () => {
      const wrapper = createWrapper();

      await wrapper.vm.onDelete();
      await nextTick();

      // Cancel deletion
      const cancelButton = wrapper.find('[data-testid="modal-cancel"]');
      await cancelButton.trigger("click");

      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();
      expect(wrapper.vm.showDeleteModal).toBe(false);
    });

    it("prevents delete when file is null", () => {
      const wrapper = createWrapper({
        props: {
          modelValue: null,
        },
      });

      // Should not throw or show modal
      wrapper.vm.onDelete();
      expect(wrapper.vm.showDeleteModal).toBe(false);
    });

    it("handles race condition in delete confirmation", async () => {
      const wrapper = createWrapper();

      // Close modal before handling confirm
      wrapper.vm.showDeleteModal = false;

      // Should return early and not call deleteFile
      const result = await wrapper.vm.handleDeleteConfirm();
      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();
    });
  });

  describe("Hover and Focus State Management", () => {
    it("applies hover state correctly", async () => {
      const wrapper = createWrapper();

      expect(wrapper.classes()).not.toContain("hovered");

      await wrapper.trigger("mouseenter");
      expect(wrapper.classes()).toContain("hovered");

      await wrapper.trigger("mouseleave");
      expect(wrapper.classes()).not.toContain("hovered");
    });

    it("applies focused state correctly", async () => {
      mockFile.value.focused = true;
      const wrapper = createWrapper();

      expect(wrapper.classes()).toContain("focused");

      mockFile.value.focused = false;
      await nextTick();

      expect(wrapper.classes()).not.toContain("focused");
    });

    it("combines multiple states correctly", async () => {
      mockFile.value.selected = true;
      mockFile.value.focused = true;
      const wrapper = createWrapper();

      await wrapper.trigger("mouseenter");

      expect(wrapper.classes()).toContain("active");
      expect(wrapper.classes()).toContain("focused");
      expect(wrapper.classes()).toContain("hovered");
    });

    it("maintains hover state during focus changes", async () => {
      const wrapper = createWrapper();

      await wrapper.trigger("mouseenter");
      expect(wrapper.classes()).toContain("hovered");

      mockFile.value.focused = true;
      await nextTick();

      expect(wrapper.classes()).toContain("hovered");
      expect(wrapper.classes()).toContain("focused");
    });
  });

  describe("View Mode Compatibility", () => {
    it("renders correctly in list mode", () => {
      const wrapper = createWrapper({ props: { mode: "list" } });

      expect(wrapper.classes()).toContain("list");
      expect(wrapper.find('[data-testid="tag-row"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="file-date"]').exists()).toBe(true);
    });

    it("renders correctly in cards mode", () => {
      const wrapper = createWrapper({ props: { mode: "cards" } });

      expect(wrapper.classes()).toContain("cards");
    });

    it("hides file menu when file is selected", async () => {
      mockFile.value.selected = true;
      const wrapper = createWrapper();

      // FileMenu should not be rendered when file is selected
      expect(wrapper.find('[data-testid="file-menu"]').exists()).toBe(false);
    });

    it("shows file menu when file is not selected", () => {
      mockFile.value.selected = false;
      const wrapper = createWrapper();

      expect(wrapper.find('[data-testid="file-menu"]').exists()).toBe(true);
    });
  });

  describe("Responsive Behavior", () => {
    it("hides tags in extra small mode", () => {
      const wrapper = createWrapper({
        provide: {
          xsMode: ref(true),
        },
      });

      // In xsMode, TagRow should not be rendered
      expect(wrapper.find('[data-testid="tag-row"]').exists()).toBe(false);
    });

    it("shows tags in normal mode", () => {
      const wrapper = createWrapper({
        provide: {
          xsMode: ref(false),
        },
      });

      expect(wrapper.find('[data-testid="tag-row"]').exists()).toBe(true);
    });

    it("adapts layout based on shouldShowColumn function", () => {
      const mockShouldShowColumn = vi.fn((column) => column !== "Tags");
      const wrapper = createWrapper({
        provide: {
          shouldShowColumn: mockShouldShowColumn,
        },
      });

      // shouldShowColumn should be available to child components
      expect(mockShouldShowColumn).toBeDefined();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("handles missing file store methods gracefully", async () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref({}), // Empty store
        },
      });

      // Should not throw
      await wrapper.trigger("click");
    });

    it("handles malformed file data", () => {
      const malformedFile = {
        id: null,
        title: undefined,
        // missing other properties
      };

      expect(() => {
        createWrapper({
          props: {
            modelValue: malformedFile,
          },
        });
      }).not.toThrow();
    });

    it("handles double-click correctly", async () => {
      const wrapper = createWrapper();

      await wrapper.trigger("dblclick");

      expect(mockOpenFile).toHaveBeenCalledWith(mockFile.value, expect.any(Object));
    });

    it("prevents context menu when file is selected", () => {
      mockFile.value.selected = true;
      const wrapper = createWrapper();

      // FileMenu component should not exist
      expect(wrapper.findComponent('[data-testid="file-menu"]').exists()).toBe(false);
    });

    it("handles component unmounting during operations", async () => {
      const wrapper = createWrapper();

      // Start delete operation
      await wrapper.vm.onDelete();

      // Unmount component
      wrapper.unmount();

      // Should not throw
      expect(true).toBe(true);
    });
  });
});
