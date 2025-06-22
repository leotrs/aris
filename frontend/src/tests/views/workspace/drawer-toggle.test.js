import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "@/views/workspace/Sidebar.vue";

// Mock the injected values
const mockInjects = {
  drawerOpen: { value: false },
  focusMode: { value: false },
  mobileMode: { value: false },
  xsMode: { value: false }
};

const createWrapper = (overrides = {}) => {
  return mount(Sidebar, {
    global: {
      provide: mockInjects,
      mocks: {
        $router: { push: vi.fn() }
      },
      stubs: {
        Icon: true,
        Button: true,
        ButtonToggle: true,
        Tooltip: true,
        UserMenu: true,
        Separator: true,
        ContextMenu: true,
        ContextMenuItem: true,
        Drawer: true
      }
    },
    ...overrides
  });
};

describe("Sidebar Drawer Toggle", () => {
  it("should have drawer items with correct initial state", () => {
    const wrapper = createWrapper();
    
    // Find the drawer items
    const drawerItems = wrapper.vm.items.filter(item => item.type === "drawer");
    expect(drawerItems.length).toBeGreaterThan(0);
    
    // All drawer items should start closed
    drawerItems.forEach(item => {
      expect(item.state).toBe(false);
    });
  });

  it("should update item state when handleItemOn is called", async () => {
    const wrapper = createWrapper();
    
    // Find the settings drawer item
    const settingsIndex = wrapper.vm.items.findIndex(item => item.name === "DrawerSettings");
    expect(settingsIndex).toBeGreaterThan(-1);
    
    // Initially closed
    expect(wrapper.vm.items[settingsIndex].state).toBe(false);
    
    // Open the drawer
    wrapper.vm.handleItemOn(settingsIndex);
    await wrapper.vm.$nextTick();
    
    // Should now be open
    expect(wrapper.vm.items[settingsIndex].state).toBe(true);
  });

  it("should update item state when handleItemOff is called", async () => {
    const wrapper = createWrapper();
    
    // Find the settings drawer item
    const settingsIndex = wrapper.vm.items.findIndex(item => item.name === "DrawerSettings");
    
    // Open it first
    wrapper.vm.handleItemOn(settingsIndex);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.items[settingsIndex].state).toBe(true);
    
    // Close it
    wrapper.vm.handleItemOff(settingsIndex);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.items[settingsIndex].state).toBe(false);
  });
});