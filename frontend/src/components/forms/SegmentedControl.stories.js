import SegmentedControl from "./SegmentedControl.vue";
import Icon from "../base/Icon.vue";
import Tooltip from "../base/Tooltip.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "Forms/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {
    icons: {
      control: "object",
      description: "An array of icon names to display for each segment.",
    },
    labels: {
      control: "object",
      description: "An array of text labels to display for each segment.",
    },
    tooltips: {
      control: "object",
      description: "An array of tooltip texts for each segment.",
    },
    defaultActive: {
      control: "number",
      description: "The index of the segment that should be active by default.",
    },
    active: {
      control: "number",
      description: "The currently active segment index (v-model).",
    },
    "update:active": { action: "update:active" },
  },
  args: {
    icons: ["List", "Grid"],
    labels: ["List View", "Grid View"],
    tooltips: ["Switch to list view", "Switch to grid view"],
    defaultActive: 0,
  },
  decorators: [
    (story) => ({
      components: { story, Icon, Tooltip },
      template: "<story />",
    }),
  ],
};

export const Default = {};

export const LabelsOnly = {
  args: {
    icons: null,
    labels: ["Option A", "Option B", "Option C"],
    tooltips: null,
  },
};

export const IconsOnly = {
  args: {
    labels: null,
    icons: ["Sun", "Moon", "Star"],
    tooltips: ["Light Mode", "Dark Mode", "Stargazer Mode"],
  },
};

export const CustomDefaultActive = {
  args: {
    defaultActive: 1,
  },
};

export const EventHandling = {
  args: {
    "update:active": action("segment-changed"),
  },
};

export const MixedContent = {
  args: {
    icons: ["Check", "X", "AlertTriangle"],
    labels: ["Yes", "No", "Maybe"],
    tooltips: ["Confirm", "Cancel", "Unsure"],
  },
};
