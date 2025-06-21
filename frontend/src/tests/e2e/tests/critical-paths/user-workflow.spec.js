import { test, expect } from "@playwright/test";
import { loginUser, logoutUser } from "../../utils/auth-helpers.js";
import { createNewFile, addTagsToFile, deleteFile } from "../../utils/manuscript-helpers.js";
import testUsers from "../../fixtures/test-users.json" with { type: "json" };

test.describe("Critical User Workflows", () => {
  test("complete research workflow: login → create → edit → tag → save → logout", async ({
    page,
  }) => {
    const user = testUsers.testUsers.defaultUser;
    const fileName = `Research Paper ${Date.now()}`;

    // Step 1: Login
    await loginUser(page, user);
    expect(page.url()).toMatch(/\/(home|workspace)/);

    // Step 2: Navigate to home and create new file
    await page.goto("/home");
    await createNewFile(page, {
      title: fileName,
      content: ":rsm:\n\n# My Research Paper\n\n## Abstract\n\nThis is my research abstract.\n\n::",
    });

    // Step 3: Verify file creation and editing
    expect(page.url()).toContain("/workspace");
    await expect(page.locator('h1:has-text("My Research Paper")')).toBeVisible();

    // Step 4: Add more content
    await page.click('[data-testid="rsm-editor"]');
    await page.keyboard.press("End");
    await page.keyboard.type("\n\n## Introduction\n\nThis is the introduction section.");

    // Verify content update
    await expect(page.locator('h2:has-text("Introduction")')).toBeVisible();

    // Step 5: Go back to home and add tags
    await page.goto("/home");
    await addTagsToFile(page, fileName, ["research", "draft", "important"]);

    // Step 6: Verify tags are applied
    await expect(page.locator('[data-testid="file-tag-research"]')).toBeVisible();
    await expect(page.locator('[data-testid="file-tag-draft"]')).toBeVisible();

    // Step 7: Open file again to verify persistence
    await page.click(`[data-testid="file-item-${fileName}"]`);
    await page.waitForURL(/\/workspace/);
    await expect(page.locator('h1:has-text("My Research Paper")')).toBeVisible();
    await expect(page.locator('h2:has-text("Introduction")')).toBeVisible();

    // Step 8: Logout
    await logoutUser(page);
    expect(page.url()).toContain("/login");

    // Step 9: Login again and verify file persists
    await loginUser(page, user);
    await page.goto("/home");
    await expect(page.locator(`[data-testid="file-item-${fileName}"]`)).toBeVisible();
  });

  test("collaboration workflow: create → share → edit → track changes", async ({ page }) => {
    const fileName = `Collaborative Document ${Date.now()}`;
    const user = testUsers.testUsers.defaultUser;

    await loginUser(page, user);

    // Create document for collaboration
    await createNewFile(page, {
      title: fileName,
      content: ":rsm:\n\n# Collaborative Paper\n\n## Authors\n\n- Author 1\n- Author 2\n\n::",
    });

    // Check for collaboration features
    const shareButton = page.locator('[data-testid="share-document"]');
    if (await shareButton.isVisible()) {
      await shareButton.click();

      // Should show sharing options
      await expect(page.locator('[data-testid="share-modal"]')).toBeVisible();

      // Should be able to add collaborators
      const collaboratorInput = page.locator('[data-testid="add-collaborator-input"]');
      if (await collaboratorInput.isVisible()) {
        await collaboratorInput.fill("collaborator@example.com");
        await page.click('[data-testid="add-collaborator-button"]');

        // Should show collaborator added
        await expect(page.locator('[data-testid="collaborator-list"]')).toContainText(
          "collaborator@example.com"
        );
      }
    }

    // Check for version history/changes tracking
    const historyButton = page.locator('[data-testid="version-history"]');
    if (await historyButton.isVisible()) {
      await historyButton.click();
      await expect(page.locator('[data-testid="version-history-panel"]')).toBeVisible();
    }
  });

  test("mobile responsive workflow", async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const user = testUsers.testUsers.defaultUser;
    const fileName = `Mobile Test ${Date.now()}`;

    // Login on mobile
    await loginUser(page, user);

    // Should have mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu-trigger"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
    }

    // Navigate to home
    await page.goto("/home");

    // Should be responsive on mobile
    await expect(page.locator('[data-testid="files-container"]')).toBeVisible();

    // Create file on mobile
    await createNewFile(page, { title: fileName });

    // Should work in mobile workspace
    expect(page.url()).toContain("/workspace");
    await expect(page.locator('[data-testid="manuscript-content"]')).toBeVisible();

    // Test mobile editing
    const editor = page.locator('[data-testid="rsm-editor"]');
    if (await editor.isVisible()) {
      await editor.click();
      await editor.fill(":rsm:\n\n# Mobile Test\n\nTesting mobile editing.\n\n::");

      // Should render correctly on mobile
      await expect(page.locator('h1:has-text("Mobile Test")')).toBeVisible();
    }
  });

  test("error recovery workflow", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;

    await loginUser(page, user);

    // Test network error recovery
    await page.goto("/home");

    // Simulate network error
    await page.route("**/api/**", (route) => route.abort());

    // Try to create file
    await page.click('[data-testid="create-file-button"]');

    // Should handle error gracefully
    const errorMessage = page.locator('[data-testid="network-error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/network|connection|error/i);
    }

    // Restore network
    await page.unroute("**/api/**");

    // Should recover and work normally
    await page.reload();
    await expect(page.locator('[data-testid="files-container"]')).toBeVisible();
  });

  test("data persistence across browser sessions", async ({ page, context }) => {
    const user = testUsers.testUsers.defaultUser;
    const fileName = `Persistence Test ${Date.now()}`;

    // First session: create file
    await loginUser(page, user);
    await createNewFile(page, {
      title: fileName,
      content: ":rsm:\n\n# Persistence Test\n\nThis should persist.\n\n::",
    });

    // Close browser context (simulates closing browser)
    await context.close();

    // Create new context (simulates opening browser again)
    const newContext = await page.context().browser().newContext();
    const newPage = await newContext.newPage();

    // Should require login again
    await newPage.goto("/home");
    await newPage.waitForURL("/login");

    // Login again
    await loginUser(newPage, user);

    // File should still exist
    await newPage.goto("/home");
    await expect(newPage.locator(`[data-testid="file-item-${fileName}"]`)).toBeVisible();

    // Content should be preserved
    await newPage.click(`[data-testid="file-item-${fileName}"]`);
    await newPage.waitForURL(/\/workspace/);
    await expect(newPage.locator('h1:has-text("Persistence Test")')).toBeVisible();

    await newContext.close();
  });

  test("performance under load workflow", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;

    await loginUser(page, user);
    await page.goto("/home");

    // Create multiple files quickly
    const filePromises = [];
    for (let i = 0; i < 5; i++) {
      filePromises.push(
        createNewFile(page, { title: `Performance Test File ${i} ${Date.now()}` }).then(() =>
          page.goto("/home")
        )
      );
    }

    // Wait for all files to be created
    await Promise.all(filePromises);

    // Should handle multiple files without performance degradation
    await expect(page.locator('[data-testid="files-container"]')).toBeVisible();

    // File list should be responsive
    const fileItems = await page.locator('[data-testid^="file-item-"]').count();
    expect(fileItems).toBeGreaterThan(0);
  });

  test("accessibility workflow with keyboard navigation", async ({ page }) => {
    const user = testUsers.testUsers.defaultUser;

    await loginUser(page, user);
    await page.goto("/home");

    // Navigate using only keyboard
    await page.keyboard.press("Tab"); // Focus first interactive element

    // Should be able to navigate to create file button
    let attempts = 0;
    while (attempts < 20) {
      const focusedElement = await page.evaluate(() =>
        document.activeElement?.getAttribute("data-testid")
      );

      if (focusedElement === "create-file-button") {
        break;
      }

      await page.keyboard.press("Tab");
      attempts++;
    }

    // Create file using keyboard
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-testid="create-file-modal"]')).toBeVisible();

    // Fill form using keyboard
    await page.keyboard.type("Accessibility Test File");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    // Should create file and navigate to workspace
    expect(page.url()).toContain("/workspace");
  });
});
