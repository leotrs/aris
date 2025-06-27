import IconEcosystem from "./IconEcosystem.vue";

export default {
  title: "Icons/IconEcosystem",
  component: IconEcosystem,
  tags: ["autodocs"],
  argTypes: {
    // IconEcosystem has no specific props beyond standard SVG attributes
  },
};

export const Default = {};

export const CustomSizingAndColor = {
  args: {
    class: "w-12 h-12 text-orange-500",
  },
};
