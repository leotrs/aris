/**
 * @file E2E tests for live RSM demo rendering on the landing page
 */

import { test, expect } from "@playwright/test";

test.describe("RSM Demo Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    // Navigate to demo section
    await page.click('a[href="#demo"]');
    await expect(page.locator("#demo")).toBeInViewport();
  });

  test("should display demo section with controls", async ({ page }) => {
    // Check demo section structure
    await expect(page.locator(".demo-section")).toBeVisible();
    await expect(page.locator("text=Introducing Readable Science Markup (RSM)")).toBeVisible();

    // Check tab controls
    await expect(page.locator('[data-testid="tab-simple"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-complex"]')).toBeVisible();

    // Check view mode controls
    await expect(page.locator('[data-testid="view-markup"]')).toBeVisible();
    await expect(page.locator('[data-testid="view-output"]')).toBeVisible();
    await expect(page.locator('[data-testid="view-both"]')).toBeVisible();
  });

  test("should make API calls to render RSM content", async ({ page }) => {
    // Mock the render API to capture requests
    const renderRequests = [];
    await page.route("**/render", async (route) => {
      const request = route.request();
      const requestBody = JSON.parse(await request.postData());
      renderRequests.push(requestBody);

      // Return mock HTML content
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("<div class='rendered-content'><h1>Live Rendered Content</h1></div>"),
      });
    });

    // Wait for page to load and make render calls
    await page.waitForTimeout(2000);

    // Should have made render calls for both simple and complex examples
    expect(renderRequests.length).toBeGreaterThanOrEqual(2);

    // Check that requests contain RSM source content
    const sources = renderRequests.map((req) => req.source);
    expect(sources.some((source) => source.includes("# The Future of Academic Publishing"))).toBe(
      true
    );
    expect(sources.some((source) => source.includes("# Advanced Research Methods"))).toBe(true);
  });

  test("should display live rendered content in output panels", async ({ page }) => {
    // Mock successful render API
    await page.route("**/render", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(
          "<div class='live-rendered'><h1>Live RSM Content</h1><p>This content was rendered by the API</p></div>"
        ),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');

    // Wait for render calls to complete
    await page.waitForTimeout(2000);

    // Check that live content appears in output panel
    await expect(page.locator(".output-content")).toContainText("Live RSM Content");
    await expect(page.locator(".output-content")).toContainText(
      "This content was rendered by the API"
    );
  });

  test("should show loading states during rendering", async ({ page }) => {
    // Mock slow render API
    await page.route("**/render", async (route) => {
      // Delay response to test loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("<div><h1>Delayed Content</h1></div>"),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');

    // Should show loading indicators
    await expect(page.locator('[data-testid="demo-loading"]')).toBeVisible();

    // Wait for loading to complete
    await expect(page.locator('[data-testid="demo-loading"]')).not.toBeVisible();
  });

  test("should handle API errors gracefully with fallback content", async ({ page }) => {
    // Mock API failure
    await page.route("**/render", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Render service unavailable" }),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');

    // Wait for error handling
    await page.waitForTimeout(2000);

    // Should show fallback static content
    await expect(page.locator(".output-content")).toContainText(
      "The Future of Academic Publishing"
    );

    // Should indicate demo unavailable
    await expect(page.locator('[data-testid="demo-error"]')).toBeVisible();
    await expect(page.locator("text=Demo unavailable")).toBeVisible();
  });

  test("should switch between simple and complex examples", async ({ page }) => {
    // Mock render API
    let _renderCount = 0;
    await page.route("**/render", async (route) => {
      const requestBody = JSON.parse(await route.request().postData());
      _renderCount++;

      // Return different content based on request
      const content = requestBody.source.includes("Advanced Research Methods")
        ? "<div><h1>Complex Example Output</h1></div>"
        : "<div><h1>Simple Example Output</h1></div>";

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(content),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');

    // Wait for initial render
    await page.waitForTimeout(1000);

    // Should start with simple tab active
    await expect(page.locator('[data-testid="tab-simple"]')).toHaveClass(/active/);
    await expect(page.locator(".output-content")).toContainText("Simple Example Output");

    // Click complex tab
    await page.click('[data-testid="tab-complex"]');

    // Should switch to complex content
    await expect(page.locator('[data-testid="tab-complex"]')).toHaveClass(/active/);
    await expect(page.locator(".output-content")).toContainText("Complex Example Output");
  });

  test("should switch between view modes", async ({ page }) => {
    // Mock render API
    await page.route("**/render", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("<div><h1>Rendered Output</h1></div>"),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');
    await page.waitForTimeout(1000);

    // Test "Both" view (default)
    await expect(page.locator(".markup-panel")).toBeVisible();
    await expect(page.locator(".output-panel")).toBeVisible();

    // Test "Markup" only view
    await page.click('[data-testid="view-markup"]');
    await expect(page.locator(".markup-panel")).toBeVisible();
    await expect(page.locator(".output-panel")).not.toBeVisible();

    // Test "Output" only view
    await page.click('[data-testid="view-output"]');
    await expect(page.locator(".markup-panel")).not.toBeVisible();
    await expect(page.locator(".output-panel")).toBeVisible();

    // Back to "Both" view
    await page.click('[data-testid="view-both"]');
    await expect(page.locator(".markup-panel")).toBeVisible();
    await expect(page.locator(".output-panel")).toBeVisible();
  });

  test("should handle network timeout gracefully", async ({ page }) => {
    // Mock timeout scenario
    await page.route("**/render", async (_route) => {
      // Never resolve to simulate timeout
      await new Promise(() => {});
    });

    await page.reload();
    await page.click('a[href="#demo"]');

    // Should show loading initially
    await expect(page.locator('[data-testid="demo-loading"]')).toBeVisible();

    // Should eventually timeout and show fallback
    await page.waitForTimeout(10000); // Wait for timeout
    await expect(page.locator('[data-testid="demo-error"]')).toBeVisible();
    await expect(page.locator("text=showing static preview")).toBeVisible();
  });

  test("should prevent duplicate API calls for same content", async ({ page }) => {
    let renderCallCount = 0;
    await page.route("**/render", async (route) => {
      renderCallCount++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("<div><h1>Cached Content</h1></div>"),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');
    await page.waitForTimeout(1000);

    const initialCallCount = renderCallCount;

    // Switch tabs back and forth
    await page.click('[data-testid="tab-complex"]');
    await page.waitForTimeout(500);
    await page.click('[data-testid="tab-simple"]');
    await page.waitForTimeout(500);

    // Should not make additional calls for same content (cached)
    expect(renderCallCount).toBe(initialCallCount);
  });

  test("should work on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Mock render API
    await page.route("**/render", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify("<div><h1>Mobile Content</h1></div>"),
      });
    });

    await page.reload();
    await page.click('a[href="#demo"]');
    await page.waitForTimeout(1000);

    // Should show mobile-friendly view controls
    await expect(page.locator('[data-testid="view-markup"]')).toContainText("Show Markup");
    await expect(page.locator('[data-testid="view-output"]')).toContainText("Show Output");

    // Both view should not be available on mobile
    await expect(page.locator('[data-testid="view-both"]')).not.toBeVisible();

    // Content should render properly
    await expect(page.locator(".output-content")).toContainText("Mobile Content");
  });
});
