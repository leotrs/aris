import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";

// @auth
test.describe("Account Password Change Integration E2E Tests @auth", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    await authHelpers.ensureLoggedIn();
  });

  test("successful password change with backend validation", async ({ page }) => {
    console.log("[Test] Starting successful password change test");

    // Log current auth state
    const accessToken = await page.evaluate(() => localStorage.getItem("accessToken"));
    const user = await page.evaluate(() => localStorage.getItem("user"));
    console.log("[Test] Auth state at start:", {
      hasAccessToken: !!accessToken,
      hasUser: !!user,
      accessTokenLength: accessToken?.length,
    });

    await page.goto("/account/security");
    console.log("[Test] Navigated to security page");

    // Wait for password section to be visible
    console.log("[Test] Waiting for password section");
    await expect(page.locator("h2:has-text('Password')")).toBeVisible();
    console.log("[Test] Password section is visible");

    // Fill in password change form
    const currentPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Current Password$/ })
      .locator("input");
    const newPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^New Password$/ })
      .locator("input");
    const confirmPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Confirm New Password$/ })
      .locator("input");

    await expect(currentPasswordInput).toBeVisible();
    await expect(newPasswordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();

    // Use valid test credentials
    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("newpassword123");

    // Submit password change
    const updateButton = page.locator('button:has-text("Update Password")');
    await expect(updateButton).toBeVisible();
    await expect(updateButton).toBeEnabled();
    console.log("[Test] Update button is visible and enabled");

    console.log("[Test] Clicking update button and waiting for API response");
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/change-password") && response.request().method() === "POST"
      ),
      updateButton.click(),
    ]);

    console.log("[Test] Password change response received:", {
      status: response.status(),
      statusText: response.statusText(),
      url: response.url(),
    });

    // Check current URL after API call
    const currentUrl = page.url();
    console.log("[Test] Current URL after password change:", currentUrl);

    // Check auth state after API call
    const accessTokenAfter = await page.evaluate(() => localStorage.getItem("accessToken"));
    const userAfter = await page.evaluate(() => localStorage.getItem("user"));
    console.log("[Test] Auth state after password change:", {
      hasAccessToken: !!accessTokenAfter,
      hasUser: !!userAfter,
      accessTokenLength: accessTokenAfter?.length,
      currentUrl,
    });

    // Should show success message
    console.log("[Test] Looking for success toast message");
    await expect(
      page.locator(".toast").filter({ hasText: "Password changed successfully" })
    ).toBeVisible({ timeout: 5000 });
    console.log("[Test] Success message found");

    // Wait a moment for form reset to complete
    await page.waitForTimeout(100);

    // Form should be reset
    await expect(currentPasswordInput).toHaveValue("");
    await expect(newPasswordInput).toHaveValue("");
    await expect(confirmPasswordInput).toHaveValue("");

    // Update button should be disabled (no unsaved changes)
    await expect(updateButton).toBeDisabled();
  });

  test("password change with wrong current password", async ({ page }) => {
    await page.goto("/account/security");

    // Fill in password change form with wrong current password
    const currentPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Current Password$/ })
      .locator("input");
    const newPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^New Password$/ })
      .locator("input");
    const confirmPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Confirm New Password$/ })
      .locator("input");

    await currentPasswordInput.fill("wrongpassword");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("newpassword123");

    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();

    // Should show error message about incorrect current password
    await expect(
      page.locator(".toast").filter({ hasText: "Current password is incorrect" })
    ).toBeVisible({ timeout: 5000 });

    // Form should not be reset on error
    await expect(currentPasswordInput).toHaveValue("wrongpassword");
    await expect(newPasswordInput).toHaveValue("newpassword123");
    await expect(confirmPasswordInput).toHaveValue("newpassword123");
  });

  test("password change with weak password rejection", async ({ page }) => {
    await page.goto("/account/security");

    // Fill in password change form with weak password
    const currentPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Current Password$/ })
      .locator("input");
    const newPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^New Password$/ })
      .locator("input");
    const confirmPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Confirm New Password$/ })
      .locator("input");

    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("123"); // Too short
    await confirmPasswordInput.fill("123");

    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();

    // Should show validation error
    await expect(page.locator(".toast").filter({ hasText: "8 characters" })).toBeVisible({
      timeout: 5000,
    });
  });

  test("password change validation for mismatched passwords", async ({ page }) => {
    await page.goto("/account/security");

    // Fill in password change form with mismatched passwords
    const currentPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Current Password$/ })
      .locator("input");
    const newPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^New Password$/ })
      .locator("input");
    const confirmPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Confirm New Password$/ })
      .locator("input");

    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("differentpassword123");

    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();

    // Should show validation error for mismatched passwords
    await expect(page.locator(".toast").filter({ hasText: "do not match" })).toBeVisible({
      timeout: 5000,
    });
  });

  test("password change form validation and UX", async ({ page }) => {
    await page.goto("/account/security");

    const currentPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Current Password$/ })
      .locator("input");
    const newPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^New Password$/ })
      .locator("input");
    const confirmPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Confirm New Password$/ })
      .locator("input");
    const updateButton = page.locator('button:has-text("Update Password")');
    const cancelButton = page.locator('button:has-text("Cancel")');

    console.log("[Test] Starting form validation test");

    // Initially buttons should be disabled (no changes)
    console.log("[Test] Checking initial button states");
    await expect(updateButton).toBeDisabled();
    await expect(cancelButton).toBeDisabled();
    console.log("[Test] Initial button states verified - both disabled");

    // Start typing - buttons should become enabled
    console.log('[Test] Filling current password field with "test"');
    await currentPasswordInput.fill("test");

    console.log("[Test] Checking buttons become enabled after typing");
    await expect(updateButton).toBeEnabled();
    await expect(cancelButton).toBeEnabled();
    console.log("[Test] Buttons are now enabled");

    // Check unsaved changes warning appears
    console.log("[Test] Checking for unsaved changes warning");
    await expect(page.locator(".status-message.warning")).toContainText("unsaved password changes");
    console.log("[Test] Unsaved changes warning is visible");

    // Get current values before cancel
    const currentValueBefore = await currentPasswordInput.inputValue();
    const newValueBefore = await newPasswordInput.inputValue();
    const confirmValueBefore = await confirmPasswordInput.inputValue();
    console.log("[Test] Values before cancel:", {
      current: currentValueBefore,
      new: newValueBefore,
      confirm: confirmValueBefore,
    });

    // Cancel should reset form
    console.log("[Test] Clicking cancel button");
    await cancelButton.click();

    // Wait a moment for the form to reset
    await page.waitForTimeout(100);

    // Check values after cancel
    const currentValueAfter = await currentPasswordInput.inputValue();
    const newValueAfter = await newPasswordInput.inputValue();
    const confirmValueAfter = await confirmPasswordInput.inputValue();
    console.log("[Test] Values after cancel:", {
      current: currentValueAfter,
      new: newValueAfter,
      confirm: confirmValueAfter,
    });

    console.log("[Test] Expecting form fields to be empty");
    await expect(currentPasswordInput).toHaveValue("");
    await expect(newPasswordInput).toHaveValue("");
    await expect(confirmPasswordInput).toHaveValue("");
    console.log("[Test] Form fields are empty");

    // Buttons should be disabled again
    console.log("[Test] Checking buttons are disabled again");
    await expect(updateButton).toBeDisabled();
    await expect(cancelButton).toBeDisabled();
    console.log("[Test] Buttons are disabled again");
  });

  test("password change loading state", async ({ page }) => {
    await page.goto("/account/security");

    // Mock slow response to test loading state
    await page.route("**/change-password", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Password changed successfully" }),
      });
    });

    const currentPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Current Password$/ })
      .locator("input");
    const newPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^New Password$/ })
      .locator("input");
    const confirmPasswordInput = page
      .locator(".input-text")
      .filter({ hasText: /^Confirm New Password$/ })
      .locator("input");

    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("newpassword123");

    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();

    // Should show loading state - button should be disabled and either show loading or have completed
    await expect(updateButton).toBeDisabled();

    // All inputs should be disabled during update
    await expect(currentPasswordInput).toBeDisabled();
    await expect(newPasswordInput).toBeDisabled();
    await expect(confirmPasswordInput).toBeDisabled();

    // Wait for completion
    await expect(updateButton).toContainText("Update Password", { timeout: 3000 });
  });
});
