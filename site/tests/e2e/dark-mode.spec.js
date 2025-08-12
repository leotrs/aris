/**
 * @file E2E tests for dark mode functionality
 */

import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("dark mode toggle works @core", async ({ page }) => {
    // 1. Verify toggle exists and is accessible (select the first visible one)
    const toggle = page.locator('[data-testid="dark-mode-toggle"]').first();
    await expect(toggle).toBeVisible();

    // 2. Click toggle and verify body class changes
    await toggle.click();
    await expect(page.locator("body")).toHaveClass(/dark-theme/);

    // 3. Verify persistence - refresh and check state maintained
    await page.reload();
    await expect(page.locator("body")).toHaveClass(/dark-theme/);

    // 4. Toggle back to light mode to ensure it works both ways
    const toggleAfterReload = page.locator('[data-testid="dark-mode-toggle"]').first();
    await toggleAfterReload.click();
    await expect(page.locator("body")).not.toHaveClass(/dark-theme/);
  });
});
