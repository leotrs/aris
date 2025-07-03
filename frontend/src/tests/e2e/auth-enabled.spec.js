import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// @auth-flows
import { AuthHelpers } from "./utils/auth-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

// Load environment variables from root .env file
dotenv.config({ path: path.resolve("../../../.env") });

// Get backend port from environment - NO fallback, will crash if not set
const BACKEND_PORT = process.env.BACKEND_PORT;

if (!BACKEND_PORT) {
  console.error("❌ FATAL: BACKEND_PORT environment variable not set");
  console.error("   Ensure .env file exists at project root with all required variables");
  process.exit(1);
}

test.describe("Auth Enabled - Production Mode @auth-flows", () => {
  test("verifies auth guards are active and login flow works", async ({ page }) => {
    const auth = new AuthHelpers(page);

    // Test 1: Verify backend API is responding
    const healthResponse = await page.request.get(`http://localhost:${BACKEND_PORT}/health`);
    expect(healthResponse.ok()).toBeTruthy();

    // Test 2: Verify protected routes redirect to login
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Test 3: Verify login form is present
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();

    // Test 4: Verify successful login works
    await auth.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);

    // Should be redirected to home page after login (with longer timeout)
    await expect(page).toHaveURL("/", { timeout: 15000 });

    // Test 5: Verify we're actually logged in (check for protected content)
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible({ timeout: 10000 });

    // Test 6: Verify auth tokens are stored
    const tokens = await auth.getStoredTokens();
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.user).toBeTruthy();
    expect(tokens.user.email).toBe(TEST_CREDENTIALS.valid.email);
  });
});
