import ColorPicker from "./ColorPicker.vue";
import { action } from "@storybook/addon-actions";

const defaultColors = {
  red: "#EF4444",
  purple: "#8B5CF6",
  green: "#22C55E",
  orange: "#F97316",
  blue: "#3B82F6",
  yellow: "#EAB308",
};

export default {
  title: "Forms/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  argTypes: {
    colors: {
      control: "object",
      description:
        "An object where keys are color names and values are color codes (e.g., { red: '#FF0000' }).",
    },
    defaultActive: {
      control: "text",
      description: "The name of the color that should be active by default.",
    },
    labels: {
      control: "boolean",
      description: "Whether to display text labels for each color swatch.",
    },
    onChange: { action: "change" },
  },
  args: {
    colors: defaultColors,
    defaultActive: "red",
    labels: true,
  },
};

export const Default = {};

export const NoLabels = {
  args: {
    labels: false,
  },
};

export const CustomPalette = {
  args: {
    colors: {
      primary: "#6200EE",
      secondary: "#03DAC6",
      accent: "#FF4081",
    },
    defaultActive: "secondary",
  },
};

export const InitialActiveColor = {
  args: {
    defaultActive: "green",
  },
};

export const EventHandling = {
  args: {
    onChange: action("color-selected"),
  },
};
