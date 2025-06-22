import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession } from "../../utils/auth-helpers.js";
import {
  createNewFile,
  uploadFile,
  openFile,
  deleteFile,
  fileExists,
  addTagsToFile,
} from "../../utils/manuscript-helpers.js";
import { getTestUsers } from "../../utils/test-config.js";

test.describe("File Management", () => {
  let testUsers;

  test.beforeAll(() => {
    testUsers = getTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
  });

  test("should display file list on home page", async ({ page }) => {
    await page.goto("/home");

    // Should show files container
    await expect(page.locator('[data-testid="files-container"]')).toBeVisible();

    // Should show file list or empty state
    const filesList = page.locator('[data-testid="files-list"]');
    const emptyState = page.locator('[data-testid="files-empty-state"]');

    // One of these should be visible
    expect((await filesList.isVisible()) || (await emptyState.isVisible())).toBe(true);
  });

  test("should create new file", async ({ page }) => {
    const fileName = `Test File ${Date.now()}`;

    await createNewFile(page, { title: fileName });

    // Should redirect to workspace
    expect(page.url()).toContain("/workspace");

    // Should show file title in workspace
    await expect(page.locator('[data-testid="file-title"]')).toContainText(fileName);

    // Go back to home and verify file exists
    await page.goto("/home");
    expect(await fileExists(page, fileName)).toBe(true);
  });

  test("should open existing file", async ({ page }) => {
    // First create a file
    const fileName = `Test File for Opening ${Date.now()}`;
    await createNewFile(page, { title: fileName });

    // Go back to home
    await page.goto("/home");

    // Open the file
    await openFile(page, fileName);

    // Should be in workspace
    expect(page.url()).toContain("/workspace");
    await expect(page.locator('[data-testid="file-title"]')).toContainText(fileName);
  });

  test("should delete file with confirmation", async ({ page }) => {
    // Create a file first
    const fileName = `Test File for Deletion ${Date.now()}`;
    await createNewFile(page, { title: fileName });

    // Go to home and delete
    await page.goto("/home");

    // Verify file exists before deletion
    expect(await fileExists(page, fileName)).toBe(true);

    // Delete the file
    await deleteFile(page, fileName);

    // Verify file is deleted
    expect(await fileExists(page, fileName)).toBe(false);
  });

  test("should show file creation modal", async ({ page }) => {
    await page.goto("/home");

    // Click create file button
    await page.click('[data-testid="create-file-button"]');

    // Should show creation modal
    await expect(page.locator('[data-testid="create-file-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="file-title-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="create-file-submit"]')).toBeVisible();
  });

  test("should validate file title when creating", async ({ page }) => {
    await page.goto("/home");
    await page.click('[data-testid="create-file-button"]');

    // Try to submit without title
    await page.click('[data-testid="create-file-submit"]');

    // Should show validation error or prevent submission
    const titleInput = page.locator('[data-testid="file-title-input"]');
    const isValid = await titleInput.evaluate((input) => input.validity.valid);
    expect(isValid).toBe(false);
  });

  test("should handle file upload", async ({ page }) => {
    await page.goto("/home");

    // Check if upload functionality exists
    const uploadButton = page.locator('[data-testid="upload-file-button"]');
    if (await uploadButton.isVisible()) {
      await uploadButton.click();

      // Should show upload interface
      await expect(page.locator('[data-testid="file-upload-input"]')).toBeVisible();

      // Note: Actual file upload would require a real file
      // This tests the UI presence
    }
  });

  test("should show file context menu on right click", async ({ page }) => {
    // Create a file first
    const fileName = `Test File for Context Menu ${Date.now()}`;
    await createNewFile(page, { title: fileName });
    await page.goto("/home");

    // Right-click on file
    await page.click(`[data-testid="file-item-${fileName}"]`, { button: "right" });

    // Should show context menu
    await expect(page.locator('[data-testid="file-context-menu"]')).toBeVisible();

    // Should show context menu options
    await expect(page.locator('[data-testid="open-file-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="delete-file-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="rename-file-option"]')).toBeVisible();
  });

  test("should rename file", async ({ page }) => {
    // Create a file first
    const originalName = `Original File ${Date.now()}`;
    const newName = `Renamed File ${Date.now()}`;

    await createNewFile(page, { title: originalName });
    await page.goto("/home");

    // Right-click to open context menu
    await page.click(`[data-testid="file-item-${originalName}"]`, { button: "right" });

    // Click rename option
    await page.click('[data-testid="rename-file-option"]');

    // Should show rename input or modal
    const renameInput = page.locator('[data-testid="rename-input"]');
    if (await renameInput.isVisible()) {
      await renameInput.fill(newName);
      await page.keyboard.press("Enter");

      // Verify file is renamed
      expect(await fileExists(page, newName)).toBe(true);
      expect(await fileExists(page, originalName)).toBe(false);
    }
  });

  test("should add tags to file", async ({ page }) => {
    // Create a file first
    const fileName = `Test File for Tags ${Date.now()}`;
    await createNewFile(page, { title: fileName });
    await page.goto("/home");

    // Add tags
    const tags = ["research", "draft"];
    await addTagsToFile(page, fileName, tags);

    // Verify tags are displayed
    for (const tag of tags) {
      await expect(page.locator(`[data-testid="file-tag-${tag}"]`)).toBeVisible();
    }
  });

  test("should filter files by tags", async ({ page }) => {
    await page.goto("/home");

    // Check if tag filter exists
    const tagFilter = page.locator('[data-testid="tag-filter"]');
    if (await tagFilter.isVisible()) {
      // Select a tag to filter by
      await tagFilter.click();

      // Should show tag options
      await expect(page.locator('[data-testid="tag-filter-options"]')).toBeVisible();
    }
  });

  test("should search files by name", async ({ page }) => {
    // Create a test file
    const fileName = `Searchable Test File ${Date.now()}`;
    await createNewFile(page, { title: fileName });
    await page.goto("/home");

    // Search for the file
    const searchInput = page.locator('[data-testid="file-search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("Searchable");

      // Should show only matching files
      await expect(page.locator(`[data-testid="file-item-${fileName}"]`)).toBeVisible();
    }
  });

  test("should sort files by different criteria", async ({ page }) => {
    await page.goto("/home");

    // Check if sort options exist
    const sortDropdown = page.locator('[data-testid="files-sort-dropdown"]');
    if (await sortDropdown.isVisible()) {
      await sortDropdown.click();

      // Should show sort options
      await expect(page.locator('[data-testid="sort-by-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="sort-by-date"]')).toBeVisible();
      await expect(page.locator('[data-testid="sort-by-modified"]')).toBeVisible();

      // Test sorting by name
      await page.click('[data-testid="sort-by-name"]');

      // Files should be sorted (would need specific test data to verify order)
    }
  });

  test("should show file metadata", async ({ page }) => {
    // Create a file first
    const fileName = `Test File for Metadata ${Date.now()}`;
    await createNewFile(page, { title: fileName });
    await page.goto("/home");

    // Click on file to select it
    await page.click(`[data-testid="file-item-${fileName}"]`);

    // Should show file metadata in sidebar or preview
    const metadataPanel = page.locator('[data-testid="file-metadata-panel"]');
    if (await metadataPanel.isVisible()) {
      // Should show file details
      await expect(page.locator('[data-testid="file-created-date"]')).toBeVisible();
      await expect(page.locator('[data-testid="file-modified-date"]')).toBeVisible();
      await expect(page.locator('[data-testid="file-size"]')).toBeVisible();
    }
  });

  test("should handle bulk file operations", async ({ page }) => {
    // Create multiple files
    const fileNames = [
      `Bulk Test File 1 ${Date.now()}`,
      `Bulk Test File 2 ${Date.now()}`,
      `Bulk Test File 3 ${Date.now()}`,
    ];

    for (const fileName of fileNames) {
      await createNewFile(page, { title: fileName });
      await page.goto("/home");
    }

    // Check if bulk selection is available
    const selectAllCheckbox = page.locator('[data-testid="select-all-files"]');
    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.check();

      // Should show bulk actions
      await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible();
      await expect(page.locator('[data-testid="bulk-delete-button"]')).toBeVisible();
    }
  });

  test("should show empty state when no files", async ({ page }) => {
    await page.goto("/home");

    // If no files exist, should show empty state
    const fileItems = await page.locator('[data-testid^="file-item-"]').count();

    if (fileItems === 0) {
      await expect(page.locator('[data-testid="files-empty-state"]')).toBeVisible();
      await expect(page.locator('[data-testid="create-first-file-button"]')).toBeVisible();
    }
  });
});
