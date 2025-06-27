import HomeSidebar from "./HomeSidebar.vue";
import ContextMenu from "../navigation/ContextMenu.vue";
import ContextMenuItem from "../navigation/ContextMenuItem.vue";
import Button from "../base/Button.vue";
import SidebarItem from "./HomeSidebarItem.vue";
import Separator from "../base/Separator.vue";

// Mock dependencies
const mockRouter = {
  push: (path) => console.log("Mock router.push called with:", path),
};

const mockFile = {
  openFile: (file, _router) => console.log("Mock File.openFile called for:", file.title),
};

const mockFileStore = {
  value: {
    getRecentFiles: (count) => {
      console.log("Mock getRecentFiles called with:", count);
      return [
        { id: "file1", title: "Recent Document 1" },
        { id: "file2", title: "Recent Document 2" },
        { id: "file3", title: "Recent Document 3" },
      ];
    },
  },
};

const mockUser = {
  value: {
    id: "user-1",
    name: "Mock User",
    initials: "MU",
    color: "#FF00FF",
  },
};

const mockKeyboardShortcuts = () => ({
  activate: () => console.log("Mock useKeyboardShortcuts: activate"),
  deactivate: () => console.log("Mock useKeyboardShortcuts: deactivate"),
});

export default {
  title: "Layout/HomeSidebar",
  component: HomeSidebar,
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: "text",
      description: "The currently active sidebar item.",
    },
    fab: {
      control: "boolean",
      description: "Whether to show the floating action button (FAB) for new file creation.",
    },
    onNewEmptyFile: { action: "newEmptyFile" },
    onShowFileUploadModal: { action: "showFileUploadModal" },
  },
  args: {
    active: "Home",
    fab: true,
  },
  decorators: [
    (story) => ({
      components: { story, ContextMenu, ContextMenuItem, Button, SidebarItem, Separator },
      provide: {
        mobileMode: { value: false },
        sidebarIsCollapsed: { value: false },
        fileStore: mockFileStore,
        user: mockUser,
      },
      setup() {
        // Mock global dependencies
        return {
          $router: mockRouter,
          File: mockFile,
          useKeyboardShortcuts: mockKeyboardShortcuts,
        };
      },
      template: "<story />",
    }),
  ],
};

export const Default = {};

export const Collapsed = {
  decorators: [
    (story) => ({
      components: { story, ContextMenu, ContextMenuItem, Button, SidebarItem, Separator },
      provide: {
        mobileMode: { value: false },
        sidebarIsCollapsed: { value: true }, // Simulate collapsed state
        fileStore: mockFileStore,
        user: mockUser,
      },
      setup() {
        return {
          $router: mockRouter,
          File: mockFile,
          useKeyboardShortcuts: mockKeyboardShortcuts,
        };
      },
      template: "<story />",
    }),
  ],
};

export const Mobile = {
  decorators: [
    (story) => ({
      components: { story, ContextMenu, ContextMenuItem, Button, SidebarItem, Separator },
      provide: {
        mobileMode: { value: true }, // Simulate mobile mode
        sidebarIsCollapsed: { value: false },
        fileStore: mockFileStore,
        user: mockUser,
      },
      setup() {
        return {
          $router: mockRouter,
          File: mockFile,
          useKeyboardShortcuts: mockKeyboardShortcuts,
        };
      },
      template: "<story />",
    }),
  ],
};

export const NoFab = {
  args: {
    fab: false,
  },
};

export const ActiveAccount = {
  args: {
    active: "Account",
  },
};
