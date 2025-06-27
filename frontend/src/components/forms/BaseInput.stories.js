import BaseInput from "./BaseInput.vue";
import Icon from "../base/Icon.vue";

export default {
  title: "Forms/BaseInput",
  component: BaseInput,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "text",
      description: "The value of the input field (v-model).",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field.",
    },
    direction: {
      control: "select",
      options: ["row", "column"],
      description: "Layout direction for label and input.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the input field.",
    },
    required: {
      control: "boolean",
      description: "Whether the input is required.",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled.",
    },
    readonly: {
      control: "boolean",
      description: "Whether the input is read-only.",
    },
    validator: {
      control: false,
      description: "Custom validation function.",
    },
    validateOnBlur: {
      control: "boolean",
      description: "Whether to validate the input on blur.",
    },
    variant: {
      control: "select",
      options: ["input", "search"],
      description: "Visual variant of the input (standard or search).",
    },
    withButtons: {
      control: "boolean",
      description: "For search variant: whether to show navigation buttons.",
    },
    showIcon: {
      control: "boolean",
      description: "For search variant: whether to show the search icon.",
    },
    buttonClose: {
      control: "boolean",
      description: "For search variant: whether to show a close button.",
    },
    buttonsDisabled: {
      control: "boolean",
      description: "For search variant: whether navigation buttons are disabled.",
    },
    id: {
      control: "text",
      description: "Custom ID for the input element.",
    },
    ariaLabel: {
      control: "text",
      description: "ARIA label for accessibility.",
    },
    ariaDescribedby: {
      control: "text",
      description: "ARIA describedby for accessibility.",
    },
    error: {
      control: "text",
      description: "External error message to display.",
    },
    label: {
      control: "text",
      description: "Label text for the input.",
    },
    // Events
    "update:modelValue": { action: "update:modelValue" },
    focus: { action: "focus" },
    blur: { action: "blur" },
    validation: { action: "validation" },
    submit: { action: "submit" },
    next: { action: "next" },
    prev: { action: "prev" },
    cancel: { action: "cancel" },
  },
  args: {
    modelValue: "",
    placeholder: "Enter text...",
    direction: "row",
    size: "md",
    required: false,
    disabled: false,
    readonly: false,
    validateOnBlur: false,
    variant: "input",
    withButtons: false,
    showIcon: false,
    buttonClose: false,
    buttonsDisabled: false,
    label: "",
    error: "",
  },
};

export const Default = {
  args: {
    label: "Name",
    placeholder: "Your name",
  },
};

export const WithLabelColumn = {
  args: {
    label: "Description",
    placeholder: "Tell us about yourself",
    direction: "column",
  },
};

export const SearchVariant = {
  args: {
    variant: "search",
    placeholder: "Search...",
    showIcon: true,
    withButtons: true,
    buttonClose: true,
  },
  render: (args) => ({
    components: { BaseInput, Icon },
    setup() {
      return { args };
    },
    template: `
      <BaseInput v-bind="args">
        <template #search-buttons="{ handlePrev, handleNext }">
          <button @click="handlePrev">Prev</button>
          <button @click="handleNext">Next</button>
        </template>
      </BaseInput>
    `,
  }),
};

export const WithError = {
  args: {
    label: "Email",
    modelValue: "invalid-email",
    error: "Please enter a valid email address.",
  },
};

export const Disabled = {
  args: {
    label: "Disabled Field",
    modelValue: "Cannot edit",
    disabled: true,
  },
};

export const ReadOnly = {
  args: {
    label: "Readonly Field",
    modelValue: "This is read-only",
    readonly: true,
  },
};

export const WithPrependAppend = {
  args: {
    label: "Amount",
    modelValue: "100",
  },
  render: (args) => ({
    components: { BaseInput, Icon },
    setup() {
      return { args };
    },
    template: `
      <BaseInput v-bind="args">
        <template #prepend><Icon name="CurrencyDollar" /></template>
        <template #append><span>.00</span></template>
      </BaseInput>
    `,
  }),
};
