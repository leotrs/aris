import { test, expect } from "@playwright/test";

test.describe("Stable User Visual Tests @visual", () => {
  // Use a fixed test user for consistent visual regression testing
  const TEST_USER_EMAIL = "testuser@aris.pub";
  const TEST_USER_PASSWORD = "eIrdA38eW1guWTVpJNlS3VwP6eszUIGOiWqj1re3inM";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display consistent file list for stable test user", async ({ page }) => {
    // Check if on login page and login
    const loginButton = page.locator('[data-testid="login-button"]');
    if (await loginButton.isVisible()) {
      await page.fill('[data-testid="email-input"]', TEST_USER_EMAIL);
      await page.fill('[data-testid="password-input"]', TEST_USER_PASSWORD);
      await page.click('[data-testid="login-button"]');
    }

    // Wait for navigation to complete
    await page.waitForURL("/");

    // Wait for file list to load
    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    // Take screenshot of stable file list
    await expect(page).toHaveScreenshot("stable-user-file-list.png", {
      fullPage: true,
    });

    // Count files to ensure stability
    const fileCount = await page.locator('[data-testid^="file-item"]').count();
    expect(fileCount).toBeGreaterThan(0);

    // Check for expected test files
    const fileTitles = await page.locator('[data-testid="file-title"]').allTextContents();
    expect(fileTitles.some((title) => title.includes("Test"))).toBe(true);
  });

  test("should show consistent hover states for file menu triggers", async ({ page }) => {
    // Login
    const loginButton = page.locator('[data-testid="login-button"]');
    if (await loginButton.isVisible()) {
      await page.fill('[data-testid="email-input"]', TEST_USER_EMAIL);
      await page.fill('[data-testid="password-input"]', TEST_USER_PASSWORD);
      await page.click('[data-testid="login-button"]');
    }

    await page.waitForURL("/");
    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const firstFile = page.locator('[data-testid^="file-item"]').first();

    // Screenshot before hover
    await expect(page).toHaveScreenshot("file-before-hover.png");

    // Hover over first file
    await firstFile.hover();
    await page.waitForTimeout(500); // Wait for hover animations

    // Screenshot during hover
    await expect(page).toHaveScreenshot("file-during-hover.png");

    // Menu trigger should be visible
    await expect(page.locator('[data-testid="trigger-button"]')).toBeVisible();
  });

  test("should display consistent context menu appearance", async ({ page }) => {
    // Login
    const loginButton = page.locator('[data-testid="login-button"]');
    if (await loginButton.isVisible()) {
      await page.fill('[data-testid="email-input"]', TEST_USER_EMAIL);
      await page.fill('[data-testid="password-input"]', TEST_USER_PASSWORD);
      await page.click('[data-testid="login-button"]');
    }

    await page.waitForURL("/");
    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const firstFile = page.locator('[data-testid^="file-item"]').first();

    // Hover and click to open menu
    await firstFile.hover();
    await page.click('[data-testid="trigger-button"]');

    // Wait for menu to appear
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();
    await page.waitForTimeout(300); // Wait for any animations

    // Screenshot of open menu
    await expect(page).toHaveScreenshot("context-menu-open.png");

    // Verify menu content is consistent
    const menuItems = page.locator('[data-testid="context-menu"] [role="menuitem"]');
    const menuItemCount = await menuItems.count();
    expect(menuItemCount).toBeGreaterThan(0);
  });

  test("should handle responsive layout consistently", async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1280, height: 720 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 667 }, // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Login if needed
      const loginButton = page.locator('[data-testid="login-button"]');
      if (await loginButton.isVisible()) {
        await page.fill('[data-testid="email-input"]', TEST_USER_EMAIL);
        await page.fill('[data-testid="password-input"]', TEST_USER_PASSWORD);
        await page.click('[data-testid="login-button"]');
      }

      await page.waitForURL("/");
      await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

      // Take screenshot for each viewport
      await expect(page).toHaveScreenshot(`responsive-${viewport.width}x${viewport.height}.png`);
    }
  });

  test("should maintain visual consistency after interactions", async ({ page }) => {
    // Login
    const loginButton = page.locator('[data-testid="login-button"]');
    if (await loginButton.isVisible()) {
      await page.fill('[data-testid="email-input"]', TEST_USER_EMAIL);
      await page.fill('[data-testid="password-input"]', TEST_USER_PASSWORD);
      await page.click('[data-testid="login-button"]');
    }

    await page.waitForURL("/");
    await expect(page.locator('[data-testid^="file-item"]')).toBeVisible();

    const firstFile = page.locator('[data-testid^="file-item"]').first();

    // Perform a series of interactions
    await firstFile.hover();
    await page.click('[data-testid="trigger-button"]');
    await expect(page.locator('[data-testid="context-menu"]')).toBeVisible();

    // Close menu
    await page.click("body");
    await expect(page.locator('[data-testid="context-menu"]')).not.toBeVisible();

    // Final state should be clean
    await expect(page).toHaveScreenshot("after-interactions.png");
  });
});
