import InputText from "./InputText.vue";

export default {
  title: "Forms/InputText",
  component: InputText,
  tags: ["autodocs"],
  argTypes: {
    modelValue: {
      control: "text",
      description: "The value of the input field (v-model).",
    },
    label: {
      control: "text",
      description: "Label text to display with the input field.",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "HTML input type attribute.",
    },
    direction: {
      control: "select",
      options: ["row", "column"],
      description: "Layout direction for label and input positioning.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when input is empty.",
    },
    "update:modelValue": { action: "update:modelValue" },
  },
  args: {
    modelValue: "",
    label: "Username",
    type: "text",
    direction: "row",
    placeholder: "Enter your username",
  },
};

export const Default = {};

export const EmailInput = {
  args: {
    label: "Email Address",
    type: "email",
    placeholder: "your.email@example.com",
  },
};

export const PasswordInput = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
};

export const ColumnLayout = {
  args: {
    label: "Description",
    direction: "column",
    placeholder: "Tell us about yourself",
  },
};

export const Disabled = {
  args: {
    label: "Disabled Input",
    modelValue: "Cannot type here",
    disabled: true,
  },
};

export const ReadOnly = {
  args: {
    label: "Read-Only Input",
    modelValue: "This is read-only",
    readonly: true,
  },
};

export const WithHtmlAttributes = {
  args: {
    label: "Min Length",
    type: "text",
    placeholder: "Min 5 chars",
    minlength: 5,
    required: true,
  },
};
