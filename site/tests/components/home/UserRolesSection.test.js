import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import UserRolesSection from "../../../components/home/UserRolesSection.vue";

// Mock Tabler icons
vi.mock("@tabler/icons-vue", () => ({
  IconUserEdit: { name: "IconUserEdit", template: "<svg data-testid='user-edit-icon'></svg>" },
  IconBook2: { name: "IconBook2", template: "<svg data-testid='book-icon'></svg>" },
  IconClipboardCheck: {
    name: "IconClipboardCheck",
    template: "<svg data-testid='clipboard-check-icon'></svg>",
  },
}));

describe("UserRolesSection Component", () => {
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
      wrapper = mount(UserRolesSection);

      const section = wrapper.find(".section-four");
      expect(section.exists()).toBe(true);
      expect(section.element.tagName.toLowerCase()).toBe("section");
    });

    it("should render section heading", () => {
      wrapper = mount(UserRolesSection);

      const heading = wrapper.find(".section-heading");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("Who Aris Empowers");
      expect(heading.element.tagName.toLowerCase()).toBe("h2");
    });

    it("should render content wrapper", () => {
      wrapper = mount(UserRolesSection);

      const contentWrapper = wrapper.find(".content-wrapper");
      expect(contentWrapper.exists()).toBe(true);
    });
  });

  describe("User Role Cards", () => {
    it("should render all three user role cards", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      expect(cards.length).toBe(3);
    });

    it("should render cards within grid container", () => {
      wrapper = mount(UserRolesSection);

      const grid = wrapper.find(".user-role-grid");
      expect(grid.exists()).toBe(true);

      const cards = grid.findAll(".user-role-card");
      expect(cards.length).toBe(3);
    });

    it("should render first card - Authors & Researchers", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      const firstCard = cards[0];

      const title = firstCard.find(".card-title");
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe("Authors & Researchers");

      const description = firstCard.find(".card-description");
      expect(description.exists()).toBe(true);
      expect(description.text()).toContain(
        "Integrated platform to craft, collaborate on, and publish research"
      );
      expect(description.text()).toContain("Focus on ideas, streamline workflow");

      const icon = firstCard.find('[data-testid="user-edit-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it("should render second card - Readers & Learners", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      const secondCard = cards[1];

      const title = secondCard.find(".card-title");
      expect(title.text()).toBe("Readers & Learners");

      const description = secondCard.find(".card-description");
      expect(description.text()).toContain("Transforms engagement with scientific knowledge");
      expect(description.text()).toContain("dynamic manuscripts, add private notes");
      expect(description.text()).toContain("connect with authors");

      const icon = secondCard.find('[data-testid="book-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it("should render third card - Reviewers & Editors", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      const thirdCard = cards[2];

      const title = thirdCard.find(".card-title");
      expect(title.text()).toBe("Reviewers & Editors");

      const description = thirdCard.find(".card-description");
      expect(description.text()).toContain("Streamlines peer review for efficiency and quality");
      expect(description.text()).toContain("intelligent reviewer recommendations");
      expect(description.text()).toContain("structured, empathetic feedback");

      const icon = thirdCard.find('[data-testid="clipboard-check-icon"]');
      expect(icon.exists()).toBe(true);
    });
  });

  describe("Card Structure", () => {
    it("should have proper card structure", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");

      cards.forEach((card) => {
        const iconContainer = card.find(".card-icon-container");
        expect(iconContainer.exists()).toBe(true);

        const title = card.find(".card-title");
        expect(title.exists()).toBe(true);
        expect(title.element.tagName.toLowerCase()).toBe("h3");

        const description = card.find(".card-description");
        expect(description.exists()).toBe(true);
        expect(description.element.tagName.toLowerCase()).toBe("p");
      });
    });

    it("should have icons in proper containers", () => {
      wrapper = mount(UserRolesSection);

      const iconContainers = wrapper.findAll(".card-icon-container");
      expect(iconContainers.length).toBe(3);

      iconContainers.forEach((container) => {
        // Each container should have an icon
        const icon = container.find("svg");
        expect(icon.exists()).toBe(true);
      });
    });
  });

  describe("Content Validation", () => {
    it("should have meaningful content in all cards", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");

      cards.forEach((card) => {
        const title = card.find(".card-title");
        const description = card.find(".card-description");

        // All text should be substantial
        expect(title.text().length).toBeGreaterThan(10);
        expect(description.text().length).toBeGreaterThan(50);
      });
    });

    it("should mention key user benefits", () => {
      wrapper = mount(UserRolesSection);

      const allText = wrapper.text();

      // Should mention key benefits for different user types
      expect(allText).toContain("craft, collaborate on, and publish");
      expect(allText).toContain("dynamic manuscripts");
      expect(allText).toContain("peer review");
      expect(allText).toContain("intelligent reviewer recommendations");
      expect(allText).toContain("streamline workflow");
      expect(allText).toContain("interactive");
    });

    it("should address different user personas", () => {
      wrapper = mount(UserRolesSection);

      const titles = wrapper.findAll(".card-title").map((title) => title.text());

      expect(titles).toContain("Authors & Researchers");
      expect(titles).toContain("Readers & Learners");
      expect(titles).toContain("Reviewers & Editors");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      wrapper = mount(UserRolesSection);

      // Main section heading should be h2
      const sectionHeading = wrapper.find(".section-heading");
      expect(sectionHeading.element.tagName.toLowerCase()).toBe("h2");

      // Card headings should be h3
      const cardTitles = wrapper.findAll(".card-title");
      cardTitles.forEach((title) => {
        expect(title.element.tagName.toLowerCase()).toBe("h3");
      });
    });

    it("should have semantic HTML structure", () => {
      wrapper = mount(UserRolesSection);

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
      wrapper = mount(UserRolesSection);

      const userEditIcon = wrapper.find('[data-testid="user-edit-icon"]');
      const bookIcon = wrapper.find('[data-testid="book-icon"]');
      const clipboardCheckIcon = wrapper.find('[data-testid="clipboard-check-icon"]');

      expect(userEditIcon.exists()).toBe(true);
      expect(bookIcon.exists()).toBe(true);
      expect(clipboardCheckIcon.exists()).toBe(true);
    });

    it("should have appropriate icons for each user type", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");

      // Authors & Researchers - UserEdit icon
      const firstCardIcon = cards[0].find('[data-testid="user-edit-icon"]');
      expect(firstCardIcon.exists()).toBe(true);

      // Readers & Learners - Book icon
      const secondCardIcon = cards[1].find('[data-testid="book-icon"]');
      expect(secondCardIcon.exists()).toBe(true);

      // Reviewers & Editors - ClipboardCheck icon
      const thirdCardIcon = cards[2].find('[data-testid="clipboard-check-icon"]');
      expect(thirdCardIcon.exists()).toBe(true);
    });
  });

  describe("Grid Layout", () => {
    it("should have user role grid container", () => {
      wrapper = mount(UserRolesSection);

      const grid = wrapper.find(".user-role-grid");
      expect(grid.exists()).toBe(true);
    });

    it("should contain all cards within the grid", () => {
      wrapper = mount(UserRolesSection);

      const grid = wrapper.find(".user-role-grid");
      const cardsInGrid = grid.findAll(".user-role-card");
      const allCards = wrapper.findAll(".user-role-card");

      expect(cardsInGrid.length).toBe(allCards.length);
      expect(cardsInGrid.length).toBe(3);
    });
  });

  describe("User Value Propositions", () => {
    it("should clearly articulate value for authors", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      const authorsCard = cards[0];
      const description = authorsCard.find(".card-description").text();

      expect(description).toContain("control and clarity");
      expect(description).toContain("Focus on ideas");
      expect(description).toContain("streamline workflow");
      expect(description).toContain("engaged audience");
    });

    it("should clearly articulate value for readers", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      const readersCard = cards[1];
      const description = readersCard.find(".card-description").text();

      expect(description).toContain("personal and interactive");
      expect(description).toContain("dynamic manuscripts");
      expect(description).toContain("private notes");
      expect(description).toContain("richer learning");
    });

    it("should clearly articulate value for reviewers", () => {
      wrapper = mount(UserRolesSection);

      const cards = wrapper.findAll(".user-role-card");
      const reviewersCard = cards[2];
      const description = reviewersCard.find(".card-description").text();

      expect(description).toContain("efficiency and quality");
      expect(description).toContain("intelligent reviewer recommendations");
      expect(description).toContain("manage submissions");
      expect(description).toContain("empathetic feedback");
    });
  });
});
