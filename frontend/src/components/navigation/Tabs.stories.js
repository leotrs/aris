import Tabs from "./Tabs.vue";
import TabPage from "./TabPage.vue";
import { ref } from "vue";

export default {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    labels: {
      control: "object",
      description: "Array of tab labels to display",
    },
    icons: {
      control: "object",
      description: "Array of icon names for each tab (from Tabler icons)",
    },
    modelValue: {
      control: "number",
      description: "The index of the currently active tab (v-model)",
    },
  },
  args: {
    labels: ["Dashboard", "Settings", "Profile"],
    icons: ["Home", "Settings", "User"],
    modelValue: 0,
  },
};

export const Default = {
  render: (args) => ({
    components: { Tabs, TabPage },
    setup() {
      const activeTab = ref(args.modelValue);
      return { args, activeTab };
    },
    template: `
      <Tabs
        :labels="args.labels"
        :icons="args.icons"
        v-model="activeTab"
      >
        <TabPage>
          <div style="padding: 20px;">
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard! Here you can see an overview of all your activities.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px;">
              <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
                <h3>Total Users</h3>
                <p style="font-size: 24px; font-weight: bold; color: #007bff;">1,234</p>
              </div>
              <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;">
                <h3>Revenue</h3>
                <p style="font-size: 24px; font-weight: bold; color: #28a745;">$12,345</p>
              </div>
            </div>
          </div>
        </TabPage>
        <TabPage>
          <div style="padding: 20px;">
            <h2>Settings</h2>
            <p>Configure your application settings here.</p>
            <form style="margin-top: 20px;">
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px;">Username:</label>
                <input type="text" value="john_doe" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;" />
              </div>
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px;">Email:</label>
                <input type="email" value="john@example.com" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;" />
              </div>
              <button type="button" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px;">Save Settings</button>
            </form>
          </div>
        </TabPage>
        <TabPage>
          <div style="padding: 20px;">
            <h2>Profile</h2>
            <p>Manage your personal profile information.</p>
            <div style="margin-top: 20px;">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: #007bff; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                  JD
                </div>
                <div>
                  <h3 style="margin: 0;">John Doe</h3>
                  <p style="margin: 4px 0; color: #666;">Software Developer</p>
                </div>
              </div>
              <button type="button" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px;">Upload Photo</button>
            </div>
          </div>
        </TabPage>
      </Tabs>
    `,
  }),
};

export const TwoTabs = {
  args: {
    labels: ["Overview", "Details"],
    icons: ["Eye", "List"],
  },
  render: (args) => ({
    components: { Tabs, TabPage },
    setup() {
      const activeTab = ref(0);
      return { args, activeTab };
    },
    template: `
      <Tabs
        :labels="args.labels"
        :icons="args.icons"
        v-model="activeTab"
      >
        <TabPage>
          <div style="padding: 20px;">
            <h2>Overview</h2>
            <p>High-level summary of the information.</p>
          </div>
        </TabPage>
        <TabPage>
          <div style="padding: 20px;">
            <h2>Details</h2>
            <p>Detailed breakdown and additional information.</p>
          </div>
        </TabPage>
      </Tabs>
    `,
  }),
};

export const FiveTabs = {
  args: {
    labels: ["Home", "About", "Services", "Portfolio", "Contact"],
    icons: ["Home", "Info", "Tool", "Briefcase", "Mail"],
  },
  render: (args) => ({
    components: { Tabs, TabPage },
    setup() {
      const activeTab = ref(0);
      return { args, activeTab };
    },
    template: `
      <Tabs
        :labels="args.labels"
        :icons="args.icons"
        v-model="activeTab"
      >
        <TabPage v-for="(label, index) in args.labels" :key="index">
          <div style="padding: 20px;">
            <h2>{{ label }}</h2>
            <p>Content for the {{ label.toLowerCase() }} section.</p>
          </div>
        </TabPage>
      </Tabs>
    `,
  }),
};

export const IconsOnly = {
  args: {
    labels: ["", "", ""],
    icons: ["Home", "Settings", "User"],
  },
  render: (args) => ({
    components: { Tabs, TabPage },
    setup() {
      const activeTab = ref(0);
      return { args, activeTab };
    },
    template: `
      <Tabs
        :labels="args.labels"
        :icons="args.icons"
        v-model="activeTab"
      >
        <TabPage>
          <div style="padding: 20px;">
            <h2>Home</h2>
            <p>Home content with icon-only tab.</p>
          </div>
        </TabPage>
        <TabPage>
          <div style="padding: 20px;">
            <h2>Settings</h2>
            <p>Settings content with icon-only tab.</p>
          </div>
        </TabPage>
        <TabPage>
          <div style="padding: 20px;">
            <h2>Profile</h2>
            <p>Profile content with icon-only tab.</p>
          </div>
        </TabPage>
      </Tabs>
    `,
  }),
};

export const Interactive = {
  render: () => ({
    components: { Tabs, TabPage },
    setup() {
      const activeTab = ref(0);
      const tabLabels = ref(["Tab 1", "Tab 2", "Tab 3"]);
      const tabIcons = ref(["Home", "Settings", "User"]);

      const addTab = () => {
        const newIndex = tabLabels.value.length + 1;
        tabLabels.value.push(`Tab ${newIndex}`);
        tabIcons.value.push("Plus");
      };

      const removeTab = () => {
        if (tabLabels.value.length > 1) {
          tabLabels.value.pop();
          tabIcons.value.pop();
          if (activeTab.value >= tabLabels.value.length) {
            activeTab.value = tabLabels.value.length - 1;
          }
        }
      };

      return { activeTab, tabLabels, tabIcons, addTab, removeTab };
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <button @click="addTab" style="margin-right: 8px; padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px;">
            Add Tab
          </button>
          <button @click="removeTab" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px;">
            Remove Tab
          </button>
        </div>
        
        <Tabs
          :labels="tabLabels"
          :icons="tabIcons"
          v-model="activeTab"
        >
          <TabPage v-for="(label, index) in tabLabels" :key="index">
            <div style="padding: 20px;">
              <h2>{{ label }}</h2>
              <p>This is the content for {{ label }}. Currently showing tab index: {{ index }}</p>
              <p>Active tab index: {{ activeTab }}</p>
            </div>
          </TabPage>
        </Tabs>
      </div>
    `,
  }),
};
