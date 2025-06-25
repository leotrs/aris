import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("Home View Navigation & Keyboard", () => {
  let authHelpers, fileHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    await page.goto("/");
    await authHelpers.clearAuthState();
    await authHelpers.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    await authHelpers.expectToBeLoggedIn();

    // Ensure we have test files for navigation
    await fileHelpers.ensureTestFiles(5);
  });

  test("keyboard navigation with j/k updates focus correctly", async ({ page }) => {
    // Wait for files to load
    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();
    expect(files.length).toBeGreaterThan(2);

    // Start navigation - j should focus first item
    await page.keyboard.press("j");
    await expect(files[0]).toHaveClass(/focused/);

    // j again should move to second item
    await page.keyboard.press("j");
    await expect(files[0]).not.toHaveClass(/focused/);
    await expect(files[1]).toHaveClass(/focused/);

    // k should move back to first item
    await page.keyboard.press("k");
    await expect(files[1]).not.toHaveClass(/focused/);
    await expect(files[0]).toHaveClass(/focused/);
  });

  test("arrow key navigation works like j/k", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // ArrowDown should focus first item
    await page.keyboard.press("ArrowDown");
    await expect(files[0]).toHaveClass(/focused/);

    // ArrowDown again should move to second
    await page.keyboard.press("ArrowDown");
    await expect(files[1]).toHaveClass(/focused/);

    // ArrowUp should move back
    await page.keyboard.press("ArrowUp");
    await expect(files[0]).toHaveClass(/focused/);
  });

  test("navigation wraps around at list boundaries", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();
    const lastIndex = files.length - 1;

    // Navigate to last item
    for (let i = 0; i < files.length; i++) {
      await page.keyboard.press("j");
    }
    await expect(files[lastIndex]).toHaveClass(/focused/);

    // j should wrap to first item
    await page.keyboard.press("j");
    await expect(files[0]).toHaveClass(/focused/);

    // k should wrap back to last item
    await page.keyboard.press("k");
    await expect(files[lastIndex]).toHaveClass(/focused/);
  });

  test("escape key clears focus", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // Focus first item
    await page.keyboard.press("j");
    await expect(files[0]).toHaveClass(/focused/);

    // Escape should clear focus
    await page.keyboard.press("Escape");
    await expect(files[0]).not.toHaveClass(/focused/);
  });

  test("focused item scrolls into view", async ({ page }) => {
    await page.goto("/");

    // Create more files to enable scrolling
    await fileHelpers.ensureTestFiles(15);
    await page.waitForSelector('[data-testid="files-container"]');

    const files = await page.locator('[data-testid^="file-item-"]').all();

    // Navigate to bottom of list
    for (let i = 0; i < files.length; i++) {
      await page.keyboard.press("j");
    }

    // Last item should be in view
    const lastFile = files[files.length - 1];
    await expect(lastFile).toBeInViewport();
  });

  test("enter key opens focused file", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Focus first file
    await page.keyboard.press("j");

    // Enter should navigate to workspace
    await page.keyboard.press("Enter");
    await page.waitForURL("/file/*");
    expect(page.url()).toContain("/file/");
  });

  test("space key opens focused file", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Focus first file
    await page.keyboard.press("j");

    // Space should navigate to workspace
    await page.keyboard.press("Space");
    await page.waitForURL("/file/*");
    expect(page.url()).toContain("/file/");
  });

  test("dot key opens context menu for focused file", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Focus first file
    await page.keyboard.press("j");

    // Dot should open context menu
    await page.keyboard.press(".");
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
  });

  test("view mode shortcut v,l switches to list view", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Switch to list view
    await page.keyboard.press("v");
    await page.keyboard.press("l");

    const filesContainer = page.locator('[data-testid="files-container"]');
    await expect(filesContainer).toHaveClass(/list/);
  });

  test("view mode shortcut v,c switches to cards view", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Switch to cards view
    await page.keyboard.press("v");
    await page.keyboard.press("c");

    const filesContainer = page.locator('[data-testid="files-container"]');
    await expect(filesContainer).toHaveClass(/cards/);
  });

  test("search shortcut / focuses search input", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Press / to focus search
    await page.keyboard.press("/");

    // Search input should be focused
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeFocused();
  });

  test("keyboard navigation maintains focus after file operations", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // Focus second file
    await page.keyboard.press("j");
    await page.keyboard.press("j");
    await expect(files[1]).toHaveClass(/focused/);

    // Duplicate file via context menu
    await page.keyboard.press(".");
    await page.locator("text=Duplicate").click();

    // Wait for file list to update
    await page.waitForTimeout(500);

    // Focus should still work after file operations
    await page.keyboard.press("j");
    const newFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(newFiles.length).toBeGreaterThan(files.length);
  });

  test("navigation works in both list and cards view modes", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Test in list mode
    await page.keyboard.press("v");
    await page.keyboard.press("l");
    await page.keyboard.press("j");

    const files = await page.locator('[data-testid^="file-item-"]').all();
    await expect(files[0]).toHaveClass(/focused/);

    // Switch to cards mode
    await page.keyboard.press("v");
    await page.keyboard.press("c");

    // Navigation should still work
    await page.keyboard.press("j");
    await expect(files[1]).toHaveClass(/focused/);
  });
});
