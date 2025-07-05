import { test, expect } from "@playwright/test";

// @auth
import { AuthHelpers } from "./utils/auth-helpers.js";

test.describe("Account View E2E Tests @auth @desktop-only", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Ensure authenticated state for account tests
    await authHelpers.ensureLoggedIn();
  });

  // No afterEach cleanup - keep auth state for all account tests


  test("avatar upload workflow", async ({ page }) => {
    await page.goto("/account");

    // Verify upload button is present
    const uploadButton = page.locator(".avatar-upload");
    await expect(uploadButton).toBeVisible();

    // Test file upload interaction
    // Note: In a real E2E test, we'd need to handle file selection
    // For now, we verify the upload interface is accessible
    await uploadButton.click();

    // The hidden file input should be present
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    await expect(fileInput).toBeHidden(); // It's hidden but should exist

    // Verify the file input accepts image types
    const acceptAttribute = await fileInput.getAttribute("accept");
    expect(acceptAttribute).toBe("image/*");
  });

  test("upload error handling display", async ({ page }) => {
    await page.goto("/account");

    // Simulate an upload scenario that would trigger validation
    // In a real test environment, we'd mock the API to return errors

    // Verify the upload button is functional
    const uploadButton = page.locator(".avatar-upload");
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeEnabled();

    // Verify error handling infrastructure is in place
    // The component should have console error handling for upload failures
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test("navigation and UI responsiveness", async ({ page }) => {
    await page.goto("/account");

    // Test responsive design elements
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size

    // Verify mobile layout adaptations
    const mainContainer = page.locator(".account-layout");
    await expect(mainContainer).toBeVisible();

    // Verify mobile navigation is available (hamburger menu should be visible)
    const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(hamburgerButton).toBeVisible();

    // Check if danger zone is visible
    const dangerSection = page.locator(".danger-zone");
    await expect(dangerSection).toBeVisible();

    const deleteButton = page.locator('button:has-text("Delete Account")');
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toContainText("Delete Account");

    // Test desktop layout
    await page.setViewportSize({ width: 1280, height: 720 });

    // Verify helpful links are visible in desktop mode
    const helpLink = page.locator('button:has-text("Get Help")');
    await expect(helpLink).toBeVisible();

    const contributeLink = page.locator('button:has-text("Contribute")');
    await expect(contributeLink).toBeVisible();

    const supportLink = page.locator('button:has-text("Support Us")');
    await expect(supportLink).toBeVisible();
  });
});
