import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import FileMenu from "@/components/navigation/FileMenu.vue";

describe("FileMenu.vue - Manual Click Test", () => {
  let mockProvides;

  beforeEach(() => {
    mockProvides = {
      mobileMode: ref(false),
    };
  });

  it("should have clickable dots button that toggles menu", async () => {
    console.log("=== Testing FileMenu Dots Functionality ===");

    const wrapper = mount(FileMenu, {
      props: {
        mode: "ContextMenu",
      },
      global: {
        provide: mockProvides,
        stubs: {
          // Use minimal stubs to test real functionality
          ContextMenuItem: {
            template: '<div class="context-menu-item" @click="$attrs.onClick"><slot /></div>',
            props: ["icon", "caption"],
          },
          Separator: {
            template: '<hr class="separator" />',
          },
        },
      },
    });

    console.log("FileMenu HTML:", wrapper.html());

    // Check if FileMenu wrapper exists
    const fileMenuWrapper = wrapper.find('[data-testid="file-menu"]');
    expect(fileMenuWrapper.exists()).toBe(true);
    console.log("✅ FileMenu wrapper found");

    // Check if ContextMenu component exists
    const contextMenu = wrapper.findComponent({ name: "ContextMenu" });
    expect(contextMenu.exists()).toBe(true);
    console.log("✅ ContextMenu component found");

    // Check if dots trigger button exists
    const dotsButton = wrapper.find('[data-testid="trigger-button"]');
    expect(dotsButton.exists()).toBe(true);
    console.log("✅ Dots trigger button found");

    // Check initial menu state (should be closed)
    expect(contextMenu.vm.show).toBe(false);
    console.log("✅ Menu initially closed");

    // Try clicking the dots button
    console.log("🔄 Clicking dots button...");
    await dotsButton.trigger("click");
    await wrapper.vm.$nextTick();

    // Check if menu opened
    expect(contextMenu.vm.show).toBe(true);
    console.log("✅ Menu opened after click");

    // Check if menu items are present
    const menuItems = wrapper.findAll(".context-menu-item");
    expect(menuItems.length).toBeGreaterThan(0);
    console.log(`✅ Found ${menuItems.length} menu items`);

    // Test toggle method from exposed API
    expect(typeof wrapper.vm.toggle).toBe("function");
    wrapper.vm.toggle();
    await wrapper.vm.$nextTick();
    expect(contextMenu.vm.show).toBe(false);
    console.log("✅ Menu closed via toggle method");

    console.log("=== FileMenu Dots Test PASSED ===");
  });

  it("should emit events when menu items are clicked", async () => {
    const wrapper = mount(FileMenu, {
      props: {
        mode: "ContextMenu",
      },
      global: {
        provide: mockProvides,
        stubs: {
          ContextMenuItem: {
            template: '<div class="context-menu-item" @click="$attrs.onClick"><slot /></div>',
            props: ["icon", "caption"],
          },
          Separator: {
            template: '<hr class="separator" />',
          },
        },
      },
    });

    // Open the menu first
    const dotsButton = wrapper.find('[data-testid="trigger-button"]');
    await dotsButton.trigger("click");
    await wrapper.vm.$nextTick();

    // Find and click menu items
    const menuItems = wrapper.findAll(".context-menu-item");

    // Test rename (should be 3rd item: Share, Download, Rename)
    if (menuItems.length >= 3) {
      await menuItems[2].trigger("click");
      expect(wrapper.emitted("rename")).toBeTruthy();
      console.log("✅ Rename event emitted");
    }

    // Test duplicate (should be 4th item)
    if (menuItems.length >= 4) {
      await menuItems[3].trigger("click");
      expect(wrapper.emitted("duplicate")).toBeTruthy();
      console.log("✅ Duplicate event emitted");
    }

    // Test delete (should be 5th item)
    if (menuItems.length >= 5) {
      await menuItems[4].trigger("click");
      expect(wrapper.emitted("delete")).toBeTruthy();
      console.log("✅ Delete event emitted");
    }
  });
});
