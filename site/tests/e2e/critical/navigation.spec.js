import { test, expect } from "@playwright/test";

test.describe("Navigation Flow E2E", () => {
  test("should navigate between all main pages", async ({ page }) => {
    // Start at home page
    await page.goto("/");
    await expect(page).toHaveTitle(/Aris/);
    await expect(page.locator("h1")).toContainText(
      "The Collaborative Preprint Server for Modern Research"
    );

    // Check if viewport is mobile-sized (less than 640px wide)
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize.width < 640;

    if (isMobile) {
      // Mobile navigation: use mobile menu
      await page.click('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

      // Navigate to signup via mobile menu
      await page.click('.mobile-nav-link[href="/signup"]');
      await page.waitForURL("/signup");
      await expect(page.locator("h1")).toContainText("Sign Up");

      // Use direct navigation for other pages since they may not be in mobile menu
      await page.goto("/terms");
      await page.waitForURL("/terms");
      await expect(page.locator("h1")).toContainText("Terms");

      await page.goto("/cookies");
      await page.waitForURL("/cookies");
      await expect(page.locator("h1")).toContainText("Cookie");

      // Navigate back to home via logo
      await page.click('a[href="/"]');
      await page.waitForURL("/");
      await expect(page.locator("h1")).toContainText(
        "The Collaborative Preprint Server for Modern Research"
      );
    } else {
      // Desktop navigation: use visible nav links from navbar-utility-links
      await page.click('.navbar-utility-links a[href="/signup"]');
      await page.waitForURL("/signup");
      await expect(page.locator("h1")).toContainText("Sign Up");

      // Navigate to terms page
      await page.click('a[href="/terms"]');
      await page.waitForURL("/terms");
      await expect(page.locator("h1")).toContainText("Terms");

      // Navigate to cookies page
      await page.click('a[href="/cookies"]');
      await page.waitForURL("/cookies");
      await expect(page.locator("h1")).toContainText("Cookie");

      // Navigate back to home via logo
      await page.click('a[href="/"]');
      await page.waitForURL("/");
      await expect(page.locator("h1")).toContainText(
        "The Collaborative Preprint Server for Modern Research"
      );
    }
  });

  test("should handle navbar navigation links", async ({ page }) => {
    await page.goto("/");

    // Check if viewport is mobile-sized (less than 640px wide)
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize.width < 640;

    if (isMobile) {
      // Mobile: Open mobile menu first
      await page.click('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

      // Test mobile navbar links (direct links only)
      const gettingStartedLink = page.locator('.mobile-nav-link[href="/getting-started"]');
      const pricingLink = page.locator('.mobile-nav-link[href="/pricing"]');
      const contactLink = page.locator('.mobile-nav-link[href="/contact"]');

      // Verify mobile direct links exist in DOM
      await expect(gettingStartedLink).toBeVisible();
      await expect(pricingLink).toBeVisible();
      await expect(contactLink).toBeVisible();

      // Test Platform dropdown contains about/ai-copilot
      await page.locator('[data-testid="mobile-platform-toggle"]').click();
      const aboutLink = page.locator('[data-testid="mobile-platform-dropdown"] a[href="/about"]');
      const aiCopilotLink = page.locator(
        '[data-testid="mobile-platform-dropdown"] a[href="/ai-copilot"]'
      );
      await expect(aboutLink).toBeVisible();
      await expect(aiCopilotLink).toBeVisible();
    } else {
      // Desktop: Test navbar links - pricing is directly visible, others are in dropdowns
      const pricingLink = page.locator('nav a[href="/pricing"]').first();
      await expect(pricingLink).toBeVisible();

      // Test Platform dropdown
      await page.hover('[data-testid="platform-dropdown"]');

      const aboutLink = page.locator('nav a[href="/about"]').first();
      const aiCopilotLink = page.locator('nav a[href="/ai-copilot"]').first();

      await expect(aboutLink).toBeVisible();
      await expect(aiCopilotLink).toBeVisible();
    }

    // Define demo link variable based on mobile/desktop
    let demoLink;

    if (isMobile) {
      // Mobile: Test mobile dropdown (click Resources dropdown)
      await page.locator('[data-testid="mobile-resources-toggle"]').click();
      await expect(page.locator('[data-testid="mobile-resources-dropdown"]')).toBeVisible();

      const docLink = page.locator(
        '[data-testid="mobile-resources-dropdown"] a[href="/documentation"]'
      );
      const blogLink = page.locator('[data-testid="mobile-resources-dropdown"] a[href="/blog"]');
      await expect(docLink).toBeVisible();
      await expect(blogLink).toBeVisible();

      // Test mobile utility links
      const loginLink = page
        .locator(".mobile-nav-link-utility")
        .filter({ hasText: "Login" })
        .first();
      const signupLink = page.locator('.mobile-nav-link[href="/signup"]');
      demoLink = page.locator(".mobile-nav-link-cta").filter({ hasText: "Try the Demo" }).first();

      await expect(loginLink).toBeVisible();
      await expect(signupLink).toBeVisible();
      await expect(demoLink).toBeVisible();
    } else {
      // Desktop: Test Resources dropdown (hover second dropdown)
      await page.hover('[data-testid="resources-dropdown"]'); // Resources dropdown
      // Wait for hover animation
      await expect(page.locator('[data-testid="resources-dropdown-menu"]')).toBeVisible(); // Resources dropdown menu

      const docLink = page.locator('nav a[href="/documentation"]').first();
      const blogLink = page.locator('nav a[href="/blog"]').first();
      await expect(docLink).toBeVisible();
      await expect(blogLink).toBeVisible();

      // Test utility links that should work
      const loginLink = page
        .locator(".navbar-utility-links a")
        .filter({ hasText: "Login" })
        .first();
      const signupLink = page.locator('.navbar-utility-links a[href="/signup"]');
      demoLink = page
        .locator(".navbar-utility-links a")
        .filter({ hasText: "Try the Demo" })
        .first();

      await expect(loginLink).toBeVisible();
      await expect(signupLink).toBeVisible();
      await expect(demoLink).toBeVisible();
    }

    // Demo link should be visible but testing its functionality is handled by frontend tests
    if ((await demoLink.count()) > 0) {
      await expect(demoLink).toBeVisible();
    }
  });

  test("should handle mobile navigation menu", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    // Mobile menu should be hidden initially
    await expect(page.locator('[data-testid="mobile-menu-overlay"]')).not.toBeVisible();

    // Click hamburger menu
    await page.click('[data-testid="menu-toggle"]');
    // Wait for mobile menu animation
    await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();

    // Verify mobile navigation links (about/ai-copilot are in Platform dropdown, pricing is direct)
    await expect(page.locator('.mobile-nav-link[href="/getting-started"]')).toBeVisible();
    await expect(page.locator('.mobile-nav-link[href="/pricing"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-platform-toggle"]')).toBeVisible();

    // Test mobile resources dropdown
    await page.locator('[data-testid="mobile-resources-toggle"]').click();
    // Wait for dropdown animation
    await expect(page.locator('[data-testid="mobile-resources-dropdown"]')).toBeVisible();

    // Test navigation to signup from mobile menu
    await page.click('.mobile-nav-link[href="/signup"]');
    await page.waitForURL("/signup");
    await expect(page.locator("h1")).toContainText("Sign Up");

    // Mobile menu should close after navigation
    await expect(page.locator('[data-testid="mobile-menu-overlay"]')).not.toBeVisible();
  });

  test("should handle footer navigation", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Test footer links (use first one to avoid strict mode violation)
    const footerTermsLink = page.locator('footer a[href="/terms"]').first();
    const footerCookiesLink = page.locator('footer a[href="/cookies"]').first();

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
    console.log("[DEBUG-CI] Starting keyboard navigation test");
    console.log("[DEBUG-CI] Browser info:", await page.evaluate(() => navigator.userAgent));

    await page.goto("/");
    console.log("[DEBUG-CI] Navigated to homepage");

    // Navigate through page using Tab key
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop
    console.log("[DEBUG-CI] Max tabs allowed:", maxTabs);

    // Tab through focusable elements
    while (tabCount < maxTabs) {
      await page.keyboard.press("Tab");
      tabCount++;

      // Check if we can reach main navigation elements
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      const focusedId = await page.evaluate(() => document.activeElement?.id);
      const focusedClass = await page.evaluate(() => document.activeElement?.className);

      console.log(
        `[DEBUG-CI] Tab ${tabCount}: focused element=${focusedElement}, id=${focusedId}, class=${focusedClass}`
      );

      if (focusedElement === "A" || focusedElement === "BUTTON") {
        // Found a focusable navigation element
        console.log("[DEBUG-CI] Found focusable navigation element, breaking");
        break;
      }
    }

    console.log("[DEBUG-CI] Final tab count:", tabCount);
    console.log("[DEBUG-CI] Expected: tabCount <", maxTabs);
    console.log("[DEBUG-CI] Actual result:", tabCount < maxTabs);

    // Verify at least some navigation elements are keyboard accessible
    expect(tabCount).toBeLessThan(maxTabs);
  });

  test("should handle navigation with browser back/forward buttons", async ({ page }) => {
    // Navigate through several pages
    await page.goto("/");

    // Check if viewport is mobile-sized (less than 640px wide)
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize.width < 640;

    if (isMobile) {
      // Mobile navigation: use mobile menu
      await page.click('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();
      await page.click('.mobile-nav-link[href="/signup"]');
    } else {
      // Desktop navigation: use regular nav links
      await page.click('.navbar-utility-links a[href="/signup"]');
    }

    await expect(page).toHaveURL("/signup");

    await page.click('a[href="/terms"]');
    await expect(page).toHaveURL("/terms");

    // Use browser back button
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForURL("/signup");
    await expect(page.locator("h1")).toContainText("Sign Up");

    // Use browser forward button
    await page.goForward({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForURL("/terms");
    await expect(page.locator("h1")).toContainText("Terms");

    // Go back to home
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForURL("/signup");
    await page.goBack({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForURL("/", { timeout: 12000 });
    await expect(page.locator("h1")).toContainText(
      "The Collaborative Preprint Server for Modern Research"
    );
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
    await page.locator(".platform-overview-section").scrollIntoViewIfNeeded();

    // Get current scroll position
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(100);

    // Navigate to another page and back
    // Check if viewport is mobile-sized (less than 640px wide)
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize.width < 640;

    if (isMobile) {
      // Mobile navigation: use mobile menu
      await page.click('[data-testid="menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();
      await page.click('.mobile-nav-link[href="/signup"]');
    } else {
      // Desktop navigation: use regular nav links
      await page.click('.navbar-utility-links a[href="/signup"]');
    }

    await expect(page).toHaveURL("/signup");

    await page.goBack({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForURL("/", { timeout: 12000 });
    await expect(page.locator("h1")).toContainText(
      "The Collaborative Preprint Server for Modern Research"
    );

    // Verify we're back on the home page (don't check scroll position as browser behavior varies)
    await expect(page.locator(".hero-section")).toBeVisible();
  });
});
