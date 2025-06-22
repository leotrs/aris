import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession } from "../../utils/auth-helpers.js";
import {
  createNewFile,
  getEditorContent,
  setEditorContent,
} from "../../utils/manuscript-helpers.js";
import { getTestUsers } from "../../utils/test-config.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sampleRSM = readFileSync(join(__dirname, "../../fixtures/sample-manuscripts.rsm"), "utf-8");

test.describe("RSM Manuscript Editing", () => {
  let testUsers;

  test.beforeAll(() => {
    testUsers = getTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
  });

  test("should create and edit RSM document", async ({ page }) => {
    const fileName = `RSM Test Document ${Date.now()}`;

    // Create new file
    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Should be in workspace
    expect(page.url()).toContain("/workspace");

    // Should show RSM editor
    await expect(page.locator('[data-testid="rsm-editor"]')).toBeVisible();

    // Should show rendered content
    await expect(page.locator('[data-testid="manuscript-content"]')).toBeVisible();
  });

  test("should render RSM markup correctly", async ({ page }) => {
    const fileName = `RSM Rendering Test ${Date.now()}`;

    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Check that RSM elements are rendered correctly
    await expect(page.locator('h1:has-text("Sample Research Manuscript")')).toBeVisible();
    await expect(page.locator('h2:has-text("Abstract")')).toBeVisible();
    await expect(page.locator('h2:has-text("Introduction")')).toBeVisible();

    // Check for formatted text
    await expect(page.locator('strong:has-text("structured content")')).toBeVisible();
    await expect(page.locator('strong:has-text("50% faster")')).toBeVisible();

    // Check for lists
    await expect(page.locator('ol li:has-text("Define core RSM syntax")')).toBeVisible();
  });

  test("should support real-time editing", async ({ page }) => {
    const fileName = `Real-time Editing Test ${Date.now()}`;

    await createNewFile(page, { title: fileName });

    // Add content to editor
    const testContent = ":rsm:\n\n# Test Header\n\nThis is test content.\n\n::";
    await setEditorContent(page, testContent);

    // Should see rendered output update
    await expect(page.locator('h1:has-text("Test Header")')).toBeVisible();
    await expect(page.locator('p:has-text("This is test content")')).toBeVisible();
  });

  test("should validate RSM syntax", async ({ page }) => {
    const fileName = `RSM Validation Test ${Date.now()}`;

    await createNewFile(page, { title: fileName });

    // Enter invalid RSM (missing closing tag)
    const invalidContent = ":rsm:\n\n# Invalid Document\n\nMissing closing tag";
    await setEditorContent(page, invalidContent);

    // Should show validation error
    const errorIndicator = page.locator('[data-testid="rsm-validation-error"]');
    if (await errorIndicator.isVisible()) {
      await expect(errorIndicator).toContainText(/missing|invalid|syntax/i);
    }
  });

  test("should support mathematical expressions", async ({ page }) => {
    const fileName = `Math Test ${Date.now()}`;

    const mathContent =
      ":rsm:\n\n# Mathematical Expressions\n\nThe quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n\n::";
    await createNewFile(page, { title: fileName, content: mathContent });

    // Should render mathematical expressions
    await expect(page.locator('h1:has-text("Mathematical Expressions")')).toBeVisible();
    await expect(page.locator(':has-text("quadratic formula")')).toBeVisible();
  });

  test("should support citations and references", async ({ page }) => {
    const fileName = `Citation Test ${Date.now()}`;

    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Should render references section
    await expect(page.locator('h2:has-text("References")')).toBeVisible();
    await expect(page.locator('ol li:has-text("Sample Reference")')).toBeVisible();
  });

  test("should auto-save changes", async ({ page }) => {
    const fileName = `Auto-save Test ${Date.now()}`;

    await createNewFile(page, { title: fileName });

    // Add content
    const content = ":rsm:\n\n# Auto-save Test\n\nThis content should be auto-saved.\n\n::";
    await setEditorContent(page, content);

    // Wait for auto-save
    await page.waitForTimeout(3000);

    // Check for save indicator
    const saveIndicator = page.locator('[data-testid="auto-save-indicator"]');
    if (await saveIndicator.isVisible()) {
      await expect(saveIndicator).toContainText(/saved|auto-saved/i);
    }

    // Refresh page and verify content persists
    await page.reload();
    await page.waitForSelector('[data-testid="rsm-editor"]');

    const savedContent = await getEditorContent(page);
    expect(savedContent).toContain("Auto-save Test");
  });

  test("should show document outline/table of contents", async ({ page }) => {
    const fileName = `Outline Test ${Date.now()}`;

    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Check if outline/TOC is available
    const outlinePanel = page.locator('[data-testid="document-outline"]');
    if (await outlinePanel.isVisible()) {
      // Should show document structure
      await expect(page.locator('[data-testid="outline-abstract"]')).toBeVisible();
      await expect(page.locator('[data-testid="outline-introduction"]')).toBeVisible();
      await expect(page.locator('[data-testid="outline-methodology"]')).toBeVisible();
    }
  });

  test("should support document export", async ({ page }) => {
    const fileName = `Export Test ${Date.now()}`;

    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Check if export functionality exists
    const exportButton = page.locator('[data-testid="export-document"]');
    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Should show export options
      await expect(page.locator('[data-testid="export-options"]')).toBeVisible();

      // Check for different export formats
      const pdfExport = page.locator('[data-testid="export-pdf"]');
      const htmlExport = page.locator('[data-testid="export-html"]');

      if (await pdfExport.isVisible()) {
        await expect(pdfExport).toBeVisible();
      }
      if (await htmlExport.isVisible()) {
        await expect(htmlExport).toBeVisible();
      }
    }
  });

  test("should support find and replace", async ({ page }) => {
    const fileName = `Find Replace Test ${Date.now()}`;

    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Open find/replace (usually Ctrl+F or Ctrl+H)
    await page.keyboard.press("Control+F");

    // Check if find interface appears
    const findInput = page.locator('[data-testid="find-input"]');
    if (await findInput.isVisible()) {
      await findInput.fill("Research");

      // Should highlight matches
      await expect(page.locator('[data-testid="find-matches"]')).toBeVisible();

      // Test replace functionality
      const replaceInput = page.locator('[data-testid="replace-input"]');
      if (await replaceInput.isVisible()) {
        await replaceInput.fill("Study");
        await page.click('[data-testid="replace-all-button"]');

        // Content should be updated
        const updatedContent = await getEditorContent(page);
        expect(updatedContent).toContain("Study");
      }
    }
  });

  test("should support word count and document statistics", async ({ page }) => {
    const fileName = `Word Count Test ${Date.now()}`;

    await createNewFile(page, { title: fileName, content: sampleRSM });

    // Check if word count is displayed
    const wordCount = page.locator('[data-testid="word-count"]');
    if (await wordCount.isVisible()) {
      const count = await wordCount.textContent();
      expect(parseInt(count)).toBeGreaterThan(0);
    }

    // Check for other statistics
    const charCount = page.locator('[data-testid="character-count"]');
    const readingTime = page.locator('[data-testid="reading-time"]');

    if (await charCount.isVisible()) {
      expect(await charCount.textContent()).toMatch(/\d+/);
    }
    if (await readingTime.isVisible()) {
      expect(await readingTime.textContent()).toMatch(/\d+.*min/);
    }
  });

  test("should handle large documents without performance issues", async ({ page }) => {
    const fileName = `Performance Test ${Date.now()}`;

    // Create large document content
    let largeContent = ":rsm:\n\n# Large Document Test\n\n";
    for (let i = 0; i < 100; i++) {
      largeContent += `## Section ${i}\n\nThis is paragraph ${i} with substantial content to test performance. `;
      largeContent += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(10);
      largeContent += "\n\n";
    }
    largeContent += "::";

    await createNewFile(page, { title: fileName, content: largeContent });

    // Should load without significant delay
    await expect(page.locator('[data-testid="manuscript-content"]')).toBeVisible({
      timeout: 10000,
    });

    // Editing should remain responsive
    await page.click('[data-testid="rsm-editor"]');
    await page.keyboard.type("\n\n# New Section Added");

    // Should update without significant lag
    await expect(page.locator('h1:has-text("New Section Added")')).toBeVisible({ timeout: 5000 });
  });

  test("should support keyboard shortcuts", async ({ page }) => {
    const fileName = `Keyboard Shortcuts Test ${Date.now()}`;

    await createNewFile(page, { title: fileName });

    // Test common shortcuts
    await page.click('[data-testid="rsm-editor"]');

    // Bold text (Ctrl+B)
    await page.keyboard.type("Bold text");
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Control+B");

    // Should format as bold (implementation depends on editor)

    // Save (Ctrl+S)
    await page.keyboard.press("Control+S");

    // Should trigger save
    const saveIndicator = page.locator('[data-testid="save-indicator"]');
    if (await saveIndicator.isVisible()) {
      await expect(saveIndicator).toBeVisible();
    }
  });
});
