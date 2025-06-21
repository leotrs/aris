import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FilesItem from "@/views/home/FilesItem.vue";

describe("FilesItem.vue - Delete Confirmation Modal Integration", () => {
  let mockFile;
  let mockFileStore;
  let mockProvides;
  let wrapper;

  beforeEach(() => {
    mockFile = ref({
      id: "test-file-1",
      title: "Test Document.txt",
      selected: false,
      focused: false,
      lastModified: new Date().toISOString(),
      tags: ["work", "important"],
    });

    mockFileStore = ref({
      createFile: vi.fn(),
      deleteFile: vi.fn().mockResolvedValue(true),
      updateFile: vi.fn(),
    });

    mockProvides = {
      fileStore: mockFileStore,
      xsMode: ref(false),
      user: ref({ id: "user-1" }),
      shouldShowColumn: vi.fn(() => true),
    };
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(FilesItem, {
      props: {
        modelValue: mockFile.value,
        mode: "list",
        ...props,
      },
      global: {
        provide: mockProvides,
        stubs: {
          FileMenu: {
            name: "FileMenu",
            template: '<div class="file-menu-stub" @click="$emit(\'delete\')">Delete</div>',
            emits: ["delete", "rename", "duplicate"],
          },
          ConfirmationModal: {
            name: "ConfirmationModal",
            template: `
              <div class="confirmation-modal-stub" v-if="show">
                <div class="modal-title">{{ title }}</div>
                <div class="modal-message">{{ message }}</div>
                <button class="confirm-btn" @click="$emit('confirm')">{{ confirmText }}</button>
                <button class="cancel-btn" @click="$emit('cancel')">{{ cancelText }}</button>
              </div>
            `,
            props: ["show", "title", "message", "confirmText", "cancelText", "variant", "fileData"],
            emits: ["confirm", "cancel", "close"],
            methods: {
              handleKeydown(event) {
                if (!this.show) return;
                if (event.key === "Escape") {
                  event.preventDefault();
                  this.$emit("cancel");
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  this.$emit("confirm");
                }
              },
              handleConfirm() {
                this.$emit("confirm");
              },
              handleCancel() {
                this.$emit("cancel");
              },
            },
          },
          FileTitle: {
            name: "FileTitle",
            template: '<div class="file-title-stub">{{ file.title }}</div>',
            props: ["file"],
            methods: { startEditing: vi.fn() },
          },
          TagRow: {
            name: "TagRow",
            template: '<div class="tag-row-stub"></div>',
            props: ["file"],
          },
          Date: {
            name: "Date",
            template: '<div class="date-stub"></div>',
            props: ["file"],
          },
        },
      },
    });
  };

  describe("confirmation modal state management", () => {
    it("does not show confirmation modal by default", () => {
      wrapper = createWrapper();

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("show")).toBe(false);
    });

    it("shows confirmation modal when delete is clicked", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("show")).toBe(true);
    });

    it("hides confirmation modal when cancel is clicked", async () => {
      wrapper = createWrapper();

      // Show modal first
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      // Then cancel
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      await modal.vm.$emit("cancel");

      expect(modal.props("show")).toBe(false);
    });

    it("hides confirmation modal when close is emitted", async () => {
      wrapper = createWrapper();

      // Show modal first
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      // Then close
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      await modal.vm.$emit("close");

      expect(modal.props("show")).toBe(false);
    });
  });

  describe("confirmation modal content", () => {
    it("displays correct title for file deletion", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("title")).toBe("Delete File?");
    });

    it("displays file-specific message with file name", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      const message = modal.props("message");
      expect(message).toContain("Test Document.txt");
      expect(message).toContain("cannot be undone");
    });

    it("uses appropriate button text for file deletion", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("confirmText")).toBe("Delete");
      expect(modal.props("cancelText")).toBe("Cancel");
    });

    it("uses danger variant for delete confirmation", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("variant")).toBe("danger");
    });
  });

  describe("deletion behavior", () => {
    it("does not delete file when cancel is clicked", async () => {
      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      // Cancel deletion
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      await modal.vm.$emit("cancel");

      // File should not be deleted
      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();
    });

    it("deletes file when confirm is clicked", async () => {
      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      // Confirm deletion
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      await modal.vm.$emit("confirm");

      // File should be deleted
      expect(mockFileStore.value.deleteFile).toHaveBeenCalledWith(mockFile.value);
    });

    it("hides modal after successful deletion", async () => {
      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      // Confirm deletion
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      await modal.vm.$emit("confirm");
      await nextTick();

      // Modal should be hidden
      expect(modal.props("show")).toBe(false);
    });

    it("keeps modal open if deletion fails", async () => {
      // Mock deletion failure
      mockFileStore.value.deleteFile.mockResolvedValue(false);

      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      // Confirm deletion
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      await modal.vm.$emit("confirm");
      await nextTick();

      // Modal should still be visible due to failure
      expect(modal.props("show")).toBe(true);
    });
  });

  describe("edge cases and error handling", () => {
    it("handles multiple rapid delete clicks gracefully", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });

      // Click delete multiple times rapidly
      await fileMenu.vm.$emit("delete");
      await fileMenu.vm.$emit("delete");
      await fileMenu.vm.$emit("delete");

      // Should only show one modal
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("show")).toBe(true);
    });

    it("handles confirm click while modal is closing", async () => {
      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });

      // Cancel the modal first (sets showDeleteModal to false)
      await modal.vm.$emit("cancel");
      await nextTick();

      // Now try to confirm - should not delete since modal was cancelled
      await modal.vm.$emit("confirm");
      await nextTick();

      // Should not delete file since modal was being cancelled
      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();
    });

    it("handles file with empty or undefined title", async () => {
      mockFile.value.title = "";
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      const message = modal.props("message");

      // Should handle empty title gracefully
      expect(message).toBeDefined();
      expect(message).toContain("this file");
    });

    it("handles deletion when file object is missing", async () => {
      wrapper = createWrapper({ modelValue: null });

      // The FileMenu should not be rendered when file is null
      // since the template checks v-if="!!file"
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      expect(fileMenu.exists()).toBe(false);

      // Modal should not be shown for null file
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("show")).toBe(false);

      // Directly test the onDelete handler with null file
      expect(wrapper.vm.onDelete).toBeDefined();
      wrapper.vm.onDelete(); // Should not crash and not show modal
      await nextTick();

      // Modal should still not be shown
      expect(modal.props("show")).toBe(false);
    });
  });

  describe("keyboard accessibility", () => {
    it("supports escape key to cancel deletion", async () => {
      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });

      // Test the modal's keyboard handler directly
      const escapeEvent = { key: "Escape", preventDefault: vi.fn() };
      modal.vm.handleKeydown(escapeEvent);
      await nextTick();

      expect(modal.props("show")).toBe(false);
    });

    it("supports enter key to confirm deletion", async () => {
      wrapper = createWrapper();

      // Show modal
      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });

      // Test the modal's keyboard handler directly
      const enterEvent = { key: "Enter", preventDefault: vi.fn() };
      modal.vm.handleKeydown(enterEvent);
      await nextTick();

      // Should confirm deletion
      expect(mockFileStore.value.deleteFile).toHaveBeenCalledWith(mockFile.value);
    });
  });

  describe("integration with existing FileMenu", () => {
    it("preserves existing FileMenu behavior", async () => {
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      expect(fileMenu.exists()).toBe(true);

      // FileMenu should still be functional
      await fileMenu.vm.$emit("delete");

      // Should show confirmation instead of immediate deletion
      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("show")).toBe(true);
      expect(mockFileStore.value.deleteFile).not.toHaveBeenCalled();
    });

    it("maintains backward compatibility with existing delete handler", async () => {
      wrapper = createWrapper();

      // The onDelete handler should now show confirmation modal
      // instead of immediately deleting
      expect(wrapper.vm.onDelete).toBeDefined();

      // Call the handler directly
      await wrapper.vm.onDelete();

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("show")).toBe(true);
    });
  });

  describe("file-specific scenarios", () => {
    it("handles files with special characters in title", async () => {
      mockFile.value.title = "Special File @#$%^&*().txt";
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      const message = modal.props("message");
      expect(message).toContain("Special File @#$%^&*().txt");
    });

    it("handles very long file titles", async () => {
      mockFile.value.title = "A".repeat(200) + ".txt";
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      expect(modal.props("message")).toBeDefined();
    });

    it("handles files without extensions", async () => {
      mockFile.value.title = "README";
      wrapper = createWrapper();

      const fileMenu = wrapper.findComponent({ name: "FileMenu" });
      await fileMenu.vm.$emit("delete");

      const modal = wrapper.findComponent({ name: "ConfirmationModal" });
      const message = modal.props("message");
      expect(message).toContain("README");
    });
  });
});
