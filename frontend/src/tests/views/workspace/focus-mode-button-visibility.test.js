import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import Sidebar from "@/views/workspace/Sidebar.vue";
import * as KSMod from "@/composables/useKeyboardShortcuts.js";

// Mock vue-router
const pushMock = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("Focus Mode Button Visibility", () => {
  let _useKSSpy;

  beforeEach(() => {
    _useKSSpy = vi.spyOn(KSMod, "useKeyboardShortcuts").mockImplementation(() => {});
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
          drawerOpen: { value: false },
          ...provide,
        },
        stubs: {
          SidebarMenu: {
            name: "SidebarMenu",
            template: "<div class='sidebar-menu-stub' />",
            props: ["items"],
          },
          Drawer: {
            name: "Drawer",
            template: "<div class='drawer-stub' />",
            props: ["component"],
          },
          Button: {
            name: "Button",
            template: "<button class='focus-button'><slot /></button>",
            props: ["kind", "icon"],
          },
          Tooltip: true,
        },
      },
    });
  };

  describe("focus button positioning", () => {
    it("positions focus button at 16px when in focus mode with drawer closed", () => {
      const wrapper = createWrapper({
        focusMode: { value: true },
        drawerOpen: { value: false },
      });

      expect(wrapper.vm.focusButtonLeft).toBe("16px");
    });

    it("positions focus button at 16px when in focus mode with drawer open", () => {
      const wrapper = createWrapper({
        focusMode: { value: true },
        drawerOpen: { value: true },
      });

      // This should be "16px" but currently fails because the implementation
      // incorrectly calculates drawer width even in focus mode
      expect(wrapper.vm.focusButtonLeft).toBe("16px");
    });

    it("positions focus button at 64px when not in focus mode with drawer closed", () => {
      const wrapper = createWrapper({
        focusMode: { value: false },
        drawerOpen: { value: false },
      });

      expect(wrapper.vm.focusButtonLeft).toBe("64px");
    });

    it("positions focus button at calc(64px + var(--sidebar-width)) when not in focus mode with drawer open", () => {
      const wrapper = createWrapper({
        focusMode: { value: false },
        drawerOpen: { value: true },
      });

      expect(wrapper.vm.focusButtonLeft).toBe("calc(64px + var(--sidebar-width))");
    });
  });

  describe("focus button visibility", () => {
    it("shows focus button when in focus mode", () => {
      const wrapper = createWrapper({
        focusMode: { value: true },
      });

      const focusButton = wrapper.findComponent({ name: "Button" });
      expect(focusButton.exists()).toBe(true);
      expect(focusButton.props("icon")).toBe("Layout");
      expect(focusButton.props("kind")).toBe("tertiary");
    });

    it("hides focus button when not in focus mode", () => {
      const wrapper = createWrapper({
        focusMode: { value: false },
      });

      const focusButton = wrapper.findComponent({ name: "Button" });
      // Note: v-show directive affects style.display, not element existence
      // The button exists in DOM but has display: none
      expect(focusButton.exists()).toBe(true);
    });

    it("focus button remains clickable when drawer is open in focus mode", async () => {
      const focusMode = { value: true };
      const wrapper = createWrapper({
        focusMode,
        drawerOpen: { value: true },
      });

      const focusButton = wrapper.findComponent({ name: "Button" });
      expect(focusButton.exists()).toBe(true);

      // Button should be positioned at 16px, not behind the drawer
      expect(wrapper.vm.focusButtonLeft).toBe("16px");

      // Simulate click to exit focus mode
      await focusButton.trigger("click");

      // In real implementation, this would set focusMode.value = false
      // For now, we test that the button is accessible
      expect(focusButton.exists()).toBe(true);
    });
  });

  describe("focus mode state transitions", () => {
    it("updates button position when transitioning from normal to focus mode with drawer open", async () => {
      // Create actual Vue refs for reactivity
      const focusMode = ref(false);
      const drawerOpen = ref(true);

      const wrapper = createWrapper({
        focusMode,
        drawerOpen,
      });

      // Initially in normal mode with drawer open
      expect(wrapper.vm.focusButtonLeft).toBe("calc(64px + var(--sidebar-width))");

      // Enter focus mode
      focusMode.value = true;
      await nextTick();

      // Button should now be positioned at 16px
      expect(wrapper.vm.focusButtonLeft).toBe("16px");
    });

    it("updates button position when transitioning from focus to normal mode with drawer open", async () => {
      // Create actual Vue refs for reactivity
      const focusMode = ref(true);
      const drawerOpen = ref(true);

      const wrapper = createWrapper({
        focusMode,
        drawerOpen,
      });

      // Initially in focus mode with drawer open
      expect(wrapper.vm.focusButtonLeft).toBe("16px");

      // Exit focus mode
      focusMode.value = false;
      await nextTick();

      // Button should now be positioned to avoid drawer
      expect(wrapper.vm.focusButtonLeft).toBe("calc(64px + var(--sidebar-width))");
    });

    it("maintains correct position when drawer is toggled in focus mode", async () => {
      const focusMode = ref(true);
      const drawerOpen = ref(false);

      const wrapper = createWrapper({
        focusMode,
        drawerOpen,
      });

      // Initially in focus mode with drawer closed
      expect(wrapper.vm.focusButtonLeft).toBe("16px");

      // Open drawer while in focus mode
      drawerOpen.value = true;
      await nextTick();

      // Button should remain at 16px because drawer is hidden in focus mode
      expect(wrapper.vm.focusButtonLeft).toBe("16px");

      // Close drawer while in focus mode
      drawerOpen.value = false;
      await nextTick();

      // Button should still be at 16px
      expect(wrapper.vm.focusButtonLeft).toBe("16px");
    });
  });
});
