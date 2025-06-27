import Pane from "./Pane.vue";
import Header from "./Header.vue";
import Button from "../base/Button.vue";

export default {
  title: "Layout/Pane",
  component: Pane,
  tags: ["autodocs"],
  argTypes: {
    customHeader: {
      control: "boolean",
      description:
        "If true, the header slot content is rendered directly. Otherwise, it's wrapped by a Header component.",
    },
    // Slots
    header: {
      control: "text",
      description: "Content for the pane's header.",
    },
    default: {
      control: "text",
      description: "Main content of the pane.",
    },
  },
  args: {
    customHeader: false,
  },
  decorators: [
    (story) => ({
      components: { story, Header, Button },
      provide: {
        mobileMode: { value: false }, // Default to desktop mode for stories
      },
      template: "<story />",
    }),
  ],
};

export const Default = {
  render: (args) => ({
    components: { Pane },
    setup() {
      return { args };
    },
    template: `
      <Pane v-bind="args">
        <template #header><h2>Default Pane Header</h2></template>
        <p>This is the default content of the pane.</p>
        <p>It will be wrapped by a standard Header component.</p>
      </Pane>
    `,
  }),
};

export const CustomHeader = {
  args: {
    customHeader: true,
  },
  render: (args) => ({
    components: { Pane, Button },
    setup() {
      return { args };
    },
    template: `
      <Pane v-bind="args">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f0f0f0; border-radius: 8px;">
            <h3>Custom Header Content</h3>
            <Button kind="primary" text="Action" />
          </div>
        </template>
        <p>This pane has a completely custom header layout.</p>
      </Pane>
    `,
  }),
};

export const MobileMode = {
  decorators: [
    (story) => ({
      components: { story, Header, Button },
      provide: {
        mobileMode: { value: true }, // Simulate mobile mode
      },
      template: "<story />",
    }),
  ],
  render: (args) => ({
    components: { Pane },
    setup() {
      return { args };
    },
    template: `
      <Pane v-bind="args">
        <template #header><h2>Mobile Pane Header</h2></template>
        <p>This pane adapts its styling for mobile devices.</p>
      </Pane>
    `,
  }),
};

export const WithLongContent = {
  render: (args) => ({
    components: { Pane },
    setup() {
      return { args };
    },
    template: `
      <Pane v-bind="args">
        <template #header><h2>Long Content Pane</h2></template>
        <div style="height: 300px; overflow-y: auto;">
          <p v-for="n in 20" :key="n">This is a line of content. Line number {{ n }}.</p>
        </div>
      </Pane>
    `,
  }),
};
