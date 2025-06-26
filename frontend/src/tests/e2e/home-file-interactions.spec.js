import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("Home View File Interactions", () => {
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

  test("file selection state works correctly", { tag: '@flaky' }, async ({ page }) => {
    const fileItems = page.locator('[data-testid^="file-item-"]');

    if ((await fileItems.count()) >= 2) {
      const firstFile = fileItems.first();
      const secondFile = fileItems.nth(1);

      // Click to select first file
      await firstFile.click();
      await page.waitForTimeout(200); // Wait for reactivity
      await expect(firstFile).toHaveClass(/active/);

      // Select different file
      await secondFile.click();
      await page.waitForTimeout(200); // Wait for reactivity
      await expect(secondFile).toHaveClass(/active/);
      await expect(firstFile).not.toHaveClass(/active/);
    }
  });

  test("file click opens file workspace", async ({ page }) => {
    const fileItems = page.locator('[data-testid^="file-item-"]');

    if ((await fileItems.count()) > 0) {
      const firstFile = fileItems.first();

      // Double-click to open file
      await firstFile.dblclick();

      // Should navigate to file workspace
      await expect(page).toHaveURL(/\/file\/[a-zA-Z0-9-]+$/);
    }
  });

  test("file menu operations work correctly", { tag: '@flaky' }, async () => {
    // Create a test file for menu operations
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Test file menu functionality
    const fileExists = await fileHelpers.fileExists(fileId);
    if (fileExists) {
      // Test duplicate operation
      await fileHelpers.duplicateFile(fileId);

      // Should have more files now
      const newFileCount = await fileHelpers.getFileCount();
      expect(newFileCount).toBeGreaterThan(1);

      // Clean up
      await fileHelpers.deleteFile(fileId);
    }
  });
});
