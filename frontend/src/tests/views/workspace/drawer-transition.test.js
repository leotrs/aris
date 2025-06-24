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

  it("should keep drawer open when switching from one drawer to another", async () => {
    const wrapper = createWrapper();

    // Initially drawer should be closed
    expect(drawerOpenRef.value).toBe(false);

    // Find drawer items
    const marginsItem = wrapper.vm.items.find((item) => item.name === "DrawerMargins");
    const activityItem = wrapper.vm.items.find((item) => item.name === "DrawerActivity");
    const marginsIndex = wrapper.vm.items.indexOf(marginsItem);
    const activityIndex = wrapper.vm.items.indexOf(activityItem);

    expect(marginsItem.state).toBe(false);
    expect(activityItem.state).toBe(false);

    // Step 1: Open margins drawer
    wrapper.vm.handleItemOn(marginsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(marginsItem.state).toBe(true);
    expect(activityItem.state).toBe(false);

    // Step 2: Switch to activity drawer - THIS IS THE CRITICAL TEST
    // The drawer should remain open, just switch content
    wrapper.vm.handleItemOn(activityIndex);
    await nextTick();

    // CRITICAL ASSERTION: drawer should still be open after switching
    expect(drawerOpenRef.value).toBe(true); // This is likely failing
    expect(marginsItem.state).toBe(false);  // margins should be off
    expect(activityItem.state).toBe(true);  // activity should be on
  });

  it("should close drawer only when all drawer buttons are turned off", async () => {
    const wrapper = createWrapper();

    // Start with margins drawer open
    const marginsItem = wrapper.vm.items.find((item) => item.name === "DrawerMargins");
    const marginsIndex = wrapper.vm.items.indexOf(marginsItem);

    wrapper.vm.handleItemOn(marginsIndex);
    await nextTick();

    expect(drawerOpenRef.value).toBe(true);
    expect(marginsItem.state).toBe(true);

    // Now turn off the margins drawer
    wrapper.vm.handleItemOff(marginsIndex);
    await nextTick();

    // Now drawer should be closed since no drawers are active
    expect(drawerOpenRef.value).toBe(false);
    expect(marginsItem.state).toBe(false);
  });

  it("should handle rapid drawer switching correctly", async () => {
    const wrapper = createWrapper();

    const marginsItem = wrapper.vm.items.find((item) => item.name === "DrawerMargins");
    const activityItem = wrapper.vm.items.find((item) => item.name === "DrawerActivity");
    const settingsItem = wrapper.vm.items.find((item) => item.name === "DrawerSettings");
    
    const marginsIndex = wrapper.vm.items.indexOf(marginsItem);
    const activityIndex = wrapper.vm.items.indexOf(activityItem);
    const settingsIndex = wrapper.vm.items.indexOf(settingsItem);

    // Open margins
    wrapper.vm.handleItemOn(marginsIndex);
    await nextTick();
    expect(drawerOpenRef.value).toBe(true);

    // Switch to activity
    wrapper.vm.handleItemOn(activityIndex);
    await nextTick();
    expect(drawerOpenRef.value).toBe(true); // Should stay open

    // Switch to settings
    wrapper.vm.handleItemOn(settingsIndex);
    await nextTick();
    expect(drawerOpenRef.value).toBe(true); // Should stay open

    // Verify only settings is active
    expect(marginsItem.state).toBe(false);
    expect(activityItem.state).toBe(false);
    expect(settingsItem.state).toBe(true);
  });
});