import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import Sidebar from "@/views/workspace/Sidebar.vue";
import SidebarMenu from "@/views/workspace/SidebarMenu.vue";
import Drawer from "@/views/workspace/Drawer.vue";

// Mock vue-router
const pushMock = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock keyboard shortcuts
vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

// Mock closable composable
vi.mock("@/composables/useClosable.js", () => ({
  default: vi.fn(),
}));

describe("Drawer Click Interaction", () => {
  let drawerOpenRef;

  beforeEach(() => {
    drawerOpenRef = { value: false };
    pushMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createWrapper = (provide = {}) => {
    return mount(Sidebar, {
      global: {
        provide: {
          focusMode: { value: false },
          mobileMode: false,
          xsMode: false,
          drawerOpen: drawerOpenRef,
          ...provide,
        },
        stubs: {
          Icon: true,
          Button: true,
          ButtonToggle: {
            name: "ButtonToggle",
            template: `<button @click="$emit('update:modelValue', !modelValue)" :class="{ active: modelValue }">{{ icon }}</button>`,
            props: ["modelValue", "icon"],
            emits: ["update:modelValue"],
          },
          Tooltip: true,
          UserMenu: true,
          Separator: true,
          ContextMenu: true,
          ContextMenuItem: true,
          DrawerMargins: {
            name: "DrawerMargins",
            template: `<div class="drawer-margins">Margins Content</div>`,
          },
          DrawerActivity: {
            name: "DrawerActivity", 
            template: `<div class="drawer-activity">Activity Content</div>`,
          },
          DrawerSettings: {
            name: "DrawerSettings",
            template: `<div class="drawer-settings">Settings Content</div>`,
          },
        },
      },
    });
  };

  it("should open DrawerMargins when margins button is clicked", async () => {
    const wrapper = createWrapper();

    // Initially drawer should be closed
    expect(drawerOpenRef.value).toBe(false);

    // Find the SidebarMenu component
    const sidebarMenu = wrapper.findComponent(SidebarMenu);
    expect(sidebarMenu.exists()).toBe(true);

    // Find the margins item in the items array
    const marginsItem = wrapper.vm.items.find(item => item.name === "DrawerMargins");
    expect(marginsItem).toBeDefined();
    expect(marginsItem.state).toBe(false);

    // Simulate clicking the margins button by calling handleItemOn
    wrapper.vm.handleItemOn(wrapper.vm.items.indexOf(marginsItem));
    await nextTick();

    // Verify drawer state changed
    expect(drawerOpenRef.value).toBe(true);
    expect(marginsItem.state).toBe(true);

    // Verify the Drawer component receives the correct component prop
    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.exists()).toBe(true);
    expect(drawerComponent.props("component")).toBe("DrawerMargins");

    // Verify drawer has active class
    const drawerElement = drawerComponent.find(".drawer");
    expect(drawerElement.exists()).toBe(true);
    expect(drawerElement.classes()).toContain("active");
  });

  it("should open DrawerSettings when settings button is clicked", async () => {
    const wrapper = createWrapper();

    // Initially drawer should be closed
    expect(drawerOpenRef.value).toBe(false);

    // Find the settings item
    const settingsItem = wrapper.vm.items.find(item => item.name === "DrawerSettings");
    expect(settingsItem).toBeDefined();
    expect(settingsItem.state).toBe(false);

    // Simulate clicking the settings button
    wrapper.vm.handleItemOn(wrapper.vm.items.indexOf(settingsItem));
    await nextTick();

    // Verify drawer state changed
    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);

    // Verify the Drawer component receives the correct component prop
    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.props("component")).toBe("DrawerSettings");
  });

  it("should close drawer when same drawer button is clicked twice", async () => {
    const wrapper = createWrapper();

    const marginsItem = wrapper.vm.items.find(item => item.name === "DrawerMargins");
    const marginsIndex = wrapper.vm.items.indexOf(marginsItem);

    // First click - open drawer
    wrapper.vm.handleItemOn(marginsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(marginsItem.state).toBe(true);

    // Second click - close drawer
    wrapper.vm.handleItemOff(marginsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(false);
    expect(marginsItem.state).toBe(false);

    // Verify drawer no longer shows active component
    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.props("component")).toBe("");
  });

  it("should switch from one drawer to another when different drawer button is clicked", async () => {
    const wrapper = createWrapper();

    const marginsItem = wrapper.vm.items.find(item => item.name === "DrawerMargins");
    const settingsItem = wrapper.vm.items.find(item => item.name === "DrawerSettings");
    const marginsIndex = wrapper.vm.items.indexOf(marginsItem);
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    // Open margins drawer first
    wrapper.vm.handleItemOn(marginsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(marginsItem.state).toBe(true);
    expect(settingsItem.state).toBe(false);

    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.props("component")).toBe("DrawerMargins");

    // Now open settings drawer - this should close margins and open settings
    // First simulate closing margins (this happens in SidebarMenu)
    wrapper.vm.handleItemOff(marginsIndex);
    await nextTick();
    
    // Then open settings
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(marginsItem.state).toBe(false);
    expect(settingsItem.state).toBe(true);
    expect(drawerComponent.props("component")).toBe("DrawerSettings");
  });

  it("should render drawer content when drawer is open", async () => {
    const wrapper = createWrapper();
    
    const marginsItem = wrapper.vm.items.find(item => item.name === "DrawerMargins");
    wrapper.vm.handleItemOn(wrapper.vm.items.indexOf(marginsItem));
    await nextTick();

    // Check that the drawer component is rendered with content
    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.exists()).toBe(true);
    
    // The DrawerMargins stub should be rendered inside the drawer
    const marginsContent = drawerComponent.findComponent({ name: "DrawerMargins" });
    expect(marginsContent.exists()).toBe(true);
    expect(marginsContent.text()).toContain("Margins Content");
  });
});