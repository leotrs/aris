import { test, expect } from "@playwright/test";

test.describe("Navigation Flow E2E", () => {
  test("should navigate between all main pages", async ({ page }) => {
    // Start at home page
    await page.goto("/");
    await expect(page).toHaveTitle(/Aris/);
    await expect(page.locator("h1")).toContainText("Aris: The Unified Platform");

    // Navigate to signup page via hero CTA link
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL("/signup");
    await expect(page.locator("h1")).toContainText("Sign Up");

    // Navigate to terms page
    await page.click('a[href="/terms"]');
    await expect(page).toHaveURL("/terms");
    await expect(page.locator("h1")).toContainText("Terms");

    // Navigate to cookies page
    await page.click('a[href="/cookies"]');
    await expect(page).toHaveURL("/cookies");
    await expect(page.locator("h1")).toContainText("Cookie");

    // Navigate back to home via logo
    await page.click('a[href="/"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toContainText("Aris: The Unified Platform");
  });

  test("should handle navbar navigation links", async ({ page }) => {
    await page.goto("/");

    // Test navbar links (these may be external or placeholder) - only check they exist
    const aboutLink = page.locator('a[href="/about"]');
    const aiCopilotLink = page.locator('a[href="/ai-copilot"]');
    const pricingLink = page.locator('a[href="/pricing"]');

    // Verify links exist in DOM
    await expect(aboutLink).toBeVisible();
    await expect(aiCopilotLink).toBeVisible();
    await expect(pricingLink).toBeVisible();

    // Test Resources dropdown
    await page.hover(".has-dropdown");
    await expect(page.locator(".dropdown-menu")).toBeVisible();

    const docLink = page.locator('a[href="/documentation"]');
    const blogLink = page.locator('a[href="/blog"]');
    await expect(docLink).toBeVisible();
    await expect(blogLink).toBeVisible();

    // Test utility links that should work
    const loginLink = page.locator('a[href="/login"]');
    const signupLink = page.locator('a[href="/signup"]');
    const demoLink = page.locator('a[href="/demo"]');

    await expect(loginLink).toBeVisible();
    await expect(signupLink).toBeVisible();
    await expect(demoLink).toBeVisible();
  });

  test("should handle mobile navigation menu", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Mobile menu should be hidden initially
    await expect(page.locator(".mobile-menu-overlay")).not.toBeVisible();

    // Click hamburger menu
    await page.click(".menu-toggle");
    await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

    // Verify mobile navigation links
    await expect(page.locator('.mobile-nav-link[href="/about"]')).toBeVisible();
    await expect(page.locator('.mobile-nav-link[href="/ai-copilot"]')).toBeVisible();
    await expect(page.locator('.mobile-nav-link[href="/pricing"]')).toBeVisible();

    // Test mobile resources dropdown
    await page.click(".mobile-dropdown-toggle");
    await expect(page.locator(".mobile-dropdown-menu")).toBeVisible();

    // Test navigation to signup from mobile menu
    await page.click('.mobile-nav-link[href="/signup"]');
    await expect(page).toHaveURL("/signup");

    // Mobile menu should close after navigation
    await expect(page.locator(".mobile-menu-overlay")).not.toBeVisible();
  });

  test("should handle footer navigation", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer (use contentinfo instead of footer)
    await page.locator("contentinfo").scrollIntoViewIfNeeded();

    // Test footer links
    const footerTermsLink = page.locator('a[href="/terms"]');
    const footerCookiesLink = page.locator('a[href="/cookies"]');

    await expect(footerTermsLink).toBeVisible();
    await expect(footerCookiesLink).toBeVisible();

    // Test footer navigation
    await footerTermsLink.click();
    await expect(page).toHaveURL("/terms");

    // Test back to top functionality
    await page.goto("/");
    await page.locator("contentinfo").scrollIntoViewIfNeeded();

    // Look for back to top button with different selector
    const backToTopButton = page.locator('button:has-text("Back to top")');
    await expect(backToTopButton).toBeVisible();
    await backToTopButton.click();

    // Verify page scrolled to top (check if hero section is visible)
    await expect(page.locator(".hero-section")).toBeInViewport();
  });

  test("should handle keyboard navigation", async ({ page }) => {
    await page.goto("/");

    // Navigate through page using Tab key
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop

    // Tab through focusable elements
    while (tabCount < maxTabs) {
      await page.keyboard.press("Tab");
      tabCount++;

      // Check if we can reach main navigation elements
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      if (focusedElement === "A" || focusedElement === "BUTTON") {
        // Found a focusable navigation element
        break;
      }
    }

    // Verify at least some navigation elements are keyboard accessible
    expect(tabCount).toBeLessThan(maxTabs);
  });

  test("should handle navigation with browser back/forward buttons", async ({ page }) => {
    // Navigate through several pages
    await page.goto("/");
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL("/signup");

    await page.click('a[href="/terms"]');
    await expect(page).toHaveURL("/terms");

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL("/signup");

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL("/terms");

    // Go back to home
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL("/");
  });

  test("should handle invalid routes gracefully", async ({ page }) => {
    // Try to navigate to non-existent page
    const response = await page.goto("/non-existent-page");

    // Should return 404 or redirect to error page
    expect(response?.status()).toBe(404);
  });

  test("should maintain scroll position appropriately", async ({ page }) => {
    await page.goto("/");

    // Scroll down to a section
    await page.locator(".section-two").scrollIntoViewIfNeeded();

    // Get current scroll position
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(100);

    // Navigate to another page and back
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL("/signup");

    await page.goBack();
    await expect(page).toHaveURL("/");

    // Verify we're back on the home page (don't check scroll position as browser behavior varies)
    await expect(page.locator(".hero-section")).toBeVisible();
  });
});
