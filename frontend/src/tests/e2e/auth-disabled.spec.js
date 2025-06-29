import { test, expect } from "@playwright/test";

test.describe("Auth Disabled - Development Mode", () => {
  test("verifies auth guards are bypassed and all routes are accessible", async ({ page }) => {
    // Test 1: Verify home page is directly accessible (no redirect to login)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should stay on home page, not redirect to login
    await expect(page).toHaveURL("/");

    // Test 2: Verify protected content is visible without login
    await expect(
      page.locator(
        '[data-testid="user-menu"], [data-testid="create-file-button"], [data-testid="files-container"]'
      )
    ).toBeVisible();

    // Test 3: Verify no login form is present on home page
    await expect(page.locator('[data-testid="email-input"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).not.toBeVisible();

    // Test 4: Verify settings page is also accessible
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL("/settings");

    // Test 5: Verify workspace routes are accessible
    // Try to create a file to test workspace access
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const createButton = page.locator('[data-testid="create-file-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      // If modal opens, that's a good sign auth is disabled
      await expect(page.locator('[data-testid="file-title-input"], .modal')).toBeVisible();
    }

    // Test 6: Verify backend API calls work without auth headers
    const response = await page.request.get("/api/health");
    expect(response.ok()).toBeTruthy();
  });
});
