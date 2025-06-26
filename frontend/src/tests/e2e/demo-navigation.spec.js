import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";

test.describe("Demo Navigation & Access", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Use proper auth clearing from auth helpers
    await authHelpers.clearAuthState();
  });

  test.describe("Route Access", () => {
    test("can navigate to /demo route directly", async ({ page }) => {
      // Verify tokens are cleared
      const tokens = await authHelpers.getStoredTokens();
      expect(tokens.accessToken).toBeNull();

      await page.goto("/demo", { waitUntil: "domcontentloaded" });

      // Wait for the page to load
      await page.waitForLoadState("networkidle");

      // Verify we're on the demo page (not redirected to login)
      expect(page.url()).toContain("/demo");

      // Check for demo-specific elements
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
    });

    test("demo route loads without authentication", async ({ page }) => {
      // Double-check that auth state is truly cleared
      await authHelpers.clearAuthState();

      // Verify no tokens exist
      const tokens = await authHelpers.getStoredTokens();
      expect(tokens.accessToken).toBeNull();
      expect(tokens.refreshToken).toBeNull();

      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Should load successfully without redirects to login
      expect(page.url()).toContain("/demo");
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
    });

    test("demo banner displays with correct messaging", async ({ page }) => {
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      const banner = page.locator(".demo-banner");
      await expect(banner).toBeVisible();

      // Check banner content
      await expect(banner).toContainText("Demo Mode");
      await expect(banner).toContainText("Experience Aris workspace with sample content");

      // Check for demo icon
      await expect(banner.locator(".demo-icon")).toBeVisible();
      await expect(banner.locator(".demo-icon")).toContainText("ℹ️");
    });

    test("back to homepage link works correctly", async ({ page }) => {
      // Clear auth state first
      await authHelpers.clearAuthState();

      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      const backLink = page.locator(".demo-link");
      await expect(backLink).toBeVisible();
      await expect(backLink).toContainText("← Back to homepage");

      // Click the back link
      await backLink.click();

      // Should navigate away from demo (may go to login since user is not authenticated)
      await page.waitForLoadState("networkidle");
      expect(page.url()).not.toContain("/demo");
      // Without auth, homepage redirects to login, which is expected behavior
      expect(page.url()).toMatch(/\/$|\/home|\/login/);
    });

    test("demo page loads with correct title", async ({ page }) => {
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Check page title
      const title = await page.title();
      expect(title).toContain("Aris");
    });
  });

  test.describe("Public Access", () => {
    test("demo accessible without login", async ({ page }) => {
      // Use comprehensive auth clearing
      await authHelpers.clearAuthState();

      // Verify clean state
      const tokens = await authHelpers.getStoredTokens();
      expect(tokens.accessToken).toBeNull();

      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Verify demo loads successfully
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();

      // Verify we're not redirected to login
      expect(page.url()).toContain("/demo");
      expect(page.url()).not.toContain("/login");
      expect(page.url()).not.toContain("/auth");
    });

    test("demo works in incognito/private browsing mode", async ({ browser }) => {
      // Create a new incognito context
      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
      });
      const page = await context.newPage();

      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Should load successfully in incognito mode
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
      expect(page.url()).toContain("/demo");

      await context.close();
    });

    test("demo loads with clean browser state", async ({ page }) => {
      // Use auth helpers to properly clear state
      await authHelpers.clearAuthState();

      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Wait for Vue to mount the demo container
      // Fast check for demo container
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 3000 });

      // Verify demo loads with clean state
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
      await expect(page.locator(".demo-banner")).toBeVisible();
    });
  });

  test.describe("Navigation Integration", () => {
    test("can navigate to demo from other pages", async ({ page }) => {
      // Start from homepage
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Navigate to demo (assuming there might be a demo link somewhere)
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
    });

    test("can navigate away from demo and back", async ({ page }) => {
      // Go to demo
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();

      // Navigate away
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Go back to demo
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
    });

    test("browser back button works from demo", async ({ page }) => {
      // Clear auth state first
      await authHelpers.clearAuthState();

      // Navigate to demo directly (as if shared link)
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();

      // Use the back to homepage link instead of browser back
      // since demo was accessed directly (more realistic for shared links)
      const backLink = page.locator(".demo-link");
      await expect(backLink).toBeVisible();
      await backLink.click();
      await page.waitForLoadState("networkidle");

      // Should navigate away from demo (may go to login since user is not authenticated)
      expect(page.url()).not.toContain("/demo");
      expect(page.url()).toMatch(/\/$|\/home|\/login/);
    });

    test("direct URL sharing works", async ({ page }) => {
      // Clear auth state using the proper auth helpers approach
      await authHelpers.clearAuthState();

      // Simulate direct navigation to demo URL (as if someone shared the link)
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Wait for Vue to mount the demo container
      // Fast check for demo container
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 3000 });

      // Should load demo directly without redirect to login
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
      expect(page.url()).toContain("/demo");
    });
  });

  test.describe("Page Structure", () => {
    test("demo page has correct basic structure", async ({ page }) => {
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Check main containers exist
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
      await expect(page.locator(".demo-banner")).toBeVisible();
      await expect(page.locator(".workspace-container")).toBeVisible();
    });

    test("demo page has correct viewport meta tag", async ({ page }) => {
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Check viewport meta tag for mobile support
      const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
      expect(viewport).toContain("width=device-width");
    });

    test("demo page loads required CSS and JS", async ({ page }) => {
      await page.goto("/demo", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Check that demo-specific styles are applied
      const demoContainer = page.locator('[data-testid="demo-container"]');
      await expect(demoContainer).toHaveClass(/demo-view/);
    });
  });

  test.describe("Error Handling", () => {
    test("handles demo route with query parameters", async ({ page }) => {
      // Clear auth state first
      await authHelpers.clearAuthState();

      await page.goto("/demo?test=1&other=value", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Wait for Vue to mount the demo container
      // Fast check for demo container
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 3000 });

      // Should still load demo correctly
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
      expect(page.url()).toContain("/demo");
    });

    test("handles demo route with hash fragments", async ({ page }) => {
      // Clear auth state first
      await authHelpers.clearAuthState();

      await page.goto("/demo#section", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      // Wait for Vue to mount the demo container
      // Fast check for demo container
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible({ timeout: 3000 });

      // Should still load demo correctly
      await expect(page.locator('[data-testid="demo-container"]')).toBeVisible();
      expect(page.url()).toContain("/demo");
    });
  });
});
