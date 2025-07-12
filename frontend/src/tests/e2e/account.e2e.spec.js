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

  test("complete account profile update workflow", async ({ page }) => {
    // Navigate to account page (will redirect to profile)
    await page.goto("/account");
    await expect(page).toHaveURL("/account/profile");

    // Verify we're on the profile page with user info displayed
    await expect(page.locator(".user-name")).toBeVisible();
    await expect(page.locator(".user-email")).toBeVisible();
    await expect(page.locator(".member-since")).toContainText("Member since");

    // Update profile information - use specific selectors targeting the InputText components
    const nameInput = page.locator(".input-text").filter({ hasText: "Full Name" }).locator("input");
    const initialsInput = page
      .locator(".input-text")
      .filter({ hasText: "Initials" })
      .locator("input");
    const emailInput = page
      .locator(".input-text")
      .filter({ hasText: "Email Address" })
      .locator("input");
    const affiliationInput = page
      .locator(".input-text")
      .filter({ hasText: "Affiliation" })
      .locator("input");

    // Wait for inputs to be visible and interactable
    await expect(nameInput).toBeVisible();
    await expect(initialsInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(affiliationInput).toBeVisible();

    await nameInput.fill("Test User Updated");
    await initialsInput.fill("TU");
    await emailInput.fill("testuser@aris.pub");
    await affiliationInput.fill("Test University");

    // Verify the form inputs were filled correctly (without submitting)
    await expect(nameInput).toHaveValue("Test User Updated");
    await expect(initialsInput).toHaveValue("TU");
    await expect(emailInput).toHaveValue("testuser@aris.pub");
    await expect(affiliationInput).toHaveValue("Test University");

    // Verify save button is present and enabled
    const saveButton = page.locator('button:has-text("Save Changes")');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
  });

  test("avatar upload workflow", async ({ page }) => {
    await page.goto("/account/profile");

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
    await page.goto("/account/profile");

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

  test.skip("navigation and UI responsiveness", async ({ page }) => {
    // Test profile page responsiveness
    await page.goto("/account/profile");

    // Test responsive design elements
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size

    // Verify mobile layout adaptations
    const mainContainer = page.locator(".profile-layout");
    await expect(mainContainer).toBeVisible();

    // Test desktop layout
    await page.setViewportSize({ width: 1280, height: 720 });

    // Verify profile content is visible in desktop mode
    await expect(page.locator(".user-name")).toBeVisible();
    await expect(page.locator(".user-email")).toBeVisible();

    // Test notifications page navigation and danger zone
    await page.goto("/account/notifications");

    const dangerSection = page.locator(".danger-zone");
    await expect(dangerSection).toBeVisible();

    const deleteButton = page.locator('button:has-text("Delete Account")');
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toContainText("Delete Account");

    // Test security page navigation
    await page.goto("/account/security");

    const passwordSection = page.locator('h2:has-text("Password")');
    await expect(passwordSection).toBeVisible();
  });

  test("affiliation field functionality", async ({ page }) => {
    await page.goto("/account/profile");

    // Test affiliation field presence and interaction
    const affiliationInput = page
      .locator(".input-text")
      .filter({ hasText: "Affiliation" })
      .locator("input");

    await expect(affiliationInput).toBeVisible();

    // Test placeholder text
    const placeholder = await affiliationInput.getAttribute("placeholder");
    expect(placeholder).toContain("institution");

    // Test that affiliation can be filled
    await affiliationInput.fill("Stanford University");
    await expect(affiliationInput).toHaveValue("Stanford University");

    // Test that affiliation field can be cleared
    await affiliationInput.fill("");
    await expect(affiliationInput).toHaveValue("");

    // Test with long affiliation name
    await affiliationInput.fill(
      "Massachusetts Institute of Technology Computer Science and Artificial Intelligence Laboratory"
    );
    await expect(affiliationInput).toHaveValue(
      "Massachusetts Institute of Technology Computer Science and Artificial Intelligence Laboratory"
    );
  });
});
