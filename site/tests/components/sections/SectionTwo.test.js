import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SectionTwo from "../../../components/sections/SectionTwo.vue";

// Mock Tabler icons
vi.mock("@tabler/icons-vue", () => ({
  IconGitFork: { name: "IconGitFork", template: "<svg data-testid='git-fork-icon'></svg>" },
  IconMessagesOff: {
    name: "IconMessagesOff",
    template: "<svg data-testid='messages-off-icon'></svg>",
  },
  IconHourglassHigh: {
    name: "IconHourglassHigh",
    template: "<svg data-testid='hourglass-icon'></svg>",
  },
  IconFileOff: { name: "IconFileOff", template: "<svg data-testid='file-off-icon'></svg>" },
}));

describe("SectionTwo Component", () => {
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
      wrapper = mount(SectionTwo);

      const section = wrapper.find(".section-two");
      expect(section.exists()).toBe(true);
      expect(section.element.tagName.toLowerCase()).toBe("section");
    });

    it("should render section heading", () => {
      wrapper = mount(SectionTwo);

      const heading = wrapper.find(".section-heading");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("The Research Experience, Reimagined by Aris");
      expect(heading.element.tagName.toLowerCase()).toBe("h2");
    });

    it("should render content wrapper", () => {
      wrapper = mount(SectionTwo);

      const contentWrapper = wrapper.find(".content-wrapper");
      expect(contentWrapper.exists()).toBe(true);
    });
  });

  describe("Problem-Solution Cards", () => {
    it("should render all four problem-solution cards", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");
      expect(cards.length).toBe(4);
    });

    it("should render cards within grid container", () => {
      wrapper = mount(SectionTwo);

      const grid = wrapper.find(".problem-solution-grid");
      expect(grid.exists()).toBe(true);

      const cards = grid.findAll(".problem-solution-card");
      expect(cards.length).toBe(4);
    });

    it("should render first card - Fragmented Tools", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");
      const firstCard = cards[0];

      // Check problem
      const problemHeading = firstCard.find(".card-problem");
      expect(problemHeading.exists()).toBe(true);
      expect(problemHeading.text()).toBe("Fragmented Tools");

      const problemDescription = firstCard.find(".card-problem-description");
      expect(problemDescription.exists()).toBe(true);
      expect(problemDescription.text()).toContain("Disconnected tools fragment workflows");

      // Check solution
      const solutionHeading = firstCard.find(".card-solution");
      expect(solutionHeading.exists()).toBe(true);
      expect(solutionHeading.text()).toBe("Aris provides an integrated platform");

      const solutionDescription = firstCard.find(".card-solution-description");
      expect(solutionDescription.exists()).toBe(true);
      expect(solutionDescription.text()).toContain("Eliminates friction, regains version control");

      // Check icon
      const icon = firstCard.find('[data-testid="git-fork-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it("should render second card - Clunky Collaboration", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");
      const secondCard = cards[1];

      // Check problem
      const problemHeading = secondCard.find(".card-problem");
      expect(problemHeading.text()).toBe("Clunky Collaboration");

      const problemDescription = secondCard.find(".card-problem-description");
      expect(problemDescription.text()).toContain("Traditional tools obscure context");

      // Check solution
      const solutionHeading = secondCard.find(".card-solution");
      expect(solutionHeading.text()).toBe(
        "Aris elevates collaboration with intelligent assistance"
      );

      const solutionDescription = secondCard.find(".card-solution-description");
      expect(solutionDescription.text()).toContain("Semantic diffs and AI Copilot");

      // Check icon
      const icon = secondCard.find('[data-testid="messages-off-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it("should render third card - Peer Review Bottleneck", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");
      const thirdCard = cards[2];

      // Check problem
      const problemHeading = thirdCard.find(".card-problem");
      expect(problemHeading.text()).toBe("Peer Review Bottleneck");

      const problemDescription = thirdCard.find(".card-problem-description");
      expect(problemDescription.text()).toContain("Current systems are opaque, slow");

      // Check solution
      const solutionHeading = thirdCard.find(".card-solution");
      expect(solutionHeading.text()).toBe("Aris redefines peer review with built-in efficiency");

      const solutionDescription = thirdCard.find(".card-solution-description");
      expect(solutionDescription.text()).toContain("AI-powered reviewer recommendations");

      // Check icon
      const icon = thirdCard.find('[data-testid="hourglass-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it("should render fourth card - Impersonal Digital Engagement", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");
      const fourthCard = cards[3];

      // Check problem
      const problemHeading = fourthCard.find(".card-problem");
      expect(problemHeading.text()).toBe("Impersonal Digital Engagement");

      const problemDescription = fourthCard.find(".card-problem-description");
      expect(problemDescription.text()).toContain("Static formats limit engagement");

      // Check solution
      const solutionHeading = fourthCard.find(".card-solution");
      expect(solutionHeading.text()).toBe("Aris transforms research into dynamic experiences");

      const solutionDescription = fourthCard.find(".card-solution-description");
      expect(solutionDescription.text()).toContain("Web-native publishing makes research");

      // Check icon
      const icon = fourthCard.find('[data-testid="file-off-icon"]');
      expect(icon.exists()).toBe(true);
    });
  });

  describe("Card Structure", () => {
    it("should have proper card header structure", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");

      cards.forEach((card) => {
        const header = card.find(".card-header");
        expect(header.exists()).toBe(true);

        const iconContainer = header.find(".card-icon-container");
        expect(iconContainer.exists()).toBe(true);

        const problemHeading = header.find(".card-problem");
        expect(problemHeading.exists()).toBe(true);
        expect(problemHeading.element.tagName.toLowerCase()).toBe("h3");
      });
    });

    it("should have proper content structure in each card", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");

      cards.forEach((card) => {
        // Problem elements
        const problemDescription = card.find(".card-problem-description");
        expect(problemDescription.exists()).toBe(true);
        expect(problemDescription.element.tagName.toLowerCase()).toBe("p");

        // Solution elements
        const solutionHeading = card.find(".card-solution");
        expect(solutionHeading.exists()).toBe(true);
        expect(solutionHeading.element.tagName.toLowerCase()).toBe("h3");

        const solutionDescription = card.find(".card-solution-description");
        expect(solutionDescription.exists()).toBe(true);
        expect(solutionDescription.element.tagName.toLowerCase()).toBe("p");
      });
    });
  });

  describe("Content Validation", () => {
    it("should have meaningful content in all cards", () => {
      wrapper = mount(SectionTwo);

      const cards = wrapper.findAll(".problem-solution-card");

      cards.forEach((card) => {
        const problemHeading = card.find(".card-problem");
        const problemDescription = card.find(".card-problem-description");
        const solutionHeading = card.find(".card-solution");
        const solutionDescription = card.find(".card-solution-description");

        // All text should be substantial
        expect(problemHeading.text().length).toBeGreaterThan(5);
        expect(problemDescription.text().length).toBeGreaterThan(20);
        expect(solutionHeading.text().length).toBeGreaterThan(10);
        expect(solutionDescription.text().length).toBeGreaterThan(30);
      });
    });

    it("should mention key Aris features in solutions", () => {
      wrapper = mount(SectionTwo);

      const allText = wrapper.text();

      // Should mention key features
      expect(allText).toContain("integrated platform");
      expect(allText).toContain("AI Copilot");
      expect(allText).toContain("Semantic diffs");
      expect(allText).toContain("AI-powered reviewer recommendations");
      expect(allText).toContain("Web-native");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      wrapper = mount(SectionTwo);

      // Main section heading should be h2
      const sectionHeading = wrapper.find(".section-heading");
      expect(sectionHeading.element.tagName.toLowerCase()).toBe("h2");

      // Card headings should be h3
      const cardHeadings = wrapper.findAll(".card-problem");
      cardHeadings.forEach((heading) => {
        expect(heading.element.tagName.toLowerCase()).toBe("h3");
      });

      const solutionHeadings = wrapper.findAll(".card-solution");
      solutionHeadings.forEach((heading) => {
        expect(heading.element.tagName.toLowerCase()).toBe("h3");
      });
    });

    it("should have semantic HTML structure", () => {
      wrapper = mount(SectionTwo);

      // Should be a section element
      const section = wrapper.find("section");
      expect(section.exists()).toBe(true);

      // Should have proper paragraph tags
      const paragraphs = wrapper.findAll("p");
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  describe("Icons", () => {
    it("should render all required icons", () => {
      wrapper = mount(SectionTwo);

      const gitForkIcon = wrapper.find('[data-testid="git-fork-icon"]');
      const messagesOffIcon = wrapper.find('[data-testid="messages-off-icon"]');
      const hourglassIcon = wrapper.find('[data-testid="hourglass-icon"]');
      const fileOffIcon = wrapper.find('[data-testid="file-off-icon"]');

      expect(gitForkIcon.exists()).toBe(true);
      expect(messagesOffIcon.exists()).toBe(true);
      expect(hourglassIcon.exists()).toBe(true);
      expect(fileOffIcon.exists()).toBe(true);
    });

    it("should have icons in proper containers", () => {
      wrapper = mount(SectionTwo);

      const iconContainers = wrapper.findAll(".card-icon-container");
      expect(iconContainers.length).toBe(4);

      iconContainers.forEach((container) => {
        // Each container should have an icon
        const icon = container.find("svg");
        expect(icon.exists()).toBe(true);
      });
    });
  });
});
