import IconTooling from "./IconTooling.vue";

export default {
  title: "Icons/IconTooling",
  component: IconTooling,
  tags: ["autodocs"],
  argTypes: {
    // IconTooling has no specific props beyond standard SVG attributes
  },
};

export const Default = {};

export const CustomSizingAndColor = {
  args: {
    class: "w-12 h-12 text-gray-700",
  },
};
