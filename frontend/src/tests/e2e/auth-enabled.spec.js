import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("Auth Enabled - Production Mode", () => {
  test("verifies auth guards are active and login flow works", async ({ page }) => {
    const auth = new AuthHelpers(page);

    // Test 1: Verify protected routes redirect to login
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);

    // Test 2: Verify login form is present
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();

    // Test 3: Verify successful login works
    await auth.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);

    // Should be redirected to home page after login
    await expect(page).toHaveURL("/");

    // Test 4: Verify we're actually logged in (check for protected content)
    await expect(
      page.locator(
        '[data-testid="user-menu"], [data-testid="create-file-button"], [data-testid="files-container"]'
      )
    ).toBeVisible();

    // Test 5: Verify auth tokens are stored
    const tokens = await auth.getStoredTokens();
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.user).toBeTruthy();
    expect(tokens.user.email).toBe(TEST_CREDENTIALS.valid.email);
  });
});
