import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import SidebarMenu from "@/views/workspace/SidebarMenu.vue";
import * as KSMod from "@/composables/useKeyboardShortcuts.js";

// Mock vue-router
const pushMock = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("Drawer Keyboard Shortcuts", () => {
  let useKSSpy;
  let keyboardShortcuts;
  let drawerOpenRef;

  beforeEach(() => {
    drawerOpenRef = { value: false };
    useKSSpy = vi.spyOn(KSMod, "useKeyboardShortcuts").mockImplementation((shortcuts) => {
      keyboardShortcuts = shortcuts;
    });
    pushMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createItems = () => [
    {
      name: "DockableEditor",
      icon: "Code",
      label: "source",
      key: "e",
      state: false,
      type: "toggle",
    },
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
    {
      name: "DrawerSettings",
      icon: "AdjustmentsHorizontal",
      label: "settings",
      key: "t",
      state: false,
      type: "drawer",
    },
  ];

  const createWrapper = (items = createItems()) => {
    return mount(SidebarMenu, {
      props: {
        items: items,
      },
      global: {
        provide: {
          drawerOpen: drawerOpenRef,
          focusMode: { value: false },
          mobileMode: false,
          xsMode: false,
        },
        stubs: {
          SidebarItem: {
            name: "SidebarItem",
            template: `<div class="sidebar-item-stub"><button @click="toggleState">{{ label }}</button></div>`,
            props: ["icon", "label"],
            emits: ["on", "off"],
            methods: {
              toggleState() {
                this.$emit("on");
              },
            },
          },
          Separator: true,
          UserMenu: true,
        },
      },
    });
  };

  it("should register keyboard shortcuts for all drawer items", () => {
    const items = createItems();
    createWrapper(items);

    expect(useKSSpy).toHaveBeenCalled();
    expect(keyboardShortcuts).toHaveProperty("p,m"); // DrawerMargins
    expect(keyboardShortcuts).toHaveProperty("p,a"); // DrawerActivity
    expect(keyboardShortcuts).toHaveProperty("p,t"); // DrawerSettings
    expect(keyboardShortcuts).toHaveProperty("u"); // UserMenu toggle
  });

  it("should not register keyboard shortcuts for toggle items in SidebarMenu", () => {
    const items = createItems();
    createWrapper(items);

    // Toggle items should not have shortcuts registered in SidebarMenu
    expect(keyboardShortcuts).not.toHaveProperty("p,e"); // DockableEditor
  });

  it("should open DrawerMargins when 'p,m' keyboard shortcut is pressed", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    // Initially drawer should be closed
    expect(drawerOpenRef.value).toBe(false);
    const marginsItem = items.find((item) => item.name === "DrawerMargins");
    expect(marginsItem.state).toBe(false);

    // Simulate keyboard shortcut
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    // The keyboard shortcut calls handleDrawerClick which emits "on" event
    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")).toHaveLength(1);

    // Get the margins index that was emitted
    const marginsIndex = items.findIndex((item) => item.name === "DrawerMargins");
    expect(wrapper.emitted("on")[0]).toEqual([marginsIndex]);
  });

  it("should open DrawerActivity when 'p,a' keyboard shortcut is pressed", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    expect(drawerOpenRef.value).toBe(false);
    const activityItem = items.find((item) => item.name === "DrawerActivity");
    expect(activityItem.state).toBe(false);

    // Simulate keyboard shortcut
    keyboardShortcuts["p,a"].fn();
    await nextTick();

    // The keyboard shortcut calls handleDrawerClick which emits "on" event
    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")).toHaveLength(1);

    // Get the activity index that was emitted
    const activityIndex = items.findIndex((item) => item.name === "DrawerActivity");
    expect(wrapper.emitted("on")[0]).toEqual([activityIndex]);
  });

  it("should open DrawerSettings when 'p,t' keyboard shortcut is pressed", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    expect(drawerOpenRef.value).toBe(false);
    const settingsItem = items.find((item) => item.name === "DrawerSettings");
    expect(settingsItem.state).toBe(false);

    // Simulate keyboard shortcut
    keyboardShortcuts["p,t"].fn();
    await nextTick();

    // The keyboard shortcut calls handleDrawerClick which emits "on" event
    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")).toHaveLength(1);

    // Get the settings index that was emitted
    const settingsIndex = items.findIndex((item) => item.name === "DrawerSettings");
    expect(wrapper.emitted("on")[0]).toEqual([settingsIndex]);
  });

  it("should handle drawer toggle when same keyboard shortcut is pressed twice", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    const marginsIndex = items.findIndex((item) => item.name === "DrawerMargins");
    const marginsItem = items[marginsIndex];

    // First press - should emit "on" event
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")).toHaveLength(1);
    expect(wrapper.emitted("on")[0]).toEqual([marginsIndex]);

    // Simulate the state change that would happen in the parent component
    marginsItem.state = true;

    // Second press - should emit "off" event (handleDrawerClick toggles)
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    expect(wrapper.emitted("off")).toBeTruthy();
    expect(wrapper.emitted("off")).toHaveLength(1);
    expect(wrapper.emitted("off")[0]).toEqual([marginsIndex]);
  });

  it("should emit events for switching between drawers via keyboard shortcuts", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    const marginsIndex = items.findIndex((item) => item.name === "DrawerMargins");
    const activityIndex = items.findIndex((item) => item.name === "DrawerActivity");
    const marginsItem = items[marginsIndex];

    // Open margins drawer first
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")).toHaveLength(1);
    expect(wrapper.emitted("on")[0]).toEqual([marginsIndex]);

    // Simulate the state change that would happen in parent component
    marginsItem.state = true;

    // Now open activity drawer - should close margins and open activity
    keyboardShortcuts["p,a"].fn();
    await nextTick();

    // Should have emitted off for margins and on for activity
    expect(wrapper.emitted("off")).toBeTruthy();
    expect(wrapper.emitted("off").length).toBeGreaterThanOrEqual(1);
    expect(wrapper.emitted("off")[0]).toEqual([marginsIndex]);

    expect(wrapper.emitted("on")).toHaveLength(2);
    expect(wrapper.emitted("on")[1]).toEqual([activityIndex]);
  });

  it("should emit correct events when keyboard shortcuts trigger drawer actions", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    // Open margins drawer via keyboard
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    // Check that the correct events were emitted
    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")).toHaveLength(1);

    // The event should include the index of the margins item
    const marginsIndex = items.findIndex((item) => item.name === "DrawerMargins");
    expect(wrapper.emitted("on")[0]).toEqual([marginsIndex]);
  });

  it("should emit correct events for multiple rapid keyboard shortcut presses", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    const marginsIndex = items.findIndex((item) => item.name === "DrawerMargins");
    const activityIndex = items.findIndex((item) => item.name === "DrawerActivity");
    const settingsIndex = items.findIndex((item) => item.name === "DrawerSettings");
    const marginsItem = items[marginsIndex];
    const activityItem = items[activityIndex];

    // First shortcut - Open margins
    keyboardShortcuts["p,m"].fn();
    marginsItem.state = true; // Simulate state change
    await nextTick();

    // Second shortcut - Switch to activity
    keyboardShortcuts["p,a"].fn();
    marginsItem.state = false; // Simulate state change
    activityItem.state = true; // Simulate state change
    await nextTick();

    // Third shortcut - Switch to settings
    keyboardShortcuts["p,t"].fn();
    activityItem.state = false; // Simulate state change
    await nextTick();

    // Should have emitted events in the correct sequence
    const onEvents = wrapper.emitted("on");
    const offEvents = wrapper.emitted("off");

    expect(onEvents).toHaveLength(3); // Three "on" events
    expect(offEvents).toHaveLength(2); // Two "off" events (margins->activity, activity->settings)

    expect(onEvents[0]).toEqual([marginsIndex]);
    expect(onEvents[1]).toEqual([activityIndex]);
    expect(onEvents[2]).toEqual([settingsIndex]);

    expect(offEvents[0]).toEqual([marginsIndex]);
    expect(offEvents[1]).toEqual([activityIndex]);
  });

  it("should maintain keyboard shortcut references correctly when items change", async () => {
    const initialItems = createItems();
    const wrapper = createWrapper(initialItems);

    const marginsIndex = initialItems.findIndex((item) => item.name === "DrawerMargins");

    // Verify initial shortcuts work
    keyboardShortcuts["p,m"].fn();
    await nextTick();
    expect(wrapper.emitted("on")).toBeTruthy();
    expect(wrapper.emitted("on")[0]).toEqual([marginsIndex]);

    // Update items prop
    const newItems = [
      ...initialItems,
      {
        name: "DrawerNewFeature",
        icon: "Star",
        label: "new",
        key: "n",
        state: false,
        type: "drawer",
      },
    ];

    await wrapper.setProps({ items: newItems });
    await nextTick();

    // Old shortcuts should still work
    const activityIndex = newItems.findIndex((item) => item.name === "DrawerActivity");
    keyboardShortcuts["p,a"].fn();
    await nextTick();

    expect(wrapper.emitted("on")).toHaveLength(2);
    expect(wrapper.emitted("on")[1]).toEqual([activityIndex]);

    // New shortcut should be registered
    expect(keyboardShortcuts).toHaveProperty("p,n");
  });
});
