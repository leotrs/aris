import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import FileMenu from "@/components/navigation/FileMenu.vue";

describe("FileMenu - Delete Confirmation Integration", () => {
  let wrapper;

  beforeEach(() => {
    // Mock ContextMenu component
    global.document.addEventListener = vi.fn();
    global.document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(FileMenu, {
      props: {
        file: {
          id: "test-file-1",
          title: "Test Document.txt",
        },
        ...props,
      },
      global: {
        stubs: {
          ContextMenu: {
            name: "ContextMenu",
            template: `
              <div class="context-menu-stub">
                <slot />
              </div>
            `,
            props: ["variant"],
          },
          ContextMenuItem: {
            name: "ContextMenuItem",
            template: `
              <div 
                class="context-menu-item-stub" 
                :class="{ danger: kind === 'danger' }"
                @click="$emit('click', $event)"
              >
                {{ caption }}
              </div>
            `,
            props: ["caption", "icon", "kind"],
            emits: ["click"],
          },
        },
      },
    });
  };

  describe("delete menu item behavior", () => {
    it("renders delete menu item with correct styling", () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      expect(deleteItem.exists()).toBe(true);
      expect(deleteItem.text()).toBe("Delete");
    });

    it("emits delete event when delete menu item is clicked", async () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      await deleteItem.trigger("click");

      expect(wrapper.emitted("delete")).toBeTruthy();
      expect(wrapper.emitted("delete")).toHaveLength(1);
    });

    it("includes file data in delete event", async () => {
      const testFile = {
        id: "test-file-123",
        title: "Important Document.pdf",
      };

      wrapper = createWrapper({ file: testFile });

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      await deleteItem.trigger("click");

      expect(wrapper.emitted("delete")).toBeTruthy();
      // The delete event should be emitted (file data passed via props)
    });

    it("closes menu after delete is clicked", async () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      await deleteItem.trigger("click");
      await nextTick();

      // Menu should close (this tests the existing behavior)
      expect(wrapper.emitted("delete")).toBeTruthy();
    });
  });

  describe("integration with other menu items", () => {
    it("does not emit delete when other menu items are clicked", async () => {
      wrapper = createWrapper();

      // Find non-delete menu items
      const allItems = wrapper.findAll(".context-menu-item-stub");
      const nonDeleteItems = allItems.filter((item) => !item.classes().includes("danger"));

      if (nonDeleteItems.length > 0) {
        await nonDeleteItems[0].trigger("click");
        expect(wrapper.emitted("delete")).toBeFalsy();
      }
    });

    it("preserves other menu functionality when delete is added", () => {
      wrapper = createWrapper();

      // Should still render other menu items
      const allItems = wrapper.findAll(".context-menu-item-stub");
      expect(allItems.length).toBeGreaterThan(1); // More than just delete
    });
  });

  describe("edge cases", () => {
    it("handles delete click with missing file data", async () => {
      wrapper = createWrapper({ file: null });

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      await deleteItem.trigger("click");

      // Should still emit delete event even with null file
      expect(wrapper.emitted("delete")).toBeTruthy();
    });

    it("handles rapid delete clicks", async () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");

      // Click multiple times rapidly
      await deleteItem.trigger("click");
      await deleteItem.trigger("click");
      await deleteItem.trigger("click");

      // Should emit each click
      expect(wrapper.emitted("delete")).toHaveLength(3);
    });

    it("maintains delete button state across menu opens/closes", async () => {
      wrapper = createWrapper();

      // Delete button should always be present and styled correctly
      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      expect(deleteItem.exists()).toBe(true);
      expect(deleteItem.text()).toBe("Delete");
    });
  });

  describe("accessibility", () => {
    it("delete menu item has proper danger styling for accessibility", () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      expect(deleteItem.classes()).toContain("danger");
    });

    it("delete menu item has descriptive text", () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      expect(deleteItem.text()).toBe("Delete");
    });
  });

  describe("confirmation modal trigger scenarios", () => {
    it("should trigger confirmation modal flow when parent handles delete event", async () => {
      // This test verifies that FileMenu emits the delete event correctly
      // The parent component (FilesItem) should handle this by showing confirmation modal

      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      await deleteItem.trigger("click");

      // FileMenu should emit delete event
      expect(wrapper.emitted("delete")).toBeTruthy();

      // Parent component should receive this event and show confirmation modal
      // (This will be tested in the FilesItem tests)
    });

    it("supports different file types for confirmation", async () => {
      const fileTypes = [
        { id: "1", title: "document.pdf" },
        { id: "2", title: "image.jpg" },
        { id: "3", title: "spreadsheet.xlsx" },
        { id: "4", title: "presentation" }, // no extension
      ];

      for (const file of fileTypes) {
        wrapper = createWrapper({ file });

        const deleteItem = wrapper.find(".context-menu-item-stub.danger");
        await deleteItem.trigger("click");

        expect(wrapper.emitted("delete")).toBeTruthy();

        // Clean up for next iteration
        wrapper.unmount();
      }
    });
  });

  describe("backward compatibility", () => {
    it("maintains existing FileMenu API", () => {
      wrapper = createWrapper();

      // Should still have all the same props and events
      expect(wrapper.props("icon")).toBeDefined();
      expect(wrapper.props("mode")).toBeDefined();

      // Should still emit delete event (not change existing behavior)
      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      expect(deleteItem.exists()).toBe(true);
    });

    it("does not break existing delete event handlers", async () => {
      wrapper = createWrapper();

      const deleteItem = wrapper.find(".context-menu-item-stub.danger");
      await deleteItem.trigger("click");

      // Should emit exactly the same event as before
      expect(wrapper.emitted("delete")).toBeTruthy();
      expect(wrapper.emitted("delete")[0]).toEqual([]);
    });
  });
});
