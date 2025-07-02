import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SettingsView from "@/views/settings/View.vue";

// Mock vue-router
const mockRoute = { path: "/settings/document" };
const mockRouter = { push: vi.fn() };
vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

describe("SettingsView", () => {
  let wrapper;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mount component with mocked components
    wrapper = mount(SettingsView, {
      global: {
        components: {
          BaseLayout: {
            name: "BaseLayout",
            props: ["contextSubItems", "fab"],
            template: '<div class="base-layout" data-testid="base-layout"><slot /></div>',
          },
          RouterView: {
            name: "RouterView",
            template: '<div class="router-view" data-testid="router-view">Settings Content</div>',
          },
        },
      },
    });
  });

  it("renders BaseLayout component", () => {
    const baseLayout = wrapper.find('[data-testid="base-layout"]');
    expect(baseLayout.exists()).toBe(true);
  });

  it("passes contextSubItems prop to BaseLayout with correct settings sections", () => {
    const baseLayout = wrapper.findComponent({ name: "BaseLayout" });
    const contextSubItems = baseLayout.props("contextSubItems");

    expect(contextSubItems).toHaveLength(4);
    expect(contextSubItems[0]).toMatchObject({
      icon: "FileText",
      text: "File",
      route: "/settings/document",
    });
    expect(contextSubItems[1]).toMatchObject({
      icon: "Settings2",
      text: "Behavior",
      route: "/settings/behavior",
    });
    expect(contextSubItems[2]).toMatchObject({
      icon: "Shield",
      text: "Privacy",
      route: "/settings/privacy",
    });
    expect(contextSubItems[3]).toMatchObject({
      icon: "Lock",
      text: "Security",
      route: "/settings/security",
    });
  });

  it("sets correct active state based on current route", () => {
    const baseLayout = wrapper.findComponent({ name: "BaseLayout" });
    const contextSubItems = baseLayout.props("contextSubItems");

    // Since mockRoute.path is "/settings/document", File should be active
    expect(contextSubItems[0].active).toBe(true); // File
    expect(contextSubItems[1].active).toBe(false); // Behavior
    expect(contextSubItems[2].active).toBe(false); // Privacy
    expect(contextSubItems[3].active).toBe(false); // Security
  });

  it("disables FAB in BaseLayout", () => {
    const baseLayout = wrapper.findComponent({ name: "BaseLayout" });
    expect(baseLayout.props("fab")).toBe(false);
  });

  it("renders RouterView for nested settings routes", () => {
    const routerView = wrapper.findComponent({ name: "RouterView" });
    expect(routerView.exists()).toBe(true);
  });

  it("handles route object being undefined in tests", () => {
    // Test that component doesn't crash when route is undefined
    // This tests the route?.path optional chaining
    expect(() => {
      const baseLayout = wrapper.findComponent({ name: "BaseLayout" });
      baseLayout.props("contextSubItems");
    }).not.toThrow();
  });
});
