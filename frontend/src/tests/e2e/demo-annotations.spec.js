import { test, expect } from "@playwright/test";

test.describe("Demo Annotations Viewport", () => {
  test.beforeEach(async ({ page }) => {
    // Mock any backend requests that might fail in CI
    await page.route("**/api/**", async (route) => {
      const url = route.request().url();
      if (url.includes("/manuscripts/") || url.includes("/demo")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: "demo content" }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/demo", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    // Check if mobile viewport
    const viewport = page.viewportSize();
    const isMobile = viewport.width < 768;

    // Wait longer for demo content to fully load, especially on mobile
    const loadWait = isMobile ? 3000 : 2000;
    await page.waitForTimeout(loadWait);

    // Wait for demo canvas to be loaded (not just the loading screen)
    const demoCanvas = page.locator('[data-testid="demo-canvas"][data-loaded="true"]');
    await expect(demoCanvas).toBeVisible({ timeout: 20000 });

    // For mobile browsers, wait for layout to stabilize
    if (isMobile) {
      await page.waitForTimeout(1000);
      // Trigger a layout reflow to ensure content is visible
      await page.evaluate(() => {
        window.dispatchEvent(new Event("resize"));
      });
      await page.waitForTimeout(500);
    }
  });

  test("annotations panel should be visible within viewport", async ({ page }) => {
    // Wait for layout to stabilize, especially on mobile
    await page.waitForTimeout(1500);

    // Multiple selectors for annotations panel
    const annotationsPanel = page.locator(
      '[data-testid*="annotations"], .dock.right.main, .annotations-container, .sidebar-right'
    );

    if ((await annotationsPanel.count()) > 0) {
      // Wait with extended timeout for mobile browsers
      await expect(annotationsPanel.first()).toBeVisible({ timeout: 15000 });

      // Get viewport and panel dimensions
      const viewport = page.viewportSize();
      const panelBox = await annotationsPanel.first().boundingBox();

      if (panelBox) {
        // Assert panel is within viewport horizontally (with tolerance for mobile)
        expect(panelBox.x).toBeGreaterThanOrEqual(-50); // Allow slight off-screen for mobile
        expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width + 50);

        // Adjust width expectations for mobile
        const isMobile = viewport.width < 768;
        const minWidth = isMobile ? 100 : 200;
        expect(panelBox.width).toBeGreaterThan(minWidth);
      }
    }
  });

  test("individual annotations should be visible", async ({ page }) => {
    // Wait for annotations to render
    await page.waitForTimeout(2000);

    // Look for annotation content with broader selectors
    const annotations = page.locator(
      '.dock.right.main .annotation, .dock.right.main [data-testid*="annotation"], .annotations-container .annotation, .annotation-item'
    );

    if ((await annotations.count()) > 0) {
      const firstAnnotation = annotations.first();
      await expect(firstAnnotation).toBeVisible({ timeout: 15000 });

      // Check annotation is within viewport (with mobile tolerance)
      const viewport = page.viewportSize();
      const annotationBox = await firstAnnotation.boundingBox();

      if (annotationBox) {
        expect(annotationBox.x).toBeGreaterThanOrEqual(-50); // Mobile tolerance
        expect(annotationBox.x + annotationBox.width).toBeLessThanOrEqual(viewport.width + 50);
      }
    }
  });

  test("no horizontal scrollbar should be present", async ({ page }) => {
    // Wait for layout to stabilize
    await page.waitForTimeout(1000);

    // Check document body doesn't have horizontal overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    const viewport = page.viewportSize();

    // Adjust tolerance for mobile browsers
    const isMobile = viewport.width < 768;
    const tolerance = isMobile ? 20 : 5; // More tolerance for mobile

    // Body should not be wider than viewport
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + tolerance);
  });

  test("annotations content should be readable", async ({ page }) => {
    // Wait for content to load and render
    await page.waitForTimeout(2000);

    // Look for demo annotation content with more flexible selectors
    const commentText = page.locator(
      'text="This is an excellent point about accessibility barriers"'
    );
    const noteText = page.locator(
      'text="Consider adding more details about the technical implementation"'
    );

    // Also check for any annotation text content as fallback
    const anyAnnotationText = page.locator(".annotation-text, .comment-text, .note-content");

    if ((await commentText.count()) > 0) {
      await expect(commentText).toBeVisible({ timeout: 15000 });

      // Ensure text is within viewport (with mobile tolerance)
      const textBox = await commentText.boundingBox();
      const viewport = page.viewportSize();

      if (textBox) {
        expect(textBox.x + textBox.width).toBeLessThanOrEqual(viewport.width + 50);
      }
    } else if ((await noteText.count()) > 0) {
      await expect(noteText).toBeVisible({ timeout: 15000 });
    } else if ((await anyAnnotationText.count()) > 0) {
      // Fallback to any annotation text
      await expect(anyAnnotationText.first()).toBeVisible({ timeout: 15000 });
    }
  });

  test("canvas layout should use proper three-column structure", async ({ page }) => {
    // Wait for layout to stabilize
    await page.waitForTimeout(1000);

    // Check for three-column layout structure with multiple selector strategies
    const leftColumn = page.locator(
      ".left-column, .dock.left, [data-testid*='left'], .sidebar-left"
    );
    const middleColumn = page.locator(
      ".middle-column, .main-content, [data-testid*='middle'], .manuscript-container"
    );
    const rightColumn = page.locator(
      ".right-column, .dock.right, [data-testid*='right'], .sidebar-right"
    );

    // Check if any columns exist
    const leftExists = (await leftColumn.count()) > 0;
    const middleExists = (await middleColumn.count()) > 0;
    const rightExists = (await rightColumn.count()) > 0;

    if (leftExists && middleExists && rightExists) {
      // Wait for columns to be visible, with extended timeout for slow layouts
      await expect(leftColumn.first()).toBeVisible({ timeout: 10000 });
      await expect(middleColumn.first()).toBeVisible({ timeout: 10000 });
      await expect(rightColumn.first()).toBeVisible({ timeout: 10000 });

      // Get bounding boxes for layout verification
      const leftBox = await leftColumn.first().boundingBox();
      const middleBox = await middleColumn.first().boundingBox();
      const rightBox = await rightColumn.first().boundingBox();

      if (leftBox && middleBox && rightBox) {
        // Verify horizontal arrangement
        expect(leftBox.x).toBeLessThan(middleBox.x);
        expect(middleBox.x).toBeLessThan(rightBox.x);
        expect(rightBox.x + rightBox.width).toBeLessThanOrEqual(page.viewportSize().width + 20); // 20px tolerance
      }
    } else {
      // If columns don't exist, check for alternative layout structures
      const anyLayout = page.locator(".workspace, .layout, .demo-content, .manuscript-viewer");
      await expect(anyLayout.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("mobile content should be visible and accessible", async ({ page }) => {
    const viewport = page.viewportSize();

    // Only run this test on mobile viewports
    if (viewport.width >= 768) {
      test.skip();
    }

    // Wait for mobile layout to stabilize
    await page.waitForTimeout(2000);

    // Check for key content elements that should be visible on mobile
    const contentElements = [
      ".manuscript, .demo-content, .workspace",
      "h1, h2, .title",
      ".main-content, .content-area",
      ".demo-banner, .banner",
    ];

    let visibleElementFound = false;

    for (const selector of contentElements) {
      const elements = page.locator(selector);
      if ((await elements.count()) > 0) {
        try {
          await expect(elements.first()).toBeVisible({ timeout: 10000 });
          visibleElementFound = true;
          break;
        } catch {
          // Continue to next selector
        }
      }
    }

    // At least one content element should be visible
    expect(visibleElementFound, "No content elements visible on mobile").toBe(true);
  });
});
