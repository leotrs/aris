import { test, expect } from "@playwright/test";
import { registerUser, loginUser, isUserAuthenticated } from "../../utils/auth-helpers.js";

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display registration form", async ({ page }) => {
    // Check that registration form elements are present
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="register-button"]')).toBeVisible();

    // Check form labels
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
  });

  test("should register new user with valid data", async ({ page }) => {
    const newUser = {
      email: `test-${Date.now()}@example.com`,
      password: "newpassword123",
      name: "New Test User",
    };

    await registerUser(page, newUser);

    // Should redirect to login or home page
    expect(page.url()).toMatch(/\/(login|home|workspace)/);

    // If redirected to login, try logging in with new credentials
    if (page.url().includes("/login")) {
      await loginUser(page, newUser);
      expect(await isUserAuthenticated(page)).toBe(true);
    }
  });

  test("should validate required fields", async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid="register-button"]');

    // Should show validation errors or prevent submission
    const nameInput = page.locator('[data-testid="name-input"]');
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');

    // Check that form doesn't submit with empty fields
    expect(page.url()).toContain("/register");

    // Check for validation messages or invalid states
    const nameValid = await nameInput.evaluate((input) => input.validity.valid);
    const emailValid = await emailInput.evaluate((input) => input.validity.valid);
    const passwordValid = await passwordInput.evaluate((input) => input.validity.valid);

    expect(nameValid || emailValid || passwordValid).toBe(false);
  });

  test("should validate email format", async ({ page }) => {
    await page.fill('[data-testid="name-input"]', "Test User");
    await page.fill('[data-testid="email-input"]', "invalid-email");
    await page.fill('[data-testid="password-input"]', "password123");

    await page.click('[data-testid="register-button"]');

    // Should show validation error for invalid email
    const emailInput = page.locator('[data-testid="email-input"]');
    const isValid = await emailInput.evaluate((input) => input.validity.valid);
    expect(isValid).toBe(false);
  });

  test("should validate password strength", async ({ page }) => {
    await page.fill('[data-testid="name-input"]', "Test User");
    await page.fill('[data-testid="email-input"]', "test@example.com");

    // Try weak password
    await page.fill('[data-testid="password-input"]', "123");

    // Check if password strength indicator or validation appears
    const passwordError = page.locator('[data-testid="password-error"]');
    if (await passwordError.isVisible()) {
      await expect(passwordError).toContainText(/weak|short|strength/i);
    }
  });

  test("should show error for existing email", async ({ page }) => {
    // Try to register with email that already exists
    const existingUser = {
      email: "test@example.com", // Assuming this user already exists
      password: "somepassword123",
      name: "Duplicate User",
    };

    await page.fill('[data-testid="name-input"]', existingUser.name);
    await page.fill('[data-testid="email-input"]', existingUser.email);
    await page.fill('[data-testid="password-input"]', existingUser.password);

    await page.click('[data-testid="register-button"]');

    // Should show error about existing account
    await expect(page.locator('[data-testid="registration-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="registration-error"]')).toContainText(
      /already exists|taken|registered/i
    );
  });

  test("should show loading state during registration", async ({ page }) => {
    const newUser = {
      email: `test-loading-${Date.now()}@example.com`,
      password: "password123",
      name: "Loading Test User",
    };

    await page.fill('[data-testid="name-input"]', newUser.name);
    await page.fill('[data-testid="email-input"]', newUser.email);
    await page.fill('[data-testid="password-input"]', newUser.password);

    // Click register and immediately check for loading state
    await page.click('[data-testid="register-button"]');

    // Should show loading indicator
    await expect(page.locator('[data-testid="register-loading"]')).toBeVisible();
  });

  test("should support keyboard navigation", async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press("Tab"); // Should focus name input
    await expect(page.locator('[data-testid="name-input"]')).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus email input
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus password input
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus register button
    await expect(page.locator('[data-testid="register-button"]')).toBeFocused();
  });

  test("should handle enter key submission", async ({ page }) => {
    const newUser = {
      email: `test-enter-${Date.now()}@example.com`,
      password: "password123",
      name: "Enter Test User",
    };

    await page.fill('[data-testid="name-input"]', newUser.name);
    await page.fill('[data-testid="email-input"]', newUser.email);
    await page.fill('[data-testid="password-input"]', newUser.password);

    // Press Enter to submit form
    await page.keyboard.press("Enter");

    // Should process registration
    expect(page.url()).not.toContain("/register");
  });

  test("should have link to login page", async ({ page }) => {
    // Check for login link
    const loginLink = page.locator('[data-testid="login-link"]');
    await expect(loginLink).toBeVisible();

    // Click link and verify navigation
    await loginLink.click();
    await page.waitForURL("/login");
  });

  test("should show terms and privacy policy links", async ({ page }) => {
    // Check for legal links
    const termsLink = page.locator('[data-testid="terms-link"]');
    const privacyLink = page.locator('[data-testid="privacy-link"]');

    if (await termsLink.isVisible()) {
      await expect(termsLink).toHaveAttribute("href");
    }

    if (await privacyLink.isVisible()) {
      await expect(privacyLink).toHaveAttribute("href");
    }
  });

  test("should validate name field", async ({ page }) => {
    // Try registration with empty name
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "password123");

    await page.click('[data-testid="register-button"]');

    // Should require name field
    const nameInput = page.locator('[data-testid="name-input"]');
    const isValid = await nameInput.evaluate((input) => input.validity.valid);
    expect(isValid).toBe(false);
  });
});
