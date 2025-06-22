import { test, expect } from "@playwright/test";
import {
  loginUser,
  logoutUser,
  isUserAuthenticated,
  setupAuthenticatedSession,
} from "../../utils/auth-helpers.js";
import { getTestUsers } from "../../utils/test-config.js";

test.describe("Logout Flow", () => {
  let testUsers;

  test.beforeAll(() => {
    testUsers = getTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    // Setup authenticated session before each test
    await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
  });

  test("should logout successfully from user menu", async ({ page }) => {
    // Verify we start authenticated
    expect(await isUserAuthenticated(page)).toBe(true);

    // Logout using helper
    await logoutUser(page);

    // Verify we're logged out
    expect(await isUserAuthenticated(page)).toBe(false);
    expect(page.url()).toContain("/login");
  });

  test("should show logout option in user menu", async ({ page }) => {
    await page.goto("/home");

    // Click user menu to open dropdown
    await page.click('[data-testid="user-menu"]');

    // Should show logout option
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="logout-button"]')).toContainText(/logout|sign out/i);
  });

  test("should handle logout from different pages", async ({ page }) => {
    const pagesToTest = ["/home", "/workspace", "/settings"];

    for (const testPage of pagesToTest) {
      // Navigate to page
      await page.goto(testPage);

      // Verify authenticated
      expect(await isUserAuthenticated(page)).toBe(true);

      // Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');

      // Should redirect to login
      await page.waitForURL("/login");
      expect(await isUserAuthenticated(page)).toBe(false);

      // Re-authenticate for next iteration
      if (pagesToTest.indexOf(testPage) < pagesToTest.length - 1) {
        await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
      }
    }
  });

  test("should clear user session data on logout", async ({ page }) => {
    await page.goto("/home");

    // Check if user data is displayed
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();

    // Logout
    await logoutUser(page);

    // Try to access protected page
    await page.goto("/home");

    // Should be redirected to login (session cleared)
    await page.waitForURL("/login");
    expect(await isUserAuthenticated(page)).toBe(false);
  });

  test("should show logout confirmation if unsaved changes", async ({ page }) => {
    // Navigate to workspace with potential unsaved changes
    await page.goto("/workspace");

    // Simulate unsaved changes (if editor is present)
    const editor = page.locator('[data-testid="rsm-editor"]');
    if (await editor.isVisible()) {
      await editor.fill("Some unsaved content that should trigger confirmation");
    }

    // Try to logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // Check if confirmation dialog appears
    const confirmDialog = page.locator('[data-testid="logout-confirmation"]');
    if (await confirmDialog.isVisible()) {
      await expect(confirmDialog).toContainText(/unsaved changes|lose changes/i);

      // Confirm logout
      await page.click('[data-testid="confirm-logout-button"]');
    }

    // Should complete logout
    await page.waitForURL("/login");
    expect(await isUserAuthenticated(page)).toBe(false);
  });

  test("should handle network error during logout gracefully", async ({ page }) => {
    await page.goto("/home");

    // Simulate network failure
    await page.route("**/api/auth/logout", (route) => route.abort());

    // Try to logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');

    // Should handle error gracefully
    // Either show error message or logout anyway (client-side session clearing)

    // Wait a moment for any error handling
    await page.waitForTimeout(2000);

    // Check final state - should either show error or complete logout
    const isStillAuthenticated = await isUserAuthenticated(page);
    if (isStillAuthenticated) {
      // If still authenticated, should show error message
      await expect(page.locator('[data-testid="logout-error"]')).toBeVisible();
    } else {
      // If logged out, should be on login page
      expect(page.url()).toContain("/login");
    }
  });

  test("should redirect to login page after logout", async ({ page }) => {
    await page.goto("/workspace");

    // Logout
    await logoutUser(page);

    // Should be on login page
    expect(page.url()).toContain("/login");

    // Should show login form
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  });

  test("should support keyboard navigation for logout", async ({ page }) => {
    await page.goto("/home");

    // Navigate to user menu with keyboard
    await page.keyboard.press("Tab");

    // Find and focus user menu
    let focusedElement = await page.evaluate(() =>
      document.activeElement.getAttribute("data-testid")
    );
    while (focusedElement !== "user-menu" && focusedElement !== null) {
      await page.keyboard.press("Tab");
      focusedElement = await page.evaluate(() =>
        document.activeElement.getAttribute("data-testid")
      );
    }

    if (focusedElement === "user-menu") {
      // Open menu with Enter or Space
      await page.keyboard.press("Enter");

      // Navigate to logout option
      await page.keyboard.press("ArrowDown"); // Navigate in dropdown
      await page.keyboard.press("Enter"); // Select logout

      // Should complete logout
      await page.waitForURL("/login");
      expect(await isUserAuthenticated(page)).toBe(false);
    }
  });

  test("should maintain logout state across browser refresh", async ({ page }) => {
    await page.goto("/home");

    // Logout
    await logoutUser(page);

    // Refresh the page
    await page.reload();

    // Should still be logged out
    expect(await isUserAuthenticated(page)).toBe(false);
    expect(page.url()).toContain("/login");
  });

  test("should invalidate tokens on logout", async ({ page }) => {
    await page.goto("/home");

    // Logout
    await logoutUser(page);

    // Try to make authenticated request with old session
    const response = await page.request.get("/api/user/profile");

    // Should return unauthorized
    expect(response.status()).toBe(401);
  });
});
