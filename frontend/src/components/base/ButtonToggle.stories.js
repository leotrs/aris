import ButtonToggle from "./ButtonToggle.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "Base/ButtonToggle",
  component: ButtonToggle,
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Text content for the button.",
    },
    icon: {
      control: "text",
      description: "Icon name from Tabler Icons to display.",
    },
    iconClass: {
      control: "text",
      description: "Additional CSS classes for the icon.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button.",
    },
    hoverColor: {
      control: "color",
      description: "Custom color for the hover state.",
    },
    activeColor: {
      control: "color",
      description: "Custom color for the active state.",
    },
    type: {
      control: "select",
      options: ["filled", "outline"],
      description: "Type of button styling.",
    },
    active: {
      control: "boolean",
      description: "Controls the active state of the button (v-model).",
    },
    on: { action: action("on") },
    off: { action: action("off") },
  },
  args: {
    text: "Toggle",
    icon: "",
    iconClass: "",
    size: "md",
    hoverColor: "var(--gray-50)",
    activeColor: "blue",
    type: "filled",
    active: false,
  },
};

export const Default = {};

export const WithIcon = {
  args: {
    icon: "Star",
  },
};

export const Small = {
  args: {
    size: "sm",
    icon: "Plus",
  },
};

export const Large = {
  args: {
    size: "lg",
    icon: "Settings",
  },
};

export const Outline = {
  args: {
    type: "outline",
    activeColor: "purple",
  },
};

export const CustomColors = {
  args: {
    activeColor: "green",
    hoverColor: "var(--green-100)",
  },
};

export const IconOnly = {
  args: {
    text: "",
    icon: "Heart",
  },
};

export const CustomContent = {
  args: {
    text: "",
    icon: "",
  },
  render: (args) => ({
    components: { ButtonToggle },
    setup() {
      return { args };
    },
    template: '<ButtonToggle v-bind="args"><span>Custom Slot Content</span></ButtonToggle>',
  }),
};
