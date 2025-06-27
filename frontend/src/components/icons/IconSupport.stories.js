import IconSupport from "./IconSupport.vue";

export default {
  title: "Icons/IconSupport",
  component: IconSupport,
  tags: ["autodocs"],
  argTypes: {
    // IconSupport has no specific props beyond standard SVG attributes
  },
};

export const Default = {};

export const CustomSizingAndColor = {
  args: {
    class: "w-12 h-12 text-red-500",
  },
};
