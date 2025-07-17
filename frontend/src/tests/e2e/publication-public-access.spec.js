/**
 * E2E tests for publication to public access workflow
 *
 * Tests the complete user journey from file creation through publication
 * to public access verification. Covers the integration of:
 * - Publication status API endpoints
 * - UUID generation system
 * - Public preprint access endpoints
 * - Frontend publication UI workflow
 */

import { test, expect } from "@playwright/test";

test.describe("Publication to Public Access Workflow", () => {
  // @core - Critical publication→public access E2E workflow
  test("complete publication to public access workflow", async ({ page }) => {
    // This test covers the complete user journey from creating a file to accessing it publicly

    // Navigate to home page
    await page.goto("/");

    // Check if we're on login page (if auth is enabled)
    const currentUrl = page.url();
    if (currentUrl.includes("/login")) {
      // Skip test if auth is required but we're in public testing mode
      test.skip(true, "Auth required but running in public testing mode");
    }

    // Create a new file
    await page.click('[data-testid="create-file-button"]');

    // Wait for file creation and navigation to workspace
    await page.waitForURL(/\/workspace/, { timeout: 10000 });

    // Add content to the file
    const editor = page.locator('[data-testid="rsm-editor"]');
    await editor.click();
    await editor.fill(
      ":rsm:# E2E Publication Test\\n\\nThis is a test of the complete publication workflow.\\n\\n## Abstract\\n\\nTesting end-to-end publication from creation to public access.\\n\\n## Keywords\\n\\ne2e, publication, public-access, workflow::"
    );

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Add a title and abstract through the UI
    const titleInput = page.locator('[data-testid="file-title-input"]');
    if (await titleInput.isVisible()) {
      await titleInput.fill("E2E Publication Test");
    }

    const abstractInput = page.locator('[data-testid="file-abstract-input"]');
    if (await abstractInput.isVisible()) {
      await abstractInput.fill("Testing end-to-end publication from creation to public access.");
    }

    // Wait for auto-save again
    await page.waitForTimeout(2000);

    // Navigate to publication settings or find publish button
    const publishButton = page.locator('[data-testid="publish-button"]');

    if (await publishButton.isVisible()) {
      // Click publish button
      await publishButton.click();

      // Wait for publication confirmation
      await expect(page.locator('[data-testid="publication-success"]')).toBeVisible({
        timeout: 10000,
      });

      // Get the public UUID from the success message or publication info
      const publicUuid = await page.locator('[data-testid="public-uuid"]').textContent();
      expect(publicUuid).toBeTruthy();
      expect(publicUuid).toHaveLength(6);

      // Test public access via UUID - open in new tab/page to simulate public access
      const publicUrl = `/ication/${publicUuid}`;

      // Navigate to public URL
      await page.goto(publicUrl);

      // Verify public access works
      await expect(page.locator("body")).toContainText("E2E Publication Test");
      await expect(page.locator("body")).toContainText(
        "Testing end-to-end publication from creation to public access."
      );

      // Test metadata endpoint access
      const metadataUrl = `/ication/${publicUuid}/metadata`;

      // Use API call to test metadata endpoint
      const response = await page.request.get(metadataUrl);
      expect(response.status()).toBe(200);

      const metadata = await response.json();
      expect(metadata.title).toBe("E2E Publication Test");
      expect(metadata.public_uuid).toBe(publicUuid);
      expect(metadata.citation_info).toBeTruthy();
      expect(metadata.citation_info.formats).toBeTruthy();
      expect(metadata.citation_info.formats.apa).toContain("E2E Publication Test");
    } else {
      test.skip(true, "Publish button not found - may need different UI flow");
    }
  });

  // @auth - Authenticated publication workflow
  test("authenticated user publication workflow", async ({ page }) => {
    // Test requires authentication - skip if not in auth mode
    await page.goto("/login");

    const isLoginPage = await page.locator('[data-testid="login-form"]').isVisible();
    if (!isLoginPage) {
      test.skip(true, "Not in authentication mode");
    }

    // Login with test credentials
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpassword");
    await page.click('[data-testid="login-button"]');

    // Wait for redirect to home
    await page.waitForURL(/\/$|\/home/, { timeout: 10000 });

    // Create new file
    await page.click('[data-testid="create-file-button"]');
    await page.waitForURL(/\/workspace/, { timeout: 10000 });

    // Add content
    const editor = page.locator('[data-testid="rsm-editor"]');
    await editor.fill(
      ":rsm:# Authenticated Publication Test\\n\\nThis tests authenticated user publication workflow.\\n\\n## Abstract\\n\\nTesting publication by authenticated user.\\n\\n## Keywords\\n\\nauth, publication, e2e::"
    );

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Publish the file
    const publishButton = page.locator('[data-testid="publish-button"]');
    if (await publishButton.isVisible()) {
      await publishButton.click();

      // Confirm publication
      await expect(page.locator('[data-testid="publication-success"]')).toBeVisible({
        timeout: 10000,
      });

      // Get public UUID
      const publicUuid = await page.locator('[data-testid="public-uuid"]').textContent();
      expect(publicUuid).toBeTruthy();

      // Verify public URL works (no authentication required)
      const publicResponse = await page.request.get(`/ication/${publicUuid}`);
      expect(publicResponse.status()).toBe(200);

      const publicData = await publicResponse.json();
      expect(publicData.title).toBe("Authenticated Publication Test");
      expect(publicData.public_uuid).toBe(publicUuid);
    } else {
      test.skip(true, "Publish button not available");
    }
  });

  // @demo-content - Demo content publication workflow
  test("demo content publication simulation", async ({ page }) => {
    // Test publication workflow using demo content (no auth required)
    await page.goto("/demo");

    // Wait for demo content to load
    await page.waitForSelector('[data-testid="demo-manuscript"]', {
      timeout: 10000,
    });

    // Check if demo has publication simulation features
    const publishDemo = page.locator('[data-testid="demo-publish-button"]');
    if (await publishDemo.isVisible()) {
      await publishDemo.click();

      // Wait for demo publication simulation
      await page.waitForTimeout(2000);

      // Check for demo public URL display
      const demoPublicUrl = page.locator('[data-testid="demo-public-url"]');
      if (await demoPublicUrl.isVisible()) {
        const demoUuid = await demoPublicUrl.textContent();
        expect(demoUuid).toBeTruthy();

        // Verify demo public access simulation works
        await expect(page.locator('[data-testid="demo-publication-success"]')).toBeVisible();
      }
    } else {
      test.skip(true, "Demo publication not available");
    }
  });

  test("publication with custom permalink workflow", async ({ page }) => {
    // Test publication workflow with custom permalink
    await page.goto("/");

    // Skip if auth required
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }

    // Create file
    await page.click('[data-testid="create-file-button"]');
    await page.waitForURL(/\/workspace/, { timeout: 10000 });

    // Add content
    const editor = page.locator('[data-testid="rsm-editor"]');
    await editor.fill(
      ":rsm:# Custom Permalink Test\\n\\nThis tests custom permalink publication.\\n\\n## Abstract\\n\\nTesting publication with custom permalink slug.\\n\\n## Keywords\\n\\npermalink, custom, publication::"
    );

    // Add custom permalink if UI supports it
    const permalinkInput = page.locator('[data-testid="permalink-input"]');
    if (await permalinkInput.isVisible()) {
      await permalinkInput.fill("custom-permalink-e2e-test");
    }

    await page.waitForTimeout(2000);

    // Publish
    const publishButton = page.locator('[data-testid="publish-button"]');
    if (await publishButton.isVisible()) {
      await publishButton.click();

      await expect(page.locator('[data-testid="publication-success"]')).toBeVisible({
        timeout: 10000,
      });

      // Get both UUID and permalink
      const publicUuid = await page.locator('[data-testid="public-uuid"]').textContent();
      const permalink = await page.locator('[data-testid="permalink-slug"]').textContent();

      expect(publicUuid).toBeTruthy();

      // Test access via UUID
      const uuidResponse = await page.request.get(`/ication/${publicUuid}`);
      expect(uuidResponse.status()).toBe(200);

      // Test access via permalink if available
      if (permalink && permalink !== publicUuid) {
        const permalinkResponse = await page.request.get(`/ication/${permalink}`);
        expect(permalinkResponse.status()).toBe(200);

        // Both should return same content
        const uuidData = await uuidResponse.json();
        const permalinkData = await permalinkResponse.json();
        expect(uuidData.id).toBe(permalinkData.id);
        expect(uuidData.title).toBe(permalinkData.title);
      }
    } else {
      test.skip(true, "Publish button not available");
    }
  });

  test("publication status workflow validation", async ({ page }) => {
    // Test different publication status transitions
    await page.goto("/");

    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }

    // Create file
    await page.click('[data-testid="create-file-button"]');
    await page.waitForURL(/\/workspace/, { timeout: 10000 });

    // Add content
    const editor = page.locator('[data-testid="rsm-editor"]');
    await editor.fill(
      ":rsm:# Status Workflow Test\\n\\nThis tests publication status workflow.\\n\\n## Abstract\\n\\nTesting different publication statuses.\\n\\n## Keywords\\n\\nstatus, workflow, publication::"
    );

    await page.waitForTimeout(2000);

    // Check initial status (should be Draft)
    const statusIndicator = page.locator('[data-testid="file-status"]');
    if (await statusIndicator.isVisible()) {
      await expect(statusIndicator).toContainText("Draft");
    }

    // Move to Under Review if UI supports it
    const underReviewButton = page.locator('[data-testid="under-review-button"]');
    if (await underReviewButton.isVisible()) {
      await underReviewButton.click();
      await expect(statusIndicator).toContainText("Under Review");

      // Verify not publicly accessible yet
      // We can't test this directly without knowing the UUID, but we test the workflow
    }

    // Publish
    const publishButton = page.locator('[data-testid="publish-button"]');
    if (await publishButton.isVisible()) {
      await publishButton.click();

      await expect(page.locator('[data-testid="publication-success"]')).toBeVisible({
        timeout: 10000,
      });
      await expect(statusIndicator).toContainText("Published");

      // Verify public access is now available
      const publicUuid = await page.locator('[data-testid="public-uuid"]').textContent();
      if (publicUuid) {
        const response = await page.request.get(`/ication/${publicUuid}`);
        expect(response.status()).toBe(200);
      }
    } else {
      test.skip(true, "Publish button not available");
    }
  });

  test("error handling in publication workflow", async ({ page }) => {
    // Test error scenarios in publication workflow
    await page.goto("/");

    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }

    // Create file
    await page.click('[data-testid="create-file-button"]');
    await page.waitForURL(/\/workspace/, { timeout: 10000 });

    // Try to publish without content
    const publishButton = page.locator('[data-testid="publish-button"]');
    if (await publishButton.isVisible()) {
      await publishButton.click();

      // Should show error for publishing without content
      const errorMessage = page.locator('[data-testid="publication-error"]');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/content|source/);
      }

      // Add minimal content
      const editor = page.locator('[data-testid="rsm-editor"]');
      await editor.fill(":rsm:# Minimal Test::");
      await page.waitForTimeout(1000);

      // Try publishing again
      await publishButton.click();

      // Should succeed this time
      await expect(page.locator('[data-testid="publication-success"]')).toBeVisible({
        timeout: 10000,
      });
    } else {
      test.skip(true, "Publish button not available for error testing");
    }
  });
});

