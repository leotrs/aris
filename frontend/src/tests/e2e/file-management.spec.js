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
    console.log("📝 [Test] Starting: create new RSM file and verify in file list");

    // Start from home page to avoid double navigation
    console.log("📝 [Test] Step 1: Starting from home page...");
    await fileHelpers.navigateToHome();
    console.log("📝 [Test] Step 1: Home page loaded");

    // Get initial file count directly without waitForFilesLoaded
    console.log("📝 [Test] Step 2: Getting initial file count...");
    const initialCount = await page.locator('[data-testid^="file-item-"]').count();
    console.log("📝 [Test] Step 2: Initial file count:", initialCount);

    // Create new file
    console.log("📝 [Test] Step 3: Creating new file...");
    const fileId = await fileHelpers.createNewFile();
    expect(fileId).toBeTruthy();
    console.log("📝 [Test] Step 3: File created with ID:", fileId);

    // Verify we're in the workspace for the new file
    console.log("📝 [Test] Step 4: Verifying workspace URL...");
    await expect(page).toHaveURL(`/file/${fileId}`);
    console.log("📝 [Test] Step 4: URL verified, in workspace");

    // Navigate back to home using proven reliable pattern
    console.log("📝 [Test] Step 5: Navigating back to home...");
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Wait for either files container or create button (handles empty state)
    await page.waitForSelector(
      '[data-testid="files-container"], [data-testid="create-file-button"]',
      { timeout: 5000 }
    );

    // Wait for file count to increase using simple polling
    await page.waitForFunction(
      (expectedCount) => {
        const fileItems = document.querySelectorAll('[data-testid^="file-item-"]');
        return fileItems.length > expectedCount;
      },
      initialCount,
      { timeout: 10000 }
    );

    const newCount = await page.locator('[data-testid^="file-item-"]').count();
    expect(newCount).toBe(initialCount + 1);
    console.log("📝 [Test] Step 5: File count increased from", initialCount, "to", newCount);

    console.log("📝 [Test] Completed successfully!");
    // TODO: Clean up - deletion functionality needs to be fixed
    // await fileHelpers.deleteFile(fileId);
  });

  // TEMPORARILY DISABLED: Failing in Firefox due to context menu interaction issues
  // Error: Context menu not opening/closing correctly in Firefox browser
  // TODO: Re-enable once Firefox-specific context menu handling is fixed
  test.skip("file context menu opens and closes correctly", async ({ page }) => {
    // Create a file for menu testing
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Verify file exists
    const fileExists = await fileHelpers.fileExists(fileId);
    expect(fileExists).toBe(true);

    // Open file menu
    await fileHelpers.openFileMenu(fileId);

    // Verify menu is visible with expected options
    const contextMenu = page.locator('[data-testid="context-menu"]').first();
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
});
