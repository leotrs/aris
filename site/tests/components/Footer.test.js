import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import Footer from "../../components/Footer.vue";

// Mock Tabler icons
vi.mock("@tabler/icons-vue", () => ({
  IconBrandBluesky: {
    name: "IconBrandBluesky",
    template: "<svg data-testid='bluesky-icon'></svg>",
  },
  IconBrandLinkedin: {
    name: "IconBrandLinkedin",
    template: "<svg data-testid='linkedin-icon'></svg>",
  },
  IconBrandX: { name: "IconBrandX", template: "<svg data-testid='x-icon'></svg>" },
  IconChevronUp: { name: "IconChevronUp", template: "<svg data-testid='chevron-up-icon'></svg>" },
}));

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

describe("Footer Component", () => {
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
    it("should render footer container", () => {
      wrapper = mount(Footer);

      const footer = wrapper.find(".main-footer");
      expect(footer.exists()).toBe(true);
    });

    it("should render footer logo with correct attributes", () => {
      wrapper = mount(Footer, {
        global: {
          stubs: {
            Logo: {
              template:
                '<img data-testid="logo-stub" src="http://localhost:8001/design-assets/logos/logo-32px-gray.svg" alt="Aris Logo" class="footer-logo" />',
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

    it("should render footer tagline", () => {
      wrapper = mount(Footer);

      const tagline = wrapper.find(".footer-tagline");
      expect(tagline.exists()).toBe(true);
      expect(tagline.text()).toBe(
        "Transforming scientific research through human-first technology"
      );
    });

    it("should render copyright information", () => {
      wrapper = mount(Footer);

      const copyright = wrapper.find(".footer-bottom-text");
      expect(copyright.exists()).toBe(true);
      expect(copyright.text()).toBe("© 2025 Aris. All rights reserved.");
    });
  });

  describe("Footer Navigation Links", () => {
    it("should render Resources section with correct links", () => {
      wrapper = mount(Footer);

      const resourcesHeading = wrapper.find(".column-heading");
      expect(resourcesHeading.text()).toBe("Resources");

      // Check specific resource links
      const blogLink = wrapper.find('a[href="/blog"]');
      const docsLink = wrapper.find('a[href="https://docs.aris.pub/"]');
      const contactLink = wrapper.find('a[href="/contact"]');

      expect(blogLink.exists()).toBe(true);
      expect(blogLink.text()).toBe("Blog");
      expect(docsLink.exists()).toBe(true);
      expect(docsLink.text()).toBe("Documentation");
      expect(contactLink.exists()).toBe(true);
      expect(contactLink.text()).toBe("Contact");
    });

    it("should render Product section with correct links", () => {
      wrapper = mount(Footer);

      const columnHeadings = wrapper.findAll(".column-heading");
      const productHeading = columnHeadings.find((heading) => heading.text() === "Product");
      expect(productHeading.exists()).toBe(true);

      // Check specific product links
      const demoLink = wrapper.find('a[href="https://app.aris.pub/demo"]');
      const pricingLink = wrapper.find('a[href="/pricing"]');
      const githubLink = wrapper.find('a[href="https://github.com/leotrs/aris"]');

      expect(demoLink.exists()).toBe(true);
      expect(demoLink.text()).toBe("Demo");
      expect(pricingLink.exists()).toBe(true);
      expect(pricingLink.text()).toBe("Pricing");
      expect(githubLink.exists()).toBe(true);
      expect(githubLink.text()).toBe("GitHub");
    });

    it("should render Connect section", () => {
      wrapper = mount(Footer);

      const columnHeadings = wrapper.findAll(".column-heading");
      const connectHeading = columnHeadings.find((heading) => heading.text() === "Connect");
      expect(connectHeading.exists()).toBe(true);
    });
  });

  describe("Social Media Icons", () => {
    it("should render all social media icons with proper attributes", () => {
      wrapper = mount(Footer);

      const socialLinks = wrapper.findAll(".social-icon-link");
      expect(socialLinks.length).toBe(3);

      // Check ARIA labels
      const blueSkyLink = socialLinks.find(
        (link) => link.attributes("aria-label") === "Follow us on BlueSky"
      );
      const linkedInLink = socialLinks.find(
        (link) => link.attributes("aria-label") === "Follow us on LinkedIn"
      );
      const xLink = socialLinks.find(
        (link) => link.attributes("aria-label") === "Follow us on X (Twitter)"
      );

      expect(blueSkyLink.exists()).toBe(true);
      expect(linkedInLink.exists()).toBe(true);
      expect(xLink.exists()).toBe(true);
    });

    it("should render social media icons", () => {
      wrapper = mount(Footer);

      // The mocked icons should be present
      const blueSkyIcon = wrapper.find('[data-testid="bluesky-icon"]');
      const linkedInIcon = wrapper.find('[data-testid="linkedin-icon"]');
      const xIcon = wrapper.find('[data-testid="x-icon"]');

      expect(blueSkyIcon.exists()).toBe(true);
      expect(linkedInIcon.exists()).toBe(true);
      expect(xIcon.exists()).toBe(true);
    });
  });

  describe("Legal Links", () => {
    it("should render legal links", () => {
      wrapper = mount(Footer);

      const termsLink = wrapper.find('a[href="/terms"]');
      const cookiesLink = wrapper.find('a[href="/cookies"]');

      expect(termsLink.exists()).toBe(true);
      expect(termsLink.text()).toBe("Terms & Conditions");
      expect(cookiesLink.exists()).toBe(true);
      expect(cookiesLink.text()).toBe("Cookie Policy");
    });
  });

  describe("Back to Top Button", () => {
    it("should render back to top button with correct attributes", () => {
      wrapper = mount(Footer);

      const backToTopButton = wrapper.find(".back-to-top");
      expect(backToTopButton.exists()).toBe(true);
      expect(backToTopButton.attributes("aria-label")).toBe("Back to top");

      const chevronIcon = wrapper.find('[data-testid="chevron-up-icon"]');
      expect(chevronIcon.exists()).toBe(true);
    });

    it("should scroll to top when back to top button is clicked", async () => {
      wrapper = mount(Footer);

      const backToTopButton = wrapper.find(".back-to-top");
      await backToTopButton.trigger("click");

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  describe("Component Structure", () => {
    it("should have proper grid layout for columns", () => {
      wrapper = mount(Footer);

      const footerColumns = wrapper.find(".footer-columns");
      expect(footerColumns.exists()).toBe(true);

      const columns = wrapper.findAll(".footer-column");
      expect(columns.length).toBe(3);
    });

    it("should have footer bottom section", () => {
      wrapper = mount(Footer);

      const footerBottom = wrapper.find(".footer-bottom");
      expect(footerBottom.exists()).toBe(true);

      const footerBranding = wrapper.find(".footer-branding");
      expect(footerBranding.exists()).toBe(true);
    });

    it("should have proper footer legal section", () => {
      wrapper = mount(Footer);

      const footerLegal = wrapper.find(".footer-legal");
      expect(footerLegal.exists()).toBe(true);

      const footerLegalLinks = wrapper.find(".footer-legal-links");
      expect(footerLegalLinks.exists()).toBe(true);
    });
  });

  describe("Link Accessibility", () => {
    it("should have accessible link text for all footer links", () => {
      wrapper = mount(Footer);

      const footerLinks = wrapper.findAll(".footer-link");
      footerLinks.forEach((link) => {
        expect(link.text().trim()).not.toBe("");
      });
    });

    it("should have external links for appropriate services", () => {
      wrapper = mount(Footer);

      // Documentation link should be external
      const docsLink = wrapper.find('a[href="https://docs.aris.pub/"]');
      expect(docsLink.exists()).toBe(true);

      // Demo link should be external
      const demoLink = wrapper.find('a[href="https://app.aris.pub/demo"]');
      expect(demoLink.exists()).toBe(true);

      // GitHub link should be external
      const githubLink = wrapper.find('a[href="https://github.com/leotrs/aris"]');
      expect(githubLink.exists()).toBe(true);
    });
  });

  describe("Content Organization", () => {
    it("should organize links into proper categories", () => {
      wrapper = mount(Footer);

      const headings = wrapper.findAll(".column-heading");
      const headingTexts = headings.map((h) => h.text());

      expect(headingTexts).toContain("Resources");
      expect(headingTexts).toContain("Product");
      expect(headingTexts).toContain("Connect");
    });

    it("should have social icons container in Connect section", () => {
      wrapper = mount(Footer);

      const socialIcons = wrapper.find(".social-icons");
      expect(socialIcons.exists()).toBe(true);

      // Should be within the Connect column
      const connectColumn = wrapper.findAll(".footer-column")[2];
      expect(connectColumn.find(".social-icons").exists()).toBe(true);
    });
  });
});
