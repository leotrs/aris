import ThemeSwitch from "./ThemeSwitch.vue";
import SegmentedControl from "../forms/SegmentedControl.vue";

export default {
  title: "Base/ThemeSwitch",
  component: ThemeSwitch,
  tags: ["autodocs"],
  argTypes: {
    labels: {
      control: "boolean",
      description: "Whether to display text labels below the icons.",
    },
    mode: {
      control: "select",
      options: [0, 1, 2],
      mapping: { 0: "Light", 1: "System", 2: "Dark" },
      description: "The currently active theme mode (0: Light, 1: System, 2: Dark).",
    },
  },
  args: {
    labels: false,
    mode: 1, // Default to System
  },
  // Add a decorator to mock SegmentedControl if needed, or ensure it's globally available
  decorators: [
    (story) => ({
      components: { story, SegmentedControl },
      template: "<story />",
    }),
  ],
};

export const Default = {};

export const WithLabels = {
  args: {
    labels: true,
  },
};

export const LightMode = {
  args: {
    mode: 0,
    labels: true,
  },
};

export const DarkMode = {
  args: {
    mode: 2,
    labels: true,
  },
};

export const SystemMode = {
  args: {
    mode: 1,
    labels: true,
  },
};
