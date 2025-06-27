import Separator from "./Separator.vue";

export default {
  title: "Base/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    // Separator has no props
  },
};

export const Default = {};

export const InContext = {
  render: () => ({
    components: { Separator },
    template: `
      <div style="padding: 20px; border: 1px solid #eee;">
        <p>Content above the separator.</p>
        <Separator />
        <p>Content below the separator.</p>
      </div>
    `,
  }),
};
