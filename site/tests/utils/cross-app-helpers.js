/**
 * Cross-App Integration Test Utilities
 * Helpers for testing interactions between marketing site and frontend demo
 */

export class CrossAppHelpers {
  constructor(page) {
    this.page = page;
    this.marketingSiteUrl = `http://localhost:${process.env.SITE_PORT}`;
    this.frontendUrl = `http://localhost:${process.env.FRONTEND_PORT}`;
  }

  /**
   * Check if both apps are running and accessible
   */
  async checkAppAvailability() {
    const results = {
      marketingSite: false,
      frontend: false,
      errors: [],
    };

    try {
      // Check marketing site
      const marketingResponse = await this.page.request.get(this.marketingSiteUrl);
      results.marketingSite = marketingResponse.ok();
      if (!results.marketingSite) {
        results.errors.push(`Marketing site unavailable: ${marketingResponse.status()}`);
      }
    } catch (error) {
      results.errors.push(`Marketing site error: ${error.message}`);
    }

    try {
      // Check frontend
      const frontendResponse = await this.page.request.get(this.frontendUrl);
      results.frontend = frontendResponse.ok();
      if (!results.frontend) {
        results.errors.push(`Frontend unavailable: ${frontendResponse.status()}`);
      }
    } catch (error) {
      results.errors.push(`Frontend error: ${error.message}`);
    }

    return results;
  }

  /**
   * Navigate to marketing site and verify it loads
   */
  async navigateToMarketingSite() {
    await this.page.goto(this.marketingSiteUrl);
    await this.page.waitForLoadState("networkidle");

    // Verify we're on marketing site
    const url = this.page.url();
    if (!url.includes(`localhost:${process.env.SITE_PORT}`)) {
      throw new Error(`Expected marketing site URL, got: ${url}`);
    }

    // Verify basic content loads
    await this.page.locator(".hero-section").waitFor({ timeout: 10000 });
    return true;
  }

