import ContextMenu from "./ContextMenu.vue";
import ContextMenuItem from "./ContextMenuItem.vue";
import Button from "../base/Button.vue";
import Icon from "../base/Icon.vue";
import ButtonDots from "../base/ButtonDots.vue";

// Mock dependencies
const mockUseListKeyboardNavigation = () => ({
  activeIndex: { value: null },
  clearSelection: () => console.log("Mock clearSelection"),
  activate: () => console.log("Mock activate navigation"),
  deactivate: () => console.log("Mock deactivate navigation"),
});

const mockUseClosable = () => ({
  activate: () => console.log("Mock activate closable"),
  deactivate: () => console.log("Mock deactivate closable"),
});

const mockUseFloating = () => ({
  floatingStyles: { value: { position: "absolute", top: "0px", left: "0px" } },
  placement: { value: "bottom-start" },
});

export default {
  title: "Navigation/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["dots", "slot"],
      description: "Menu trigger variant type.",
    },
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ],
      description: "Floating UI placement string for menu positioning relative to trigger.",
    },
    // Slots
    trigger: {
      control: "text",
      description: "Slot for a custom trigger element when variant is 'slot'.",
    },
    default: {
      control: "text",
      description: "Content for the menu (typically ContextMenuItem components).",
    },
  },
  args: {
    variant: "dots",
    placement: "bottom-start",
  },
  decorators: [
    (story) => ({
      components: { story, ContextMenuItem, Button, Icon, ButtonDots },
      provide: {
        mobileMode: { value: false },
        isSubMenu: false,
        parentMenu: null,
      },
      setup() {
        // Mock composables
        return {
          useListKeyboardNavigation: mockUseListKeyboardNavigation,
          useClosable: mockUseClosable,
          useFloating: mockUseFloating,
        };
      },
      template: "<story />",
    }),
  ],
};

export const Default = {
  render: (args) => ({
    components: { ContextMenu, ContextMenuItem },
    setup() {
      return { args };
    },
    template: `
      <ContextMenu v-bind="args">
        <ContextMenuItem icon="edit" caption="Edit" />
        <ContextMenuItem icon="trash" caption="Delete" />
      </ContextMenu>
    `,
  }),
};

export const CustomPlacement = {
  args: {
    placement: "right-start",
  },
  render: (args) => ({
    components: { ContextMenu, ContextMenuItem },
    setup() {
      return { args };
    },
    template: `
      <ContextMenu v-bind="args">
        <ContextMenuItem icon="copy" caption="Copy" />
        <ContextMenuItem icon="paste" caption="Paste" />
      </ContextMenu>
    `,
  }),
};

export const CustomTrigger = {
  args: {
    variant: "slot",
  },
  render: (args) => ({
    components: { ContextMenu, ContextMenuItem, Button, Icon },
    setup() {
      return { args };
    },
    template: `
      <ContextMenu v-bind="args">
        <template #trigger="{ toggle, isOpen }">
          <Button @click="toggle" :class="{ active: isOpen }" kind="secondary" text="Actions" icon="ChevronDown" />
        </template>
        <ContextMenuItem icon="settings" caption="Settings" />
        <ContextMenuItem icon="help" caption="Help" />
      </ContextMenu>
    `,
  }),
};

export const NestedMenu = {
  render: (args) => ({
    components: { ContextMenu, ContextMenuItem, ButtonDots },
    setup() {
      return { args };
    },
    template: `
      <ContextMenu v-bind="args">
        <ContextMenuItem icon="edit" caption="Edit" />
        <ContextMenu variant="slot" placement="right-start">
          <template #trigger="{ toggle }">
            <ButtonDots @click="toggle" /> More Actions
          </template>
          <ContextMenuItem icon="copy" caption="Duplicate" />
          <ContextMenuItem icon="archive" caption="Archive" />
        </ContextMenu>
      </ContextMenu>
    `,
  }),
};
