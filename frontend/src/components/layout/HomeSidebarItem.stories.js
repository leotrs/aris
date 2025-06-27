import HomeSidebarItem from "./HomeSidebarItem.vue";
import Icon from "../base/Icon.vue";
import Tooltip from "../base/Tooltip.vue";

export default {
  title: "Layout/HomeSidebarItem",
  component: HomeSidebarItem,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "text",
      description: "Name of the icon to display when the sidebar is expanded.",
    },
    iconCollapsed: {
      control: "text",
      description:
        "Name of the icon to display when the sidebar is collapsed. If not provided, `icon` will be used.",
    },
    text: {
      control: "text",
      description: "The text label for the sidebar item.",
    },
    tooltip: {
      control: "text",
      description: "Custom tooltip text. If not provided, `text` will be used as tooltip.",
    },
    tooltipAlways: {
      control: "boolean",
      description: "Whether the tooltip should always be shown, regardless of collapsed state.",
    },
    active: {
      control: "boolean",
      description: "Whether the sidebar item is currently active.",
    },
    clickable: {
      control: "boolean",
      description: "Whether the sidebar item is clickable.",
    },
  },
  args: {
    icon: "Home",
    iconCollapsed: "",
    text: "Dashboard",
    tooltip: "",
    tooltipAlways: false,
    active: false,
    clickable: true,
  },
  decorators: [
    (story) => ({
      components: { story, Icon, Tooltip },
      provide: {
        collapsed: { value: false }, // Default to expanded state for stories
      },
      template: "<story />",
    }),
  ],
};

export const Default = {};

export const Active = {
  args: {
    active: true,
  },
};

export const Collapsed = {
  decorators: [
    (story) => ({
      components: { story, Icon, Tooltip },
      provide: {
        collapsed: { value: true }, // Simulate collapsed state
      },
      template: "<story />",
    }),
  ],
};

export const CollapsedWithCustomIcon = {
  args: {
    icon: "LayoutSidebarLeftCollapse",
    iconCollapsed: "LayoutSidebarLeftExpand",
    text: "Toggle Sidebar",
  },
  decorators: [
    (story) => ({
      components: { story, Icon, Tooltip },
      provide: {
        collapsed: { value: true },
      },
      template: "<story />",
    }),
  ],
};

export const NonClickable = {
  args: {
    clickable: false,
  },
};

export const WithCustomTooltip = {
  args: {
    tooltip: "This is a custom tooltip.",
    tooltipAlways: true,
  },
};
