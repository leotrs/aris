import HSeparator from "./HSeparator.vue";

export default {
  title: "Base/HSeparator",
  component: HSeparator,
  tags: ["autodocs"],
  argTypes: {
    // HSeparator has no props
  },
};

export const Default = {};

export const InFlexContainer = {
  render: () => ({
    components: { HSeparator },
    template: `
      <div style="display: flex; align-items: center; gap: 10px; padding: 20px; border: 1px solid #eee;">
        <span>Left Item</span>
        <HSeparator />
        <span>Middle Item</span>
        <HSeparator />
        <span>Right Item</span>
      </div>
    `,
  }),
};
