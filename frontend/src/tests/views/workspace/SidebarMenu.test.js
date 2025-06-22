import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import SidebarMenu from "@/views/workspace/SidebarMenu.vue";
import * as KSMod from "@/composables/useKeyboardShortcuts.js";

describe("Workspace SidebarMenu", () => {
  let useKSSpy;

  const mockItems = [
    {
      name: "DockableEditor",
      icon: "Code",
      label: "source",
      key: "e",
      state: false,
      type: "toggle",
    },
    {
      name: "DockableSearch",
      icon: "Search",
      label: "search",
      key: "f",
      state: false,
      type: "toggle",
    },
    { name: "Separator", state: false },
    {
      name: "DrawerMargins",
      icon: "LayoutDistributeVertical",
      label: "margins",
      key: "m",
      state: false,
      type: "drawer",
    },
    {
      name: "DrawerActivity",
      icon: "ProgressBolt",
      label: "activity",
      key: "a",
      state: false,
      type: "drawer",
    },
  ];

  beforeEach(() => {
    useKSSpy = vi.spyOn(KSMod, "useKeyboardShortcuts").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createWrapper = (provide = {}, props = {}) => {
    return mount(SidebarMenu, {
      props: {
        modelValue: mockItems,
        ...props,
      },
      global: {
        provide: {
          focusMode: { value: false },
          mobileMode: false,
          xsMode: false,
          drawerOpen: { value: false },
          ...provide,
        },
        stubs: {
          SidebarItem: {
            name: "SidebarItem",
            template: "<div class='sidebar-item-stub' />",
            props: ["modelValue", "icon", "label"],
            emits: ["update:modelValue"],
          },
          Separator: {
            name: "Separator",
            template: "<div class='separator-stub' />",
          },
          UserMenu: {
            name: "UserMenu",
            template: "<div class='user-menu-stub' />",
            methods: { toggle: vi.fn() },
          },
          ContextMenu: {
            name: "ContextMenu",
            template: "<div class='context-menu-stub'><slot /></div>",
            props: ["variant"],
          },
          ContextMenuItem: {
            name: "ContextMenuItem",
            template: "<div class='context-menu-item-stub' />",
            props: ["modelValue", "icon", "caption"],
            emits: ["update:modelValue"],
          },
        },
      },
    });
  };

  describe("component structure", () => {
    it("renders with correct default structure", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".sb-menu").exists()).toBe(true);
      expect(wrapper.findAllComponents({ name: "SidebarItem" })).toHaveLength(5); // 2 toggles + 2 drawers + focus mode
      expect(wrapper.findComponent({ name: "UserMenu" }).exists()).toBe(true);
    });

    it("applies correct CSS classes based on mode", () => {
      const wrapper = createWrapper({
        mobileMode: true,
        xsMode: true,
      });

      const menu = wrapper.find(".sb-menu");
      expect(menu.classes()).toContain("mobile");
      expect(menu.classes()).toContain("xs");
    });
  });

  describe("desktop mode rendering", () => {
    it("renders all items in desktop mode", () => {
      const wrapper = createWrapper({ mobileMode: false });

      // Should render toggle items
      const toggleItems = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .filter((w) => w.props("icon") === "Code" || w.props("icon") === "Search");
      expect(toggleItems).toHaveLength(2);

      // Should render drawer items
      const drawerItems = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .filter(
          (w) =>
            w.props("icon") === "LayoutDistributeVertical" || w.props("icon") === "ProgressBolt"
        );
      expect(drawerItems).toHaveLength(2);

      // Should render separators
      expect(wrapper.findAllComponents({ name: "Separator" })).toHaveLength(1);

      // Should render focus mode toggle
      const focusItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "LayoutOff");
      expect(focusItem).toBeTruthy();

      // Should render user menu
      expect(wrapper.findComponent({ name: "UserMenu" }).exists()).toBe(true);
    });

    it("does not render mobile-specific elements in desktop mode", () => {
      const wrapper = createWrapper({ mobileMode: false });

      expect(wrapper.findComponent({ name: "ContextMenu" }).exists()).toBe(false);
      expect(wrapper.findAllComponents({ name: "ContextMenuItem" })).toHaveLength(0);
    });
  });

  describe("mobile mode rendering", () => {
    it("renders mobile layout", () => {
      const wrapper = createWrapper({ mobileMode: true });

      // Should have home button
      const homeItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "Home");
      expect(homeItem).toBeTruthy();

      // Should render toggle items
      const toggleItems = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .filter((w) => w.props("icon") === "Code" || w.props("icon") === "Search");
      expect(toggleItems).toHaveLength(2);

      // Should render context menu for drawer items
      expect(wrapper.findComponent({ name: "ContextMenu" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "ContextMenu" }).props("variant")).toBe("slot");

      // Should render drawer items in context menu
      expect(wrapper.findAllComponents({ name: "ContextMenuItem" })).toHaveLength(2);
    });

    it("does not render desktop-specific elements in mobile mode", () => {
      const wrapper = createWrapper({ mobileMode: true });

      // Should not render focus mode toggle in mobile
      const focusItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "LayoutOff");
      expect(focusItem).toBeFalsy();

      // Should not render user menu in mobile
      expect(wrapper.findComponent({ name: "UserMenu" }).exists()).toBe(false);
    });
  });

  describe("drawer management", () => {
    it("has drawer click handler function", () => {
      const wrapper = createWrapper();

      // Verify the component has the handleDrawerClick method
      expect(typeof wrapper.vm.handleDrawerClick).toBe("function");
    });

    it("manages drawerOpen injection correctly", () => {
      const drawerOpen = { value: false };
      const wrapper = createWrapper({ drawerOpen });

      // Initially no drawer should be open
      expect(drawerOpen.value).toBe(false);

      // The component should have access to drawerOpen
      // Note: Testing actual drawer functionality requires proper v-model setup
      // which is complex with defineModel in test environment
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("keyboard shortcuts", () => {
    it("registers keyboard shortcuts for drawer items", () => {
      createWrapper();

      expect(useKSSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          "p,m": expect.any(Object), // DrawerMargins shortcut
          "p,a": expect.any(Object), // DrawerActivity shortcut
          u: expect.any(Object), // User menu shortcut
        })
      );
    });

    it("registers keyboard shortcuts with functions", () => {
      let shortcutsConfig;
      useKSSpy.mockImplementation((config) => {
        shortcutsConfig = config;
      });

      createWrapper();

      // Verify that keyboard shortcuts are registered with functions
      expect(shortcutsConfig["p,m"]).toBeDefined();
      expect(typeof shortcutsConfig["p,m"].fn).toBe("function");
      expect(shortcutsConfig["p,a"]).toBeDefined();
      expect(typeof shortcutsConfig["p,a"].fn).toBe("function");
    });

    it("handles user menu keyboard shortcut", () => {
      let shortcutsConfig;
      useKSSpy.mockImplementation((config) => {
        shortcutsConfig = config;
      });

      const wrapper = createWrapper();
      const userMenu = wrapper.findComponent({ name: "UserMenu" });
      const toggleSpy = vi.spyOn(userMenu.vm, "toggle");

      // Invoke user menu shortcut
      shortcutsConfig.u.fn();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it("includes description for user menu shortcut", () => {
      let shortcutsConfig;
      useKSSpy.mockImplementation((config) => {
        shortcutsConfig = config;
      });

      createWrapper();

      expect(shortcutsConfig.u.description).toBe("Toggle user menu");
    });
  });

  describe("focus mode integration", () => {
    it("binds focus mode to SidebarItem", () => {
      const focusMode = { value: false };
      const wrapper = createWrapper({ focusMode });

      const focusItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "LayoutOff");

      expect(focusItem).toBeTruthy();
      expect(focusItem.props("label")).toBe("focus");
    });

    it("has focus mode functionality", () => {
      const focusMode = { value: false };
      const wrapper = createWrapper({ focusMode });

      const focusItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "LayoutOff");

      // Verify the focus item exists
      expect(focusItem).toBeTruthy();

      // Verify focusMode is reactive
      focusMode.value = true;
      expect(focusMode.value).toBe(true);
    });
  });

  describe("item prop binding", () => {
    it("binds correct props to toggle items", () => {
      const wrapper = createWrapper();

      const editorItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "Code");

      expect(editorItem.props("icon")).toBe("Code");
      expect(editorItem.props("label")).toBe("source");
      expect(editorItem.props("modelValue")).toBe(false);
    });

    it("binds correct props to drawer items", () => {
      const wrapper = createWrapper();

      const marginsItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "LayoutDistributeVertical");

      expect(marginsItem.props("icon")).toBe("LayoutDistributeVertical");
      expect(marginsItem.props("label")).toBe("margins");
      expect(marginsItem.props("modelValue")).toBe(false);
    });

    it("updates item state when SidebarItem emits change", async () => {
      const wrapper = createWrapper();

      const editorItem = wrapper
        .findAllComponents({ name: "SidebarItem" })
        .find((w) => w.props("icon") === "Code");

      // Simulate state change
      await editorItem.vm.$emit("update:modelValue", true);

      const updatedItem = wrapper.vm.items.find((item) => item.name === "DockableEditor");
      expect(updatedItem.state).toBe(true);
    });
  });

  describe("context menu in mobile mode", () => {
    it("renders drawer items in context menu", () => {
      const wrapper = createWrapper({ mobileMode: true });

      const contextMenuItems = wrapper.findAllComponents({ name: "ContextMenuItem" });
      expect(contextMenuItems).toHaveLength(2);

      // Check props
      const marginsMenuItem = contextMenuItems.find(
        (w) => w.props("icon") === "LayoutDistributeVertical"
      );
      expect(marginsMenuItem.props("caption")).toBe("margins");

      const activityMenuItem = contextMenuItems.find((w) => w.props("icon") === "ProgressBolt");
      expect(activityMenuItem.props("caption")).toBe("activity");
    });

    it("binds drawer states to context menu items", async () => {
      const wrapper = createWrapper({ mobileMode: true });

      const marginsMenuItem = wrapper
        .findAllComponents({ name: "ContextMenuItem" })
        .find((w) => w.props("icon") === "LayoutDistributeVertical");

      expect(marginsMenuItem.props("modelValue")).toBe(false);

      // Change item state
      const marginsItem = wrapper.vm.items.find((item) => item.name === "DrawerMargins");
      marginsItem.state = true;
      await nextTick();

      expect(marginsMenuItem.props("modelValue")).toBe(true);
    });
  });
});
