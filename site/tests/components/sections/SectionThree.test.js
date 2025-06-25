import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SectionThree from "../../../components/sections/SectionThree.vue";

describe("SectionThree Component", () => {
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
    it("should render section container", () => {
      wrapper = mount(SectionThree);

      const section = wrapper.find(".section-three");
      expect(section.exists()).toBe(true);
      expect(section.element.tagName.toLowerCase()).toBe("section");
    });

    it("should render section heading", () => {
      wrapper = mount(SectionThree);

      const heading = wrapper.find(".section-heading");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("How Aris Transforms Your Research Experience");
      expect(heading.element.tagName.toLowerCase()).toBe("h2");
    });

    it("should render content wrapper", () => {
      wrapper = mount(SectionThree);

      const contentWrapper = wrapper.find(".content-wrapper");
      expect(contentWrapper.exists()).toBe(true);
    });
  });

  describe("Feature Cards", () => {
    it("should render all four feature cards", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      expect(cards.length).toBe(4);
    });

    it("should render cards within grid container", () => {
      wrapper = mount(SectionThree);

      const grid = wrapper.find(".feature-grid");
      expect(grid.exists()).toBe(true);

      const cards = grid.findAll(".feature-card");
      expect(cards.length).toBe(4);
    });

    it("should render first card - Unified Research Environment", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      const firstCard = cards[0];

      const title = firstCard.find(".card-title");
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe("The Unified Research Environment");

      const description = firstCard.find(".card-description");
      expect(description.exists()).toBe(true);
      expect(description.text()).toContain("integrates writing, collaboration, review, and publishing");
      expect(description.text()).toContain("solving fragmentation");
    });

    it("should render second card - Intelligent Collaboration", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      const secondCard = cards[1];

      const title = secondCard.find(".card-title");
      expect(title.text()).toBe("Intelligent, Human-First Collaboration");

      const description = secondCard.find(".card-description");
      expect(description.text()).toContain("semantic diffs");
      expect(description.text()).toContain("AI Copilot");
      expect(description.text()).toContain("facilitating human interaction");
    });

    it("should render third card - Streamlined Peer Review", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      const thirdCard = cards[2];

      const title = thirdCard.find(".card-title");
      expect(title.text()).toBe("Streamlined Peer Review, Focused on Quality");

      const description = thirdCard.find(".card-description");
      expect(description.text()).toContain("built-in system for peer review");
      expect(description.text()).toContain("AI recommendations for reviewers");
      expect(description.text()).toContain("quality and integrity");
    });

    it("should render fourth card - Interactive Science", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      const fourthCard = cards[3];

      const title = fourthCard.find(".card-title");
      expect(title.text()).toBe("Interactive Science for Deeper Engagement");

      const description = fourthCard.find(".card-description");
      expect(description.text()).toContain("web-native content");
      expect(description.text()).toContain("discoverability");
      expect(description.text()).toContain("understandability");
      expect(description.text()).toContain("engagement");
    });
  });

  describe("Feature Visuals", () => {
    it("should render feature images in each card", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      
      cards.forEach((card, index) => {
        const featureVisual = card.find(".feature-visual");
        expect(featureVisual.exists()).toBe(true);

        const image = card.find(".feature-gif");
        expect(image.exists()).toBe(true);
        expect(image.attributes("src")).toBeDefined();
        expect(image.attributes("alt")).toBeDefined();
      });
    });

    it("should have proper image alt text", () => {
      wrapper = mount(SectionThree);

      const images = wrapper.findAll(".feature-gif");
      
      const expectedAlts = [
        "Unified Research Environment Demo",
        "Intelligent Human-First Collaboration Demo", 
        "Streamlined Peer Review Demo",
        "Interactive Science Demo"
      ];

      images.forEach((image, index) => {
        expect(image.attributes("alt")).toBe(expectedAlts[index]);
      });
    });

    it("should render video placeholders", () => {
      wrapper = mount(SectionThree);

      const placeholders = wrapper.findAll(".video-placeholder");
      expect(placeholders.length).toBe(4);

      const expectedTexts = [
        "Demo Video: Unified Environment",
        "Demo Video: AI Collaboration",
        "Demo Video: Peer Review", 
        "Demo Video: Interactive Publishing"
      ];

      placeholders.forEach((placeholder, index) => {
        expect(placeholder.text()).toBe(expectedTexts[index]);
      });
    });

    it("should use appropriate image sources", () => {
      wrapper = mount(SectionThree);

      const images = wrapper.findAll(".feature-gif");
      
      // All images should have proper src attributes
      images.forEach(image => {
        expect(image.attributes("src")).toBeDefined();
        expect(image.attributes("src").length).toBeGreaterThan(0);
      });
    });
  });

  describe("Card Structure", () => {
    it("should have proper card structure", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      
      cards.forEach(card => {
        const featureVisual = card.find(".feature-visual");
        expect(featureVisual.exists()).toBe(true);

        const featureContent = card.find(".feature-content");
        expect(featureContent.exists()).toBe(true);

        const title = card.find(".card-title");
        expect(title.exists()).toBe(true);
        expect(title.element.tagName.toLowerCase()).toBe("h3");

        const description = card.find(".card-description");
        expect(description.exists()).toBe(true);
        expect(description.element.tagName.toLowerCase()).toBe("p");
      });
    });
  });

  describe("Content Validation", () => {
    it("should have meaningful content in all cards", () => {
      wrapper = mount(SectionThree);

      const cards = wrapper.findAll(".feature-card");
      
      cards.forEach(card => {
        const title = card.find(".card-title");
        const description = card.find(".card-description");

        // All text should be substantial
        expect(title.text().length).toBeGreaterThan(10);
        expect(description.text().length).toBeGreaterThan(50);
      });
    });

    it("should mention key product features", () => {
      wrapper = mount(SectionThree);

      const allText = wrapper.text();
      
      // Should mention key features
      expect(allText).toContain("writing, collaboration, review, and publishing");
      expect(allText).toContain("semantic diffs");
      expect(allText).toContain("AI Copilot");
      expect(allText).toContain("peer review");
      expect(allText).toContain("web-native content");
      expect(allText.toLowerCase()).toContain("interactive");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      wrapper = mount(SectionThree);

      // Main section heading should be h2
      const sectionHeading = wrapper.find(".section-heading");
      expect(sectionHeading.element.tagName.toLowerCase()).toBe("h2");

      // Card headings should be h3
      const cardTitles = wrapper.findAll(".card-title");
      cardTitles.forEach(title => {
        expect(title.element.tagName.toLowerCase()).toBe("h3");
      });
    });

    it("should have semantic HTML structure", () => {
      wrapper = mount(SectionThree);

      // Should be a section element
      const section = wrapper.find("section");
      expect(section.exists()).toBe(true);

      // Should have proper paragraph tags
      const paragraphs = wrapper.findAll("p");
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it("should have descriptive image alt text", () => {
      wrapper = mount(SectionThree);

      const images = wrapper.findAll("img");
      images.forEach(image => {
        const alt = image.attributes("alt");
        expect(alt).toBeDefined();
        expect(alt.trim()).not.toBe("");
        expect(alt.length).toBeGreaterThan(10);
      });
    });
  });

  describe("Grid Layout", () => {
    it("should have feature grid container", () => {
      wrapper = mount(SectionThree);

      const grid = wrapper.find(".feature-grid");
      expect(grid.exists()).toBe(true);
    });

    it("should contain all cards within the grid", () => {
      wrapper = mount(SectionThree);

      const grid = wrapper.find(".feature-grid");
      const cardsInGrid = grid.findAll(".feature-card");
      const allCards = wrapper.findAll(".feature-card");

      expect(cardsInGrid.length).toBe(allCards.length);
      expect(cardsInGrid.length).toBe(4);
    });
  });
});