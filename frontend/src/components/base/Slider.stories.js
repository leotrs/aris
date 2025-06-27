import Slider from "./Slider.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "Base/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    iconLeft: {
      control: "text",
      description: "Name of the icon to display on the left side.",
    },
    iconRight: {
      control: "text",
      description: "Name of the icon to display on the right side.",
    },
    labelLeft: {
      control: "text",
      description: "Text label to display on the left side.",
    },
    labelRight: {
      control: "text",
      description: "Text label to display on the right side.",
    },
    numberStops: {
      control: {
        type: "range",
        min: 2,
        max: 10,
        step: 1,
      },
      description: "The total number of discrete stops on the slider.",
    },
    defaultActive: {
      control: {
        type: "range",
        min: 0,
        max: 9,
        step: 1,
      },
      description: "The 0-based index of the initially active stop.",
    },
    onChange: { action: "change" },
  },
  args: {
    iconLeft: "",
    iconRight: "",
    labelLeft: "",
    labelRight: "",
    numberStops: 3,
    defaultActive: 0,
  },
};

export const Default = {};

export const WithIconsAndLabels = {
  args: {
    iconLeft: "VolumeOff",
    iconRight: "VolumeUp",
    labelLeft: "Mute",
    labelRight: "Max",
    numberStops: 5,
  },
};

export const FiveStops = {
  args: {
    numberStops: 5,
  },
};

export const CustomDefaultActive = {
  args: {
    numberStops: 7,
    defaultActive: 3,
  },
};

export const EventHandling = {
  args: {
    onChange: action("slider-change"),
  },
};
