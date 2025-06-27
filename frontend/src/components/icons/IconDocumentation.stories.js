import IconDocumentation from "./IconDocumentation.vue";

export default {
  title: "Icons/IconDocumentation",
  component: IconDocumentation,
  tags: ["autodocs"],
  argTypes: {
    // IconDocumentation has no specific props beyond standard SVG attributes
  },
};

export const Default = {};

export const CustomSizingAndColor = {
  args: {
    class: "w-12 h-12 text-purple-500",
  },
};
