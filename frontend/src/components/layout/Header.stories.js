import Header from "./Header.vue";
import Button from "../base/Button.vue";

export default {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    // Header has no specific props, only a default slot
  },
};

export const Default = {
  render: () => ({
    components: { Header },
    template: "<Header><h2>Default Header</h2></Header>",
  }),
};

export const WithButton = {
  render: () => ({
    components: { Header, Button },
    template: `
      <Header>
        <h2>Settings</h2>
        <Button kind="tertiary" icon="Settings" />
      </Header>
    `,
  }),
};

export const CustomContent = {
  render: () => ({
    components: { Header },
    template: `
      <Header>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">🚀</span>
          <h3>Custom Header Content</h3>
        </div>
      </Header>
    `,
  }),
};
