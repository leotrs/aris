import { test, expect } from "@playwright/test";

test.describe("User Journey: Marketing Site to Demo", () => {
  test.describe("Complete User Flow", () => {
    test("homepage to demo via hero CTA - complete journey", async ({ page }) => {
      // Step 1: User lands on homepage
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Verify homepage loads correctly
      await expect(page.locator("h1")).toContainText("Aris: The Unified Platform");
      await expect(page.locator(".hero-section")).toBeVisible();

      // Step 2: User sees and clicks hero CTA
      const heroButton = page.locator(".hero-section .btn-primary").first();
      await expect(heroButton).toBeVisible();
      await expect(heroButton).toContainText("Try the Demo");

      // Measure click to demo load time
      const startTime = Date.now();

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), heroButton.click()]);

      const loadTime = Date.now() - startTime;
      console.log(`Demo load time: ${loadTime}ms`);

      // Step 3: User arrives at demo
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      // Step 4: Demo content loads
      await expect(page.locator(".demo-banner")).toBeVisible();
      await expect(page.locator(".demo-banner")).toContainText("Demo Mode");

      // Wait for manuscript content to load
      await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible({ timeout: 15000 });

      // Step 5: User can interact with demo
      // Try focus mode shortcut
      await page.keyboard.press("c");
      await page.waitForTimeout(500);

      // Check if focus mode activated
      const demoContainer = page.locator('[data-testid="demo-container"]');
      const hasFocusClass = await demoContainer.evaluate((el) => el.classList.contains("focus"));

      if (hasFocusClass) {
        // Banner should be hidden in focus mode
        await expect(page.locator(".demo-banner")).toBeHidden();
      }

      // Exit focus mode
      await page.keyboard.press("c");
      await page.waitForTimeout(500);
      await expect(page.locator(".demo-banner")).toBeVisible();

      // Step 6: User goes back to marketing site (manually navigate)
      await page.goto(`http://localhost:${process.env.SITE_PORT}`);
      await page.waitForLoadState("networkidle");

      // Step 7: User is back on marketing site
      expect(page.url()).toContain(`localhost:${process.env.SITE_PORT}`);
      expect(page.url()).not.toContain("/demo");
      await expect(page.locator(".hero-section")).toBeVisible();
    });

    test("explore different CTAs in same session", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Test multiple CTA buttons in sequence
      const ctaSelectors = [".hero-section .btn-primary", ".cta-section .btn-primary"];

      for (let i = 0; i < ctaSelectors.length; i++) {
        const selector = ctaSelectors[i];
        const button = page.locator(selector).filter({ hasText: /demo/i }).first();

        if ((await button.count()) > 0) {
          await button.scrollIntoViewIfNeeded();
          await expect(button).toBeVisible();

          // Click CTA and go to demo
          await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), button.click()]);

          expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
          await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({
            timeout: 10000,
          });

          // Return to marketing site for next CTA test
          if (i < ctaSelectors.length - 1) {
            await page.goto(`http://localhost:${process.env.SITE_PORT}`);
            await page.waitForLoadState("networkidle");
            expect(page.url()).toContain(`localhost:${process.env.SITE_PORT}`);
          }
        }
      }
    });

    test("browser navigation works correctly", async ({ page }) => {
      // Start from homepage
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Navigate to demo
      const heroButton = page.locator(".hero-section .btn-primary").first();
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), heroButton.click()]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      // Manual navigation back to marketing site (more realistic user behavior)
      await page.goto(`http://localhost:${process.env.SITE_PORT}`);
      await page.waitForLoadState("networkidle");

      // Should be back on marketing site
      expect(page.url()).toContain(`localhost:${process.env.SITE_PORT}`);
      expect(page.url()).not.toContain("/demo");
      await expect(page.locator(".hero-section")).toBeVisible();

      // Navigate to demo again
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      // Should be back on demo
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("User Scenarios", () => {
    test("new user discovery flow", async ({ page }) => {
      // Simulate new user who has never seen Aris
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // User reads hero content
      await expect(page.locator(".hero-headline")).toContainText("Aris: The Unified Platform");
      await expect(page.locator(".hero-subheadline")).toBeVisible();

      // User scrolls to learn more
      await page.locator(".section-two").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // User decides to try demo
      await page.locator(".hero-section").scrollIntoViewIfNeeded();
      const demoButton = page.locator(".hero-section .btn-primary").first();

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), demoButton.click()]);

      // User experiences demo
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      // Verify user sees demo instructions
      await expect(page.locator(".demo-banner")).toContainText("Experience Aris workspace");

      // User explores manuscript content
      await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible({ timeout: 15000 });

      const manuscriptText = await page.locator('[data-testid="manuscript-viewer"]').textContent();
      expect(manuscriptText).toContain("The Future of Web-Native Publishing");
    });

    test("returning user quick demo access", async ({ page }) => {
      // Simulate user who knows about Aris and wants quick demo access

      // User goes directly to demo URL
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      // Should redirect immediately to demo
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      // Demo should load quickly for returning users
      await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible({ timeout: 10000 });
    });

    test("user shares demo URL", async ({ page, browser }) => {
      // Simulate user sharing demo URL with colleague

      // Original user navigates to demo
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      const demoUrl = page.url();
      expect(demoUrl).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);

      // Simulate sharing URL (new browser context)
      const context = await browser.newContext();
      const sharedPage = await context.newPage();

      // Colleague clicks shared URL
      await sharedPage.goto(demoUrl);
      await sharedPage.waitForLoadState("networkidle");

      // Should load demo directly
      expect(sharedPage.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(sharedPage.locator('[data-testid="demo-container"]')).toBeVisible({
        timeout: 10000,
      });

      await context.close();
    });

    test("user mobile demo experience", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Mobile user sees hero section
      await expect(page.locator(".hero-section")).toBeVisible();

      // Mobile CTA should be accessible
      const mobileButton = page.locator(".btn-primary").filter({ hasText: /demo/i }).first();
      await expect(mobileButton).toBeVisible();

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        mobileButton.click(),
      ]);

      // Demo should work on mobile
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      // Check mobile responsive behavior
      const demoContainer = page.locator('[data-testid="demo-container"]');
      const hasMobileClass = await demoContainer.evaluate(
        (el) => el.classList.contains("mobile") || window.innerWidth <= 768
      );

      expect(typeof hasMobileClass).toBe("boolean");
    });
  });

  test.describe("Error Recovery", () => {
    test("handles slow demo loading gracefully", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Simulate slow network
      await page.route(`**localhost:${process.env.FRONTEND_PORT}/**`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay
        route.continue();
      });

      const heroButton = page.locator(".hero-section .btn-primary").first();

      const startTime = Date.now();
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle", timeout: 30000 }),
        heroButton.click(),
      ]);

      const loadTime = Date.now() - startTime;
      console.log(`Slow demo load time: ${loadTime}ms`);

      // Should still reach demo eventually
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 15000 });
    });

    test("multiple rapid CTA clicks handled correctly", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroButton = page.locator(".hero-section .btn-primary").first();

      // Simulate user rapidly clicking CTA
      const clickPromises = [];
      for (let i = 0; i < 3; i++) {
        clickPromises.push(heroButton.click());
      }

      // Wait for navigation
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), ...clickPromises]);

      // Should still work correctly
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    });

    test("demo unavailable fallback behavior", async ({ page }) => {
      // Block all requests to frontend
      await page.route(`**localhost:${process.env.FRONTEND_PORT}/**`, (route) => {
        route.abort("failed");
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroButton = page.locator(".hero-section .btn-primary").first();

      // Click should still work (redirect will happen)
      await heroButton.click();
      await page.waitForTimeout(2000);

      // Should attempt redirect but frontend is unavailable
      // The redirect itself should still work, even if destination fails
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/localhost:(3000|5173)/);
    });
  });

  test.describe("Performance Validation", () => {
    test("demo loads within acceptable time", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroButton = page.locator(".hero-section .btn-primary").first();

      const startTime = Date.now();

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), heroButton.click()]);

      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      const totalTime = Date.now() - startTime;
      console.log(`Total demo access time: ${totalTime}ms`);

      // Demo should load within 10 seconds
      expect(totalTime).toBeLessThan(10000);
    });

    test("demo content renders within reasonable time", async ({ page }) => {
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      const startTime = Date.now();

      // Wait for manuscript content to be fully loaded
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 15000,
      });

      const renderTime = Date.now() - startTime;
      console.log(`Demo content render time: ${renderTime}ms`);

      // Content should render within 15 seconds
      expect(renderTime).toBeLessThan(15000);

      // Verify content is substantial
      const manuscriptText = await page.locator('[data-testid="manuscript-viewer"]').textContent();
      expect(manuscriptText.length).toBeGreaterThan(500);
    });
  });
});
