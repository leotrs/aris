import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// @core

// Load environment variables from root .env file
dotenv.config({ path: path.resolve("../../../.env") });

// Get backend port from environment - NO fallback, will crash if not set
const BACKEND_PORT = process.env.BACKEND_PORT;

if (!BACKEND_PORT) {
  console.error("❌ FATAL: BACKEND_PORT environment variable not set");
  console.error("   Ensure .env file exists at project root with all required variables");
  process.exit(1);
}

test.describe("Auth Disabled - Development Mode @core", () => {
  test("verifies auth guards are bypassed and all routes are accessible", async ({ page }) => {
    // Test 1: Verify backend API is responding with auth disabled
    const healthResponse = await page.request.get(`http://localhost:${BACKEND_PORT}/health`);
    expect(healthResponse.ok()).toBeTruthy();

    // Test 2: Verify home page is directly accessible (no redirect to login)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should stay on home page, not redirect to login
    await expect(page).toHaveURL("/", { timeout: 5000 });

    // Test 3: Verify protected content is visible without login
    await expect(page.locator('[data-testid="files-container"]')).toBeVisible({ timeout: 10000 });

    // Test 4: Verify no login form is present on home page
    await expect(page.locator('[data-testid="email-input"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).not.toBeVisible();

    // Test 5: Verify settings page is also accessible
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/settings/document", { timeout: 10000 });

    // Test 6: Verify workspace routes are accessible
    // Try to create a file to test workspace access
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const createButton = page.locator('[data-testid="create-file-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      // If context menu opens, that's a good sign auth is disabled
      await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
    }

    // Test 7: Verify backend API calls work without auth headers
    const response = await page.request.get(`http://localhost:${BACKEND_PORT}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
