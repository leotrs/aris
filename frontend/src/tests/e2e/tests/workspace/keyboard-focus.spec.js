import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession } from "../../utils/auth-helpers.js";
import { createNewFile, openFile } from "../../utils/manuscript-helpers.js";
import testUsers from "../../fixtures/test-users.json" with { type: "json" };

test.describe("Workspace Keyboard Focus", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
  });

  test("Page Up/Down keys should work immediately after navigation to workspace", async ({
    page,
  }) => {
    // Create a file from home page
    const fileName = `Keyboard Focus Test ${Date.now()}`;
    await createNewFile(page, { title: fileName });

    // Go back to home
    await page.goto("/home");

    // Navigate to workspace by clicking on the file
    await openFile(page, fileName);

    // Wait for workspace to be fully loaded
    await expect(page.locator('[data-testid="workspace-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="manuscript-container"]')).toBeVisible();

    // Get initial scroll position
    const initialScrollTop = await page.evaluate(() => {
      const container =
        document.querySelector('[data-testid="manuscript-container"]') ||
        document.querySelector(".manuscript-container") ||
        document.documentElement;
      return container.scrollTop;
    });

    // Try Page Down immediately (without clicking first)
    await page.keyboard.press("PageDown");

    // Wait a bit for potential scroll
    await page.waitForTimeout(100);

    // Check if scroll position changed
    const scrollTopAfterPageDown = await page.evaluate(() => {
      const container =
        document.querySelector('[data-testid="manuscript-container"]') ||
        document.querySelector(".manuscript-container") ||
        document.documentElement;
      return container.scrollTop;
    });

    // Page Down should work immediately without needing to click first
    expect(scrollTopAfterPageDown).toBeGreaterThan(initialScrollTop);

    // Also test Page Up
    await page.keyboard.press("PageUp");
    await page.waitForTimeout(100);

    const scrollTopAfterPageUp = await page.evaluate(() => {
      const container =
        document.querySelector('[data-testid="manuscript-container"]') ||
        document.querySelector(".manuscript-container") ||
        document.documentElement;
      return container.scrollTop;
    });

    // Should have scrolled back up
    expect(scrollTopAfterPageUp).toBeLessThan(scrollTopAfterPageDown);
  });

  test("Page Up/Down keys work after clicking (current behavior)", async ({ page }) => {
    // Create a file from home page
    const fileName = `Click Focus Test ${Date.now()}`;
    await createNewFile(page, { title: fileName });

    // Go back to home
    await page.goto("/home");

    // Navigate to workspace
    await openFile(page, fileName);

    // Wait for workspace to load
    await expect(page.locator('[data-testid="workspace-container"]')).toBeVisible();

    // Click somewhere on the page to give focus
    await page.click('[data-testid="manuscript-container"]');

    // Get initial scroll position
    const initialScrollTop = await page.evaluate(() => {
      const container =
        document.querySelector('[data-testid="manuscript-container"]') ||
        document.querySelector(".manuscript-container") ||
        document.documentElement;
      return container.scrollTop;
    });

    // Page Down after clicking should work
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(100);

    const scrollTopAfterPageDown = await page.evaluate(() => {
      const container =
        document.querySelector('[data-testid="manuscript-container"]') ||
        document.querySelector(".manuscript-container") ||
        document.documentElement;
      return container.scrollTop;
    });

    // Should scroll
    expect(scrollTopAfterPageDown).toBeGreaterThan(initialScrollTop);
  });

  test("Focus is properly set on manuscript container", async ({ page }) => {
    // Create and open a file
    const fileName = `Focus Test ${Date.now()}`;
    await createNewFile(page, { title: fileName });

    await page.goto("/home");
    await openFile(page, fileName);

    // Wait for workspace to load
    await expect(page.locator('[data-testid="workspace-container"]')).toBeVisible();

    // Check if the manuscript container can receive focus
    const isFocusable = await page.evaluate(() => {
      const container =
        document.querySelector('[data-testid="manuscript-container"]') ||
        document.querySelector(".manuscript-container");
      if (!container) return false;

      // Check if element has tabindex or is naturally focusable
      return (
        container.tabIndex >= 0 ||
        container.hasAttribute("tabindex") ||
        ["input", "textarea", "button", "select", "a"].includes(container.tagName.toLowerCase())
      );
    });

    // The container should be focusable for keyboard events to work
    expect(isFocusable).toBe(true);
  });

  test("Document has proper focus management", async ({ page }) => {
    // Create and open a file
    const fileName = `Document Focus Test ${Date.now()}`;
    await createNewFile(page, { title: fileName });

    await page.goto("/home");
    await openFile(page, fileName);

    // Wait for workspace to load
    await expect(page.locator('[data-testid="workspace-container"]')).toBeVisible();

    // Check what element has focus initially
    const activeElement = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        tagName: active?.tagName,
        className: active?.className,
        id: active?.id,
        testId: active?.getAttribute("data-testid"),
      };
    });

    console.log("Active element after navigation:", activeElement);

    // The active element should be something that can handle keyboard events
    // or the manuscript container should be programmatically focused
    const hasValidFocus =
      activeElement.testId === "manuscript-container" ||
      activeElement.tagName === "BODY" ||
      activeElement.tagName === "HTML";

    expect(hasValidFocus).toBe(true);
  });
});
