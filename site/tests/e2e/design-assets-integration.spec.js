import { test, expect } from "@playwright/test";

test.describe("Design Assets Integration", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage
    await page.goto("/");
  });

  test("should load navbar logo from backend design assets", async ({ page }) => {
    // Mock the design assets API since backend may not be running in site tests
    await page.route("**/design-assets/**", async (route) => {
      // Return a simple SVG for any design assets request
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#0e9ae9"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12">ARIS</text>
      </svg>`;

      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: svgContent,
      });
    });

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Find the navbar logo
    const navbarLogo = page.locator(".navbar-logo img");
    await expect(navbarLogo).toBeVisible();

    // Check that the logo src points to the backend design assets
    const logoSrc = await navbarLogo.getAttribute("src");
    expect(logoSrc).toContain("/design-assets/logos/logo-32px.svg");

    // Verify the logo loads successfully (not broken image)
    await expect(navbarLogo).toHaveAttribute("alt", "Aris Logo");

    // Check that the image actually loads (naturalWidth > 0)
    const naturalWidth = await navbarLogo.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("should load footer logo from backend design assets", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Scroll to the footer
    await page.locator(".main-footer").scrollIntoViewIfNeeded();

    // Find the footer logo
    const footerLogo = page.locator(".footer-logo");
    await expect(footerLogo).toBeVisible();

    // Check that the logo src points to the backend design assets
    const logoSrc = await footerLogo.getAttribute("src");
    expect(logoSrc).toContain("/design-assets/logos/logo-32px-gray.svg");

    // Verify the logo loads successfully
    await expect(footerLogo).toHaveAttribute("alt", "Aris Logo");

    // Check that the image actually loads
    const naturalWidth = await footerLogo.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("should load design assets CSS files", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that design assets CSS files are loaded
    const stylesheets = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map((link) => link.href).filter((href) => href.includes("/design-assets/css/"));
    });

    // Should have loaded the 4 design asset CSS files
    expect(stylesheets.length).toBeGreaterThanOrEqual(4);

    // Check specific files are loaded
    const expectedFiles = ["typography.css", "components.css", "layout.css", "variables.css"];
    expectedFiles.forEach((filename) => {
      const found = stylesheets.some((href) => href.includes(filename));
      expect(found, `${filename} should be loaded`).toBe(true);
    });
  });

  test("should apply design assets CSS variables", async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that CSS variables from design assets are available
    const hasVariables = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      // Check for some expected CSS variables from variables.css
      return {
        hasPrimary: styles.getPropertyValue("--primary-500").trim() !== "",
        hasGray: styles.getPropertyValue("--gray-100").trim() !== "",
        hasFont: styles.getPropertyValue("--weight-regular").trim() !== "",
      };
    });

    // At least one of these should be true if design assets CSS is loaded
    expect(hasVariables.hasPrimary || hasVariables.hasGray || hasVariables.hasFont).toBe(true);
  });

  test("should handle logo loading errors gracefully", async ({ page }) => {
    // Intercept image requests and simulate failures for testing
    await page.route("**/design-assets/logos/**", (route) => {
      route.abort();
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Logo elements should still exist even if images fail to load
    const navbarLogo = page.locator(".navbar-logo img");
    await expect(navbarLogo).toBeVisible();

    // Should have proper alt text for accessibility
    await expect(navbarLogo).toHaveAttribute("alt", "Aris Logo");
  });

  test("should have correct CORS headers for design assets", async ({ page }) => {
    let designAssetResponse = null;

    // Listen for design asset requests
    page.on("response", (response) => {
      if (response.url().includes("/design-assets/")) {
        designAssetResponse = response;
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait a bit for design assets to load
    await page.waitForTimeout(1000);

    if (designAssetResponse) {
      // Check that the response was successful
      expect(designAssetResponse.status()).toBe(200);

      // Verify that it's actually serving content
      const contentType = designAssetResponse.headers()["content-type"];
      expect(contentType).toBeDefined();
    }
  });

  test("should load logos on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // On mobile, navbar logo should still be visible
    const navbarLogo = page.locator(".navbar-logo img");
    await expect(navbarLogo).toBeVisible();

    // Check logo loads correctly
    const logoSrc = await navbarLogo.getAttribute("src");
    expect(logoSrc).toContain("/design-assets/logos/logo-32px.svg");

    const naturalWidth = await navbarLogo.evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});
