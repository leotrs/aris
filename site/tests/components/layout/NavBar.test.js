import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import NavBar from "../../../components/layout/NavBar.vue";

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
      wrapper = mount(NavBar, {
        global: {
          stubs: {
            Logo: {
              template:
                '<img data-testid="logo-stub" src="http://localhost:8001/design-assets/logos/logo-32px.svg" alt="Aris Logo" />',
              props: ["type", "alt", "class"],
            },
          },
        },
      });

      const logo = wrapper.find('[data-testid="logo-stub"]');
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

    it("should render utility links with correct URLs", () => {
      const mockUseRuntimeConfig = vi.fn(() => ({
        public: {
          frontendUrl: "http://localhost:5173",
        },
      }));

      wrapper = mount(NavBar, {
        global: {
          provide: {
            useRuntimeConfig: mockUseRuntimeConfig,
          },
          stubs: {
            useRuntimeConfig: mockUseRuntimeConfig,
          },
        },
      });

      // Test that the links exist with the expected text
      const loginLinks = wrapper.findAll("a").filter((link) => link.text() === "Login");
      const signupLinks = wrapper.findAll("a").filter((link) => link.text() === "Sign Up");
      const demoLinks = wrapper.findAll("a").filter((link) => link.text() === "Try the Demo");

      expect(loginLinks.length).toBeGreaterThan(0);
      expect(signupLinks.length).toBeGreaterThan(0);
      expect(demoLinks.length).toBeGreaterThan(0);

      // Check that at least one login link has the frontend URL
      const hasCorrectLoginUrl = loginLinks.some((link) =>
        link.attributes("href")?.includes("localhost:5173/login")
      );
      expect(hasCorrectLoginUrl).toBe(true);
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
      expect(dropdownMenu.exists()).toBe(true);
      expect(dropdownMenu.isVisible()).toBe(false);
    });

    it("should show dropdown menu on hover", async () => {
      wrapper = mount(NavBar);

      const dropdownContainer = wrapper.find(".has-dropdown");
      await dropdownContainer.trigger("mouseenter");

      const dropdownMenu = wrapper.find(".dropdown-menu");
      expect(dropdownMenu.isVisible()).toBe(true);

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
      expect(wrapper.find(".dropdown-menu").isVisible()).toBe(true);

      await dropdownContainer.trigger("mouseleave");
      expect(wrapper.find(".dropdown-menu").attributes("style")).toBe("display: none;");
    });

    it("should toggle dropdown on click", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("click");

      expect(wrapper.find(".dropdown-menu").isVisible()).toBe(true);

      await dropdownToggle.trigger("click");
      expect(wrapper.find(".dropdown-menu").attributes("style")).toBe("display: none;");
    });

    it("should toggle dropdown on Enter key", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("keydown.enter");

      expect(wrapper.find(".dropdown-menu").isVisible()).toBe(true);
    });

    it("should toggle dropdown on Space key", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("keydown.space");

      expect(wrapper.find(".dropdown-menu").isVisible()).toBe(true);
    });

    it("should close dropdown on Escape key", async () => {
      wrapper = mount(NavBar);

      const dropdownToggle = wrapper.find(".dropdown-toggle");
      await dropdownToggle.trigger("click");
      expect(wrapper.find(".dropdown-menu").isVisible()).toBe(true);

      await dropdownToggle.trigger("keydown.escape");
      expect(wrapper.find(".dropdown-menu").attributes("style")).toBe("display: none;");
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

    it("should render mobile utility links with correct URLs", async () => {
      const mockUseRuntimeConfig = vi.fn(() => ({
        public: {
          frontendUrl: "http://localhost:5173",
        },
      }));

      wrapper = mount(NavBar, {
        global: {
          provide: {
            useRuntimeConfig: mockUseRuntimeConfig,
          },
          stubs: {
            useRuntimeConfig: mockUseRuntimeConfig,
          },
        },
      });

      const menuToggle = wrapper.find(".menu-toggle");
      await menuToggle.trigger("click");

      // Test that mobile links exist with expected text
      const mobileLoginLinks = wrapper
        .findAll(".mobile-nav-link")
        .filter((link) => link.text() === "Login");
      const mobileSignupLinks = wrapper
        .findAll(".mobile-nav-link")
        .filter((link) => link.text() === "Sign Up");
      const mobileDemoLinks = wrapper
        .findAll(".mobile-nav-link")
        .filter((link) => link.text() === "Try the Demo");

      expect(mobileLoginLinks.length).toBeGreaterThan(0);
      expect(mobileSignupLinks.length).toBeGreaterThan(0);
      expect(mobileDemoLinks.length).toBeGreaterThan(0);

      // Check that mobile login link has the correct frontend URL
      const hasCorrectMobileLoginUrl = mobileLoginLinks.some((link) =>
        link.attributes("href")?.includes("localhost:5173/login")
      );
      expect(hasCorrectMobileLoginUrl).toBe(true);
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

  describe("Link Validation", () => {
    it("should identify broken internal links", () => {
      wrapper = mount(NavBar);

      // These are currently broken links that need pages created
      const brokenLinks = [
        { selector: 'a[href="/about"]', text: "About" },
        { selector: 'a[href="/ai-copilot"]', text: "AI Copilot" },
        { selector: 'a[href="/pricing"]', text: "Pricing" },
        { selector: 'a[href="/documentation"]', text: "Documentation" },
        { selector: 'a[href="/blog"]', text: "Blog" },
      ];

      brokenLinks.forEach(({ selector, text }) => {
        const link = wrapper.find(selector);
        expect(link.exists()).toBe(true);
        expect(link.text()).toBe(text);
        // These currently point to non-existent pages
        console.warn(`Broken link found: ${text} -> ${link.attributes("href")}`);
      });
    });

    it("should verify external links point to frontend app", () => {
      const mockUseRuntimeConfig = vi.fn(() => ({
        public: {
          frontendUrl: "http://localhost:5173",
        },
      }));

      wrapper = mount(NavBar, {
        global: {
          provide: {
            useRuntimeConfig: mockUseRuntimeConfig,
          },
          stubs: {
            useRuntimeConfig: mockUseRuntimeConfig,
          },
        },
      });

      // Find all links and check that login/demo links point to frontend
      const allLinks = wrapper.findAll("a");
      const loginLinks = allLinks.filter((link) => link.text() === "Login");
      const demoLinks = allLinks.filter((link) => link.text() === "Try the Demo");

      expect(loginLinks.length).toBeGreaterThan(0);
      expect(demoLinks.length).toBeGreaterThan(0);

      // Verify at least one login link points to frontend
      const hasCorrectLoginUrl = loginLinks.some((link) =>
        link.attributes("href")?.includes("localhost:5173/login")
      );
      const hasCorrectDemoUrl = demoLinks.some((link) =>
        link.attributes("href")?.includes("localhost:5173/demo")
      );

      expect(hasCorrectLoginUrl).toBe(true);
      expect(hasCorrectDemoUrl).toBe(true);
    });

    it("should verify existing internal links", () => {
      wrapper = mount(NavBar);

      // These pages actually exist
      const validLinks = [
        { selector: 'a[href="/signup"]', text: "Sign Up" },
        { selector: 'a[href="/"]', ariaLabel: "Home - Aris" },
      ];

      validLinks.forEach(({ selector, text, ariaLabel }) => {
        const link = wrapper.find(selector);
        expect(link.exists()).toBe(true);
        if (text) expect(link.text()).toBe(text);
        if (ariaLabel) expect(link.attributes("aria-label")).toBe(ariaLabel);
      });
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
