import { test, expect } from "@playwright/test";

test.describe("Cross-Browser Compatibility", () => {
  test.describe("Core Functionality Across Browsers", () => {
    test("should render homepage correctly in all browsers", async ({ page, browserName }) => {
      await page.goto("/");

      // Basic page elements should be present
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();
      await expect(page.locator(".section-two")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      // Navigation should be functional
      await expect(page.locator(".navbar")).toBeVisible();
      await expect(page.locator(".navbar-logo")).toBeVisible();

      // CTA buttons should be present
      await expect(page.locator(".btn-primary")).toBeVisible();

      console.log(`✓ Homepage renders correctly in ${browserName}`);
    });

    test("should handle form submission in all browsers", async ({ page, browserName }) => {
      await page.goto("/signup");

      // Form elements should be present and functional
      await expect(page.locator("form")).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();

      // Fill form
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[name="name"]', "Dr. Jane Doe");

      // Mock API response
      await page.route("**/signup/", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: 1, email: "test@example.com" }),
        });
      });

      // Submit and verify
      await page.click('button[type="submit"]');
      await expect(
        page.locator(
          "text=Successfully signed up for early access! We'll notify you when Aris is ready."
        )
      ).toBeVisible();

      console.log(`✓ Form submission works correctly in ${browserName}`);
    });

    test("should handle navigation correctly in all browsers", async ({ page, browserName }) => {
      await page.goto("/");

      // Test navigation to signup
      await page.click('a[href="/signup"]');
      await expect(page).toHaveURL("/signup");

      // Test navigation to legal pages
      await page.click('a[href="/terms"]');
      await expect(page).toHaveURL("/terms");

      await page.click('a[href="/cookies"]');
      await expect(page).toHaveURL("/cookies");

      // Test back to home
      await page.click('a[href="/"]');
      await expect(page).toHaveURL("/");

      console.log(`✓ Navigation works correctly in ${browserName}`);
    });
  });

  test.describe("CSS and Layout Compatibility", () => {
    test("should maintain layout integrity across browsers", async ({ page, browserName }) => {
      await page.goto("/");

      // Check hero section layout
      const heroSection = page.locator(".hero-section");
      await expect(heroSection).toBeVisible();

      const heroBox = await heroSection.boundingBox();
      expect(heroBox?.height).toBeGreaterThan(300); // Minimum height

      // Check grid layouts
      const problemSolutionGrid = page.locator(".problem-solution-grid");
      await problemSolutionGrid.scrollIntoViewIfNeeded();
      await expect(problemSolutionGrid).toBeVisible();

      const cards = page.locator(".problem-solution-card");
      const cardCount = await cards.count();
      expect(cardCount).toBe(4);

      // Check responsive behavior at common breakpoint
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(heroSection).toBeVisible();
      await expect(problemSolutionGrid).toBeVisible();

      console.log(`✓ Layout integrity maintained in ${browserName}`);
    });

    test("should handle CSS animations and transitions", async ({ page, browserName }) => {
      await page.goto("/");

      // Test hover effects
      const primaryButton = page.locator(".btn-primary").first();
      await primaryButton.hover();

      // Button should still be visible and clickable after hover
      await expect(primaryButton).toBeVisible();

      // Test scroll-based animations
      await page.locator(".section-two").scrollIntoViewIfNeeded();
      await expect(page.locator(".section-two")).toBeVisible();

      // Test mobile menu animation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.click(".menu-toggle");
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      console.log(`✓ CSS animations work correctly in ${browserName}`);
    });

    test("should handle fonts and typography", async ({ page, browserName }) => {
      await page.goto("/");

      // Check that text is rendered and readable
      const headline = page.locator(".hero-headline");
      await expect(headline).toBeVisible();

      const headlineText = await headline.textContent();
      expect(headlineText?.length).toBeGreaterThan(10);

      // Check computed styles
      const headlineStyles = await headline.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
        };
      });

      expect(headlineStyles.fontFamily).toBeDefined();
      expect(headlineStyles.fontSize).toBeDefined();

      console.log(`✓ Typography renders correctly in ${browserName}`);
    });
  });

  test.describe("JavaScript Compatibility", () => {
    test("should handle interactive features across browsers", async ({ page, browserName }) => {
      await page.goto("/");

      // Test dropdown interaction
      await page.hover(".has-dropdown");
      await expect(page.locator(".dropdown-menu")).toBeVisible();

      // Test mobile menu
      await page.setViewportSize({ width: 375, height: 667 });
      await page.click(".menu-toggle");
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      // Test back to top
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto("/");
      await page.locator("contentinfo").scrollIntoViewIfNeeded();
      await page.click('button:has-text("Back to top")');
      await expect(page.locator(".hero-section")).toBeInViewport();

      console.log(`✓ Interactive features work correctly in ${browserName}`);
    });

    test("should handle form validation across browsers", async ({ page, browserName }) => {
      await page.goto("/signup");

      // Test client-side validation
      await page.click('button[type="submit"]');

      // Check browser validation state instead of custom messages
      const emailValid = await page
        .locator('input[type="email"]')
        .evaluate((el) => el.validity.valid);
      expect(emailValid).toBe(false);

      // Test character limit validation
      const longName = "a".repeat(101);
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[name="name"]', longName);
      await page.click('button[type="submit"]');

      // Wait for validation and check for error message
      await page.waitForTimeout(100);
      await expect(page.locator(".error-message")).toBeVisible();

      console.log(`✓ Form validation works correctly in ${browserName}`);
    });

    test("should handle async operations across browsers", async ({ page, browserName }) => {
      await page.goto("/signup");

      // Test loading states
      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[name="name"]', "Dr. Jane Doe");

      // Mock slow response
      await page.route("**/signup/", async (route) => {
        await page.waitForTimeout(100);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: 1 }),
        });
      });

      await page.click('button[type="submit"]');

      // Loading state should work
      await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();

      // Should complete successfully
      await expect(
        page.locator(
          "text=Successfully signed up for early access! We'll notify you when Aris is ready."
        )
      ).toBeVisible();

      console.log(`✓ Async operations work correctly in ${browserName}`);
    });
  });

  test.describe("Mobile Browser Compatibility", () => {
    test("should work correctly on mobile browsers", async ({ page, browserName }) => {
      // Only run on mobile browser configs
      if (!browserName.includes("Mobile")) {
        test.skip();
      }

      await page.goto("/");

      // Mobile-specific functionality
      await expect(page.locator(".menu-toggle")).toBeVisible();
      await expect(page.locator(".navbar-links")).not.toBeVisible();

      // Test mobile menu
      await page.tap(".menu-toggle");
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      // Test mobile form
      await page.goto("/signup");
      await expect(page.locator("form")).toBeVisible();

      // Form inputs should be properly sized for mobile
      const emailInput = page.locator('input[type="email"]');
      const inputBox = await emailInput.boundingBox();
      expect(inputBox?.height).toBeGreaterThanOrEqual(40); // Minimum touch target

      console.log(`✓ Mobile functionality works correctly in ${browserName}`);
    });

    test("should handle touch events on mobile", async ({ page, browserName }) => {
      if (!browserName.includes("Mobile")) {
        test.skip();
      }

      await page.goto("/");

      // Test touch interactions
      await page.tap(".menu-toggle");
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      await page.tap('.mobile-nav-link[href="/signup"]');
      await expect(page).toHaveURL("/signup");

      // Test form touch interactions
      await page.tap('input[type="email"]');
      await page.fill('input[type="email"]', "test@example.com");
      await expect(page.locator('input[type="email"]')).toHaveValue("test@example.com");

      console.log(`✓ Touch events work correctly in ${browserName}`);
    });
  });

  test.describe("Error Handling Compatibility", () => {
    test("should handle network errors consistently", async ({ page, browserName }) => {
      await page.goto("/signup");

      await page.fill('input[type="email"]', "test@example.com");
      await page.fill('input[name="name"]', "Dr. Jane Doe");

      // Mock network failure
      await page.route("**/signup/", (route) => route.abort("failed"));

      await page.click('button[type="submit"]');
      await expect(
        page.locator(
          "text=Unable to connect to server. Please check your internet connection and try again."
        )
      ).toBeVisible();

      console.log(`✓ Network error handling works correctly in ${browserName}`);
    });

    test("should handle API errors consistently", async ({ page, browserName }) => {
      await page.goto("/signup");

      await page.fill('input[type="email"]', "duplicate@example.com");
      await page.fill('input[name="name"]', "Dr. Jane Doe");

      // Mock API error
      await page.route("**/signup/", (route) => {
        route.fulfill({
          status: 409,
          contentType: "application/json",
          body: JSON.stringify({
            detail: {
              error: "duplicate_email",
              message: "This email address is already registered for early access.",
            },
          }),
        });
      });

      await page.click('button[type="submit"]');
      await expect(
        page.locator("text=This email address is already registered for early access.")
      ).toBeVisible();

      console.log(`✓ API error handling works correctly in ${browserName}`);
    });
  });

  test.describe("Performance Across Browsers", () => {
    test("should load within reasonable time", async ({ page, browserName }) => {
      const startTime = Date.now();

      await page.goto("/");
      await expect(page.locator(".hero-headline")).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds (adjust based on requirements)
      expect(loadTime).toBeLessThan(5000);

      console.log(`✓ Page loads in ${loadTime}ms in ${browserName}`);
    });

    test("should handle multiple interactions without degradation", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Perform multiple interactions rapidly
      for (let i = 0; i < 5; i++) {
        await page.hover(".has-dropdown");
        await page.locator("body").hover(); // Move away
        await page.locator(".section-two").scrollIntoViewIfNeeded();
        await page.locator(".hero-section").scrollIntoViewIfNeeded();
      }

      // Page should still be responsive
      await expect(page.locator(".hero-headline")).toBeVisible();

      console.log(`✓ Multiple interactions handled well in ${browserName}`);
    });
  });
});
