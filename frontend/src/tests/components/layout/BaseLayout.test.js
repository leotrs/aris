import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import BaseLayout from "@/components/layout/BaseLayout.vue";

// Mock vue-router
const mockRoute = {
  path: "/settings/document",
  fullPath: "/settings/document",
  name: "settings-document",
};
const mockRouter = { push: vi.fn() };
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

// Mock composables
vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn(),
    isRegistered: vi.fn(() => false),
    addShortcuts: vi.fn(),
    removeShortcuts: vi.fn(),
    getShortcuts: vi.fn(() => ({})),
  })),
}));

describe("BaseLayout", () => {
  let wrapper;
  const mockContextSubItems = [
    {
      icon: "FileText",
      text: "File",
      active: true,
      route: "/settings/document",
    },
    {
      icon: "Settings2",
      text: "Behavior",
      active: false,
      route: "/settings/behavior",
    },
    {
      icon: "Shield",
      text: "Privacy",
      active: false,
      route: "/settings/privacy",
    },
  ];

  const mockProvideValues = {
    mobileMode: { value: false },
    fileStore: {
      value: {
        createFile: vi.fn().mockResolvedValue({ id: "new-file-id" }),
        getRecentFiles: () => [],
      },
    },
    user: {
      value: {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = mount(BaseLayout, {
      props: {
        fab: true,
        contextSubItems: mockContextSubItems,
      },
      global: {
        provide: mockProvideValues,
        components: {
          BaseSidebar: {
            name: "BaseSidebar",
            props: ["sidebarItems", "fab"],
            template: '<div data-testid="base-sidebar" />',
            emits: ["action", "newEmptyFile", "showFileUploadModal"],
          },
          Button: {
            name: "Button",
            template: '<button data-testid="button" />',
          },
          UserMenu: {
            name: "UserMenu",
            template: '<div data-testid="user-menu" />',
          },
          ModalUploadFile: {
            name: "ModalUploadFile",
            template: '<div data-testid="modal-upload-file" />',
            emits: ["close"],
          },
        },
      },
      slots: {
        default: '<div data-testid="slot-content">Main Content</div>',
      },
    });
  });

  describe("Component Structure", () => {
    it("renders the main view wrapper", () => {
      expect(wrapper.find(".view").exists()).toBe(true);
    });

    it("renders BaseSidebar component", () => {
      expect(wrapper.findComponent({ name: "BaseSidebar" }).exists()).toBe(true);
    });

    it("renders top menus", () => {
      expect(wrapper.find(".menus").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "UserMenu" }).exists()).toBe(true);
    });

    it("renders slot content", () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="slot-content"]').text()).toBe("Main Content");
    });
  });

  describe("Sidebar Items Integration", () => {
    it("creates main sidebar items", () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      // Find main items (excluding sub-items container)
      const mainItems = sidebarItems.filter((item) => !item.isSubItemsContainer);
      expect(mainItems.length).toBe(5); // Home, Account, Settings, Separator, Collapse

      // Check main items structure
      expect(mainItems[0]).toMatchObject({
        icon: "Home",
        text: "Home",
        route: "/",
      });

      expect(mainItems[1]).toMatchObject({
        icon: "User",
        text: "Account",
        route: "/account",
      });

      expect(mainItems[2]).toMatchObject({
        icon: "Settings",
        text: "Settings",
        route: "/settings",
        active: true, // Should be active for /settings/document path
      });
    });

    it("sets correct active states for main items", () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      const homeItem = sidebarItems.find((item) => item.text === "Home");
      const accountItem = sidebarItems.find((item) => item.text === "Account");
      const settingsItem = sidebarItems.find((item) => item.text === "Settings");

      expect(homeItem.active).toBe(false);
      expect(accountItem.active).toBe(false);
      expect(settingsItem.active).toBe(true);
    });

    it("inserts context sub-items after active main item", () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      // Find the sub-items container
      const subItemsContainer = sidebarItems.find((item) => item.isSubItemsContainer);
      expect(subItemsContainer).toBeDefined();

      // Check sub-items structure
      expect(subItemsContainer.subItems).toHaveLength(3);
      expect(subItemsContainer.subItems[0]).toMatchObject({
        icon: "FileText",
        text: "File",
        active: true,
        route: "/settings/document",
        isSubItem: true,
      });
    });

    it("marks context sub-items with isSubItem flag", () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      const subItemsContainer = sidebarItems.find((item) => item.isSubItemsContainer);
      subItemsContainer.subItems.forEach((subItem) => {
        expect(subItem.isSubItem).toBe(true);
      });
    });

    it("does not insert sub-items when no active main item", async () => {
      // Create wrapper with route that doesn't match any main item
      const nonMatchingRoute = { path: "/some-other-page", fullPath: "/some-other-page" };
      
      // Temporarily override the mock route
      const originalRoute = mockRoute;
      Object.assign(mockRoute, nonMatchingRoute);

      const newWrapper = mount(BaseLayout, {
        props: { contextSubItems: mockContextSubItems },
        global: {
          provide: mockProvideValues,
          components: {
            BaseSidebar: {
              name: "BaseSidebar",
              props: ["sidebarItems"],
              template: "<div />",
            },
            Button: { template: "<div />" },
            UserMenu: { template: "<div />" },
          },
        },
      });

      const baseSidebar = newWrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      const subItemsContainer = sidebarItems.find((item) => item.isSubItemsContainer);
      expect(subItemsContainer).toBeUndefined();
      
      // Restore original route
      Object.assign(mockRoute, originalRoute);
    });

    it("does not insert sub-items for separator or action items", () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      // Sub-items should only be inserted after Settings item, not after separator or collapse
      const subItemsContainers = sidebarItems.filter((item) => item.isSubItemsContainer);
      expect(subItemsContainers).toHaveLength(1);
    });
  });

  describe("Context Sub-Items Prop", () => {
    it("handles empty contextSubItems", async () => {
      await wrapper.setProps({ contextSubItems: [] });

      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      const subItemsContainer = sidebarItems.find((item) => item.isSubItemsContainer);
      expect(subItemsContainer).toBeUndefined();
    });

    it("updates sub-items when contextSubItems prop changes", async () => {
      const newContextSubItems = [
        {
          icon: "NewIcon",
          text: "New Item",
          active: false,
          route: "/settings/new",
        },
      ];

      await wrapper.setProps({ contextSubItems: newContextSubItems });

      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      const sidebarItems = baseSidebar.props("sidebarItems");

      const subItemsContainer = sidebarItems.find((item) => item.isSubItemsContainer);
      expect(subItemsContainer.subItems).toHaveLength(1);
      expect(subItemsContainer.subItems[0].text).toBe("New Item");
    });
  });

  describe("Sidebar Actions", () => {
    it("handles newEmptyFile action", async () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      await baseSidebar.vm.$emit("newEmptyFile");

      expect(mockProvideValues.fileStore.value.createFile).toHaveBeenCalledWith({
        title: "New File",
        ownerId: "user-123",
        source: expect.stringContaining("# New File"),
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/file/new-file-id");
    });

    it("handles showFileUploadModal action", async () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      await baseSidebar.vm.$emit("showFileUploadModal");

      expect(wrapper.find(".modal").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "ModalUploadFile" }).exists()).toBe(true);
    });

    it("handles unknown sidebar action", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      await baseSidebar.vm.$emit("action", "unknownAction");

      expect(consoleSpy).toHaveBeenCalledWith("Unknown sidebar action: unknownAction");
      consoleSpy.mockRestore();
    });
  });

  describe("Modal Handling", () => {
    it("shows upload modal when triggered", async () => {
      expect(wrapper.find(".modal").exists()).toBe(false);

      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      await baseSidebar.vm.$emit("showFileUploadModal");

      expect(wrapper.find(".modal").exists()).toBe(true);
    });

    it("closes upload modal when close event emitted", async () => {
      // Open modal first
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      await baseSidebar.vm.$emit("showFileUploadModal");

      expect(wrapper.find(".modal").exists()).toBe(true);

      // Close modal
      const uploadFile = wrapper.findComponent({ name: "ModalUploadFile" });
      if (uploadFile.exists()) {
        await uploadFile.vm.$emit("close");
      }

      expect(wrapper.find(".modal").exists()).toBe(false);
    });
  });

  describe("Mobile Mode", () => {
    it("applies mobile class in mobile mode", async () => {
      const mobileWrapper = mount(BaseLayout, {
        props: { contextSubItems: mockContextSubItems },
        global: {
          provide: {
            ...mockProvideValues,
            mobileMode: { value: true },
          },
          components: {
            BaseSidebar: { template: "<div />" },
            Button: { template: "<div />" },
            UserMenu: { template: "<div />" },
          },
        },
      });

      expect(mobileWrapper.find(".view.mobile").exists()).toBe(true);
      expect(mobileWrapper.find(".menus.mobile").exists()).toBe(true);
    });

    it("shows home button in mobile mode when not on home", async () => {
      const mobileWrapper = mount(BaseLayout, {
        props: { contextSubItems: mockContextSubItems },
        global: {
          provide: {
            ...mockProvideValues,
            mobileMode: { value: true },
          },
          components: {
            BaseSidebar: { template: "<div />" },
            Button: {
              name: "Button",
              props: ["kind", "icon"],
              template: '<button data-testid="home-button" />',
            },
            UserMenu: { template: "<div />" },
          },
        },
      });

      const homeButton = mobileWrapper.find('[data-testid="home-button"]');
      expect(homeButton.exists()).toBe(true);
    });
  });

  describe("Props", () => {
    it("passes fab prop to BaseSidebar", () => {
      const baseSidebar = wrapper.findComponent({ name: "BaseSidebar" });
      expect(baseSidebar.props("fab")).toBe(true);
    });

    it("has correct default props", () => {
      const defaultWrapper = mount(BaseLayout, {
        global: {
          provide: mockProvideValues,
          components: {
            BaseSidebar: { template: "<div />" },
            Button: { template: "<div />" },
            UserMenu: { template: "<div />" },
          },
        },
      });

      expect(defaultWrapper.props("fab")).toBe(true);
      expect(defaultWrapper.props("contextSubItems")).toEqual([]);
    });
  });
});
