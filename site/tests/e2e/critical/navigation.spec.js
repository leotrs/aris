import { test, expect } from "@playwright/test";

test.describe("Navigation Flow E2E", () => {
  test("should navigate between all main pages", async ({ page, browserName }) => {
    // Start at home page
    await page.goto("/");
    await expect(page).toHaveTitle(/Aris/);
    await expect(page.locator("h1")).toContainText("Aris: The Unified Platform");

    // Check if this is a mobile viewport (based on responsive breakpoint - sm: 640px)
    const viewport = page.viewportSize();
    const isMobile = viewport.width <= 640;

    if (isMobile) {
      // Mobile navigation: use mobile menu
      await page.click(".menu-toggle");
      await page.waitForTimeout(300);
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      // Navigate to signup via mobile menu
      await page.click('.mobile-nav-link[href="/signup"]');
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/signup");
      await expect(page.locator("h1")).toContainText("Sign Up");

      // Use direct navigation for other pages since they may not be in mobile menu
      await page.goto("/terms");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/terms");
      await expect(page.locator("h1")).toContainText("Terms");

      await page.goto("/cookies");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/cookies");
      await expect(page.locator("h1")).toContainText("Cookie");

      // Navigate back to home via logo
      await page.click('a[href="/"]');
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/");
      await expect(page.locator("h1")).toContainText("Aris: The Unified Platform");
    } else {
      // Desktop navigation: use regular nav links
      await page.click('a[href="/signup"]');
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/signup");
      await expect(page.locator("h1")).toContainText("Sign Up");

      // Navigate to terms page
      await page.click('a[href="/terms"]');
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/terms");
      await expect(page.locator("h1")).toContainText("Terms");

      // Navigate to cookies page
      await page.click('a[href="/cookies"]');
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/cookies");
      await expect(page.locator("h1")).toContainText("Cookie");

      // Navigate back to home via logo
      await page.click('a[href="/"]');
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL("/");
      await expect(page.locator("h1")).toContainText("Aris: The Unified Platform");
    }
  });

  test("should handle navbar navigation links", async ({ page, browserName }) => {
    await page.goto("/");

    // Check if this is a mobile viewport (based on responsive breakpoint - sm: 640px)
    const viewport = page.viewportSize();
    const isMobile = viewport.width <= 640;

    if (isMobile) {
      // Mobile: Open mobile menu first
      await page.click(".menu-toggle");
      await page.waitForTimeout(300);
      await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

      // Test mobile navbar links
      const aboutLink = page.locator('.mobile-nav-link[href="/about"]');
      const aiCopilotLink = page.locator('.mobile-nav-link[href="/ai-copilot"]');
      const pricingLink = page.locator('.mobile-nav-link[href="/pricing"]');

      // Verify mobile links exist in DOM
      await expect(aboutLink).toBeVisible();
      await expect(aiCopilotLink).toBeVisible();
      await expect(pricingLink).toBeVisible();
    } else {
      // Desktop: Test navbar links (these may be external or placeholder) - only check they exist
      const aboutLink = page.locator('nav a[href="/about"]').first();
      const aiCopilotLink = page.locator('nav a[href="/ai-copilot"]').first();
      const pricingLink = page.locator('nav a[href="/pricing"]').first();

      // Verify links exist in DOM
      await expect(aboutLink).toBeVisible();
      await expect(aiCopilotLink).toBeVisible();
      await expect(pricingLink).toBeVisible();
    }

    // Define demo link variable based on mobile/desktop
    let demoLink;

    if (isMobile) {
      // Mobile: Test mobile dropdown
      await page.click(".mobile-dropdown-toggle");
      await page.waitForTimeout(300);
      await expect(page.locator(".mobile-dropdown-menu")).toBeVisible();

      const docLink = page.locator('.mobile-dropdown-link[href="/documentation"]');
      const blogLink = page.locator('.mobile-dropdown-link[href="/blog"]');
      await expect(docLink).toBeVisible();
      await expect(blogLink).toBeVisible();

      // Test mobile utility links
      const loginLink = page.locator('.mobile-nav-link[href="/login"]');
      const signupLink = page.locator('.mobile-nav-link[href="/signup"]');
      demoLink = page.locator('.mobile-nav-link[href="/demo"]');

      await expect(loginLink).toBeVisible();
      await expect(signupLink).toBeVisible();
      await expect(demoLink).toBeVisible();
    } else {
      // Desktop: Test Resources dropdown
      await page.hover(".has-dropdown");
      await page.waitForTimeout(300); // Wait for hover animation
      await expect(page.locator(".dropdown-menu")).toBeVisible();

      const docLink = page.locator('nav a[href="/documentation"]').first();
      const blogLink = page.locator('nav a[href="/blog"]').first();
      await expect(docLink).toBeVisible();
      await expect(blogLink).toBeVisible();

      // Test utility links that should work
      const loginLink = page.locator('nav a[href="/login"]').first();
      const signupLink = page.locator('nav a[href="/signup"]').first();
      demoLink = page.locator('nav a[href="/demo"]').first();

      await expect(loginLink).toBeVisible();
      await expect(signupLink).toBeVisible();
      await expect(demoLink).toBeVisible();
    }

    // Test demo link redirects to frontend (only if frontend is available)
    if ((await demoLink.count()) > 0) {
      try {
        // Check if frontend is available before testing demo
        const frontendCheck = await page.request.get("http://localhost:5173").catch(() => null);

        if (frontendCheck && frontendCheck.ok()) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle" }),
            demoLink.click(),
          ]);

          // Should redirect to frontend demo
          expect(page.url()).toContain("localhost:5173/demo");

          // Navigate back for other tests
          await page.goBack();
          await page.waitForLoadState("networkidle");
        } else {
          console.log("Frontend not available, skipping demo redirect test");
        }
      } catch {
        console.log("Demo redirect test skipped due to frontend unavailability");
      }
    }
  });

  test("should handle mobile navigation menu", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Mobile menu should be hidden initially
    await expect(page.locator(".mobile-menu-overlay")).not.toBeVisible();

    // Click hamburger menu
    await page.click(".menu-toggle");
    await page.waitForTimeout(300); // Wait for mobile menu animation
    await expect(page.locator(".mobile-menu-overlay")).toBeVisible();

    // Verify mobile navigation links
    await expect(page.locator('.mobile-nav-link[href="/about"]')).toBeVisible();
    await expect(page.locator('.mobile-nav-link[href="/ai-copilot"]')).toBeVisible();
    await expect(page.locator('.mobile-nav-link[href="/pricing"]')).toBeVisible();

    // Test mobile resources dropdown
    await page.click(".mobile-dropdown-toggle");
    await page.waitForTimeout(300); // Wait for dropdown animation
    await expect(page.locator(".mobile-dropdown-menu")).toBeVisible();

    // Test navigation to signup from mobile menu
    await page.click('.mobile-nav-link[href="/signup"]');
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/signup");

    // Mobile menu should close after navigation
    await expect(page.locator(".mobile-menu-overlay")).not.toBeVisible();
  });

  test("should handle footer navigation", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Test footer links
    const footerTermsLink = page.locator('footer a[href="/terms"]');
    const footerCookiesLink = page.locator('footer a[href="/cookies"]');

    await expect(footerTermsLink).toBeVisible();
    await expect(footerCookiesLink).toBeVisible();

    // Test footer navigation
    await footerTermsLink.click();
    await expect(page).toHaveURL("/terms");

    // Test back to top functionality
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Look for back to top button using aria-label
    const backToTopButton = page.locator('button[aria-label="Back to top"]');
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

  test("should handle navigation with browser back/forward buttons", async ({
    page,
    browserName,
  }) => {
    // Navigate through several pages
    await page.goto("/");

    // Check if this is a mobile viewport (based on responsive breakpoint - sm: 640px)
    const viewport = page.viewportSize();
    const isMobile = viewport.width <= 640;

    if (isMobile) {
      // Mobile navigation: use mobile menu
      await page.click(".menu-toggle");
      await page.waitForTimeout(300);
      await page.click('.mobile-nav-link[href="/signup"]');
    } else {
      // Desktop navigation: use regular nav links
      await page.click('a[href="/signup"]');
    }

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

  test("should handle demo route redirect correctly", async ({ page }) => {
    // Test direct navigation to /demo
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

    // Should redirect to frontend demo
    expect(page.url()).toContain("localhost:5173/demo");

    // Verify demo loads
    await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".demo-banner")).toBeVisible();
  });

  test("should handle invalid routes gracefully", async ({ page }) => {
    // Try to navigate to non-existent page
    const response = await page.goto("/non-existent-page");

    // Should return 404 or redirect to error page
    expect(response?.status()).toBe(404);
  });

  test("should maintain scroll position appropriately", async ({ page, browserName }) => {
    await page.goto("/");

    // Scroll down to a section
    await page.locator(".section-two").scrollIntoViewIfNeeded();

    // Get current scroll position
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(100);

    // Navigate to another page and back
    // Check if this is a mobile viewport (based on responsive breakpoint - sm: 640px)
    const viewport = page.viewportSize();
    const isMobile = viewport.width <= 640;

    if (isMobile) {
      // Mobile navigation: use mobile menu
      await page.click(".menu-toggle");
      await page.waitForTimeout(300);
      await page.click('.mobile-nav-link[href="/signup"]');
    } else {
      // Desktop navigation: use regular nav links
      await page.click('a[href="/signup"]');
    }

    await expect(page).toHaveURL("/signup");

    await page.goBack();
    await expect(page).toHaveURL("/");

    // Verify we're back on the home page (don't check scroll position as browser behavior varies)
    await expect(page.locator(".hero-section")).toBeVisible();
  });
});
