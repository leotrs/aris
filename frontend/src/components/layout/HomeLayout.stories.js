import HomeLayout from "./HomeLayout.vue";
import HomeSidebar from "./HomeSidebar.vue";
import Button from "../base/Button.vue";
import UserMenu from "../navigation/UserMenu.vue";
import UploadFile from "../../views/home/ModalUploadFile.vue";

// Mock necessary injections and router
const mockFileStore = {
  value: {
    createFile: async (fileData) => {
      console.log("Mock createFile called with:", fileData);
      return { id: "mock-file-123", ...fileData };
    },
  },
};

const mockUser = {
  value: {
    id: "mock-user-id",
    name: "Mock User",
    email: "mock@example.com",
    initials: "MU",
    color: "#FF00FF",
  },
};

const mockRouter = {
  push: (path) => console.log("Mock router.push called with:", path),
};

const mockRoute = {
  fullPath: "/",
};

export default {
  title: "Layout/HomeLayout",
  component: HomeLayout,
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: "text",
      description: "The currently active item in the sidebar.",
    },
    fab: {
      control: "boolean",
      description: "Whether to show the floating action button (FAB) for new file creation.",
    },
  },
  args: {
    active: "Home",
    fab: true,
  },
  decorators: [
    (story) => ({
      components: { story, HomeSidebar, Button, UserMenu, UploadFile },
      provide: {
        mobileMode: { value: false },
        fileStore: mockFileStore,
        user: mockUser,
      },
      // Mock router and route globally for the story
      setup() {
        return {
          $router: mockRouter,
          $route: mockRoute,
        };
      },
      template: "<story />",
    }),
  ],
};

export const Default = {
  args: {
    active: "Home",
    fab: true,
  },
  render: (args) => ({
    components: { HomeLayout },
    setup() {
      return { args };
    },
    template: `
      <HomeLayout v-bind="args">
        <div style="padding: 20px; border: 1px dashed #ccc; height: 200px; display: flex; align-items: center; justify-content: center;">
          Main Content Area
        </div>
      </HomeLayout>
    `,
  }),
};

export const MobileView = {
  args: {
    active: "Home",
    fab: true,
  },
  decorators: [
    (story) => ({
      components: { story, HomeSidebar, Button, UserMenu, UploadFile },
      provide: {
        mobileMode: { value: true }, // Simulate mobile mode
        fileStore: mockFileStore,
        user: mockUser,
      },
      setup() {
        return {
          $router: mockRouter,
          $route: mockRoute,
        };
      },
      template: "<story />",
    }),
  ],
  render: (args) => ({
    components: { HomeLayout },
    setup() {
      return { args };
    },
    template: `
      <HomeLayout v-bind="args">
        <div style="padding: 20px; border: 1px dashed #ccc; height: 200px; display: flex; align-items: center; justify-content: center;">
          Mobile Content Area
        </div>
      </HomeLayout>
    `,
  }),
};

export const NoFab = {
  args: {
    active: "Account",
    fab: false,
  },
  render: (args) => ({
    components: { HomeLayout },
    setup() {
      return { args };
    },
    template: `
      <HomeLayout v-bind="args">
        <div style="padding: 20px; border: 1px dashed #ccc; height: 200px; display: flex; align-items: center; justify-content: center;">
          FAB Button Disabled
        </div>
      </HomeLayout>
    `,
  }),
};
