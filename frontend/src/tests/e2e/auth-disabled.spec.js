import { test, expect } from "@playwright/test";

test.describe("Auth Disabled - Development Mode", () => {
  test("verifies auth guards are bypassed and all routes are accessible", async ({ page }) => {
    // Test 1: Verify backend API is responding with auth disabled
    const healthResponse = await page.request.get("http://localhost:8000/health");
    expect(healthResponse.ok()).toBeTruthy();

    // Debug: Check if auth is disabled by testing backend directly
    const meResponse = await page.request.get("http://localhost:8000/me");
    console.log("Backend /me response status:", meResponse.status());
    if (meResponse.ok()) {
      const userData = await meResponse.json();
      console.log("Backend user data:", userData);
    }

    // Test 2: Verify home page is directly accessible (no redirect to login)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Debug: Check current URL
    const currentUrl = page.url();
    console.log("Current URL after goto('/'):", currentUrl);

    // Check if we're still on login page - if so, VITE_DISABLE_AUTH is not working
    if (currentUrl.includes("/login")) {
      console.log("❌ VITE_DISABLE_AUTH is not working - still redirected to login");
      // Fail the test with a clear message
      throw new Error("VITE_DISABLE_AUTH environment variable is not working. Frontend is still redirecting to login page.");
    }

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
    await expect(page).toHaveURL("/settings", { timeout: 10000 });

    // Test 6: Verify workspace routes are accessible
    // Try to create a file to test workspace access
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const createButton = page.locator('[data-testid="create-file-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      // If modal opens, that's a good sign auth is disabled
      await expect(page.locator('[data-testid="file-title-input"], .modal')).toBeVisible();
    }

    // Test 7: Verify backend API calls work without auth headers
    const response = await page.request.get("http://localhost:8000/api/health");
    expect(response.ok()).toBeTruthy();
  });
});
