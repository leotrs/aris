import ConfirmationModal from "./ConfirmationModal.vue";
// eslint-disable-next-line no-unused-vars
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/ConfirmationModal",
  component: ConfirmationModal,
  tags: ["autodocs"],
  argTypes: {
    show: {
      control: "boolean",
      description: "Whether the modal is visible",
    },
    title: {
      control: "text",
      description: "The modal title",
    },
    message: {
      control: "text",
      description: "The confirmation message",
    },
    confirmText: {
      control: "text",
      description: "Text for the confirm button",
    },
    cancelText: {
      control: "text",
      description: "Text for the cancel button",
    },
    confirmBtnClass: {
      control: "select",
      options: ["primary", "danger", "warning"],
      description: "The visual variant for the confirm button",
    },
    fileData: {
      control: "object",
      description: "Optional file data to pass through events",
    },
    onConfirm: { action: "confirm" },
    onCancel: { action: "cancel" },
    onClose: { action: "close" },
  },
  args: {
    show: true,
    title: "Confirm Action",
    message: "Are you sure you want to perform this action?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmBtnClass: "danger",
    fileData: null,
  },
};

export const Default = {};

export const DeleteConfirmation = {
  args: {
    title: "Delete File?",
    message: "Are you sure you want to delete this file? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmBtnClass: "danger",
  },
};

export const PublishConfirmation = {
  args: {
    title: "Publish Changes?",
    message: "This will make your changes visible to everyone.",
    confirmText: "Publish",
    cancelText: "Keep Draft",
    confirmBtnClass: "primary",
  },
};

export const WarningAction = {
  args: {
    title: "Unsaved Changes",
    message: "You have unsaved changes. Do you want to discard them?",
    confirmText: "Discard",
    cancelText: "Keep Editing",
    confirmBtnClass: "warning",
  },
};

export const WithFileData = {
  args: {
    title: "Delete Document?",
    message: 'Are you sure you want to delete "Research Paper.docx"?',
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmBtnClass: "danger",
    fileData: {
      id: 123,
      name: "Research Paper.docx",
      type: "document",
    },
  },
};

export const LongMessage = {
  args: {
    title: "Important Notice",
    message:
      "This action will permanently delete all selected files and folders, including any nested content. All associated metadata, comments, and version history will also be removed. This operation cannot be undone and may affect other users who have access to these files.",
    confirmText: "I Understand, Delete",
    cancelText: "Cancel",
    confirmBtnClass: "danger",
  },
};

export const Hidden = {
  args: {
    show: false,
    title: "Hidden Modal",
    message: "This modal is not visible.",
  },
};

// Interactive story demonstrating keyboard shortcuts
export const KeyboardShortcuts = {
  args: {
    title: "Keyboard Navigation",
    message: "Try pressing Enter to confirm or Escape to cancel.",
    confirmText: "Confirm (Enter)",
    cancelText: "Cancel (Esc)",
    confirmBtnClass: "primary",
  },
  parameters: {
    docs: {
      description: {
        story: "This modal supports keyboard navigation: Enter to confirm, Escape to cancel.",
      },
    },
  },
};
