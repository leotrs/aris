import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import IndexPage from "../../pages/index.vue";

// Mock the section components
vi.mock("~/components/home/HeroSection.vue", () => ({
  default: {
    name: "HeroSection",
    template: "<div data-testid='hero-section'>HeroSection</div>",
  },
}));

vi.mock("~/components/home/PlatformOverview.vue", () => ({
  default: {
    name: "PlatformOverview",
    template: "<div data-testid='platform-overview'>PlatformOverview</div>",
  },
}));

vi.mock("~/components/home/HomeCTASection.vue", () => ({
  default: {
    name: "HomeCTASection",
    template: "<div data-testid='home-cta-section'>HomeCTASection</div>",
  },
}));

describe("Index Page", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Basic Rendering", () => {
    it("should render main page container", () => {
      wrapper = mount(IndexPage);

      const mainContainer = wrapper.find("div");
      expect(mainContainer.exists()).toBe(true);
    });

    it("should render all required sections", () => {
      wrapper = mount(IndexPage);

      const heroSection = wrapper.find('[data-testid="hero-section"]');
      const platformOverview = wrapper.find('[data-testid="platform-overview"]');
      const homeCTASection = wrapper.find('[data-testid="home-cta-section"]');

      expect(heroSection.exists()).toBe(true);
      expect(platformOverview.exists()).toBe(true);
      expect(homeCTASection.exists()).toBe(true);
    });
  });

  describe("Section Order", () => {
    it("should render sections in correct order", () => {
      wrapper = mount(IndexPage);

      const sections = wrapper.findAll('[data-testid]');

      expect(sections[0].attributes("data-testid")).toBe("hero-section");
      expect(sections[1].attributes("data-testid")).toBe("platform-overview");
      expect(sections[2].attributes("data-testid")).toBe("home-cta-section");
    });

    it("should have proper section count", () => {
      wrapper = mount(IndexPage);

      const allSections = wrapper.findAll('[data-testid]');
      expect(allSections.length).toBe(3);
    });
  });

  describe("Component Composition", () => {
    it("should import and use HeroSection component", () => {
      wrapper = mount(IndexPage);

      const heroSection = wrapper.find('[data-testid="hero-section"]');
      expect(heroSection.exists()).toBe(true);
      expect(heroSection.text()).toBe("HeroSection");
    });

    it("should import and use PlatformOverview component", () => {
      wrapper = mount(IndexPage);

      const platformOverview = wrapper.find('[data-testid="platform-overview"]');
      expect(platformOverview.exists()).toBe(true);
      expect(platformOverview.text()).toBe("PlatformOverview");
    });

    it("should import and use HomeCTASection component", () => {
      wrapper = mount(IndexPage);

      const homeCTASection = wrapper.find('[data-testid="home-cta-section"]');
      expect(homeCTASection.exists()).toBe(true);
      expect(homeCTASection.text()).toBe("HomeCTASection");
    });
  });

  describe("Page Structure", () => {
    it("should have a single root div element", () => {
      wrapper = mount(IndexPage);

      const rootDivs = wrapper.vm.$el;
      expect(rootDivs.tagName.toLowerCase()).toBe("div");
    });

    it("should contain all sections within the root container", () => {
      wrapper = mount(IndexPage);

      const rootElement = wrapper.element;
      const sections = wrapper.findAll('[data-testid]');

      sections.forEach((section) => {
        expect(rootElement.contains(section.element)).toBe(true);
      });
    });
  });

  describe("Template Structure", () => {
    it("should use proper Vue template structure", () => {
      wrapper = mount(IndexPage);

      // Should have a template wrapper
      expect(wrapper.exists()).toBe(true);

      // Should render without errors
      expect(wrapper.vm).toBeDefined();
    });

    it("should not have any conditional rendering", () => {
      wrapper = mount(IndexPage);

      // All sections should always be present
      const sections = wrapper.findAll('[data-testid]');
      expect(sections.length).toBe(3);
    });
  });

  describe("Component Imports", () => {
    it("should properly import all section components", () => {
      wrapper = mount(IndexPage);

      // Each section should be rendered, indicating successful import
      expect(wrapper.find('[data-testid="hero-section"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="platform-overview"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="home-cta-section"]').exists()).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should have semantic page structure", () => {
      wrapper = mount(IndexPage);

      // Main container should exist
      const container = wrapper.find("div");
      expect(container.exists()).toBe(true);
    });

    it("should provide proper page content flow", () => {
      wrapper = mount(IndexPage);

      const sections = wrapper.findAll('[data-testid]');

      // Sections should flow from hero -> content sections -> CTA
      expect(sections[0].attributes("data-testid")).toBe("hero-section");
      expect(sections[sections.length - 1].attributes("data-testid")).toBe("home-cta-section");
    });
  });

  describe("Performance Considerations", () => {
    it("should render all components synchronously", () => {
      wrapper = mount(IndexPage);

      // All sections should be immediately available
      const sections = wrapper.findAll('[data-testid]');
      expect(sections.length).toBe(3);
    });

    it("should not have any loading states", () => {
      wrapper = mount(IndexPage);

      // Should not contain any loading indicators
      const loadingElements = wrapper.findAll("[data-loading], .loading, .spinner");
      expect(loadingElements.length).toBe(0);
    });
  });
});
