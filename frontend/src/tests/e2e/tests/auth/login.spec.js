import { test, expect } from "@playwright/test";
import { loginUser, logoutUser, isUserAuthenticated } from "../../utils/auth-helpers.js";
import testUsers from "../../fixtures/test-users.json" with { type: "json" };

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start from a clean slate
    await page.goto("/");
  });

  test("should display login form", async ({ page }) => {
    await page.goto("/login");

    // Check that login form elements are present
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();

    // Check form labels and placeholders
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
  });

  test("should login with valid credentials", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;

    await loginUser(page, user);

    // Verify successful login
    expect(await isUserAuthenticated(page)).toBe(true);

    // Should be redirected to home or workspace
    expect(page.url()).toMatch(/\/(home|workspace)/);
  });

  test("should show error with invalid password", async ({ page }) => {
    const invalidUser = testUsers.invalidCredentials.wrongPassword;

    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', invalidUser.email);
    await page.fill('[data-testid="password-input"]', invalidUser.password);
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error"]')).toContainText(
      /invalid|incorrect|wrong/i
    );

    // Should remain on login page
    expect(page.url()).toContain("/login");
    expect(await isUserAuthenticated(page)).toBe(false);
  });

  test("should show error with non-existent user", async ({ page }) => {
    const invalidUser = testUsers.invalidCredentials.nonExistentUser;

    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', invalidUser.email);
    await page.fill('[data-testid="password-input"]', invalidUser.password);
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    expect(await isUserAuthenticated(page)).toBe(false);
  });

  test("should validate email format", async ({ page }) => {
    const invalidUser = testUsers.invalidCredentials.invalidEmail;

    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', invalidUser.email);
    await page.fill('[data-testid="password-input"]', invalidUser.password);

    // Try to submit form
    await page.click('[data-testid="login-button"]');

    // Should show validation error or prevent submission
    const emailInput = page.locator('[data-testid="email-input"]');
    const isInvalid = await emailInput.evaluate((input) => !input.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test("should show loading state during login", async ({ page }) => {
    await page.goto("/login");

    const user = testUsers.testUsers.defaultUser;
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);

    // Click login and immediately check for loading state
    await page.click('[data-testid="login-button"]');

    // Should show loading indicator
    await expect(page.locator('[data-testid="login-loading"]')).toBeVisible();
  });

  test("should support keyboard navigation", async ({ page }) => {
    await page.goto("/login");

    // Tab through form elements
    await page.keyboard.press("Tab"); // Should focus email input
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus password input
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus login button
    await expect(page.locator('[data-testid="login-button"]')).toBeFocused();
  });

  test("should handle enter key submission", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;

    await page.goto("/login");
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);

    // Press Enter to submit form
    await page.keyboard.press("Enter");

    // Should successfully login
    await page.waitForURL(/\/(home|workspace)/);
    expect(await isUserAuthenticated(page)).toBe(true);
  });

  test("should redirect to intended page after login", async ({ page }) => {
    // Try to access a protected page
    await page.goto("/workspace");

    // Should be redirected to login
    await page.waitForURL("/login");

    // Login
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    // Should redirect back to workspace
    await page.waitForURL("/workspace");
  });

  test('should have "Remember me" functionality', async ({ page }) => {
    await page.goto("/login");

    // Check if remember me checkbox exists
    const rememberCheckbox = page.locator('[data-testid="remember-me-checkbox"]');
    if (await rememberCheckbox.isVisible()) {
      await rememberCheckbox.check();
      expect(await rememberCheckbox.isChecked()).toBe(true);
    }
  });

  test("should have link to registration page", async ({ page }) => {
    await page.goto("/login");

    // Check for registration link
    const registerLink = page.locator('[data-testid="register-link"]');
    await expect(registerLink).toBeVisible();

    // Click link and verify navigation
    await registerLink.click();
    await page.waitForURL("/register");
  });
});
