import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import IndexPage from "../../pages/index.vue";

// Mock the section components
vi.mock("~/components/sections/HeroSection.vue", () => ({
  default: {
    name: "HeroSection",
    template: "<div data-testid='hero-section'>HeroSection</div>",
  },
}));

vi.mock("~/components/sections/SectionTwo.vue", () => ({
  default: {
    name: "SectionTwo",
    template: "<div data-testid='section-two'>SectionTwo</div>",
  },
}));

vi.mock("~/components/sections/SectionThree.vue", () => ({
  default: {
    name: "SectionThree",
    template: "<div data-testid='section-three'>SectionThree</div>",
  },
}));

vi.mock("~/components/sections/SectionFour.vue", () => ({
  default: {
    name: "SectionFour",
    template: "<div data-testid='section-four'>SectionFour</div>",
  },
}));

vi.mock("~/components/sections/SectionCTA.vue", () => ({
  default: {
    name: "SectionCTA",
    template: "<div data-testid='section-cta'>SectionCTA</div>",
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
      const sectionTwo = wrapper.find('[data-testid="section-two"]');
      const sectionThree = wrapper.find('[data-testid="section-three"]');
      const sectionFour = wrapper.find('[data-testid="section-four"]');
      const sectionCTA = wrapper.find('[data-testid="section-cta"]');

      expect(heroSection.exists()).toBe(true);
      expect(sectionTwo.exists()).toBe(true);
      expect(sectionThree.exists()).toBe(true);
      expect(sectionFour.exists()).toBe(true);
      expect(sectionCTA.exists()).toBe(true);
    });
  });

  describe("Section Order", () => {
    it("should render sections in correct order", () => {
      wrapper = mount(IndexPage);

      const sections = wrapper.findAll('[data-testid^="hero-section"], [data-testid^="section-"]');

      expect(sections[0].attributes("data-testid")).toBe("hero-section");
      expect(sections[1].attributes("data-testid")).toBe("section-two");
      expect(sections[2].attributes("data-testid")).toBe("section-three");
      expect(sections[3].attributes("data-testid")).toBe("section-four");
      expect(sections[4].attributes("data-testid")).toBe("section-cta");
    });

    it("should have proper section count", () => {
      wrapper = mount(IndexPage);

      const allSections = wrapper.findAll(
        '[data-testid^="hero-section"], [data-testid^="section-"]'
      );
      expect(allSections.length).toBe(5);
    });
  });

  describe("Component Composition", () => {
    it("should import and use HeroSection component", () => {
      wrapper = mount(IndexPage);

      const heroSection = wrapper.find('[data-testid="hero-section"]');
      expect(heroSection.exists()).toBe(true);
      expect(heroSection.text()).toBe("HeroSection");
    });

    it("should import and use SectionTwo component", () => {
      wrapper = mount(IndexPage);

      const sectionTwo = wrapper.find('[data-testid="section-two"]');
      expect(sectionTwo.exists()).toBe(true);
      expect(sectionTwo.text()).toBe("SectionTwo");
    });

    it("should import and use SectionThree component", () => {
      wrapper = mount(IndexPage);

      const sectionThree = wrapper.find('[data-testid="section-three"]');
      expect(sectionThree.exists()).toBe(true);
      expect(sectionThree.text()).toBe("SectionThree");
    });

    it("should import and use SectionFour component", () => {
      wrapper = mount(IndexPage);

      const sectionFour = wrapper.find('[data-testid="section-four"]');
      expect(sectionFour.exists()).toBe(true);
      expect(sectionFour.text()).toBe("SectionFour");
    });

    it("should import and use SectionCTA component", () => {
      wrapper = mount(IndexPage);

      const sectionCTA = wrapper.find('[data-testid="section-cta"]');
      expect(sectionCTA.exists()).toBe(true);
      expect(sectionCTA.text()).toBe("SectionCTA");
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
      const sections = wrapper.findAll('[data-testid^="hero-section"], [data-testid^="section-"]');

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
      const sections = wrapper.findAll('[data-testid^="hero-section"], [data-testid^="section-"]');
      expect(sections.length).toBe(5);
    });
  });

  describe("Component Imports", () => {
    it("should properly import all section components", () => {
      wrapper = mount(IndexPage);

      // Each section should be rendered, indicating successful import
      expect(wrapper.find('[data-testid="hero-section"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="section-two"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="section-three"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="section-four"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="section-cta"]').exists()).toBe(true);
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

      const sections = wrapper.findAll('[data-testid^="hero-section"], [data-testid^="section-"]');

      // Sections should flow from hero -> content sections -> CTA
      expect(sections[0].attributes("data-testid")).toBe("hero-section");
      expect(sections[sections.length - 1].attributes("data-testid")).toBe("section-cta");
    });
  });

  describe("Performance Considerations", () => {
    it("should render all components synchronously", () => {
      wrapper = mount(IndexPage);

      // All sections should be immediately available
      const sections = wrapper.findAll('[data-testid^="hero-section"], [data-testid^="section-"]');
      expect(sections.length).toBe(5);
    });

    it("should not have any loading states", () => {
      wrapper = mount(IndexPage);

      // Should not contain any loading indicators
      const loadingElements = wrapper.findAll("[data-loading], .loading, .spinner");
      expect(loadingElements.length).toBe(0);
    });
  });
});
