import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";
import HamburgerMenu from "@/components/HamburgerMenu.vue";

describe("HamburgerMenu", () => {
  let wrapper;
  let mockMobileDrawerOpen;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMobileDrawerOpen = ref(false);

    wrapper = mount(HamburgerMenu, {
      global: {
        provide: {
          mobileDrawerOpen: mockMobileDrawerOpen,
        },
        components: {
          Button: {
            template: '<button v-bind="$attrs" @click="$emit(\'click\')" />',
            props: ["kind", "icon"],
            emits: ["click"],
          },
        },
      },
    });
  });

  describe("Component Rendering", () => {
    it("always renders hamburger button when component is mounted", () => {
      expect(wrapper.find('[data-testid="mobile-menu-button"]').exists()).toBe(true);
    });

    it("shows Menu icon when drawer is closed", () => {
      mockMobileDrawerOpen.value = false;
      const button = wrapper.findComponent({ name: "Button" });
      expect(button.props("icon")).toBe("Menu");
    });

    it("shows X icon when drawer is open", async () => {
      mockMobileDrawerOpen.value = true;
      await wrapper.vm.$nextTick();

      const button = wrapper.findComponent({ name: "Button" });
      expect(button.props("icon")).toBe("X");
    });
  });

  describe("Drawer Control", () => {
    it("toggles drawer state when button is clicked", async () => {
      const initialState = mockMobileDrawerOpen.value;

      const button = wrapper.find('[data-testid="mobile-menu-button"]');
      await button.trigger("click");

      expect(mockMobileDrawerOpen.value).toBe(!initialState);
    });

    it("can close drawer programmatically", () => {
      mockMobileDrawerOpen.value = true;

      wrapper.vm.close();

      expect(mockMobileDrawerOpen.value).toBe(false);
    });

    it("can toggle drawer programmatically", () => {
      const initialState = mockMobileDrawerOpen.value;

      wrapper.vm.toggle();

      expect(mockMobileDrawerOpen.value).toBe(!initialState);
    });

    it("exposes isOpen state correctly", () => {
      mockMobileDrawerOpen.value = true;
      expect(wrapper.vm.isOpen).toBe(true);

      mockMobileDrawerOpen.value = false;
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Responsive Design", () => {
    it("applies correct CSS classes", () => {
      expect(wrapper.find(".mobile-nav").exists()).toBe(true);
    });
  });
});
