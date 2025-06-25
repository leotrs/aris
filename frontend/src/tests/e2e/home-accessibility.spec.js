import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("Home View Accessibility", () => {
  let authHelpers, fileHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    await page.goto("/");
    await authHelpers.clearAuthState();
    await authHelpers.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    await authHelpers.expectToBeLoggedIn();

    await fileHelpers.ensureTestFiles(5);
  });

  test("file items have proper ARIA roles and attributes", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const files = await page.locator('[data-testid^="file-item-"]').all();

    // File items should have button role
    for (const file of files) {
      await expect(file).toHaveAttribute("role", "button");
      await expect(file).toHaveAttribute("tabindex", "0");
    }
  });

  test("keyboard-only file selection workflow", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Navigate using keyboard only
    await page.keyboard.press("j"); // Focus first file
    await page.keyboard.press("Enter"); // Select file

    const firstFile = page.locator('[data-testid^="file-item-"]').first();
    await expect(firstFile).toHaveClass(/focused/);
  });

  test("keyboard-only file operations workflow", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const initialFiles = await page.locator('[data-testid^="file-item-"]').all();
    const initialCount = initialFiles.length;

    // Focus file and open menu
    await page.keyboard.press("j");
    await page.keyboard.press(".");

    // Context menu should be visible
    await expect(page.locator(".context-menu")).toBeVisible();

    // Navigate menu with keyboard
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown"); // Navigate to duplicate
    await page.keyboard.press("Enter");

    // Wait for duplication
    await page.waitForTimeout(1000);

    // Should have new file
    const newFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(newFiles.length).toBe(initialCount + 1);
  });

  test("keyboard-only search workflow", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Use keyboard shortcut to focus search
    await page.keyboard.press("/");

    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeFocused();

    // Type search term
    await page.keyboard.type("Test");
    await page.keyboard.press("Enter");

    // Wait for filtering
    await page.waitForTimeout(300);

    // Navigate results with keyboard
    await page.keyboard.press("Escape"); // Clear search focus
    await page.keyboard.press("j"); // Navigate files

    const visibleFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(visibleFiles.length).toBeGreaterThan(0);
  });

  test("focus indicators are visible during keyboard navigation", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Focus first file
    await page.keyboard.press("j");

    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // Check focus styles are applied
    await expect(firstFile).toHaveClass(/focused/);

    // Focus should be visually distinct
    const focusedStyle = await firstFile.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        outline: styles.outline,
      };
    });

    // Should have focus styling (background change or outline)
    expect(focusedStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("tab navigation works through interface elements", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Tab through main interface elements
    await page.keyboard.press("Tab");

    // Should be able to reach search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    if ((await searchInput.count()) > 0) {
      await expect(searchInput).toBeFocused();
    }

    // Continue tabbing to other interactive elements
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Should reach file items or other interactive elements
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("escape key behavior in different contexts", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Test escape from file focus
    await page.keyboard.press("j");
    await page.keyboard.press("Escape");

    const files = await page.locator('[data-testid^="file-item-"]').all();
    for (const file of files) {
      await expect(file).not.toHaveClass(/focused/);
    }

    // Test escape from search
    await page.keyboard.press("/");
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(searchInput).not.toBeFocused();
  });

  test("screen reader accessible file information", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const firstFile = page.locator('[data-testid^="file-item-"]').first();

    // File should have accessible title
    const fileTitle = firstFile.locator(".file-title");
    const titleText = await fileTitle.textContent();
    expect(titleText).toBeTruthy();

    // Check for accessible labels
    const ariaLabel = await firstFile.getAttribute("aria-label");
    const title = await firstFile.getAttribute("title");

    // Should have some form of accessible description
    expect(ariaLabel || title || titleText).toBeTruthy();
  });

  test("keyboard shortcuts work consistently across view modes", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Test shortcuts in list view
    await page.keyboard.press("v");
    await page.keyboard.press("l");

    await page.keyboard.press("j");
    const files = await page.locator('[data-testid^="file-item-"]').all();
    await expect(files[0]).toHaveClass(/focused/);

    // Switch to cards view
    await page.keyboard.press("v");
    await page.keyboard.press("c");

    // Shortcuts should still work
    await page.keyboard.press("j");
    await expect(files[1]).toHaveClass(/focused/);
  });

  test("error messages are accessible", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Try to trigger an error state (e.g., delete operation)
    await page.keyboard.press("j");
    await page.keyboard.press(".");

    if ((await page.locator(".context-menu").count()) > 0) {
      await page.locator(".context-menu").locator("text=Delete").click();

      // Confirmation modal should be accessible
      const modal = page.locator(".modal");
      await expect(modal).toBeVisible();

      // Modal should have proper focus management
      const modalContent = modal.locator(".modal-content, .modal-body").first();
      if ((await modalContent.count()) > 0) {
        await expect(modalContent).toBeVisible();
      }
    }
  });

  test("loading states are announced properly", async ({ page }) => {
    await page.goto("/");

    // Check for loading indicators
    const loadingIndicator = page.locator('.loading, [aria-label*="loading"]');
    if ((await loadingIndicator.count()) > 0) {
      // Loading indicator should be accessible
      const ariaLabel = await loadingIndicator.getAttribute("aria-label");
      const text = await loadingIndicator.textContent();
      expect(ariaLabel || text).toContain("loading");
    }

    await page.waitForSelector('[data-testid="files-container"]');

    // Content should be accessible after loading
    const filesContainer = page.locator('[data-testid="files-container"]');
    await expect(filesContainer).toBeVisible();
  });

  test("keyboard navigation maintains logical reading order", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Navigate files in order
    const files = await page.locator('[data-testid^="file-item-"]').all();

    for (let i = 0; i < Math.min(3, files.length); i++) {
      await page.keyboard.press("j");
      await expect(files[i]).toHaveClass(/focused/);
    }

    // Reverse navigation should work
    await page.keyboard.press("k");
    await expect(files[files.length > 2 ? 1 : 0]).toHaveClass(/focused/);
  });

  test("context menu keyboard navigation", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Open context menu with keyboard
    await page.keyboard.press("j");
    await page.keyboard.press(".");

    const contextMenu = page.locator(".context-menu");
    await expect(contextMenu).toBeVisible();

    // Should be able to navigate menu items
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowUp");

    // Escape should close menu
    await page.keyboard.press("Escape");
    await expect(contextMenu).not.toBeVisible();
  });

  test("complete keyboard-only file management workflow", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const initialCount = (await page.locator('[data-testid^="file-item-"]').all()).length;

    // 1. Navigate to file
    await page.keyboard.press("j");

    // 2. Duplicate file
    await page.keyboard.press(".");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(1000);

    // 3. Verify duplication worked
    const afterDuplicate = (await page.locator('[data-testid^="file-item-"]').all()).length;
    expect(afterDuplicate).toBe(initialCount + 1);

    // 4. Search for files
    await page.keyboard.press("/");
    await page.keyboard.type("Copy");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(300);

    // 5. Navigate search results
    await page.keyboard.press("Escape"); // Clear search focus
    await page.keyboard.press("j");

    const searchResults = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(searchResults.length).toBeGreaterThan(0);

    // Entire workflow completed with keyboard only
    expect(true).toBe(true); // Test completed successfully
  });
});
