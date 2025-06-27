import ButtonDots from "./ButtonDots.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "Base/ButtonDots",
  component: ButtonDots,
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: "boolean",
      description: "Controls the active state of the button.",
    },
    hoverColor: {
      control: "color",
      description: "Custom color for the hover state.",
    },
    activeColor: {
      control: "color",
      description: "Custom color for the active state.",
    },
    on: { action: "on" },
    off: { action: "off" },
  },
  args: {
    active: false,
    hoverColor: "var(--surface-hint)",
    activeColor: "var(--surface-hint)",
  },
};

export const Default = {};

export const Active = {
  args: {
    active: true,
  },
};

export const CustomColors = {
  args: {
    hoverColor: "#FFD700",
    activeColor: "#FF4500",
  },
};

export const EventHandling = {
  args: {
    on: action("button-on"),
    off: action("button-off"),
  },
};
