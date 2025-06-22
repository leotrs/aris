import { test, expect } from "@playwright/test";
import { loginUser } from "../../utils/auth-helpers.js";
import { getTestUsers } from "../../utils/test-config.js";

test.describe("File Menu Interactions", () => {
  let testUsers;

  test.beforeAll(() => {
    testUsers = getTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    // Ensure we start from a clean slate
    await page.goto("/");
  });

  test("should show file menu trigger on hover", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    // Wait for file list to load
    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');
    const firstFile = fileItems.first();

    // Hover over first file
    await firstFile.hover();

    // Menu trigger should become visible
    await expect(page.locator('[data-testid="trigger-button"]')).toBeVisible();
  });

  test("should open context menu when trigger is clicked", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    // Wait for file list to load
    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');
    const firstFile = fileItems.first();

    // Hover to make trigger visible
    await firstFile.hover();
    await expect(page.locator('[data-testid="trigger-button"]')).toBeVisible();

    // Click the trigger button
    await page.click('[data-testid="trigger-button"]');

    // Context menu should appear
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Check aria-expanded attribute
    await expect(page.locator('[data-testid="trigger-button"]')).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  test("should handle multiple click methods for menu trigger", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');
    const firstFile = fileItems.first();

    // Hover to make trigger visible
    await firstFile.hover();
    await expect(page.locator('[data-testid="trigger-button"]')).toBeVisible();

    // Test regular click
    await page.click('[data-testid="trigger-button"]');
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Close menu by clicking elsewhere
    await page.click("body");
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();

    // Test JavaScript click as fallback
    await page.evaluate(() => {
      const trigger = document.querySelector('[data-testid="trigger-button"]');
      if (trigger) trigger.click();
    });
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
  });

  test("should display correct menu items", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');
    const firstFile = fileItems.first();

    // Open menu
    await firstFile.hover();
    await page.click('[data-testid="trigger-button"]');
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Check for expected menu items
    const menuItems = page.locator('[data-testid="context-menu"] [role="menuitem"]');
    await expect(menuItems).toHaveCount(expect.any(Number));

    // Common file operations should be present
    const menuText = await page.locator('[data-testid="context-menu"]').textContent();
    expect(menuText).toMatch(/open|edit|delete|rename|share/i);
  });

  test("should close menu when clicking outside", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');
    const firstFile = fileItems.first();

    // Open menu
    await firstFile.hover();
    await page.click('[data-testid="trigger-button"]');
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Click outside to close
    await page.click("body");
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();

    // Check aria-expanded is false
    await expect(page.locator('[data-testid="trigger-button"]')).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  test("should work with keyboard navigation", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');
    const firstFile = fileItems.first();

    // Focus the first file
    await firstFile.focus();

    // Use Tab to navigate to the trigger button
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="trigger-button"]')).toBeFocused();

    // Press Enter or Space to activate
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Escape should close the menu
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();
  });

  test("should handle rapid hover interactions", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;
    await loginUser(page, user);

    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const fileItems = page.locator('[data-testid^="file-item"]');

    // Rapidly hover over multiple files
    for (let i = 0; i < Math.min(3, await fileItems.count()); i++) {
      await fileItems.nth(i).hover();
      await page.waitForTimeout(100); // Brief pause
    }

    // Final hover should still show trigger
    await fileItems.first().hover();
    await expect(page.locator('[data-testid="trigger-button"]')).toBeVisible();
  });
});
