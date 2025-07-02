import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import Sidebar from "@/views/workspace/Sidebar.vue";
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

  it("should verify no DrawerMargins exists (removed for MVP)", async () => {
    const wrapper = createWrapper();

    // Verify DrawerMargins item no longer exists in sidebar
    const marginsItem = wrapper.vm.items.find((item) => item.name === "DrawerMargins");
    expect(marginsItem).toBeUndefined();
  });

  it("should open DrawerSettings when settings button is clicked", async () => {
    const wrapper = createWrapper();

    // Initially drawer should be closed
    expect(drawerOpenRef.value).toBe(false);

    // Find the settings item
    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
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

    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    // First click - open drawer
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);

    // Second click - close drawer
    wrapper.vm.handleItemOff(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(false);
    expect(settingsItem.state).toBe(false);

    // Verify drawer no longer shows active component
    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.props("component")).toBe("");
  });

  it("should verify drawer switching behavior with single drawer (MVP)", async () => {
    const wrapper = createWrapper();

    // With only one drawer (DrawerSettings), test that it works correctly
    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    // Open settings drawer
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);

    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.props("component")).toBe("DrawerSettings");

    // Close settings drawer
    wrapper.vm.handleItemOff(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(false);
    expect(settingsItem.state).toBe(false);
    expect(drawerComponent.props("component")).toBe("");
  });

  it("should render drawer content when drawer is open", async () => {
    const wrapper = createWrapper();

    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    wrapper.vm.handleItemOn(wrapper.vm.items.indexOf(settingsItem));
    await nextTick();

    // Check that the drawer component is rendered with content
    const drawerComponent = wrapper.findComponent(Drawer);
    expect(drawerComponent.exists()).toBe(true);

    // The DrawerSettings stub should be rendered inside the drawer
    const settingsContent = drawerComponent.findComponent({ name: "DrawerSettings" });
    expect(settingsContent.exists()).toBe(true);
    expect(settingsContent.text()).toContain("Settings Content");
  });
});
