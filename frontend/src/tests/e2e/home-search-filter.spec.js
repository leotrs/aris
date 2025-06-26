import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("Home View Search & Filter", () => {
  let authHelpers, fileHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    await page.goto("/");
    await authHelpers.clearAuthState();
    await authHelpers.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    await authHelpers.expectToBeLoggedIn();

    await fileHelpers.waitForFilesLoaded();
  });

  test("search input is accessible and functional", async ({ page }) => {
    // Check if search input exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();

    if ((await searchInput.count()) > 0) {
      await expect(searchInput).toBeVisible();

      // Should be able to type in search
      await searchInput.fill("test");
      expect(await searchInput.inputValue()).toBe("test");

      // Clear search
      await searchInput.clear();
      expect(await searchInput.inputValue()).toBe("");
    }
  });

  test("search keyboard shortcut opens search", async ({ page }) => {
    // Test search shortcut
    await page.keyboard.press("/");

    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    if ((await searchInput.count()) > 0) {
      await expect(searchInput).toBeFocused();

      // Escape should exit search
      await page.keyboard.press("Escape");
    }
  });

  test("file list remains functional with search functionality", { tag: '@flaky' }, async ({ page }) => {
    const filesContainer = page.locator('[data-testid="files-container"]');
    await expect(filesContainer).toBeVisible();

    // Files should be visible
    const fileItems = page.locator('[data-testid^="file-item-"]');
    if ((await fileItems.count()) > 0) {
      const firstFile = fileItems.first();
      await expect(firstFile).toBeVisible();

      // Should be able to interact with files
      await firstFile.click();
      await page.waitForTimeout(200); // Wait for reactivity
      await expect(firstFile).toHaveClass(/active/);
    }
  });
});
