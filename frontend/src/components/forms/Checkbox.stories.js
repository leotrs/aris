import Checkbox from "./Checkbox.vue";

export default {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The text label for the checkbox.",
    },
    icon: {
      control: "text",
      description: "Optional icon name to display next to the checkbox.",
    },
    active: {
      control: "boolean",
      description: "Controls the checked state of the checkbox (v-model).",
    },
    "update:active": { action: "update:active" },
  },
  args: {
    text: "Enable Feature",
    icon: "",
    active: false,
  },
};

export const Default = {};

export const Checked = {
  args: {
    active: true,
  },
};

export const WithIcon = {
  args: {
    text: "Accept Terms",
    icon: "Check",
  },
};

export const CheckedWithIcon = {
  args: {
    text: "Remember Me",
    icon: "Lock",
    active: true,
  },
};

export const LongText = {
  args: {
    text: "This is a very long text label for the checkbox to demonstrate how it handles wrapping.",
  },
};
