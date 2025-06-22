import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession } from "../../utils/auth-helpers.js";
import { getTestUsers } from "../../utils/test-config.js";

test.describe("Responsive Visual Testing @visual", () => {
  let testUsers;

  test.beforeAll(() => {
    testUsers = getTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
  });

  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 800 },
    { name: "large-desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`Home page layout on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await page.goto("/home");
      await page.waitForSelector('[data-testid="files-container"]');

      // Take full page screenshot
      await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, { fullPage: true });

      // Screenshot specific components
      await expect(page.locator('[data-testid="files-container"]')).toHaveScreenshot(
        `files-container-${viewport.name}.png`
      );

      // Test navigation on smaller screens
      if (viewport.width < 768) {
        const mobileMenu = page.locator('[data-testid="mobile-menu-trigger"]');
        if (await mobileMenu.isVisible()) {
          await mobileMenu.click();
          await expect(page.locator('[data-testid="mobile-navigation"]')).toHaveScreenshot(
            `mobile-nav-${viewport.name}.png`
          );
        }
      }
    });

    test(`Workspace layout on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await page.goto("/home");

      // Create a test file if needed
      const createButton = page.locator('[data-testid="create-file-button"]');
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.fill('[data-testid="file-title-input"]', `Responsive Test ${viewport.name}`);
        await page.click('[data-testid="create-file-submit"]');
        await page.waitForURL(/\/workspace/);
      }

      // Screenshot workspace layout
      await expect(page).toHaveScreenshot(`workspace-${viewport.name}.png`, { fullPage: true });

      // Test editor responsiveness
      const editor = page.locator('[data-testid="rsm-editor"]');
      if (await editor.isVisible()) {
        await expect(editor).toHaveScreenshot(`editor-${viewport.name}.png`);
      }

      // Test preview responsiveness
      const preview = page.locator('[data-testid="manuscript-content"]');
      if (await preview.isVisible()) {
        await expect(preview).toHaveScreenshot(`preview-${viewport.name}.png`);
      }
    });

    test(`Modal responsiveness on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await page.goto("/home");

      // Trigger modal if available
      const createButton = page.locator('[data-testid="create-file-button"]');
      if (await createButton.isVisible()) {
        await createButton.click();

        // Screenshot modal at different viewport sizes
        await expect(page.locator('[data-testid="create-file-modal"]')).toHaveScreenshot(
          `modal-${viewport.name}.png`
        );
      }
    });

    test(`Form layouts on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Test login form responsiveness
      await page.goto("/login");
      await expect(page).toHaveScreenshot(`login-form-${viewport.name}.png`);

      // Test registration form responsiveness
      await page.goto("/register");
      await expect(page).toHaveScreenshot(`register-form-${viewport.name}.png`);
    });
  }

  test("Responsive breakpoint transitions", async ({ page }) => {
    // Start with desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/home");

    // Gradually reduce width to test breakpoints
    const breakpoints = [1024, 768, 640, 480, 375];

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 600 });
      await page.waitForTimeout(500); // Wait for CSS transitions

      await expect(page).toHaveScreenshot(`breakpoint-${width}px.png`);
    }
  });

  test("Text scaling and readability", async ({ page }) => {
    const scales = [
      { name: "normal", scale: 1 },
      { name: "large", scale: 1.25 },
      { name: "extra-large", scale: 1.5 },
    ];

    for (const scale of scales) {
      await page.goto("/home");

      // Simulate text scaling
      await page.addStyleTag({
        content: `
          * {
            font-size: calc(var(--font-size, 1rem) * ${scale.scale}) !important;
          }
        `,
      });

      await page.waitForTimeout(200);
      await expect(page).toHaveScreenshot(`text-scale-${scale.name}.png`);
    }
  });

  test("High contrast and accessibility visual check", async ({ page }) => {
    await page.goto("/home");

    // Apply high contrast styles
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            border-color: #000 !important;
            color: #000 !important;
            background-color: #fff !important;
          }
          button, input {
            border: 2px solid #000 !important;
          }
        }
      `,
    });

    // Force high contrast
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });

    await expect(page).toHaveScreenshot("high-contrast.png");
  });

  test("Print layout visual check", async ({ page }) => {
    await page.goto("/home");

    // Create a test file with content
    const createButton = page.locator('[data-testid="create-file-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.fill('[data-testid="file-title-input"]', "Print Test Document");
      await page.click('[data-testid="create-file-submit"]');
      await page.waitForURL(/\/workspace/);
    }

    // Apply print styles
    await page.emulateMedia({ media: "print" });

    await expect(page).toHaveScreenshot("print-layout.png");
  });

  test("Component overflow handling", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // Very narrow

    await page.goto("/home");

    // Test how components handle very narrow screens
    await expect(page).toHaveScreenshot("narrow-overflow.png");

    // Test with very wide content
    await page.setViewportSize({ width: 3000, height: 600 });
    await expect(page).toHaveScreenshot("wide-layout.png");
  });

  test("Touch target sizing on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/home");

    // Add visual indicators for touch targets
    await page.addStyleTag({
      content: `
        button, [role="button"], input, a {
          outline: 2px dashed red !important;
          outline-offset: 2px !important;
        }
      `,
    });

    await expect(page).toHaveScreenshot("touch-targets-mobile.png");
  });

  test("Orientation change visual consistency", async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/home");
    await expect(page).toHaveScreenshot("mobile-portrait.png");

    // Landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500); // Wait for reflow
    await expect(page).toHaveScreenshot("mobile-landscape.png");

    // Tablet portrait
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot("tablet-portrait.png");

    // Tablet landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page).toHaveScreenshot("tablet-landscape.png");
  });

  test("Responsive images and media", async ({ page }) => {
    await page.goto("/home");

    const viewports = [
      { width: 375, height: 667, name: "mobile" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 1280, height: 800, name: "desktop" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Check for responsive images
      const images = await page.locator("img").count();
      if (images > 0) {
        await expect(page.locator("img").first()).toHaveScreenshot(
          `responsive-image-${viewport.name}.png`
        );
      }
    }
  });
});
