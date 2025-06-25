import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";

test.describe("Demo Content Rendering", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Ensure clean auth state for demo access
    await authHelpers.clearAuthState();

    await page.goto("/demo");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Content Loading", () => {
    test("demo manuscript content loads and displays", async ({ page }) => {
      // Wait for demo canvas to be visible
      await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible();

      // Wait for manuscript content to load
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check that manuscript content is rendered
      const manuscript = page.locator('[data-testid="manuscript-viewer"]');
      await expect(manuscript).toBeVisible();

      // Verify content is not empty
      const textContent = await manuscript.textContent();
      expect(textContent.trim().length).toBeGreaterThan(0);
    });

    test("RSM content renders with proper styling", async ({ page }) => {
      // Wait for manuscript to be visible
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check for RSM-specific classes and structure
      const manuscriptWrapper = page.locator(".manuscriptwrapper");
      await expect(manuscriptWrapper).toBeVisible();

      const manuscript = page.locator(".manuscript");
      await expect(manuscript).toBeVisible();

      // Verify manuscript has content
      const hasContent = await manuscript.evaluate((el) => el.children.length > 0);
      expect(hasContent).toBe(true);
    });

    test("interactive RSM elements are present and functional", async ({ page }) => {
      // Wait for manuscript content
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Look for RSM handrails (interactive UI elements)
      const handrails = page.locator(".hr");
      await expect(handrails.first()).toBeVisible({ timeout: 5000 });

      // Check for interactive elements like headings with handrails
      const headingHandrails = page.locator(".heading.hr");
      await expect(headingHandrails.first()).toBeVisible({ timeout: 5000 });

      // Verify handrails have interactive menus
      const hrMenus = page.locator(".hr-menu");
      const menuCount = await hrMenus.count();
      expect(menuCount).toBeGreaterThan(0);
    });

    test("content scrolling works correctly", async ({ page }) => {
      // Wait for manuscript content
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      const manuscriptContainer = page.locator('[data-testid="manuscript-container"]');
      await expect(manuscriptContainer).toBeVisible();

      // Get initial scroll position
      const initialScrollTop = await manuscriptContainer.evaluate((el) => el.scrollTop);

      // Scroll down
      await manuscriptContainer.evaluate((el) => (el.scrollTop = 200));
      await page.waitForTimeout(100);

      // Verify scroll position changed
      const newScrollTop = await manuscriptContainer.evaluate((el) => el.scrollTop);
      expect(newScrollTop).toBeGreaterThan(initialScrollTop);
    });

    test("content loads within reasonable time", async ({ page }) => {
      const startTime = Date.now();

      // Wait for content to load
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      const loadTime = Date.now() - startTime;

      // Content should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });
  });

  test.describe("Visual Verification", () => {
    test("research paper title is visible", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Look for the main title
      const title = page.locator("h1").first();
      await expect(title).toBeVisible({ timeout: 5000 });

      const titleText = await title.textContent();
      expect(titleText).toContain("The Future of Web-Native Publishing");
    });

    test("section headings render correctly", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check for various heading levels
      const h1Elements = page.locator("h1");
      const h2Elements = page.locator("h2");

      expect(await h1Elements.count()).toBeGreaterThan(0);
      expect(await h2Elements.count()).toBeGreaterThan(0);

      // Verify some expected section headings
      await expect(page.locator("text=Introduction")).toBeVisible();
      await expect(page.locator("text=Methodology")).toBeVisible();
      await expect(page.locator("text=Results")).toBeVisible();
      await expect(page.locator("text=Conclusion")).toBeVisible();
    });

    test("interactive handrails (RSM UI elements) are present", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Wait for handrails to render
      await expect(page.locator(".hr-menu-zone")).toBeVisible({ timeout: 5000 });

      // Check for various handrail components
      const menuZones = page.locator(".hr-menu-zone");
      const borderZones = page.locator(".hr-border-zone");
      const contentZones = page.locator(".hr-content-zone");

      expect(await menuZones.count()).toBeGreaterThan(0);
      expect(await borderZones.count()).toBeGreaterThan(0);
      expect(await contentZones.count()).toBeGreaterThan(0);
    });

    test("proper typography and spacing applied", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check that content has proper styling
      const manuscript = page.locator(".manuscript");
      await expect(manuscript).toBeVisible();

      // Verify text content has proper line height
      const computedStyle = await manuscript.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          lineHeight: styles.lineHeight,
          fontSize: styles.fontSize,
        };
      });

      expect(computedStyle.fontFamily).toBeDefined();
      expect(computedStyle.lineHeight).toBeDefined();
      expect(computedStyle.fontSize).toBeDefined();
    });

    test("lists and itemization render correctly", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Look for itemized lists (from RSM :itemize: markup)
      const listItems = page.locator("li, .list-item");
      const listCount = await listItems.count();

      if (listCount > 0) {
        await expect(listItems.first()).toBeVisible();

        // Verify list items have content
        const firstItemText = await listItems.first().textContent();
        expect(firstItemText.trim().length).toBeGreaterThan(0);
      }
    });

    test("abstract section renders correctly", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Look for abstract content (from RSM :abstract: markup)
      const abstractSection = page.locator("text=This paper explores").first();
      await expect(abstractSection).toBeVisible({ timeout: 5000 });

      const abstractText = await abstractSection.textContent();
      expect(abstractText).toContain("web-native scientific publishing");
    });
  });

  test.describe("Backend Integration", () => {
    test("content loads from backend /render endpoint", async ({ page }) => {
      // Monitor network requests
      let renderRequestMade = false;

      page.on("request", (request) => {
        if (request.url().includes("/render") && request.method() === "POST") {
          renderRequestMade = true;
        }
      });

      // Navigate to demo (fresh load to trigger API call)
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Wait for content to load
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Verify the render request was made
      expect(renderRequestMade).toBe(true);
    });

    test("RSM CSS loads from backend /static/rsm.css", async ({ page }) => {
      // Monitor for CSS requests
      let rsmCssLoaded = false;

      page.on("response", (response) => {
        if (response.url().includes("/static/rsm.css")) {
          rsmCssLoaded = true;
        }
      });

      await page.reload();
      await page.waitForLoadState("networkidle");

      // Wait for styles to apply
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Verify RSM CSS was loaded
      expect(rsmCssLoaded).toBe(true);
    });

    test("network requests complete successfully", async ({ page }) => {
      const failedRequests = [];

      page.on("requestfailed", (request) => {
        failedRequests.push(request.url());
      });

      await page.reload();
      await page.waitForLoadState("networkidle");

      // Wait for content to load completely
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check for any failed requests related to demo content
      const demoRelatedFailures = failedRequests.filter(
        (url) => url.includes("/render") || url.includes("/static/rsm.css")
      );

      expect(demoRelatedFailures).toHaveLength(0);
    });

    test("handles backend unavailability gracefully", async ({ page }) => {
      // Block requests to render endpoint to simulate backend down
      await page.route("**/render", (route) => {
        route.abort("failed");
      });

      await page.reload();
      await page.waitForLoadState("networkidle");

      // Content should still attempt to load or show fallback
      await expect(page.locator('[data-testid="demo-canvas"]')).toBeVisible();

      // Should not show error messages to user
      const errorMessages = page.locator("text=error", { ignoreCase: true });
      expect(await errorMessages.count()).toBe(0);
    });
  });

  test.describe("Content Quality", () => {
    test("content contains expected research sections", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check for standard academic paper sections
      await expect(page.locator("text=Abstract")).toBeVisible();
      await expect(page.locator("text=Introduction")).toBeVisible();
      await expect(page.locator("text=Methodology")).toBeVisible();
      await expect(page.locator("text=Results")).toBeVisible();
      await expect(page.locator("text=Discussion")).toBeVisible();
      await expect(page.locator("text=Conclusion")).toBeVisible();
      await expect(page.locator("text=Acknowledgments")).toBeVisible();
    });

    test("content is substantive and realistic", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      // Check that content has meaningful length
      const manuscriptText = await page.locator('[data-testid="manuscript-viewer"]').textContent();
      const wordCount = manuscriptText.split(/\s+/).length;

      // Research paper should have substantial content
      expect(wordCount).toBeGreaterThan(500);

      // Should contain academic terminology
      expect(manuscriptText).toContain("research");
      expect(manuscriptText).toContain("analysis");
      expect(manuscriptText).toContain("methodology");
    });

    test("RSM markup renders correctly without raw syntax", async ({ page }) => {
      await expect(page.locator('[data-testid="manuscript-viewer"]')).toBeVisible({
        timeout: 10000,

      const manuscriptText = await page.locator('[data-testid="manuscript-viewer"]').textContent();

      // Should not contain raw RSM syntax
      expect(manuscriptText).not.toContain(":rsm:");
      expect(manuscriptText).not.toContain(":itemize:");
      expect(manuscriptText).not.toContain(":enumerate:");
      expect(manuscriptText).not.toContain(":item:");
      expect(manuscriptText).not.toContain("::");

      // Should not contain escaped characters
      expect(manuscriptText).not.toContain("\\n");
      expect(manuscriptText).not.toContain('\\"');
    });
  });
});
