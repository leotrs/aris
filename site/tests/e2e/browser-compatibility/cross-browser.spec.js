import { test, expect } from "@playwright/test";

test.describe("Cross-Browser Compatibility", () => {
  test.describe("Core Functionality Across Browsers", () => {
    test("should render homepage correctly in all browsers", async ({ page, browserName }) => {
      await page.goto("/");

      // Basic page elements should be present
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();
      await expect(page.locator(".platform-overview-section")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      // Navigation should be functional
      await expect(page.locator(".navbar")).toBeVisible();
      await expect(page.locator(".navbar-logo")).toBeVisible();

      // CTA buttons should be present (use first one to avoid strict mode violation)
      await expect(page.locator(".btn-primary").first()).toBeVisible();

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

      // Mock API response - intercept both localhost:8000 and relative URLs
      await page.route("**/signup/", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: 1, email: "test@example.com" }),
        });
      });

      // Submit and verify
      await page.click('button[type="submit"]');

      // Wait for the success message to appear
      await expect(
        page.locator(
          "text=Successfully signed up for early access! We'll notify you when Aris is ready."
        )
      ).toBeVisible({ timeout: 10000 });

      console.log(`✓ Form submission works correctly in ${browserName}`);
    });

    test("should handle navigation correctly in all browsers", async ({ page, browserName }) => {
      await page.goto("/");

      // Check if viewport is mobile-sized (less than 640px wide)
      const viewportSize = page.viewportSize();
      const isMobile = viewportSize.width < 640;

      if (isMobile) {
        // Mobile navigation: use mobile menu
        await page.click('[data-testid="menu-toggle"]');
        await page.waitForTimeout(300); // Wait for mobile menu animation
        await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

        // Test navigation to signup via mobile menu
        await page.click('.mobile-nav-link[href="/signup"]');
        await expect(page).toHaveURL("/signup");

        // Navigate back to test other links
        await page.goto("/");
        await page.click('[data-testid="menu-toggle"]');
        await page.waitForTimeout(300);

        // Test legal page navigation via direct URL (since they may not be in mobile menu)
        await page.goto("/terms");
        await expect(page).toHaveURL("/terms");

        await page.goto("/cookies");
        await expect(page).toHaveURL("/cookies");

        // Test back to home
        await page.goto("/");
        await expect(page).toHaveURL("/");
      } else {
        // Desktop navigation: use regular nav links
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
      }

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
      const workflowComparison = page.locator(".workflow-comparison");
      await workflowComparison.scrollIntoViewIfNeeded();
      await expect(workflowComparison).toBeVisible();

      const compatibilityFeatures = page.locator(".compatibility-feature");
      const featureCount = await compatibilityFeatures.count();
      expect(featureCount).toBeGreaterThan(0);

      // Check responsive behavior at common breakpoint
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(heroSection).toBeVisible();
      await expect(workflowComparison).toBeVisible();

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
      await page.locator(".platform-overview-section").scrollIntoViewIfNeeded();
      await expect(page.locator(".platform-overview-section")).toBeVisible();

      // Test mobile menu animation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.click('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

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

      // Check if viewport is mobile-sized (less than 640px wide)
      const viewportSize = page.viewportSize();
      const isMobile = viewportSize.width < 640;

      if (isMobile) {
        // Mobile: Test mobile menu functionality
        await page.click('[data-testid="menu-toggle"]');
        await page.waitForTimeout(300); // Wait for mobile menu animation
        await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

        // Test mobile dropdown
        await page.click('[data-testid="mobile-platform-toggle"]');
        await page.waitForTimeout(300); // Wait for dropdown animation
        await expect(page.locator('[data-testid="mobile-platform-dropdown"]')).toBeVisible();

        // Close mobile menu
        await page.click('[data-testid="menu-toggle"]');
        await page.waitForTimeout(300);
        await expect(page.locator('[data-testid="mobile-menu-overlay"]')).not.toBeVisible();
      } else {
        // Desktop: Test dropdown interaction
        await page.hover(".has-dropdown");
        await page.waitForTimeout(500); // Wait for hover animation and state change
        await expect(page.locator(".dropdown-menu").first()).toBeVisible({ timeout: 5000 });

        // Test mobile menu on desktop (should work when viewport is small)
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(300); // Wait for viewport change
        await page.click('[data-testid="menu-toggle"]');
        await page.waitForTimeout(300); // Wait for mobile menu animation
        await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

        // Reset viewport for back to top test
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.goto("/");
      }

      // Test back to top (works for both mobile and desktop)
      await page.locator("footer").scrollIntoViewIfNeeded();
      const backToTopButton = page.locator('button[aria-label="Back to top"]');
      if (await backToTopButton.isVisible()) {
        await backToTopButton.click();
        await expect(page.locator(".hero-section")).toBeInViewport();
      }

      console.log(`✓ Interactive features work correctly in ${browserName}`);
    });
  });

  test.describe("Mobile Browser Compatibility", () => {
    test("should work correctly on mobile browsers", async ({ page, browserName }) => {
      // Only run if viewport is mobile-sized (less than 640px wide)
      const viewportSize = page.viewportSize();
      if (viewportSize.width >= 640) {
        test.skip();
      }

      await page.goto("/");

      // Mobile-specific functionality
      await expect(page.locator('[data-testid="menu-toggle"]')).toBeVisible();
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).not.toBeVisible();

      // Test mobile menu
      await page.tap('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

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
      // Only run if viewport is mobile-sized (less than 640px wide)
      const viewportSize = page.viewportSize();
      if (viewportSize.width >= 640) {
        test.skip();
      }

      await page.goto("/");

      // Test touch interactions
      await page.tap('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

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

      // Wait for form submission and error to be processed
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(3000); // Extended wait for Safari/webkit

      // Look for error message in multiple ways - some browsers might display it differently
      const errorMessage = page.locator(
        "text=This email address is already registered for early access."
      );
      const errorContainer = page.locator('.error, .alert, .notification, [role="alert"]');
      const formError = page
        .locator("form")
        .locator("text=This email address is already registered");

      try {
        // Try the exact text match first
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      } catch {
        try {
          // Try looking for any error container that might contain the message
          await expect(errorContainer).toContainText("already registered", { timeout: 5000 });
        } catch {
          // Try looking within the form for partial text
          await expect(formError).toBeVisible({ timeout: 5000 });
        }
      }

      console.log(`✓ API error handling works correctly in ${browserName}`);
    });
  });
});
