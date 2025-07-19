import { test, expect } from "@playwright/test";

test.describe("Citation Modal Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ication/abc123", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    // Wait for cite button to be visible and clickable
    await expect(page.locator('[data-testid="cite-button"]')).toBeVisible();
  });

  test("citation modal should open and stay open when clicking cite button @demo-content", async ({
    page,
  }) => {
    // Open citation modal
    await page.click('[data-testid="cite-button"]');

    // Modal should be visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Modal should have citation content
    await expect(page.locator('[role="dialog"]')).toContainText(
      "Dr. Sarah Chen, Prof. Michael Rodriguez"
    );
    await expect(page.locator('[role="dialog"]')).toContainText(
      "Sample Research Paper: The Future of Web-Native Publishing"
    );
  });

  test("citation modal should NOT close when clicking format tabs @demo-content", async ({
    page,
  }) => {
    // Open citation modal
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click BibTeX tab - modal should remain open
    await page.click('.sc-wrapper button:has-text("BibTeX")');
    await page.waitForTimeout(200); // Allow click to process
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click Chicago tab - modal should remain open
    await page.click('.sc-wrapper button:has-text("Chicago")');
    await page.waitForTimeout(200); // Allow click to process
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click MLA tab - modal should remain open
    await page.click('.sc-wrapper button:has-text("MLA")');
    await page.waitForTimeout(200); // Allow click to process
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test("citation modal should NOT close when clicking copy button @demo-content", async ({
    page,
  }) => {
    // Open citation modal
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click copy button - modal should remain open
    await page.click('[data-testid="copy-citation-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test("citation modal should close only when clicking close button or backdrop @demo-content", async ({
    page,
  }) => {
    // Open citation modal
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click backdrop to close (click on the modal overlay, not the content)
    await page.click(".modal", { position: { x: 50, y: 50 } });
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // Open again
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Press escape to close
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
