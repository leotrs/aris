import IconCommunity from "./IconCommunity.vue";

export default {
  title: "Icons/IconCommunity",
  component: IconCommunity,
  tags: ["autodocs"],
  argTypes: {
    // IconCommunity has no specific props beyond standard SVG attributes
  },
};

export const Default = {};

export const CustomSizingAndColor = {
  args: {
    class: "w-12 h-12 text-blue-500",
  },
};
