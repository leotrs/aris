import Tab from "./Tab.vue";
import { ref } from "vue";

export default {
  title: "Navigation/Tab",
  component: Tab,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "The text label displayed in the tab",
    },
    icon: {
      control: "select",
      options: ["Home", "Settings", "User", "File", "Search", "Download", "Upload"],
      description: "Icon name to display in the tab (from Tabler icons)",
    },
    active: {
      control: "boolean",
      description: "Whether this tab is currently active",
    },
  },
  args: {
    label: "Dashboard",
    icon: "Home",
    active: false,
  },
};

export const Default = {};

export const Active = {
  args: {
    active: true,
  },
};

export const WithoutLabel = {
  args: {
    label: "",
    icon: "Settings",
  },
};

export const WithoutIcon = {
  args: {
    label: "Settings",
    icon: "",
  },
};

export const DifferentIcons = {
  render: () => ({
    components: { Tab },
    setup() {
      const tabs = ref([
        { label: "Home", icon: "Home", active: true },
        { label: "Profile", icon: "User", active: false },
        { label: "Files", icon: "File", active: false },
        { label: "Settings", icon: "Settings", active: false },
      ]);
      return { tabs };
    },
    template: `
      <div style="display: flex; gap: 8px;">
        <Tab
          v-for="(tab, index) in tabs"
          :key="index"
          v-model="tab.active"
          :label="tab.label"
          :icon="tab.icon"
        />
      </div>
    `,
  }),
};

export const Interactive = {
  render: (args) => ({
    components: { Tab },
    setup() {
      const isActive = ref(args.active);
      return { args, isActive };
    },
    template: `
      <div>
        <Tab
          v-model="isActive"
          :label="args.label"
          :icon="args.icon"
        />
        <p style="margin-top: 16px;">
          Tab is {{ isActive ? 'active' : 'inactive' }}
        </p>
      </div>
    `,
  }),
};
