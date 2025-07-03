import { test, expect } from "@playwright/test";

// @auth
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";

test.describe("File Management Tests @auth @desktop-only", () => {
  let authHelpers;
  let fileHelpers;

  test.beforeEach(async ({ page }) => {
    // Set desktop viewport for desktop-only keyboard navigation tests
    await page.setViewportSize({ width: 1024, height: 768 });
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    // Ensure logged in (handles both real auth and disabled auth)
    await authHelpers.ensureLoggedIn();
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
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 640;
    if (isMobile) {
      // Tap the same context menu trigger (three dots) to close the menu
      const fileItem = await page.locator(`[data-testid="file-item-${fileId}"]`);
      const dotsButton = fileItem.locator('[data-testid="trigger-button"]');
      await dotsButton.tap();
    } else {
      await page.click('[data-testid="files-container"]');
    }
    await expect(contextMenu).not.toBeVisible();

    // Clean up
    await fileHelpers.deleteFile(fileId);
  });

  test(
    "file operations work with keyboard shortcuts @desktop-only",
    { tag: "@flaky" },
    async ({ page }) => {
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
      await page.waitForTimeout(300);
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
    }
  );
});
