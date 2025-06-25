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

    await fileHelpers.ensureTestFiles(3);
  });

  test("file selection state syncs across components", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // Click to select first file
    await files[0].click();

    // File should have active class
    await expect(files[0]).toHaveClass(/active/);

    // Other files should not be selected
    for (let i = 1; i < files.length; i++) {
      await expect(files[i]).not.toHaveClass(/active/);
    }

    // Select different file
    await files[1].click();

    // Only second file should be selected
    await expect(files[0]).not.toHaveClass(/active/);
    await expect(files[1]).toHaveClass(/active/);
  });

  test("file selection updates preview pane if enabled", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // Select first file
    await files[0].click();

    // Check if preview pane becomes visible (if implemented)
    const previewPane = page.locator(".preview-pane, .preview-container");
    if ((await previewPane.count()) > 0) {
      await expect(previewPane).toBeVisible();
    }
  });

  test("double-click opens file immediately", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Double-click should navigate to workspace
    await firstFile.dblclick();
    await page.waitForURL("/file/*");
    expect(page.url()).toContain("/file/");
  });

  test("context menu opens on right-click", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Right-click should open context menu
    await firstFile.click({ button: "right" });

    // Context menu should be visible
    await expect(page.locator(".context-menu")).toBeVisible();

    // Should contain expected menu items
    await expect(page.locator(".context-menu")).toContainText("Rename");
    await expect(page.locator(".context-menu")).toContainText("Duplicate");
    await expect(page.locator(".context-menu")).toContainText("Delete");
  });

  test("context menu opens with dot key when file is focused", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Focus first file
    await page.keyboard.press("j");

    // Dot key should open context menu
    await page.keyboard.press(".");

    await expect(page.locator(".context-menu")).toBeVisible();
  });

  test("rename operation works via context menu", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Get original title
    const _originalTitle = await firstFile.locator(".file-title").textContent();

    // Open context menu and rename
    await firstFile.click({ button: "right" });
    await page.locator(".context-menu").locator("text=Rename").click();

    // Edit field should be active
    const editableTitle = firstFile.locator(".file-title input, .file-title [contenteditable]");
    await expect(editableTitle).toBeVisible();

    // Change title
    const newTitle = `${_originalTitle} (Renamed)`;
    await editableTitle.clear();
    await editableTitle.fill(newTitle);
    await editableTitle.press("Enter");

    // Wait for backend update
    await page.waitForTimeout(500);

    // Title should be updated
    await expect(firstFile.locator(".file-title")).toContainText("(Renamed)");
  });

  test("duplicate operation creates copy with incremented name", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const initialFiles = await page.locator('[data-testid^="file-item-"]').all();
    const initialCount = initialFiles.length;

    const firstFile = page.locator('[data-testid^="file-item-"]').first();
    const _originalTitle = await firstFile.locator(".file-title").textContent();

    // Open context menu and duplicate
    await firstFile.click({ button: "right" });
    await page.locator(".context-menu").locator("text=Duplicate").click();

    // Wait for duplication to complete
    await page.waitForTimeout(1000);

    // Should have one more file
    const newFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(newFiles.length).toBe(initialCount + 1);

    // Should find a file with "Copy" in the name
    const copyFile = page.locator('[data-testid^="file-item-"]').filter({ hasText: "Copy" });
    await expect(copyFile).toBeVisible();
  });

  test("delete operation shows confirmation modal", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Open context menu and delete
    await firstFile.click({ button: "right" });
    await page.locator(".context-menu").locator("text=Delete").click();

    // Confirmation modal should appear
    await expect(page.locator(".modal")).toBeVisible();
    await expect(page.locator(".modal")).toContainText("Delete");
    await expect(page.locator(".modal")).toContainText("Are you sure");
  });

  test("delete operation removes file after confirmation", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const initialFiles = await page.locator('[data-testid^="file-item-"]').all();
    const initialCount = initialFiles.length;

    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Open context menu and delete
    await firstFile.click({ button: "right" });
    await page.locator(".context-menu").locator("text=Delete").click();

    // Confirm deletion
    await page.locator(".modal").locator("text=Delete").click();

    // Wait for deletion to complete
    await page.waitForTimeout(1000);

    // Should have one fewer file
    const remainingFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(remainingFiles.length).toBe(initialCount - 1);
  });

  test("delete operation can be cancelled", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const initialFiles = await page.locator('[data-testid^="file-item-"]').all();
    const initialCount = initialFiles.length;

    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Open context menu and delete
    await firstFile.click({ button: "right" });
    await page.locator(".context-menu").locator("text=Delete").click();

    // Cancel deletion
    await page.locator(".modal").locator("text=Cancel").click();

    // Should still have same number of files
    const remainingFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(remainingFiles.length).toBe(initialCount);
  });

  test("file hover states don't interfere with selection", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // Select first file
    await files[0].click();
    await expect(files[0]).toHaveClass(/active/);

    // Hover over second file
    await files[1].hover();
    await expect(files[1]).toHaveClass(/hovered/);

    // First file should still be selected
    await expect(files[0]).toHaveClass(/active/);
    await expect(files[1]).not.toHaveClass(/active/);
  });

  test("file operations update UI state immediately", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Select file
    await firstFile.click();
    await expect(firstFile).toHaveClass(/active/);

    // Context menu should be hidden when file is selected
    const contextMenuTrigger = firstFile.locator(".context-menu-trigger, .file-menu");
    if ((await contextMenuTrigger.count()) > 0) {
      await expect(contextMenuTrigger).not.toBeVisible();
    }
  });

  test("file focus management during list changes", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Focus second file
    await page.keyboard.press("j");
    await page.keyboard.press("j");

    const files = await page.locator('[data-testid^="file-item-"]').all();
    await expect(files[1]).toHaveClass(/focused/);

    // Create new file
    await fileHelpers.createFile("New Test File");

    // Wait for file list to update
    await page.waitForTimeout(500);

    // Focus should still be manageable
    await page.keyboard.press("j");
    const newFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(newFiles.length).toBeGreaterThan(files.length);
  });

  test("context menu closes when clicking outside", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Open context menu
    await firstFile.click({ button: "right" });
    await expect(page.locator(".context-menu")).toBeVisible();

    // Click outside to close
    await page.locator("body").click({ position: { x: 10, y: 10 } });

    // Context menu should be hidden
    await expect(page.locator(".context-menu")).not.toBeVisible();
  });

  test("file operations work in both list and cards view", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Test in list view
    const firstFile = page.locator('[data-testid^="file-item-"]').first();
    await firstFile.click();
    await expect(firstFile).toHaveClass(/active/);

    // Switch to cards view
    await page.keyboard.press("v");
    await page.keyboard.press("c");

    // File should still be selected
    await expect(firstFile).toHaveClass(/active/);

    // Context menu should work in cards view
    await firstFile.click({ button: "right" });
    await expect(page.locator(".context-menu")).toBeVisible();
  });
});