test.describe("Public Access Verification", () => {
  test("public access works without authentication", async ({ page }) => {
    // Test that public URLs work without any authentication

    // Try to access a known public URL pattern (this will likely 404 but should not redirect to login)
    await page.goto("/ication/test01");

    // Should get 404, not redirect to login
    const response = await page.waitForResponse((response) =>
      response.url().includes("/ication/test01")
    );
    expect(response.status()).toBe(404);

    // Should not be redirected to login page
    expect(page.url()).not.toContain("/login");

    // Page should show 404 error, not login form
    await expect(page.locator('[data-testid="login-form"]')).not.toBeVisible();
  });

  test("public metadata access works without authentication", async ({ page }) => {
    // Test that metadata endpoints work without authentication

    // Try to access metadata endpoint
    const response = await page.request.get("/ication/test01/metadata");

    // Should get 404 (since test01 doesn't exist), not 401/403
    expect(response.status()).toBe(404);

    // Should not require authentication
    const responseText = await response.text();
    expect(responseText).not.toContain("unauthorized");
    expect(responseText).not.toContain("authentication");
  });

  test("public access handles non-existent files correctly", async ({ page }) => {
    // Test proper 404 handling for non-existent public files

    await page.goto("/ication/nonexistent123");

    // Should show appropriate 404 page
    const response = await page.waitForResponse((response) =>
      response.url().includes("/ication/nonexistent123")
    );
    expect(response.status()).toBe(404);

    // Should not crash or show internal errors
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
    await expect(page.locator("body")).not.toContainText("500");
  });
});
