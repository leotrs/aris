import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import HeroSection from "../../../components/sections/HeroSection.vue";

describe("HeroSection Component", () => {
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
    it("should render hero section container", () => {
      wrapper = mount(HeroSection);

      const heroSection = wrapper.find(".hero-section");
      expect(heroSection.exists()).toBe(true);
    });

    it("should render main headline", () => {
      wrapper = mount(HeroSection);

      const headline = wrapper.find("#hero-heading");
      expect(headline.exists()).toBe(true);
      expect(headline.text()).toBe("Aris: The Unified Platform for Human-First Scientific Research.");
      expect(headline.classes()).toContain("hero-headline");
    });

    it("should render hero subheadline", () => {
      wrapper = mount(HeroSection);

      const subheadline = wrapper.find(".hero-subheadline");
      expect(subheadline.exists()).toBe(true);
      expect(subheadline.text()).toContain("Experience an integrated platform for collaborative writing");
      expect(subheadline.text()).toContain("intelligent peer review");
      expect(subheadline.text()).toContain("interactive publishing");
    });

    it("should render hero background element", () => {
      wrapper = mount(HeroSection);

      const heroBackground = wrapper.find(".hero-background");
      expect(heroBackground.exists()).toBe(true);
      expect(heroBackground.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("Call-to-Action Elements", () => {
    it("should render primary CTA button", () => {
      wrapper = mount(HeroSection);

      const primaryButton = wrapper.find(".btn.btn-primary");
      expect(primaryButton.exists()).toBe(true);
      expect(primaryButton.text()).toBe("Try the Demo"); 
      expect(primaryButton.attributes("type")).toBe("button");
    });

    it("should render secondary CTA link", () => {
      wrapper = mount(HeroSection);

      const secondaryLink = wrapper.find('a[href="/signup"]');
      expect(secondaryLink.exists()).toBe(true);
      expect(secondaryLink.text()).toBe("Or, sign up for the beta waitlist");
      expect(secondaryLink.classes()).toContain("text-link");
    });

    it("should render CTAs within proper container", () => {
      wrapper = mount(HeroSection);

      const ctaContainer = wrapper.find(".hero-ctas");
      expect(ctaContainer.exists()).toBe(true);
      expect(ctaContainer.attributes("role")).toBe("group");
      expect(ctaContainer.attributes("aria-label")).toBe("Call to action buttons");

      // Both CTAs should be within this container
      const button = ctaContainer.find(".btn.btn-primary");
      const link = ctaContainer.find('a[href="/signup"]');
      expect(button.exists()).toBe(true);
      expect(link.exists()).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labeling", () => {
      wrapper = mount(HeroSection);

      const heroSection = wrapper.find(".hero-section");
      expect(heroSection.attributes("aria-labelledby")).toBe("hero-heading");

      const ctaGroup = wrapper.find(".hero-ctas");
      expect(ctaGroup.attributes("role")).toBe("group");
      expect(ctaGroup.attributes("aria-label")).toBe("Call to action buttons");
    });

    it("should have primary button connected to heading", () => {
      wrapper = mount(HeroSection);

      const primaryButton = wrapper.find(".btn.btn-primary");
      expect(primaryButton.attributes("aria-describedby")).toBe("hero-heading");
    });

    it("should hide decorative elements from screen readers", () => {
      wrapper = mount(HeroSection);

      const heroBackground = wrapper.find(".hero-background");
      expect(heroBackground.attributes("aria-hidden")).toBe("true");
    });

    it("should have proper heading hierarchy", () => {
      wrapper = mount(HeroSection);

      const heading = wrapper.find("h1");
      expect(heading.exists()).toBe(true);
      expect(heading.attributes("id")).toBe("hero-heading");
    });
  });

  describe("Component Structure", () => {
    it("should have proper layout structure", () => {
      wrapper = mount(HeroSection);

      const contentWrapper = wrapper.find(".hero-content-wrapper");
      expect(contentWrapper.exists()).toBe(true);

      const heroContent = wrapper.find(".hero-content");
      expect(heroContent.exists()).toBe(true);

      // Hero content should contain all main content elements
      expect(heroContent.find(".hero-headline").exists()).toBe(true);
      expect(heroContent.find(".hero-subheadline").exists()).toBe(true);
      expect(heroContent.find(".hero-ctas").exists()).toBe(true);
    });

    it("should have semantic HTML elements", () => {
      wrapper = mount(HeroSection);

      // Should be a section element
      const section = wrapper.find("section");
      expect(section.exists()).toBe(true);

      // Should have proper heading tag
      const h1 = wrapper.find("h1");
      expect(h1.exists()).toBe(true);

      // Should have paragraph for subheadline
      const paragraph = wrapper.find(".hero-subheadline");
      expect(paragraph.element.tagName.toLowerCase()).toBe("p");
    });
  });

  describe("Content Validation", () => {
    it("should have meaningful and descriptive content", () => {
      wrapper = mount(HeroSection);

      const headline = wrapper.find(".hero-headline").text();
      const subheadline = wrapper.find(".hero-subheadline").text();

      // Headlines should be substantial
      expect(headline.length).toBeGreaterThan(20);
      expect(subheadline.length).toBeGreaterThan(50);

      // Should mention key product features
      expect(subheadline).toContain("collaborative writing");
      expect(subheadline).toContain("peer review");
      expect(subheadline).toContain("publishing");
    });

    it("should have proper button text", () => {
      wrapper = mount(HeroSection);

      const primaryButton = wrapper.find(".btn.btn-primary");
      const secondaryLink = wrapper.find('a[href="/signup"]');

      expect(primaryButton.text()).toBe("Try the Demo");
      expect(secondaryLink.text()).toBe("Or, sign up for the beta waitlist");
    });
  });

  describe("Link and Navigation", () => {
    it("should have correct link targets", () => {
      wrapper = mount(HeroSection);

      const signupLink = wrapper.find('a[href="/signup"]');
      expect(signupLink.exists()).toBe(true);
      expect(signupLink.attributes("href")).toBe("/signup");
    });

    it("should not have any broken or empty links", () => {
      wrapper = mount(HeroSection);

      const links = wrapper.findAll("a");
      links.forEach(link => {
        const href = link.attributes("href");
        expect(href).toBeDefined();
        expect(href.trim()).not.toBe("");
        expect(href).not.toBe("#");
      });
    });
  });

  describe("CSS Classes", () => {
    it("should have proper CSS class structure", () => {
      wrapper = mount(HeroSection);

      // Main container classes
      expect(wrapper.find(".hero-section").exists()).toBe(true);
      expect(wrapper.find(".hero-content-wrapper").exists()).toBe(true);
      expect(wrapper.find(".hero-content").exists()).toBe(true);

      // Content classes
      expect(wrapper.find(".hero-headline").exists()).toBe(true);
      expect(wrapper.find(".hero-subheadline").exists()).toBe(true);
      expect(wrapper.find(".hero-ctas").exists()).toBe(true);

      // Button classes
      expect(wrapper.find(".btn.btn-primary").exists()).toBe(true);
      expect(wrapper.find(".text-link").exists()).toBe(true);
    });
  });
});