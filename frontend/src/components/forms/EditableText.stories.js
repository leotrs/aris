import EditableText from "./EditableText.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "Forms/EditableText",
  component: EditableText,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "text",
      description: "The text content of the editable field (v-model).",
    },
    inputClass: {
      control: "text",
      description: "CSS classes to apply to the input field when editing.",
    },
    textClass: {
      control: "text",
      description: "CSS classes to apply to the text display when not editing.",
    },
    editOnClick: {
      control: "boolean",
      description: "Whether clicking the text should activate edit mode.",
    },
    clearOnStart: {
      control: "boolean",
      description: "Whether to clear the input field when editing starts.",
    },
    preserveWidth: {
      control: "boolean",
      description: "Whether to preserve and dynamically adjust the input width during editing.",
    },
    onSave: { action: "save" },
    onCancel: { action: "cancel" },
  },
  args: {
    modelValue: "Click to edit this text",
    inputClass: "",
    textClass: "",
    editOnClick: true,
    clearOnStart: false,
    preserveWidth: false,
  },
};

export const Default = {};

export const InitialText = {
  args: {
    modelValue: "This is some initial text.",
  },
};

export const CustomStyling = {
  args: {
    modelValue: "Styled Text",
    textClass: "text-lg font-semibold text-blue-600",
    inputClass: "border-2 border-purple-500 rounded-md px-2 py-1",
  },
};

export const NoClickToEdit = {
  args: {
    modelValue: "Programmatic Edit Only",
    editOnClick: false,
  },
  play: async ({ canvasElement }) => {
    const editableText = canvasElement.querySelector(".editable");
    if (editableText) {
      // Simulate programmatic activation (if component exposes startEditing)
      // This requires a ref to the component, which is hard in Storybook play function
      // For manual testing, you'd interact with the component's exposed method.
      console.log("Clicking this text will not activate edit mode.");
    }
  },
};

export const ClearOnStart = {
  args: {
    modelValue: "Text will be cleared on edit",
    clearOnStart: true,
  },
};

export const PreserveWidth = {
  args: {
    modelValue: "Short text",
    preserveWidth: true,
  },
};

export const LongText = {
  args: {
    modelValue:
      "This is a very long piece of text that should wrap within the container and still be editable inline.",
    preserveWidth: false,
  },
};

export const EventHandling = {
  args: {
    onSave: action("text-saved"),
    onCancel: action("text-cancelled"),
  },
};
