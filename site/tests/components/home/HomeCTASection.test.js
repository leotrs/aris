import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import HomeCTASection from "../../../components/home/HomeCTASection.vue";

describe("HomeCTASection Component", () => {
  let wrapper;

  beforeEach(() => {
    // Any setup before each test
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Basic Rendering", () => {
    it("should render CTA section container", () => {
      wrapper = mount(HomeCTASection);

      const section = wrapper.find(".cta-section");
      expect(section.exists()).toBe(true);
      expect(section.element.tagName.toLowerCase()).toBe("section");
    });

    it("should render CTA headline", () => {
      wrapper = mount(HomeCTASection);

      const headline = wrapper.find(".cta-headline");
      expect(headline.exists()).toBe(true);
      expect(headline.text().length).toBeGreaterThan(5);
      expect(headline.element.tagName.toLowerCase()).toBe("h2");
    });

    it("should render content wrapper", () => {
      wrapper = mount(HomeCTASection);

      const contentWrapper = wrapper.find(".cta-content-wrapper");
      expect(contentWrapper.exists()).toBe(true);
    });
  });

  describe("Call-to-Action Elements", () => {
    it("should render primary CTA button", () => {
      wrapper = mount(HomeCTASection);

      const primaryButton = wrapper.find(".btn.btn-primary");
      expect(primaryButton.exists()).toBe(true);
      expect(primaryButton.text().length).toBeGreaterThan(3);
      expect(primaryButton.element.tagName.toLowerCase()).toBe("a");
    });

    it("should render secondary CTA link", () => {
      wrapper = mount(HomeCTASection);

      const secondaryLink = wrapper.find(".text-link");
      expect(secondaryLink.exists()).toBe(true);
      expect(secondaryLink.text().length).toBeGreaterThan(3);
      expect(secondaryLink.classes()).toContain("text-link");
    });

    it("should render CTAs within buttons container", () => {
      wrapper = mount(HomeCTASection);

      const ctaButtons = wrapper.find(".cta-buttons");
      expect(ctaButtons.exists()).toBe(true);

      // Both CTAs should be within this container
      const button = ctaButtons.find(".btn.btn-primary");
      const link = ctaButtons.find(".text-link");
      expect(button.exists()).toBe(true);
      expect(link.exists()).toBe(true);
    });
  });

  describe("Content Validation", () => {
    it("should have meaningful headline text", () => {
      wrapper = mount(HomeCTASection);

      const headline = wrapper.find(".cta-headline").text();

      expect(headline.length).toBeGreaterThan(20);
      expect(headline.length).toBeGreaterThan(5);
    });

    it("should have proper button text", () => {
      wrapper = mount(HomeCTASection);

      const primaryButton = wrapper.find(".btn.btn-primary");
      const secondaryLink = wrapper.find(".text-link");

      expect(primaryButton.text().length).toBeGreaterThan(3);
      expect(secondaryLink.text().length).toBeGreaterThan(3);
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      wrapper = mount(HomeCTASection);

      const headline = wrapper.find(".cta-headline");
      expect(headline.element.tagName.toLowerCase()).toBe("h2");
    });

    it("should have semantic HTML structure", () => {
      wrapper = mount(HomeCTASection);

      // Should be a section element
      const section = wrapper.find("section");
      expect(section.exists()).toBe(true);

      // Should have proper heading tag
      const h2 = wrapper.find("h2");
      expect(h2.exists()).toBe(true);
    });
  });

  describe("Link and Navigation", () => {
    it("should have correct link target", () => {
      wrapper = mount(HomeCTASection);

      const contactLink = wrapper.find('a[href="/contact"]');
      expect(contactLink.exists()).toBe(true);
      expect(contactLink.attributes("href")).toBe("/contact");
    });

    it("should not have any broken or empty links", () => {
      wrapper = mount(HomeCTASection);

      const links = wrapper.findAll("a");
      links.forEach((link) => {
        const href = link.attributes("href");
        expect(href).toBeDefined();
        expect(href.trim()).not.toBe("");
        expect(href).not.toBe("#");
      });
    });
  });

  describe("CSS Classes", () => {
    it("should have proper CSS class structure", () => {
      wrapper = mount(HomeCTASection);

      // Main container classes
      expect(wrapper.find(".cta-section").exists()).toBe(true);
      expect(wrapper.find(".cta-content-wrapper").exists()).toBe(true);
      expect(wrapper.find(".cta-headline").exists()).toBe(true);
      expect(wrapper.find(".cta-buttons").exists()).toBe(true);

      // Button classes
      expect(wrapper.find(".btn.btn-primary").exists()).toBe(true);
      expect(wrapper.find(".text-link").exists()).toBe(true);
    });
  });

  describe("Component Structure", () => {
    it("should have proper layout structure", () => {
      wrapper = mount(HomeCTASection);

      const contentWrapper = wrapper.find(".cta-content-wrapper");
      expect(contentWrapper.exists()).toBe(true);

      // Content wrapper should contain headline and buttons
      expect(contentWrapper.find(".cta-headline").exists()).toBe(true);
      expect(contentWrapper.find(".cta-buttons").exists()).toBe(true);
    });

    it("should have centered layout elements", () => {
      wrapper = mount(HomeCTASection);

      const ctaButtons = wrapper.find(".cta-buttons");
      expect(ctaButtons.exists()).toBe(true);

      // Should contain both CTA elements
      const buttons = ctaButtons.findAll("button, a");
      expect(buttons.length).toBe(2);
    });
  });

  describe("Button Functionality", () => {
    it("should render link with proper href", () => {
      wrapper = mount(HomeCTASection);

      const button = wrapper.find(".btn.btn-primary");
      expect(button.exists()).toBe(true);
      expect(button.element.tagName.toLowerCase()).toBe("a");
      expect(button.attributes("href")).toBe("/getting-started");
    });

    it("should have link element for secondary action", () => {
      wrapper = mount(HomeCTASection);

      const link = wrapper.find('a[href="/contact"]');
      expect(link.exists()).toBe(true);
      expect(link.element.tagName.toLowerCase()).toBe("a");
    });
  });
});