  /**
   * Verify demo redirect works and returns redirect details
   */
  async testDemoRedirect(fromPath = "/demo") {
    const responses = [];

    // Monitor network responses
    this.page.on("response", (response) => {
      if (response.url().includes("/demo")) {
        responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers(),
        });
      }
    });

    const startTime = Date.now();

    // Navigate to demo path
    await this.page.goto(`${this.marketingSiteUrl}${fromPath}`);
    await this.page.waitForLoadState("networkidle");

    const endTime = Date.now();
    const finalUrl = this.page.url();

    // Find redirect response
    const redirectResponse = responses.find((r) => r.status === 302);

    return {
      success: finalUrl.includes(`localhost:${process.env.FRONTEND_PORT}/demo`),
      finalUrl,
      redirectTime: endTime - startTime,
      redirectResponse,
      allResponses: responses,
    };
  }

  /**
   * Test CTA button click and measure performance
   */
  async testCTAClick(selector) {
    const startTime = Date.now();

    // Ensure we're on marketing site
    await this.navigateToMarketingSite();

    // Find and click CTA
    const button = this.page.locator(selector).first();
    await button.waitFor({ timeout: 10000 });
    await button.scrollIntoViewIfNeeded();

    const clickTime = Date.now();

    // Click and wait for navigation
    await Promise.all([this.page.waitForNavigation({ waitUntil: "networkidle" }), button.click()]);

    const navigationTime = Date.now();

    // Wait for demo content to load
    await this.page.locator('[data-testid="demo-container"]').waitFor({ timeout: 15000 });

    const loadTime = Date.now();

    return {
      success: this.page.url().includes(`localhost:${process.env.FRONTEND_PORT}/demo`),
      finalUrl: this.page.url(),
      timing: {
        setup: clickTime - startTime,
        navigation: navigationTime - clickTime,
        contentLoad: loadTime - navigationTime,
        total: loadTime - startTime,
      },
      buttonText: await button.textContent(),
    };
  }

  /**
   * Verify demo content loads correctly
   */
  async verifyDemoContent() {
    // Must be on demo page
    if (!this.page.url().includes(`localhost:${process.env.FRONTEND_PORT}/demo`)) {
      throw new Error("Not on demo page");
    }

    const checks = {
      demoBanner: false,
      demoContainer: false,
      demoCanvas: false,
      manuscriptContent: false,
      backLink: false,
    };

    try {
      // Check demo banner
      await this.page.locator(".demo-banner").waitFor({ timeout: 5000 });
      checks.demoBanner = true;
    } catch {
      console.warn("Demo banner not found");
    }

    try {
      // Check demo container
      await this.page.locator('[data-testid="demo-container"]').waitFor({ timeout: 5000 });
      checks.demoContainer = true;
    } catch {
      console.warn("Demo container not found");
    }

    try {
      // Check demo canvas
      await this.page.locator('[data-testid="demo-canvas"]').waitFor({ timeout: 10000 });
      checks.demoCanvas = true;
    } catch {
      console.warn("Demo canvas not found");
    }

    try {
      // Check manuscript content
      const manuscript = this.page.locator('[data-testid="manuscript-viewer"]');
      await manuscript.waitFor({ timeout: 15000 });
      const text = await manuscript.textContent();
      checks.manuscriptContent = text.length > 100;
    } catch {
      console.warn("Manuscript content not loaded");
    }

    try {
      // Check back to homepage link
      await this.page.locator(".demo-link").waitFor({ timeout: 5000 });
      checks.backLink = true;
    } catch {
      console.warn("Back link not found");
    }

    return checks;
  }

  /**
   * Test complete round trip: marketing site -> demo -> back
   */
  async testCompleteUserJourney() {
    const journey = {
      steps: [],
      success: false,
      errors: [],
    };

    try {
      // Step 1: Start on marketing site
      await this.navigateToMarketingSite();
      journey.steps.push("Marketing site loaded");

      // Step 2: Click CTA
      const heroButton = this.page.locator(".hero-section .btn-primary").first();
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: "networkidle" }),
        heroButton.click(),
      ]);
      journey.steps.push("CTA clicked, navigated to demo");

      // Step 3: Verify demo loads
      const demoChecks = await this.verifyDemoContent();
      journey.steps.push(
        `Demo content verified: ${Object.values(demoChecks).filter(Boolean).length}/5 checks passed`
      );

      // Step 4: Return to marketing site
      const backLink = this.page.locator(".demo-link").filter({ hasText: /back.*homepage/i });
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: "networkidle" }),
        backLink.click(),
      ]);

      const finalUrl = this.page.url();
      if (finalUrl.includes(`localhost:${process.env.SITE_PORT}`) && !finalUrl.includes("/demo")) {
        journey.steps.push("Successfully returned to marketing site");
        journey.success = true;
      } else {
        journey.errors.push(`Unexpected final URL: ${finalUrl}`);
      }
    } catch (error) {
      journey.errors.push(`Journey failed: ${error.message}`);
    }

    return journey;
  }

  /**
   * Test demo accessibility from different entry points
   */
  async testMultipleEntryPoints() {
    const entryPoints = [
      { path: "/demo", name: "Direct demo URL" },
      { path: "/demo/", name: "Demo URL with trailing slash" },
      { path: "/demo?test=1", name: "Demo URL with query params" },
    ];

    const results = [];

    for (const entry of entryPoints) {
      try {
        const result = await this.testDemoRedirect(entry.path);
        results.push({
          entryPoint: entry.name,
          path: entry.path,
          success: result.success,
          finalUrl: result.finalUrl,
          redirectTime: result.redirectTime,
        });
      } catch (error) {
        results.push({
          entryPoint: entry.name,
          path: entry.path,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Clean up event listeners and reset state
   */
  cleanup() {
    this.page.removeAllListeners("response");
    this.page.removeAllListeners("request");
  }
}

/**
 * Wait for both apps to be available before running tests
 */
export async function waitForAppsReady(page, timeout = 30000) {
  const helpers = new CrossAppHelpers(page);
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const status = await helpers.checkAppAvailability();

    if (status.marketingSite && status.frontend) {
      return true;
    }

    console.log("Waiting for apps to be ready...", status);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Apps not ready within timeout period");
}

/**
 * Utility to test all CTA buttons on marketing site
 */
export async function testAllCTAButtons(page) {
  const helpers = new CrossAppHelpers(page);
  await helpers.navigateToMarketingSite();

  const ctaSelectors = [
    ".hero-section .btn-primary",
    ".cta-section .btn-primary",
    'a[href="/demo"]',
  ];

  const results = [];

  for (const selector of ctaSelectors) {
    const buttons = await page.locator(selector).all();

    for (let i = 0; i < buttons.length; i++) {
      try {
        // Return to marketing site for each test
        await helpers.navigateToMarketingSite();

        const result = await helpers.testCTAClick(`${selector}:nth-of-type(${i + 1})`);
        results.push({
          selector: `${selector}:nth-of-type(${i + 1})`,
          success: result.success,
          timing: result.timing,
          buttonText: result.buttonText,
        });
      } catch (error) {
        results.push({
          selector: `${selector}:nth-of-type(${i + 1})`,
          success: false,
          error: error.message,
        });
      }
    }
  }

  return results;
}
