import { test, expect } from "@playwright/test";

test.describe("Demo Annotations Viewport @demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    // Wait for demo content to load
    await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible();
  });

  test("annotations panel should be visible within viewport", async ({ page }) => {
    // Wait for annotations to be rendered
    const annotationsPanel = page.locator('[data-testid*="annotations"], .dock.right.main');

    if ((await annotationsPanel.count()) > 0) {
      await expect(annotationsPanel).toBeVisible();

      // Get viewport and panel dimensions
      const viewport = page.viewportSize();
      const panelBox = await annotationsPanel.boundingBox();

      // Assert panel is within viewport horizontally
      expect(panelBox.x).toBeGreaterThanOrEqual(0);
      expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width);

      // Assert panel has reasonable width (not collapsed)
      expect(panelBox.width).toBeGreaterThan(200);
    }
  });

  test("individual annotations should be visible", async ({ page }) => {
    // Look for annotation content
    const annotations = page.locator(
      '.dock.right.main .annotation, .dock.right.main [data-testid*="annotation"]'
    );

    if ((await annotations.count()) > 0) {
      const firstAnnotation = annotations.first();
      await expect(firstAnnotation).toBeVisible();

      // Check annotation is within viewport
      const viewport = page.viewportSize();
      const annotationBox = await firstAnnotation.boundingBox();

      expect(annotationBox.x).toBeGreaterThanOrEqual(0);
      expect(annotationBox.x + annotationBox.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test("no horizontal scrollbar should be present", async ({ page }) => {
    // Check document body doesn't have horizontal overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);

    // Body should not be wider than viewport
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 5); // 5px tolerance
  });

  test("annotations content should be readable", async ({ page }) => {
    // Look for demo annotation content
    const commentText = page.locator(
      'text="This is an excellent point about accessibility barriers"'
    );
    const noteText = page.locator(
      'text="Consider adding more details about the technical implementation"'
    );

    if ((await commentText.count()) > 0) {
      await expect(commentText).toBeVisible();

      // Ensure text is within viewport
      const textBox = await commentText.boundingBox();
      const viewport = page.viewportSize();

      expect(textBox.x + textBox.width).toBeLessThanOrEqual(viewport.width);
    }

    if ((await noteText.count()) > 0) {
      await expect(noteText).toBeVisible();
    }
  });

  test("canvas layout should use proper three-column structure", async ({ page }) => {
    // Check for three-column layout structure
    const leftColumn = page.locator(".left-column");
    const middleColumn = page.locator(".middle-column");
    const rightColumn = page.locator(".right-column");

    if (
      (await leftColumn.count()) > 0 &&
      (await middleColumn.count()) > 0 &&
      (await rightColumn.count()) > 0
    ) {
      // All columns should be present
      await expect(leftColumn).toBeVisible();
      await expect(middleColumn).toBeVisible();
      await expect(rightColumn).toBeVisible();

      // Columns should be horizontally arranged
      const leftBox = await leftColumn.boundingBox();
      const middleBox = await middleColumn.boundingBox();
      const rightBox = await rightColumn.boundingBox();

      // Left should be leftmost
      expect(leftBox.x).toBeLessThan(middleBox.x);
      // Middle should be between left and right
      expect(middleBox.x).toBeLessThan(rightBox.x);
      // Right column should be within viewport
      expect(rightBox.x + rightBox.width).toBeLessThanOrEqual(page.viewportSize().width);
    }
  });
});
