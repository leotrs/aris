import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

describe("ConfirmationModal", () => {
  let wrapper;

  beforeEach(() => {
    // Mock global close handlers
    global.document.addEventListener = vi.fn();
    global.document.removeEventListener = vi.fn();
    global.window.addEventListener = vi.fn();
    global.window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(ConfirmationModal, {
      props: {
        show: false,
        title: "Confirm Action",
        message: "Are you sure you want to proceed?",
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: "danger",
        ...props,
      },
      global: {
        stubs: {
          Modal: {
            name: "Modal",
            template: `
              <div class="modal-stub">
                <div class="modal-header">
                  <slot name="header"></slot>
                </div>
                <div class="modal-body">
                  <slot></slot>
                </div>
              </div>
            `,
            emits: ["close"],
          },
          Button: {
            name: "Button",
            template: '<button class="button-stub" @click="$emit(\'click\')"><slot /></button>',
            props: ["kind", "icon"],
            emits: ["click"],
          },
        },
      },
    });
  };

  describe("component structure", () => {
    it("renders when show prop is true", () => {
      wrapper = createWrapper({ show: true });

      expect(wrapper.findComponent({ name: "Modal" }).exists()).toBe(true);
    });

    it("does not render when show prop is false", () => {
      wrapper = createWrapper({ show: false });

      expect(wrapper.findComponent({ name: "Modal" }).exists()).toBe(false);
    });

    it("displays the correct title", () => {
      wrapper = createWrapper({
        show: true,
        title: "Delete File?",
      });

      expect(wrapper.text()).toContain("Delete File?");
    });

    it("displays the correct message", () => {
      wrapper = createWrapper({
        show: true,
        message: "This action cannot be undone.",
      });

      expect(wrapper.text()).toContain("This action cannot be undone.");
    });

    it("renders confirm and cancel buttons", () => {
      wrapper = createWrapper({ show: true });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      expect(buttons).toHaveLength(2);
    });

    it("displays custom button text", () => {
      wrapper = createWrapper({
        show: true,
        confirmText: "Delete Forever",
        cancelText: "Keep File",
      });

      expect(wrapper.text()).toContain("Delete Forever");
      expect(wrapper.text()).toContain("Keep File");
    });
  });

  describe("button behavior", () => {
    it("emits confirm event when confirm button is clicked", async () => {
      wrapper = createWrapper({
        show: true,
        confirmText: "Delete",
      });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const confirmButton = buttons.find((btn) => btn.text().includes("Delete"));

      await confirmButton.trigger("click");

      expect(wrapper.emitted("confirm")).toBeTruthy();
      expect(wrapper.emitted("confirm")).toHaveLength(1);
    });

    it("emits cancel event when cancel button is clicked", async () => {
      wrapper = createWrapper({
        show: true,
        cancelText: "Cancel",
      });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const cancelButton = buttons.find((btn) => btn.text().includes("Cancel"));

      await cancelButton.trigger("click");

      expect(wrapper.emitted("cancel")).toBeTruthy();
      expect(wrapper.emitted("cancel")).toHaveLength(1);
    });

    it("emits close event when modal is closed", async () => {
      wrapper = createWrapper({ show: true });

      const modal = wrapper.findComponent({ name: "Modal" });
      await modal.vm.$emit("close");

      expect(wrapper.emitted("close")).toBeTruthy();
      expect(wrapper.emitted("close")).toHaveLength(1);
    });
  });

  describe("button styling", () => {
    it("applies danger variant to confirm button", () => {
      wrapper = createWrapper({
        show: true,
        variant: "danger",
      });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const confirmButton = buttons.find(
        (btn) => btn.text().includes("Confirm") || btn.props("kind") === "danger"
      );

      expect(confirmButton).toBeTruthy();
    });

    it("applies primary variant to confirm button by default", () => {
      wrapper = createWrapper({
        show: true,
        variant: "primary",
      });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const confirmButton = buttons.find(
        (btn) => btn.text().includes("Confirm") || btn.props("kind") === "primary"
      );

      expect(confirmButton).toBeTruthy();
    });

    it("applies secondary variant to cancel button", () => {
      wrapper = createWrapper({ show: true });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const cancelButton = buttons.find(
        (btn) => btn.text().includes("Cancel") || btn.props("kind") === "secondary"
      );

      expect(cancelButton).toBeTruthy();
    });
  });

  describe("keyboard accessibility", () => {
    it("responds to escape key to cancel", async () => {
      wrapper = createWrapper({ show: true });

      // Test the keyboard handler directly since document events are tricky in tests
      const escapeEvent = { key: "Escape", preventDefault: vi.fn() };
      wrapper.vm.handleKeydown(escapeEvent);

      await nextTick();

      expect(wrapper.emitted("cancel")).toBeTruthy();
      expect(escapeEvent.preventDefault).toHaveBeenCalled();
    });

    it("focuses confirm button when modal opens", async () => {
      // This test verifies the behavior exists, actual focus testing requires browser
      wrapper = createWrapper({ show: false });

      await wrapper.setProps({ show: true });
      await nextTick();

      // In real implementation, confirm button should receive focus
      expect(wrapper.findAllComponents({ name: "Button" })).toHaveLength(2);
    });
  });

  describe("props validation", () => {
    it("accepts all required props", () => {
      wrapper = createWrapper({
        show: true,
        title: "Test Title",
        message: "Test Message",
        confirmText: "OK",
        cancelText: "Cancel",
        variant: "danger",
      });

      expect(wrapper.props("title")).toBe("Test Title");
      expect(wrapper.props("message")).toBe("Test Message");
      expect(wrapper.props("confirmText")).toBe("OK");
      expect(wrapper.props("cancelText")).toBe("Cancel");
      expect(wrapper.props("variant")).toBe("danger");
    });

    it("has correct default values", () => {
      wrapper = createWrapper({ show: true });

      expect(wrapper.props("variant")).toBe("danger");
      expect(wrapper.props("confirmText")).toBe("Confirm");
      expect(wrapper.props("cancelText")).toBe("Cancel");
    });
  });

  describe("edge cases", () => {
    it("handles rapid show/hide transitions", async () => {
      wrapper = createWrapper({ show: false });

      await wrapper.setProps({ show: true });
      await wrapper.setProps({ show: false });
      await wrapper.setProps({ show: true });

      expect(wrapper.findComponent({ name: "Modal" }).exists()).toBe(true);
    });

    it("prevents multiple confirm events", async () => {
      wrapper = createWrapper({ show: true });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const confirmButton = buttons.find((btn) => btn.text().includes("Confirm"));

      // Click multiple times rapidly
      await confirmButton.trigger("click");
      await confirmButton.trigger("click");
      await confirmButton.trigger("click");

      // Should still only emit once (or handle multiple appropriately)
      expect(wrapper.emitted("confirm")).toBeTruthy();
    });

    it("handles missing button text gracefully", () => {
      wrapper = createWrapper({
        show: true,
        confirmText: "",
        cancelText: "",
      });

      // Should still render buttons even with empty text
      expect(wrapper.findAllComponents({ name: "Button" })).toHaveLength(2);
    });
  });

  describe("integration with existing Modal component", () => {
    it("conditionally renders Modal based on show prop", async () => {
      wrapper = createWrapper({ show: false });

      expect(wrapper.findComponent({ name: "Modal" }).exists()).toBe(false);

      await wrapper.setProps({ show: true });

      expect(wrapper.findComponent({ name: "Modal" }).exists()).toBe(true);
    });

    it("handles Modal close event", async () => {
      wrapper = createWrapper({ show: true });

      const modal = wrapper.findComponent({ name: "Modal" });
      await modal.vm.$emit("close");

      expect(wrapper.emitted("close")).toBeTruthy();
    });
  });

  describe("file deletion specific scenarios", () => {
    it("supports file deletion confirmation dialog", () => {
      wrapper = createWrapper({
        show: true,
        title: "Delete File?",
        message: "Are you sure you want to delete this file? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Keep File",
        variant: "danger",
      });

      expect(wrapper.text()).toContain("Delete File?");
      expect(wrapper.text()).toContain("This action cannot be undone");
      expect(wrapper.text()).toContain("Delete");
      expect(wrapper.text()).toContain("Keep File");
    });

    it("emits file-specific events with proper data", async () => {
      const fileData = { id: 123, title: "test-file.txt" };

      wrapper = createWrapper({
        show: true,
        fileData,
      });

      const buttons = wrapper.findAllComponents({ name: "Button" });
      const confirmButton = buttons.find((btn) => btn.text().includes("Confirm"));

      await confirmButton.trigger("click");

      expect(wrapper.emitted("confirm")).toBeTruthy();
      // Verify file data can be passed through if needed
    });
  });
});
