import Button from "./Button.vue";

export default {
  title: "Base/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    kind: { control: "select", options: ["primary", "secondary", "tertiary"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    icon: { control: "text" },
    text: { control: "text" },
    textFloat: { control: "select", options: ["", "bottom"] },
    disabled: { control: "boolean" },
    shadow: { control: "boolean" },
  },
};

export const Primary = {
  args: {
    kind: "primary",
    text: "Primary Button",
  },
};

export const Secondary = {
  args: {
    kind: "secondary",
    text: "Secondary Button",
  },
};

export const Tertiary = {
  args: {
    kind: "tertiary",
    text: "Tertiary Button",
  },
};

export const WithIcon = {
  args: {
    kind: "primary",
    text: "Button with Icon",
    icon: "Plus",
  },
};

export const IconOnly = {
  args: {
    kind: "tertiary",
    icon: "Settings",
  },
};

export const Disabled = {
  args: {
    kind: "primary",
    text: "Disabled Button",
    disabled: true,
  },
};
