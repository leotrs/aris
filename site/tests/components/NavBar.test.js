import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import NavBar from "../../components/NavBar.vue";

// Mock DOM methods that aren't available in jsdom
Object.defineProperty(window, "scrollY", {
  writable: true,
  value: 0,
});

Object.defineProperty(window, "addEventListener", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, "removeEventListener", {
  writable: true,
  value: vi.fn(),
});

// Mock document.body.style
Object.defineProperty(document.body, "style", {
  value: {
    overflow: "",
  },
  writable: true,
});

describe("NavBar Component", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
    document.body.style.overflow = "";
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Basic Rendering", () => {
    it("should render navbar with logo", () => {
      wrapper = mount(NavBar);

      const logo = wrapper.find(".navbar-logo img");
      expect(logo.exists()).toBe(true);
      expect(logo.attributes("src")).toBeDefined();
      expect(logo.attributes("alt")).toBe("Aris Logo");
    });

    it("should render main navigation links", () => {
      wrapper = mount(NavBar);

      const navLinks = wrapper.findAll(".navbar-links .nav-link");
      expect(navLinks.length).toBeGreaterThan(0);

      // Check specific navigation links
      const aboutLink = wrapper.find('a[href="/about"]');
      const aiCopilotLink = wrapper.find('a[href="/ai-copilot"]');
      const pricingLink = wrapper.find('a[href="/pricing"]');

      expect(aboutLink.exists()).toBe(true);
      expect(aboutLink.text()).toBe("About");
      expect(aiCopilotLink.exists()).toBe(true);
      expect(aiCopilotLink.text()).toBe("AI Copilot");
      expect(pricingLink.exists()).toBe(true);
      expect(pricingLink.text()).toBe("Pricing");
    });

    it("should render utility links", () => {
      wrapper = mount(NavBar);

      const loginLink = wrapper.find('a[href="/login"]');
      const signupLink = wrapper.find('a[href="/signup"]');
      const demoLink = wrapper.find('a[href="/demo"]');

      expect(loginLink.exists()).toBe(true);
      expect(loginLink.text()).toBe("Login");
      expect(signupLink.exists()).toBe(true);
      expect(signupLink.text()).toBe("Sign Up");
      expect(demoLink.exists()).toBe(true);
      expect(demoLink.text()).toBe("Try the Demo");
    });

    it("should render mobile menu toggle button", () => {
      wrapper = mount(NavBar);

      const menuToggle = wrapper.find(".menu-toggle");
      expect(menuToggle.exists()).toBe(true);
      expect(menuToggle.attributes("aria-label")).toBe("Toggle navigation menu");
    });
  });

  describe("Resources Dropdown", () => {
    it("should render resources dropdown toggle", () => {
      wrapper = mount(NavBar);

      const resourcesToggle = wrapper.find(".dropdown-toggle");
      expect(resourcesToggle.exists()).toBe(true);
      expect(resourcesToggle.text()).toBe("Resources");
      expect(resourcesToggle.attributes("aria-haspopup")).toBe("true");
    });

    it("should not show dropdown menu initially", () => {
      wrapper = mount(NavBar);

      const dropdownMenu = wrapper.find(".dropdown-menu");
      expect(dropdownMenu.exists()).toBe(false);
    });

    it("should show dropdown menu on hover", async () => {
      wrapper = mount(NavBar);

      const dropdownContainer = wrapper.find(".has-dropdown");
      await dropdownContainer.trigger("mouseenter");

      const dropdownMenu = wrapper.find(".dropdown-menu");
      expect(dropdownMenu.exists()).toBe(true);

      const docLink = wrapper.find('a[href="/documentation"]');
      const blogLink = wrapper.find('a[href="/blog"]');
      expect(docLink.exists()).toBe(true);
      expect(docLink.text()).toBe("Documentation");
      expect(blogLink.exists()).toBe(true);
      expect(blogLink.text()).toBe("Blog");
    });

    it("should hide dropdown menu on mouse leave", async () => {
      wrapper = mount(NavBar);

      const dropdownContainer = wrapper.find(".has-dropdown");
      await dropdownContainer.trigger("mouseenter");
      expect(wrapper.find(".dropdown-menu").exists()).toBe(true);

      await dropdownContainer.trigger("mouseleave");
      expect(wrapper.find(".dropdown-menu").exists()).toBe(false);
    });

    it("should toggle dropdown on click", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("click");

      expect(wrapper.find(".dropdown-menu").exists()).toBe(true);

      await dropdownToggle.trigger("click");
      expect(wrapper.find(".dropdown-menu").exists()).toBe(false);
    });

    it("should toggle dropdown on Enter key", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("keydown.enter");

      expect(wrapper.find(".dropdown-menu").exists()).toBe(true);
    });

    it("should toggle dropdown on Space key", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("keydown.space");

      expect(wrapper.find(".dropdown-menu").exists()).toBe(true);
    });

    it("should close dropdown on Escape key", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("click");
      expect(wrapper.find(".dropdown-menu").exists()).toBe(true);

      await dropdownToggle.trigger("keydown.escape");
      expect(wrapper.find(".dropdown-menu").exists()).toBe(false);
    });
  });

  describe("Mobile Menu", () => {
    it("should not show mobile menu initially", () => {
      wrapper = mount(NavBar);

      const mobileMenu = wrapper.find(".mobile-menu-overlay");
      expect(mobileMenu.exists()).toBe(false);
    });

    it("should toggle mobile menu on button click", async () => {
      wrapper = mount(NavBar);

      const menuToggle = wrapper.find(".menu-toggle");
      await menuToggle.trigger("click");

      const mobileMenu = wrapper.find(".mobile-menu-overlay");
      expect(mobileMenu.exists()).toBe(true);
      expect(document.body.style.overflow).toBe("hidden");

      await menuToggle.trigger("click");
      expect(wrapper.find(".mobile-menu-overlay").exists()).toBe(false);
      expect(document.body.style.overflow).toBe("");
    });

    it("should render mobile navigation links", async () => {
      wrapper = mount(NavBar);

      const menuToggle = wrapper.find(".menu-toggle");
      await menuToggle.trigger("click");

      const mobileAboutLink = wrapper.find('.mobile-nav-link[href="/about"]');
      const mobileAiCopilotLink = wrapper.find('.mobile-nav-link[href="/ai-copilot"]');
      const mobilePricingLink = wrapper.find('.mobile-nav-link[href="/pricing"]');

      expect(mobileAboutLink.exists()).toBe(true);
      expect(mobileAboutLink.text()).toBe("About");
      expect(mobileAiCopilotLink.exists()).toBe(true);
      expect(mobileAiCopilotLink.text()).toBe("AI Copilot");
      expect(mobilePricingLink.exists()).toBe(true);
      expect(mobilePricingLink.text()).toBe("Pricing");
    });

    it("should render mobile utility links", async () => {
      wrapper = mount(NavBar);

      const menuToggle = wrapper.find(".menu-toggle");
      await menuToggle.trigger("click");

      const mobileLoginLink = wrapper.find('.mobile-nav-link[href="/login"]');
      const mobileSignupLink = wrapper.find('.mobile-nav-link[href="/signup"]');
      const mobileDemoLink = wrapper.find('.mobile-nav-link[href="/demo"]');

      expect(mobileLoginLink.exists()).toBe(true);
      expect(mobileLoginLink.text()).toBe("Login");
      expect(mobileSignupLink.exists()).toBe(true);
      expect(mobileSignupLink.text()).toBe("Sign Up");
      expect(mobileDemoLink.exists()).toBe(true);
      expect(mobileDemoLink.text()).toBe("Try the Demo");
    });

    it("should close mobile menu when navigation link is clicked", async () => {
      wrapper = mount(NavBar);

      const menuToggle = wrapper.find(".menu-toggle");
      await menuToggle.trigger("click");
      expect(wrapper.find(".mobile-menu-overlay").exists()).toBe(true);

      const mobileAboutLink = wrapper.find('.mobile-nav-link[href="/about"]');
      await mobileAboutLink.trigger("click");

      expect(wrapper.find(".mobile-menu-overlay").exists()).toBe(false);
      expect(document.body.style.overflow).toBe("");
    });

    it("should handle mobile resources dropdown", async () => {
      wrapper = mount(NavBar);

      const menuToggle = wrapper.find(".menu-toggle");
      await menuToggle.trigger("click");

      const mobileResourcesToggle = wrapper.find(".mobile-dropdown-toggle");
      expect(mobileResourcesToggle.exists()).toBe(true);
      expect(mobileResourcesToggle.text()).toBe("Resources");

      // Initially no mobile dropdown menu
      expect(wrapper.find(".mobile-dropdown-menu").exists()).toBe(false);

      // Click to open mobile dropdown
      await mobileResourcesToggle.trigger("click");
      expect(wrapper.find(".mobile-dropdown-menu").exists()).toBe(true);

      const mobileDocLink = wrapper.find('.mobile-dropdown-link[href="/documentation"]');
      const mobileBlogLink = wrapper.find('.mobile-dropdown-link[href="/blog"]');
      expect(mobileDocLink.exists()).toBe(true);
      expect(mobileDocLink.text()).toBe("Documentation");
      expect(mobileBlogLink.exists()).toBe(true);
      expect(mobileBlogLink.text()).toBe("Blog");
    });
  });

  describe("Scroll Behavior", () => {
    it("should add scrolled class when scrolled", async () => {
      wrapper = mount(NavBar);

      // Initially not scrolled
      expect(wrapper.find(".navbar-scrolled").exists()).toBe(false);

      // Simulate scroll
      window.scrollY = 100;
      const handleScroll = window.addEventListener.mock.calls.find(
        (call) => call[0] === "scroll"
      )[1];
      handleScroll();

      await wrapper.vm.$nextTick();
      expect(wrapper.find(".navbar-scrolled").exists()).toBe(true);
    });

    it("should not add scrolled class when scroll is minimal", async () => {
      wrapper = mount(NavBar);

      // Small scroll
      window.scrollY = 25;
      const handleScroll = window.addEventListener.mock.calls.find(
        (call) => call[0] === "scroll"
      )[1];
      handleScroll();

      await wrapper.vm.$nextTick();
      expect(wrapper.find(".navbar-scrolled").exists()).toBe(false);
    });

    it("should remove scroll event listener on unmount", () => {
      wrapper = mount(NavBar);

      expect(window.addEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));

      wrapper.unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      wrapper = mount(NavBar);

      const navbar = wrapper.find('[role="navigation"]');
      expect(navbar.exists()).toBe(true);
      expect(navbar.attributes("aria-label")).toBe("Main navigation");

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      expect(dropdownToggle.attributes("aria-haspopup")).toBe("true");
      expect(dropdownToggle.attributes("role")).toBe("button");
    });

    it("should have proper logo link accessibility", () => {
      wrapper = mount(NavBar);

      const logoLink = wrapper.find('.navbar-logo a[href="/"]');
      expect(logoLink.exists()).toBe(true);
      expect(logoLink.attributes("aria-label")).toBe("Home - Aris");
    });

    it("should show correct menu icon based on state", async () => {
      wrapper = mount(NavBar);

      // Initially should show menu icon
      expect(wrapper.find(".icon-tabler-menu-2").exists()).toBe(true);
      expect(wrapper.find(".icon-tabler-x").exists()).toBe(false);

      // After clicking toggle, should show close icon
      await wrapper.find(".menu-toggle").trigger("click");
      expect(wrapper.find(".icon-tabler-menu-2").exists()).toBe(false);
      expect(wrapper.find(".icon-tabler-x").exists()).toBe(true);
    });
  });
});
