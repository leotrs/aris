import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";

test.describe("Login Flow Tests", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    await page.goto("/");
    await authHelpers.clearAuthState();
  });

  test("successful login - valid credentials, redirect to home, session persistence", async ({ page }) => {
    // Mock successful login API response
    await page.route("**/api/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          user: {
            id: 1,
            email: "test@example.com",
            name: "Test User"
          }
        })
      });
    });

    // Perform login
    await authHelpers.login("test@example.com", "password");
    
    // Verify redirect to home and user is logged in
    await authHelpers.expectToBeLoggedIn();
    
    // Verify session persistence in localStorage
    const tokens = await authHelpers.getStoredTokens();
    expect(tokens.accessToken).toBe("mock-access-token");
    expect(tokens.refreshToken).toBe("mock-refresh-token");
    expect(tokens.user.email).toBe("test@example.com");
    
    // Verify session persists after page refresh
    await page.reload();
    await authHelpers.expectToBeLoggedIn();
  });

  test("invalid credentials - display appropriate error message", async ({ page }) => {
    // Mock failed login API response
    await page.route("**/api/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "Invalid email or password"
        })
      });
    });

    await authHelpers.login("test@example.com", "wrongpassword");
    
    // Verify error message is displayed
    await expect(page.locator('.error-message')).toContainText("Invalid email or password");
    
    // Verify user remains on login page
    await authHelpers.expectToBeOnLoginPage();
    
    // Verify no tokens are stored
    const tokens = await authHelpers.getStoredTokens();
    expect(tokens.accessToken).toBeNull();
  });

  test("empty fields validation - show 'please fill in all fields' error", async ({ page }) => {
    await page.goto("/login");
    
    // Try to submit with empty fields
    await page.click('button[type="submit"]');
    
    // Verify validation error
    await expect(page.locator('.error-message')).toContainText("Please fill in all fields");
    
    // Test with only email filled
    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toContainText("Please fill in all fields");
    
    // Test with only password filled
    await page.fill('input[type="email"]', "");
    await page.fill('input[type="password"]', "password");
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toContainText("Please fill in all fields");
  });

  test("network error handling - handle API failures gracefully", async ({ page }) => {
    // Mock network error
    await page.route("**/api/login", async (route) => {
      await route.abort("failed");
    });

    await authHelpers.login("test@example.com", "password");
    
    // Verify generic error message is shown
    await expect(page.locator('.error-message')).toBeVisible();
    
    // Verify user remains on login page
    await authHelpers.expectToBeOnLoginPage();
  });

  test("already logged in redirect - auto-redirect to home if valid session exists", async ({ page }) => {
    // Set up existing session
    await authHelpers.setAuthState(
      "existing-token",
      "existing-refresh-token", 
      { id: 1, email: "test@example.com", name: "Test User" }
    );
    
    // Try to navigate to login page
    await page.goto("/login");
    
    // Should redirect to home
    await authHelpers.expectToBeLoggedIn();
  });

  test("navigation to register - register link works correctly", async ({ page }) => {
    await page.goto("/login");
    
    // Click register link
    await page.click('a[href="/register"]');
    
    // Verify navigation to register page
    await expect(page).toHaveURL("/register");
    await expect(page.locator('input[placeholder*="name" i]')).toBeVisible();
  });

  test("enter key login - keyboard shortcut functionality", async ({ page }) => {
    // Mock successful login
    await page.route("**/api/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          user: { id: 1, email: "test@example.com", name: "Test User" }
        })
      });
    });

    await page.goto("/login");
    
    // Fill credentials and press Enter
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password");
    await page.press('input[type="password"]', "Enter");
    
    // Verify login was triggered
    await authHelpers.expectToBeLoggedIn();
  });

  test("dev mode auto-fill - pre-filled credentials in development", async ({ page }) => {
    // This test checks if dev mode pre-fills credentials
    // Skip if not in development mode
    const isDev = process.env.NODE_ENV === "development";
    test.skip(!isDev, "Only runs in development mode");
    
    await page.goto("/login");
    
    // Check if fields are pre-filled in dev mode
    const emailValue = await page.inputValue('input[type="email"]');
    const passwordValue = await page.inputValue('input[type="password"]');
    
    expect(emailValue).toBeTruthy();
    expect(passwordValue).toBeTruthy();
  });
});