import { test, expect } from "@playwright/test";

test.describe("Citation Modal UI Improvements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ication/abc123", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    // Wait for cite button to be visible and clickable
    await expect(page.locator('[data-testid="cite-button"]')).toBeVisible();
  });

  test("citation modal should have proper header with title and close button @demo-content", async ({
    page,
  }) => {
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Modal should have a simple header with "Cite" title
    await expect(page.locator('[role="dialog"] .pane-header')).toBeVisible();
    await expect(page.locator('[role="dialog"] .header-title')).toContainText("Cite");

    // Should have close button in header
    await expect(page.locator('[data-testid="close-modal-button"]')).toBeVisible();

    // Close button should work
    await page.click('[data-testid="close-modal-button"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("copy button should show visual feedback when clicked @demo-content", async ({ page }) => {
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Initial state - should show copy icon (icon-only button)
    const copyButton = page.locator('[data-testid="copy-citation-button"]');
    await expect(copyButton).toBeVisible();

    // Click copy button
    await copyButton.click();

    // Should show success feedback (Check icon appears, copy-success class applied)
    await expect(copyButton).toHaveClass(/copy-success/);

    // Should revert back after timeout (copy-success class removed)
    await expect(copyButton).not.toHaveClass(/copy-success/, { timeout: 3000 });
  });

  test("modal should have improved information architecture @demo-content", async ({ page }) => {
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Wait for content to load
    await expect(page.locator(".citation-content")).toBeVisible();

    // Should have Links section (not SEO notice)
    const linksSection = page.locator('h4:has-text("Links")');
    await expect(linksSection).toBeVisible();

    // Should have permalink, SEO-optimized version, and premium link
    await expect(page.locator('.links-section .link:has-text("Permalink")')).toBeVisible();
    await expect(
      page.locator('.links-section .link:has-text("SEO-optimized version")')
    ).toBeVisible();
    await expect(page.locator('.links-section .link:has-text("Premium link")')).toBeVisible();

    // Should NOT have redundant export section
    await expect(page.locator('h4:has-text("Export to Reference Manager")')).not.toBeVisible();

    // Should have Publication Information section
    await expect(page.locator('h4:has-text("Publication Information")')).toBeVisible();
  });

  test("format selector should use existing SegmentedControl component @demo-content", async ({
    page,
  }) => {
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Should use SegmentedControl component class
    await expect(page.locator(".sc-wrapper, .segmented-control")).toBeVisible();

    // Should not use custom format-tabs class
    await expect(page.locator(".format-tabs")).not.toBeVisible();
  });
});
