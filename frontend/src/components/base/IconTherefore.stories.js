import IconTherefore from "./IconTherefore.vue";

export default {
  title: "Base/IconTherefore",
  component: IconTherefore,
  tags: ["autodocs"],
  argTypes: {
    // IconTherefore has no specific props beyond standard SVG attributes
  },
};

export const Default = {};

export const CustomSizingAndColor = {
  args: {
    class: "w-12 h-12 text-red-500",
  },
};
