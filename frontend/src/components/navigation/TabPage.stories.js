import TabPage from "./TabPage.vue";

export default {
  title: "Navigation/TabPage",
  component: TabPage,
  tags: ["autodocs"],
  argTypes: {
    default: {
      control: "text",
      description: "Content to display in the tab page",
    },
  },
};

export const Default = {
  render: () => ({
    components: { TabPage },
    template: `
      <TabPage>
        <h2>Default Tab Page</h2>
        <p>This is the default content of a tab page.</p>
      </TabPage>
    `,
  }),
};

export const WithComplexContent = {
  render: () => ({
    components: { TabPage },
    template: `
      <TabPage>
        <div style="padding: 20px;">
          <h2>Complex Content</h2>
          <p>Tab pages can contain any content you need:</p>
          <ul>
            <li>Text and paragraphs</li>
            <li>Lists and tables</li>
            <li>Forms and inputs</li>
            <li>Charts and visualizations</li>
          </ul>
          <button>Action Button</button>
        </div>
      </TabPage>
    `,
  }),
};

export const WithCard = {
  render: () => ({
    components: { TabPage },
    template: `
      <TabPage>
        <div style="padding: 20px;">
          <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; background: #f9f9f9;">
            <h3 style="margin-top: 0;">Card Content</h3>
            <p>This tab page contains a card-like layout with structured content.</p>
            <div style="display: flex; gap: 8px; margin-top: 16px;">
              <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Cancel</button>
              <button style="padding: 8px 16px; border: none; border-radius: 4px; background: #007bff; color: white;">Save</button>
            </div>
          </div>
        </div>
      </TabPage>
    `,
  }),
};

export const Empty = {
  render: () => ({
    components: { TabPage },
    template: `
      <TabPage>
        <!-- Empty tab page -->
      </TabPage>
    `,
  }),
};
