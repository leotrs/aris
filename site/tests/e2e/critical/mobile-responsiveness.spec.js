import { test, expect } from "@playwright/test";

test.describe("Mobile Responsiveness E2E", () => {
  const mobileViewports = [
    { name: "iPhone SE", width: 375, height: 667 },
    { name: "iPhone 12", width: 390, height: 844 },
    { name: "Samsung Galaxy S21", width: 360, height: 800 },
    { name: "iPad Mini", width: 768, height: 1024 },
  ];

  const desktopViewports = [
    { name: "Desktop Small", width: 1024, height: 768 },
    { name: "Desktop Large", width: 1440, height: 900 },
  ];

  test.describe("Mobile Navigation", () => {
    test("should show mobile menu on small screens", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Desktop navigation should be hidden
      await expect(page.locator(".navbar-links")).not.toBeVisible();
      await expect(page.locator(".navbar-utility-links")).not.toBeVisible();

      // Mobile menu toggle should be visible
      await expect(page.locator(".menu-toggle")).toBeVisible();

      // Mobile menu should be hidden initially
      await expect(page.locator(".mobile-menu-overlay")).not.toBeVisible();

      // Click to open mobile menu
      await page.click(".menu-toggle");
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      // Verify mobile navigation elements
      await expect(page.locator('.mobile-nav-link[href="/about"]')).toBeVisible();
      await expect(page.locator('.mobile-nav-link[href="/signup"]')).toBeVisible();
      await expect(page.locator('.mobile-nav-link[href="/demo"]')).toBeVisible();
    });

    test("should hide mobile menu on larger screens", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto("/");

      // Desktop navigation should be visible
      await expect(page.locator(".navbar-links")).toBeVisible();
      await expect(page.locator(".navbar-utility-links")).toBeVisible();

      // Mobile menu toggle should be hidden
      await expect(page.locator(".menu-toggle")).not.toBeVisible();
    });
  });

  test.describe("Responsive Layout", () => {
    mobileViewports.forEach((viewport) => {
      test(`should render correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto("/");

        // Hero section should adapt to mobile
        const heroSection = page.locator(".hero-section");
        await expect(heroSection).toBeVisible();

        // Text should be readable (not overlapping or cut off)
        const heroHeadline = page.locator(".hero-headline");
        await expect(heroHeadline).toBeVisible();

        // CTA buttons should be accessible
        const ctaButtons = page.locator(".hero-ctas .btn");
        await expect(ctaButtons.first()).toBeVisible();

        // Sections should stack properly (use actual component classes)
        await expect(page.locator(".section-two")).toBeVisible();
        await expect(page.locator("section").nth(2)).toBeVisible(); // SectionThree
        await expect(page.locator("section").nth(3)).toBeVisible(); // SectionFour
      });
    });

    test("should handle orientation changes", async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      await expect(page.locator(".hero-section")).toBeVisible();

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });

      // Content should still be accessible
      await expect(page.locator(".hero-section")).toBeVisible();
      await expect(page.locator(".hero-headline")).toBeVisible();
    });
  });

  test.describe("Mobile Form Usability", () => {
    test("should be usable on mobile devices", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/signup");

      // Form should be visible and properly sized
      const form = page.locator("form");
      await expect(form).toBeVisible();

      // Input fields should be appropriately sized for touch
      const emailInput = page.locator('input[type="email"]');
      const nameInput = page.locator('input[name="name"]');

      await expect(emailInput).toBeVisible();
      await expect(nameInput).toBeVisible();

      // Fields should be easily tappable (minimum 44px touch target)
      const emailBox = await emailInput.boundingBox();
      const nameBox = await nameInput.boundingBox();

      expect(emailBox?.height).toBeGreaterThanOrEqual(40);
      expect(nameBox?.height).toBeGreaterThanOrEqual(40);

      // Test form interaction
      await emailInput.tap();
      await emailInput.fill("test@example.com");

      await nameInput.tap();
      await nameInput.fill("Dr. Jane Doe");

      // Submit button should be easily tappable
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();

      const submitBox = await submitButton.boundingBox();
      expect(submitBox?.height).toBeGreaterThanOrEqual(40);
    });

    test("should handle virtual keyboard properly", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/signup");

      // Focus on email input (would trigger virtual keyboard on real device)
      await page.click('input[type="email"]');

      // Form should remain accessible even with reduced viewport height
      // (simulating virtual keyboard taking up space)
      await page.setViewportSize({ width: 375, height: 400 });

      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });
  });

  test.describe("Touch Interactions", () => {
    test("should handle touch events on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Test touch on mobile menu
      await page.tap(".menu-toggle");
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      // Test touch on mobile links
      await page.tap('.mobile-nav-link[href="/signup"]');
      await expect(page).toHaveURL("/signup");
    });

    test("should handle scroll behavior on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Should be able to scroll through all sections
      await page.locator(".section-two").scrollIntoViewIfNeeded();
      await expect(page.locator(".section-two")).toBeInViewport();

      await page.locator("section").nth(2).scrollIntoViewIfNeeded();
      await expect(page.locator("section").nth(2)).toBeInViewport();

      await page.locator("contentinfo").scrollIntoViewIfNeeded();
      await expect(page.locator("contentinfo")).toBeInViewport();

      // Test back to top functionality
      await page.tap('button:has-text("Back to top")');
      await expect(page.locator(".hero-section")).toBeInViewport();
    });
  });

  test.describe("Content Readability", () => {
    test("should maintain readable text sizes across viewports", async ({ page }) => {
      const viewports = [...mobileViewports, ...desktopViewports];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto("/");

        // Check that main text elements are visible and have reasonable sizes
        const headline = page.locator(".hero-headline");
        const subheadline = page.locator(".hero-subheadline");

        await expect(headline).toBeVisible();
        await expect(subheadline).toBeVisible();

        // Text should not be too small to read
        const headlineSize = await headline.evaluate((el) =>
          parseInt(window.getComputedStyle(el).fontSize)
        );
        const subheadlineSize = await subheadline.evaluate((el) =>
          parseInt(window.getComputedStyle(el).fontSize)
        );

        expect(headlineSize).toBeGreaterThanOrEqual(24); // Minimum readable size
        expect(subheadlineSize).toBeGreaterThanOrEqual(14);
      }
    });

    test("should not have horizontal scroll on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Check that page doesn't cause horizontal scrolling
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow small variance
    });
  });

  test.describe("Performance on Mobile", () => {
    test("should load reasonably fast on mobile simulation", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const startTime = Date.now();
      await page.goto("/");

      // Wait for main content to be visible
      await expect(page.locator(".hero-headline")).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Should load within reasonable time (adjust based on your requirements)
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });
  });
});
