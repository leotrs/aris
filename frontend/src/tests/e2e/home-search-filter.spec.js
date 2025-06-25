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

    // Create diverse test files for searching/filtering
    await fileHelpers.ensureTestFiles(10, {
      titles: [
        "Research Paper Alpha",
        "Data Analysis Beta",
        "Machine Learning Study",
        "Statistical Methods",
        "Alpha Testing Protocol",
        "Beta Version Notes",
        "Research Methodology",
        "Analysis Framework",
        "Study Results",
        "Protocol Documentation",
      ],
    });
  });

  test("search filters file list by title with live results", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const initialFiles = await page.locator('[data-testid^="file-item-"]').all();
    expect(initialFiles.length).toBeGreaterThan(5);

    // Search for "Alpha"
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await searchInput.fill("Alpha");
    await searchInput.press("Enter");

    // Wait for filtering to apply
    await page.waitForTimeout(300);

    // Should show only files containing "Alpha"
    const filteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(filteredFiles.length).toBeLessThan(initialFiles.length);

    // Verify all visible files contain "Alpha"
    for (const file of filteredFiles) {
      const title = await file.locator(".file-title").textContent();
      expect(title.toLowerCase()).toContain("alpha");
    }
  });

  test("search is case insensitive", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();

    // Search with different cases
    await searchInput.fill("RESEARCH");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const upperCaseResults = await page.locator('[data-testid^="file-item-"]:visible').all();

    await searchInput.clear();
    await searchInput.fill("research");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const lowerCaseResults = await page.locator('[data-testid^="file-item-"]:visible').all();

    // Should return same number of results
    expect(upperCaseResults.length).toBe(lowerCaseResults.length);
    expect(upperCaseResults.length).toBeGreaterThan(0);
  });

  test("empty search shows all files", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const allFiles = await page.locator('[data-testid^="file-item-"]').all();

    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();

    // First apply a filter
    await searchInput.fill("Alpha");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const filteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(filteredFiles.length).toBeLessThan(allFiles.length);

    // Clear search
    await searchInput.clear();
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    // Should show all files again
    const restoredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(restoredFiles.length).toBe(allFiles.length);
  });

  test("column sorting works for title column", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Click title column header to sort
    const titleHeader = page.locator(".pane-header .col-header").filter({ hasText: "Title" });
    await titleHeader.click();

    await page.waitForTimeout(300);

    // Get file titles after sorting
    const fileTitles = await page
      .locator('[data-testid^="file-item-"] .file-title')
      .allTextContents();

    // Should be sorted alphabetically
    const sortedTitles = [...fileTitles].sort();
    expect(fileTitles).toEqual(sortedTitles);

    // Click again to reverse sort
    await titleHeader.click();
    await page.waitForTimeout(300);

    const reversedTitles = await page
      .locator('[data-testid^="file-item-"] .file-title')
      .allTextContents();
    const reverseSortedTitles = [...fileTitles].sort().reverse();
    expect(reversedTitles).toEqual(reverseSortedTitles);
  });

  test("column sorting works for date column", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Click date column header to sort
    const dateHeader = page
      .locator(".pane-header .col-header")
      .filter({ hasText: /Last edit|Date/ });
    await dateHeader.click();

    await page.waitForTimeout(300);

    // Verify sorting indicator is visible
    await expect(dateHeader.locator(".sort-indicator, .sort-icon")).toBeVisible();
  });

  test("tag-based filtering works with multiple selections", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Create or ensure files have tags first
    await fileHelpers.addTagsToFiles(["research", "analysis", "draft"]);

    // Open tag filter menu
    const tagsHeader = page.locator(".pane-header .col-header").filter({ hasText: "Tags" });
    if ((await tagsHeader.count()) > 0) {
      await tagsHeader.click();

      // Select tags for filtering
      const tagFilter = page.locator(".tag-filter, .multi-select");
      if ((await tagFilter.count()) > 0) {
        await tagFilter.locator("text=research").click();
        await page.waitForTimeout(300);

        // Should filter to only files with research tag
        const filteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();

        // Add another tag to filter
        await tagFilter.locator("text=analysis").click();
        await page.waitForTimeout(300);

        // Should show files with either tag
        const multiFilteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
        expect(multiFilteredFiles.length).toBeGreaterThanOrEqual(filteredFiles.length);
      }
    }
  });

  test("clear filters restores full file list", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');
    const allFiles = await page.locator('[data-testid^="file-item-"]').all();

    // Apply search filter
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await searchInput.fill("Research");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const filteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(filteredFiles.length).toBeLessThan(allFiles.length);

    // Clear filters (search input clear should trigger clearFilters)
    await searchInput.clear();
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const restoredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(restoredFiles.length).toBe(allFiles.length);
  });

  test("search and sorting work together", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Apply search filter first
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await searchInput.fill("Analysis");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const searchResults = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(searchResults.length).toBeGreaterThan(0);

    // Then apply sorting
    const titleHeader = page.locator(".pane-header .col-header").filter({ hasText: "Title" });
    await titleHeader.click();
    await page.waitForTimeout(300);

    // Get filtered and sorted titles
    const sortedFilteredTitles = await page
      .locator('[data-testid^="file-item-"]:visible .file-title')
      .allTextContents();

    // Should be both filtered and sorted
    expect(sortedFilteredTitles.length).toBe(searchResults.length);
    sortedFilteredTitles.forEach((title) => {
      expect(title.toLowerCase()).toContain("analysis");
    });

    // Should be in alphabetical order
    const sortedTitles = [...sortedFilteredTitles].sort();
    expect(sortedFilteredTitles).toEqual(sortedTitles);
  });

  test("search persists during navigation within results", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    // Apply search
    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();
    await searchInput.fill("Study");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const filteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(filteredFiles.length).toBeGreaterThan(0);

    // Navigate with keyboard
    await page.keyboard.press("j");
    await expect(filteredFiles[0]).toHaveClass(/focused/);

    // Search results should remain filtered
    const stillFilteredFiles = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(stillFilteredFiles.length).toBe(filteredFiles.length);
  });

  test("partial search matches work correctly", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();

    // Search for partial word
    await searchInput.fill("Meth");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const results = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(results.length).toBeGreaterThan(0);

    // Should match files containing "Methods" or "Methodology"
    for (const file of results) {
      const title = await file.locator(".file-title").textContent();
      expect(title.toLowerCase()).toMatch(/meth/);
    }
  });

  test("no results state handled gracefully", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="files-container"]');

    const searchInput = page.locator('input[type="search"], input[placeholder*="earch"]').first();

    // Search for something that won't match
    await searchInput.fill("XYZNonExistentTerm123");
    await searchInput.press("Enter");
    await page.waitForTimeout(300);

    const results = await page.locator('[data-testid^="file-item-"]:visible').all();
    expect(results.length).toBe(0);

    // Interface should still be functional
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });
});
