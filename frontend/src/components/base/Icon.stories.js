import Icon from "./Icon.vue";

export default {
  title: "Base/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description:
        "Name of the icon to render (e.g., Home, Settings, Plus). For Tabler icons, use the name without the 'Icon' prefix. For custom icons like 'Therefore', use the exact name.",
    },
    iconClass: {
      control: "text",
      description: "Additional CSS classes to apply to the icon element.",
    },
  },
};

export const HomeIcon = {
  args: {
    name: "Home",
  },
};

export const SettingsIcon = {
  args: {
    name: "Settings",
    iconClass: "text-blue-500",
  },
};

export const PlusIcon = {
  args: {
    name: "Plus",
    iconClass: "w-6 h-6",
  },
};

export const CustomIcon = {
  args: {
    name: "Therefore",
    iconClass: "text-purple-600",
  },
};

export const InvalidIcon = {
  args: {
    name: "NonExistentIcon",
  },
};

export const WithCustomClasses = {
  args: {
    name: "Download",
    iconClass: "text-green-500 hover:text-green-700",
  },
};
