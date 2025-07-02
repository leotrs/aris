import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import Sidebar from "@/views/workspace/Sidebar.vue";

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

describe("Drawer Transition Behavior", () => {
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

  it("should verify drawer behavior with single drawer (MVP)", async () => {
    const wrapper = createWrapper();

    // Initially drawer should be closed
    expect(drawerOpenRef.value).toBe(false);

    // Find the only drawer item (DrawerSettings)
    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    expect(settingsItem).toBeDefined();
    expect(settingsItem.state).toBe(false);

    // Open settings drawer
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);

    // Verify removed drawer items don't exist
    const marginsItem = wrapper.vm.items.find((item) => item.name === "DrawerMargins");
    const activityItem = wrapper.vm.items.find((item) => item.name === "DrawerActivity");
    expect(marginsItem).toBeUndefined();
    expect(activityItem).toBeUndefined();
  });

  it("should close drawer only when all drawer buttons are turned off", async () => {
    const wrapper = createWrapper();

    // Start with settings drawer open
    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);

    // Now turn off the settings drawer
    wrapper.vm.handleItemOff(settingsIndex);
    await nextTick();

    // Now drawer should be closed since no drawers are active
    expect(drawerOpenRef.value).toBe(false);
    expect(settingsItem.state).toBe(false);
  });

  it("should handle drawer toggle correctly with single drawer (MVP)", async () => {
    const wrapper = createWrapper();

    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    // Open settings
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();
    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);

    // Close settings
    wrapper.vm.handleItemOff(settingsIndex);
    await nextTick();
    expect(drawerOpenRef.value).toBe(false);
    expect(settingsItem.state).toBe(false);

    // Reopen settings
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();
    expect(drawerOpenRef.value).toBe(true);
    expect(settingsItem.state).toBe(true);
  });
});
