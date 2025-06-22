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
              }
            }
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
    const marginsItem = items.find(item => item.name === "DrawerMargins");
    expect(marginsItem.state).toBe(false);

    // Simulate keyboard shortcut
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    // Should have triggered drawer opening
    expect(marginsItem.state).toBe(true);
    expect(drawerOpenRef.value).toBe(true);
  });

  it("should open DrawerActivity when 'p,a' keyboard shortcut is pressed", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    expect(drawerOpenRef.value).toBe(false);
    const activityItem = items.find(item => item.name === "DrawerActivity");
    expect(activityItem.state).toBe(false);

    // Simulate keyboard shortcut
    keyboardShortcuts["p,a"].fn();
    await nextTick();

    expect(activityItem.state).toBe(true);
    expect(drawerOpenRef.value).toBe(true);
  });

  it("should open DrawerSettings when 'p,t' keyboard shortcut is pressed", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    expect(drawerOpenRef.value).toBe(false);
    const settingsItem = items.find(item => item.name === "DrawerSettings");
    expect(settingsItem.state).toBe(false);

    // Simulate keyboard shortcut
    keyboardShortcuts["p,t"].fn();
    await nextTick();

    expect(settingsItem.state).toBe(true);
    expect(drawerOpenRef.value).toBe(true);
  });

  it("should close drawer when same keyboard shortcut is pressed twice", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    const marginsItem = items.find(item => item.name === "DrawerMargins");

    // First press - open drawer
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    expect(marginsItem.state).toBe(true);
    expect(drawerOpenRef.value).toBe(true);

    // Second press - close drawer
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    expect(marginsItem.state).toBe(false);
    expect(drawerOpenRef.value).toBe(false);
  });

  it("should switch from one drawer to another via keyboard shortcuts", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    const marginsItem = items.find(item => item.name === "DrawerMargins");
    const activityItem = items.find(item => item.name === "DrawerActivity");

    // Open margins drawer first
    keyboardShortcuts["p,m"].fn();
    await nextTick();

    expect(marginsItem.state).toBe(true);
    expect(activityItem.state).toBe(false);
    expect(drawerOpenRef.value).toBe(true);

    // Now open activity drawer - should close margins and open activity
    keyboardShortcuts["p,a"].fn();
    await nextTick();

    expect(marginsItem.state).toBe(false);
    expect(activityItem.state).toBe(true);
    expect(drawerOpenRef.value).toBe(true);
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
    const marginsIndex = items.findIndex(item => item.name === "DrawerMargins");
    expect(wrapper.emitted("on")[0]).toEqual([marginsIndex]);
  });

  it("should handle multiple rapid keyboard shortcut presses correctly", async () => {
    const items = createItems();
    const wrapper = createWrapper(items);

    // Rapidly press multiple shortcuts
    keyboardShortcuts["p,m"].fn(); // Open margins
    keyboardShortcuts["p,a"].fn(); // Switch to activity
    keyboardShortcuts["p,t"].fn(); // Switch to settings
    await nextTick();

    const marginsItem = items.find(item => item.name === "DrawerMargins");
    const activityItem = items.find(item => item.name === "DrawerActivity");
    const settingsItem = items.find(item => item.name === "DrawerSettings");

    // Only the last action should be active
    expect(marginsItem.state).toBe(false);
    expect(activityItem.state).toBe(false);
    expect(settingsItem.state).toBe(true);
    expect(drawerOpenRef.value).toBe(true);
  });

  it("should maintain keyboard shortcut references correctly when items change", async () => {
    const initialItems = createItems();
    const wrapper = createWrapper(initialItems);

    // Verify initial shortcuts work
    keyboardShortcuts["p,m"].fn();
    await nextTick();
    expect(initialItems.find(item => item.name === "DrawerMargins").state).toBe(true);

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
      }
    ];

    await wrapper.setProps({ items: newItems });
    await nextTick();

    // Old shortcuts should still work
    keyboardShortcuts["p,a"].fn();
    await nextTick();
    expect(newItems.find(item => item.name === "DrawerActivity").state).toBe(true);

    // New shortcut should be registered
    expect(keyboardShortcuts).toHaveProperty("p,n");
  });
});