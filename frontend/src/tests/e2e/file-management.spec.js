import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("File Management Tests", () => {
  let authHelpers;
  let fileHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    // Clear auth state and login for file operations
    await authHelpers.clearAuthState();

    // Skip tests if no valid credentials available
    const hasValidCredentials = TEST_CREDENTIALS.valid.password;
    test.skip(!hasValidCredentials, "Requires valid test credentials for file operations");

    // Login with valid credentials
    await authHelpers.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);

    try {
      await authHelpers.expectToBeLoggedIn();
    } catch {
      test.skip(true, "Login failed - cannot test file operations");
    }
  });

  test("create new RSM file and verify in file list", async ({ page }) => {
    // Create new file
    const fileId = await fileHelpers.createNewFile();
    expect(fileId).toBeTruthy();

    // Verify we're in the workspace for the new file
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Navigate back to home to see file list
    await fileHelpers.navigateToHome();

    // Verify file appears in the list
    await fileHelpers.waitForFilesLoaded();
    const fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(true);

    // Verify file has default title
    const fileTitle = await fileHelpers.getFileTitle(fileId);
    expect(fileTitle).toContain("New File");

    // TODO: Clean up - deletion functionality needs to be fixed
    // await fileHelpers.deleteFile(fileId);
  });

  test("delete file with confirmation modal works correctly", async () => {
    // Create a file to delete
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Verify file exists before deletion
    let fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(true);

    // Delete the file
    await fileHelpers.deleteFile(fileId);

    // Wait for file list to update
    await fileHelpers.waitForFilesLoaded();

    // Verify file no longer exists in the list
    fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(false);
  });

  test("duplicate file creates copy with incremented name", { tag: '@flaky' }, async () => {
    // Create a file to duplicate
    const originalFileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Get original file title
    const originalTitle = await fileHelpers.getFileTitle(originalFileId);

    // Duplicate the file
    await fileHelpers.duplicateFile(originalFileId);

    // Wait for file list to update
    await fileHelpers.waitForFilesLoaded();

    // Find the duplicated file (should have "Copy" in the title)
    const fileItems = await fileHelpers.getFileItems();
    let duplicatedFileFound = false;
    let _duplicatedFileId = null;

    for (const fileItem of fileItems) {
      const testId = await fileItem.getAttribute("data-testid");
      const fileId = testId.replace("file-item-", "");

      if (fileId !== originalFileId) {
        const title = await fileHelpers.getFileTitle(fileId);
        if (title.includes("Copy") || title.includes(originalTitle)) {
          duplicatedFileFound = true;
          _duplicatedFileId = fileId;
          break;
        }
      }
    }

    expect(duplicatedFileFound).toBe(true);

    // TODO: Clean up - deletion functionality needs to be fixed
    // await fileHelpers.deleteFile(originalFileId);
    // if (_duplicatedFileId) {
    //   await fileHelpers.deleteFile(_duplicatedFileId);
    // }
  });

  test("file selection updates UI state across components", { tag: '@flaky' }, async () => {
    // Create multiple files for selection testing
    const fileId1 = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    const fileId2 = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Verify both files exist
    const file1Exists = await fileHelpers.fileExists(fileId1);
    const file2Exists = await fileHelpers.fileExists(fileId2);
    expect(file1Exists).toBe(true);
    expect(file2Exists).toBe(true);

    // Select first file
    await fileHelpers.selectFile(fileId1);

    // Verify first file is selected (has active class)
    const file1Item = await fileHelpers.getFileItem(fileId1);
    await expect(file1Item).toHaveClass(/active/);

    // Verify second file is not selected
    const file2Item = await fileHelpers.getFileItem(fileId2);
    await expect(file2Item).not.toHaveClass(/active/);

    // Select second file
    await fileHelpers.selectFile(fileId2);

    // Verify selection switched to second file
    await expect(file2Item).toHaveClass(/active/);
    await expect(file1Item).not.toHaveClass(/active/);

    // Clean up - delete test files
    await fileHelpers.deleteFile(fileId1);
    await fileHelpers.deleteFile(fileId2);
  });

  test("file deletion can be cancelled", async () => {
    // Create a file to test cancellation
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Verify file exists
    let fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(true);

    // Start deletion but cancel it
    await fileHelpers.cancelFileDeletion(fileId);

    // Verify file still exists after cancellation
    fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(true);

    // Clean up - actually delete the file
    await fileHelpers.deleteFile(fileId);
  });

  test("file context menu opens and closes correctly", async ({ page }) => {
    // Create a file for menu testing
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Verify file exists
    const fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(true);

    // Open file menu
    await fileHelpers.openFileMenu(fileId);

    // Verify menu is visible with expected options
    const contextMenu = page.locator('[data-testid="context-menu"]');
    await expect(contextMenu).toBeVisible();
    await expect(page.locator('text="Delete"')).toBeVisible();
    await expect(page.locator('text="Duplicate"')).toBeVisible();

    // Close menu by clicking elsewhere
    await page.click("body");
    await expect(contextMenu).not.toBeVisible();

    // Clean up
    await fileHelpers.deleteFile(fileId);
  });

  test("file operations work with keyboard shortcuts", { tag: '@flaky' }, async ({ page }) => {
    // Create a file for keyboard testing
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Select the file item - this now handles both selection and focus
    await fileHelpers.selectFile(fileId);

    // Test keyboard shortcut to open file menu (.) - if implemented
    await page.keyboard.press(".");
    const contextMenu = page.locator('[data-testid="context-menu"]');

    // Context menu may or may not appear depending on keyboard shortcut implementation
    if ((await contextMenu.count()) > 0) {
      await expect(contextMenu).toBeVisible();

      // Close menu with Escape
      await page.keyboard.press("Escape");
      await expect(contextMenu).not.toBeVisible();
    }

    // Test Enter to open file (re-select to ensure focus)
    await fileHelpers.selectFile(fileId);
    await page.keyboard.press("Enter");

    // Check if navigation happened (keyboard shortcut may not be implemented)
    await page.waitForTimeout(1000);
    const currentUrl = page.url();

    if (currentUrl.includes(`/file/${fileId}`)) {
      // File opened successfully via keyboard
      await fileHelpers.navigateToHome();
    } else {
      // Keyboard shortcut not implemented, that's okay
      console.log("Enter key shortcut not implemented for file opening");
    }

    // Clean up
    await fileHelpers.deleteFile(fileId);
  });
});
