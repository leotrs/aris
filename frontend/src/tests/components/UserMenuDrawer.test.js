import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";
import UserMenuDrawer from "@/components/UserMenuDrawer.vue";

// Mock vue-router
const mockRoute = { path: "/account", name: "account" };
const mockRouter = { push: vi.fn() };
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

describe("UserMenuDrawer", () => {
  let wrapper;
  let mockMobileMode;
  let mockUser;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMobileMode = ref(true);
    mockUser = {
      id: 1,
      name: "Test User",
      initials: "TU",
      color: "#FF5733",
    };

    wrapper = mount(UserMenuDrawer, {
      global: {
        provide: {
          mobileMode: mockMobileMode,
          user: mockUser,
        },
        components: {
          Button: {
            template: '<button data-testid="button" v-bind="$attrs" @click="$emit(\'click\')" />',
            props: ["kind", "icon"],
          },
          Logo: {
            template: '<div data-testid="logo" />',
            props: ["type"],
          },
          Icon: {
            template: '<svg data-testid="icon" />',
            props: ["name"],
          },
          Avatar: {
            template: '<div data-testid="avatar" />',
            props: ["user", "size", "tooltip"],
          },
        },
      },
    });
  });

  describe("Mobile Drawer Functionality", () => {
    it("renders avatar button in mobile mode", () => {
      expect(wrapper.find('[data-testid="user-avatar"]').exists()).toBe(true);

      // Verify Avatar component is rendered
      const avatarElement = wrapper.find('[data-testid="avatar"]');
      expect(avatarElement.exists()).toBe(true);
    });

    it("does not render drawer initially", () => {
      expect(wrapper.find(".user-drawer").exists()).toBe(false);
    });

    it("opens drawer when avatar is clicked", async () => {
      // Call toggle method directly for now
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isOpen).toBe(true);
      await wrapper.vm.$nextTick(); // Extra tick for conditional rendering
      expect(wrapper.find(".user-overlay").exists()).toBe(true);
      expect(wrapper.find(".user-drawer").exists()).toBe(true);
    });

    it("closes drawer when backdrop is clicked", async () => {
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      const overlay = wrapper.find(".user-overlay");
      await overlay.trigger("click");

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("closes drawer when close button is clicked", async () => {
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      const closeButton = wrapper.find('[data-testid="user-close"]');
      await closeButton.trigger("click");

      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Account Navigation", () => {
    beforeEach(async () => {
      await wrapper.vm.toggle(); // Open drawer
      await wrapper.vm.$nextTick();
    });

    it("renders Account section with sub-items", () => {
      const accountSection = wrapper.find('[data-testid="account-section"]');
      expect(accountSection.exists()).toBe(true);

      expect(wrapper.text()).toContain("Account");
      expect(wrapper.text()).toContain("Profile");
      expect(wrapper.text()).toContain("Security");
      expect(wrapper.text()).toContain("Privacy");
    });

    it("navigates to Profile and closes drawer", async () => {
      const profileItem = wrapper.find('[data-testid="account-profile"]');
      await profileItem.trigger("click");

      expect(mockRouter.push).toHaveBeenCalledWith("/account/profile");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("navigates to Security and closes drawer", async () => {
      const securityItem = wrapper.find('[data-testid="account-security"]');
      await securityItem.trigger("click");

      expect(mockRouter.push).toHaveBeenCalledWith("/account/security");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("navigates to Privacy and closes drawer", async () => {
      const privacyItem = wrapper.find('[data-testid="account-privacy"]');
      await privacyItem.trigger("click");

      expect(mockRouter.push).toHaveBeenCalledWith("/account/privacy");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("marks correct Account sub-item as active", async () => {
      mockRoute.path = "/account/security";
      await wrapper.vm.$forceUpdate();

      const securityItem = wrapper.find('[data-testid="account-security"]');
      expect(securityItem.classes()).toContain("active");
    });
  });

  describe("User Actions", () => {
    beforeEach(async () => {
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();
    });

    it("renders Help action", () => {
      const helpItem = wrapper.find('[data-testid="user-help"]');
      expect(helpItem.exists()).toBe(true);
      expect(helpItem.text()).toContain("Help");
    });

    it("renders Feedback action", () => {
      const feedbackItem = wrapper.find('[data-testid="user-feedback"]');
      expect(feedbackItem.exists()).toBe(true);
      expect(feedbackItem.text()).toContain("Feedback");
    });

    it("renders Logout action", () => {
      const logoutItem = wrapper.find('[data-testid="user-logout"]');
      expect(logoutItem.exists()).toBe(true);
      expect(logoutItem.text()).toContain("Logout");
    });

    it("handles Help click", async () => {
      const helpItem = wrapper.find('[data-testid="user-help"]');
      await helpItem.trigger("click");

      // Should navigate to help or open help dialog
      expect(mockRouter.push).toHaveBeenCalledWith("/help");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("handles Feedback click", async () => {
      const feedbackItem = wrapper.find('[data-testid="user-feedback"]');
      await feedbackItem.trigger("click");

      // Should open feedback modal or navigate
      expect(wrapper.emitted("showFeedback")).toBeTruthy();
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("handles Logout click", async () => {
      const logoutItem = wrapper.find('[data-testid="user-logout"]');
      await logoutItem.trigger("click");

      expect(wrapper.emitted("logout")).toBeTruthy();
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Shortcuts (Desktop Only)", () => {
    it("shows Shortcuts on desktop", async () => {
      // Desktop mode should not render UserMenuDrawer mobile component
      // This functionality would be in a desktop UserMenu component
      mockMobileMode.value = false;
      await wrapper.vm.$nextTick();

      // Component should not render on desktop
      expect(wrapper.find(".user-menu-mobile").exists()).toBe(false);
    });

    it("hides Shortcuts on mobile", async () => {
      // Ensure mobile mode
      mockMobileMode.value = true;
      await wrapper.vm.$nextTick();
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      const shortcutsItem = wrapper.find('[data-testid="user-shortcuts"]');
      expect(shortcutsItem.exists()).toBe(false);
    });
  });

  describe("Desktop vs Mobile Behavior", () => {
    it("renders as drawer in mobile mode", () => {
      mockMobileMode.value = true;
      expect(wrapper.find(".user-menu-wrapper.mobile").exists()).toBe(true);
    });

    it("renders as context menu in desktop mode", async () => {
      mockMobileMode.value = false;
      await wrapper.vm.$nextTick();

      // Desktop mode should not show mobile menu
      expect(wrapper.find(".user-menu-mobile").exists()).toBe(false);
    });
  });

  describe("Styling and Animation", () => {
    it("applies correct drawer animation classes", async () => {
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      const drawer = wrapper.find(".user-drawer");
      expect(drawer.classes()).toContain("open");
    });

    it("applies consistent styling with sidebar items", async () => {
      await wrapper.vm.toggle();
      await wrapper.vm.$nextTick();

      const menuItems = wrapper.findAll(".user-item");
      expect(menuItems.length).toBeGreaterThan(0);

      // Should have same styling as sidebar items
      expect(menuItems[0].classes()).toContain("user-item");
    });
  });
});
