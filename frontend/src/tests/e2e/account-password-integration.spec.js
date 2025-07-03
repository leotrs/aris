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
    await page.goto("/account/security");
    
    // Wait for password section to be visible
    await expect(page.locator("h2:has-text('Password')")).toBeVisible();
    
    // Fill in password change form
    const currentPasswordInput = page.locator('input[type="password"]').filter({ hasText: "Current Password" }).or(
      page.locator('.input-text').filter({ hasText: "Current Password" }).locator('input')
    );
    const newPasswordInput = page.locator('input[type="password"]').filter({ hasText: "New Password" }).or(
      page.locator('.input-text').filter({ hasText: "New Password" }).locator('input')
    );
    const confirmPasswordInput = page.locator('input[type="password"]').filter({ hasText: "Confirm" }).or(
      page.locator('.input-text').filter({ hasText: "Confirm" }).locator('input')
    );
    
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
    
    await Promise.all([
      page.waitForResponse(response => 
        response.url().includes("/change-password") && 
        response.request().method() === "POST"
      ),
      updateButton.click()
    ]);
    
    // Should show success message
    await expect(page.locator(".toast").filter({ hasText: "Password changed successfully" })).toBeVisible({ timeout: 5000 });
    
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
    const currentPasswordInput = page.locator('.input-text').filter({ hasText: "Current Password" }).locator('input');
    const newPasswordInput = page.locator('.input-text').filter({ hasText: "New Password" }).locator('input');
    const confirmPasswordInput = page.locator('.input-text').filter({ hasText: "Confirm" }).locator('input');
    
    await currentPasswordInput.fill("wrongpassword");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("newpassword123");
    
    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();
    
    // Should show error message about incorrect current password
    await expect(page.locator(".toast").filter({ hasText: "Current password is incorrect" })).toBeVisible({ timeout: 5000 });
    
    // Form should not be reset on error
    await expect(currentPasswordInput).toHaveValue("wrongpassword");
    await expect(newPasswordInput).toHaveValue("newpassword123");
    await expect(confirmPasswordInput).toHaveValue("newpassword123");
  });

  test("password change with weak password rejection", async ({ page }) => {
    await page.goto("/account/security");
    
    // Fill in password change form with weak password
    const currentPasswordInput = page.locator('.input-text').filter({ hasText: "Current Password" }).locator('input');
    const newPasswordInput = page.locator('.input-text').filter({ hasText: "New Password" }).locator('input');
    const confirmPasswordInput = page.locator('.input-text').filter({ hasText: "Confirm" }).locator('input');
    
    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("123"); // Too short
    await confirmPasswordInput.fill("123");
    
    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();
    
    // Should show validation error
    await expect(page.locator(".toast").filter({ hasText: "8 characters" })).toBeVisible({ timeout: 5000 });
  });

  test("password change validation for mismatched passwords", async ({ page }) => {
    await page.goto("/account/security");
    
    // Fill in password change form with mismatched passwords
    const currentPasswordInput = page.locator('.input-text').filter({ hasText: "Current Password" }).locator('input');
    const newPasswordInput = page.locator('.input-text').filter({ hasText: "New Password" }).locator('input');
    const confirmPasswordInput = page.locator('.input-text').filter({ hasText: "Confirm" }).locator('input');
    
    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("differentpassword123");
    
    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();
    
    // Should show validation error for mismatched passwords
    await expect(page.locator(".toast").filter({ hasText: "do not match" })).toBeVisible({ timeout: 5000 });
  });

  test("password change form validation and UX", async ({ page }) => {
    await page.goto("/account/security");
    
    const currentPasswordInput = page.locator('.input-text').filter({ hasText: "Current Password" }).locator('input');
    const newPasswordInput = page.locator('.input-text').filter({ hasText: "New Password" }).locator('input');
    const confirmPasswordInput = page.locator('.input-text').filter({ hasText: "Confirm" }).locator('input');
    const updateButton = page.locator('button:has-text("Update Password")');
    const cancelButton = page.locator('button:has-text("Cancel")');
    
    // Initially buttons should be disabled (no changes)
    await expect(updateButton).toBeDisabled();
    await expect(cancelButton).toBeDisabled();
    
    // Start typing - buttons should become enabled
    await currentPasswordInput.fill("test");
    await expect(updateButton).toBeEnabled();
    await expect(cancelButton).toBeEnabled();
    
    // Check unsaved changes warning appears
    await expect(page.locator(".status-message.warning")).toContainText("unsaved password changes");
    
    // Cancel should reset form
    await cancelButton.click();
    await expect(currentPasswordInput).toHaveValue("");
    await expect(newPasswordInput).toHaveValue("");
    await expect(confirmPasswordInput).toHaveValue("");
    
    // Buttons should be disabled again
    await expect(updateButton).toBeDisabled();
    await expect(cancelButton).toBeDisabled();
  });

  test("password change loading state", async ({ page }) => {
    await page.goto("/account/security");
    
    // Mock slow response to test loading state
    await page.route("**/change-password", async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Password changed successfully" })
      });
    });
    
    const currentPasswordInput = page.locator('.input-text').filter({ hasText: "Current Password" }).locator('input');
    const newPasswordInput = page.locator('.input-text').filter({ hasText: "New Password" }).locator('input');
    const confirmPasswordInput = page.locator('.input-text').filter({ hasText: "Confirm" }).locator('input');
    
    await currentPasswordInput.fill("testpass123");
    await newPasswordInput.fill("newpassword123");
    await confirmPasswordInput.fill("newpassword123");
    
    const updateButton = page.locator('button:has-text("Update Password")');
    await updateButton.click();
    
    // Should show loading state
    await expect(updateButton).toContainText("Updating...");
    await expect(updateButton).toBeDisabled();
    
    // All inputs should be disabled during update
    await expect(currentPasswordInput).toBeDisabled();
    await expect(newPasswordInput).toBeDisabled();
    await expect(confirmPasswordInput).toBeDisabled();
    
    // Wait for completion
    await expect(updateButton).toContainText("Update Password", { timeout: 3000 });
  });
});