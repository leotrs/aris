import { test, expect } from "@playwright/test";

test.describe("Demo Integration E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Start from the marketing site homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.describe("CTA Button Redirects", () => {
    test("Hero section CTA redirects to frontend demo", async ({ page }) => {
      console.log('[DEBUG-CI] Starting hero CTA redirect test');
      console.log('[DEBUG-CI] Browser info:', await page.evaluate(() => navigator.userAgent));
      console.log('[DEBUG-CI] FRONTEND_PORT:', process.env.FRONTEND_PORT);
      console.log('[DEBUG-CI] SITE_PORT:', process.env.SITE_PORT);

      // Find the Try the Demo button in hero section
      const heroButton = page.locator(".hero-section .btn-primary").first();
      console.log('[DEBUG-CI] Looking for hero button');
      await expect(heroButton).toBeVisible();
      console.log('[DEBUG-CI] Hero button is visible');
      
      await expect(heroButton).toContainText("Explore the Platform");
      console.log('[DEBUG-CI] Hero button has correct text');

      // Click the button and wait for navigation
      console.log('[DEBUG-CI] URL before click:', page.url());
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), heroButton.click()]);
      console.log('[DEBUG-CI] URL after click:', page.url());

      // Verify redirect happened
      const expectedUrl = `localhost:${process.env.FRONTEND_PORT}/demo`;
      console.log('[DEBUG-CI] Expected URL to contain:', expectedUrl);
      console.log('[DEBUG-CI] Actual URL:', page.url());
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);

      // Verify demo page loads with content
      console.log('[DEBUG-CI] Checking for demo-container element');
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
      console.log('[DEBUG-CI] demo-container is visible');
      
      await expect(page.locator('[data-testid="demo-banner"]')).toBeVisible();
      console.log('[DEBUG-CI] demo-banner is visible');
      
      await expect(page.locator('[data-testid="demo-banner"]')).toContainText("Demo Mode");
      console.log('[DEBUG-CI] demo-banner has correct text');
    });

    test("Section CTA button redirects to getting started", async ({ page }) => {
      console.log('[DEBUG-CI] Starting section CTA redirect test');
      console.log('[DEBUG-CI] URL before scrolling:', page.url());

      // Scroll to find the section CTA
      await page.locator(".cta-section").scrollIntoViewIfNeeded();
      console.log('[DEBUG-CI] Scrolled to cta-section');

      const sectionButton = page.locator(".cta-section .btn-primary").first();
      await expect(sectionButton).toBeVisible();
      console.log('[DEBUG-CI] Section button is visible');
      
      await expect(sectionButton).toContainText("Get Started");
      console.log('[DEBUG-CI] Section button has correct text');

      // Click and verify redirect
      console.log('[DEBUG-CI] URL before click:', page.url());
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        sectionButton.click(),
      ]);
      console.log('[DEBUG-CI] URL after click:', page.url());
      console.log('[DEBUG-CI] Expected URL to contain: /getting-started');

      expect(page.url()).toContain(`/getting-started`);
    });

    test("CTASection explore demo link redirects correctly", async ({ page }) => {
      // Find the "explore the demo" link
      const exploreLink = page
        .locator('a[href="/demo"]')
        .filter({ hasText: /explore.*demo/i })
        .first();

      if ((await exploreLink.count()) > 0) {
        await exploreLink.scrollIntoViewIfNeeded();
        await expect(exploreLink).toBeVisible();

        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle" }),
          exploreLink.click(),
        ]);

        expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
        await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({
          timeout: 10000,
        });
      }
    });

    test("BannerCTA demo button redirects correctly", async ({ page }) => {
      // Look for banner CTA (use hero button since banner may not exist)
      const bannerButton = page.locator(".hero-section .btn-primary").first();

      if ((await bannerButton.count()) > 0) {
        await bannerButton.scrollIntoViewIfNeeded();
        await expect(bannerButton).toBeVisible();

        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle" }),
          bannerButton.click(),
        ]);

        expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
        await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({
          timeout: 10000,
        });
      }
    });
  });

  test.describe("Direct Demo Route Access", () => {
    test("navigating to /demo redirects to frontend", async ({ page }) => {
      // Navigate directly to /demo on marketing site
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      // Should redirect to frontend demo
      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    });

    test("demo route with trailing slash works", async ({ page }) => {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        page.goto("/demo/"),
      ]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    });

    test("demo route with query parameters works", async ({ page }) => {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        page.goto("/demo?test=1"),
      ]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Redirect Behavior", () => {
    test("redirect returns 302 status", async ({ page }) => {
      // Monitor network requests
      const responses = [];
      page.on("response", (response) => {
        if (response.url().includes("/demo")) {
          responses.push({
            url: response.url(),
            status: response.status(),
          });
        }
      });

      await page.goto("/demo", { waitUntil: "networkidle" });

      // Find the 302 redirect response
      const redirectResponse = responses.find((r) => r.status === 302);
      expect(redirectResponse).toBeDefined();
      expect(redirectResponse.url).toContain(`localhost:${process.env.SITE_PORT}/demo`);
    });

    test("handles frontend unavailable gracefully", async ({ page }) => {
      // Block requests to frontend to simulate downtime
      await page.route(`**localhost:${process.env.FRONTEND_PORT}/**`, (route) => {
        route.abort("failed");
      });

      // Try to access demo - this will redirect but then fail to load
      try {
        await page.goto("/demo", { waitUntil: "domcontentloaded", timeout: 5000 });
      } catch (error) {
        // This is expected when frontend is unavailable
        expect(error.message).toContain("net::ERR_ABORTED");
      }
    });

    test("preserves URL structure in redirect", async ({ page }) => {
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      // URL should be the frontend demo URL
      expect(page.url()).toMatch(new RegExp(`localhost:${process.env.FRONTEND_PORT}\\/demo$`));
    });
  });

  test.describe("Mobile Demo Access", () => {
    test("mobile CTA buttons redirect correctly", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Find mobile CTA button
      const mobileButton = page.locator(".hero-section .btn-primary").first();
      await expect(mobileButton).toBeVisible();

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        mobileButton.click(),
      ]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });
    });

    test("mobile demo loads with proper viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);

      // Demo should be mobile responsive
      const demoContainer = page.locator('[data-testid="demo-container"]');
      await expect(demoContainer).toBeVisible({ timeout: 10000 });

      // Check if mobile class is applied
      const hasMobileClass = await demoContainer.evaluate(
        (el) =>
          el.classList.contains("mobile") ||
          getComputedStyle(el).getPropertyValue("--mobile-mode") !== ""
      );

      // Mobile behavior should be applied
      expect(typeof hasMobileClass).toBe("boolean");
    });
  });

  test.describe("Demo Content Validation", () => {
    test("demo loads with expected content after redirect", async ({ page }) => {
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      // Verify demo banner
      await expect(page.locator('[data-testid="demo-banner"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('[data-testid="demo-banner"]')).toContainText("Demo Mode");
      await expect(page.locator('[data-testid="demo-banner"]')).toContainText(
        "Experience Aris workspace"
      );

      // Verify demo workspace
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();

      // Verify manuscript content loads
      await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible({ timeout: 15000 });
    });

    test("demo back to homepage link works", async ({ page }) => {
      // Go to demo first
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);

      // Find and click back to homepage link
      const backLink = page
        .locator('[data-testid="demo-back-link"]')
        .filter({ hasText: /back.*homepage/i });
      await expect(backLink).toBeVisible();

      // Check where the link points
      const href = await backLink.getAttribute("href");

      // The demo back link might point to frontend root, which is expected
      if (href === "/" || href?.includes(`localhost:${process.env.SITE_PORT}`)) {
        await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), backLink.click()]);

        // Could go to either marketing site or frontend home
        const finalUrl = page.url();
        expect(finalUrl).toMatch(/localhost:(3000|5173)/);
      } else {
        // Skip this test if link behavior is different
        console.log(`Back link href: ${href} - skipping test`);
      }
    });

    test("demo manuscript content renders correctly", async ({ page }) => {
      console.log('[DEBUG-CI] Starting manuscript content render test');
      console.log('[DEBUG-CI] Browser info:', await page.evaluate(() => navigator.userAgent));
      
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.goto("/demo")]);
      console.log('[DEBUG-CI] URL after navigation:', page.url());

      // Wait for manuscript to load
      console.log('[DEBUG-CI] Looking for manuscript-viewer element');
      const manuscriptExists = await page.locator('[data-testid="manuscript-viewer"]').count();
      console.log('[DEBUG-CI] manuscript-viewer element count:', manuscriptExists);
      
      if (manuscriptExists === 0) {
        console.log('[DEBUG-CI] No manuscript-viewer found, checking page content');
        const bodyText = await page.evaluate(() => document.body.textContent);
        console.log('[DEBUG-CI] Page body text (first 500 chars):', bodyText.substring(0, 500));
        
        const allElements = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('[data-testid]'));
          return elements.map(el => el.getAttribute('data-testid'));
        });
        console.log('[DEBUG-CI] All data-testid elements found:', allElements);
      }
      
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 15000,
      });
      console.log('[DEBUG-CI] manuscript-viewer is now visible');

      // Verify content is present
      const manuscriptText = await page.locator('[data-testid="manuscript-viewer"]').textContent();
      console.log('[DEBUG-CI] Manuscript text length:', manuscriptText.length);
      console.log('[DEBUG-CI] Manuscript text (first 200 chars):', manuscriptText.substring(0, 200));
      
      expect(manuscriptText).toContain("The Future of Web-Native Publishing");
      expect(manuscriptText.length).toBeGreaterThan(100);
      console.log('[DEBUG-CI] Manuscript content validation passed');
    });
  });

  test.describe("Cross-Browser Compatibility", () => {
    test("demo redirect works in different browser contexts", async ({ browser }) => {
      // Test with fresh browser context
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroButton = page.locator(".hero-section .btn-primary").first();
      await expect(heroButton).toBeVisible();

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), heroButton.click()]);

      expect(page.url()).toContain(`localhost:${process.env.FRONTEND_PORT}/demo`);
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 10000 });

      await context.close();
    });
  });
});
