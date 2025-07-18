import { test, expect } from "@playwright/test";

test.describe("Citation Modal Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ication/test01");
    await page.waitForLoadState("networkidle");
  });

  test("citation modal complete workflow @demo-content", async ({ page }) => {
    // Open citation modal
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Verify all format tabs are present using SegmentedControl
    await expect(page.locator(".sc-wrapper")).toBeVisible();
    await expect(page.locator('button:has-text("APA")').first()).toBeVisible();
    await expect(page.locator('button:has-text("BibTeX")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Chicago")').first()).toBeVisible();
    await expect(page.locator('button:has-text("MLA")').first()).toBeVisible();

    // APA should be active by default
    await expect(page.locator('.sc-wrapper button:has-text("APA")')).toHaveClass(/active/);

    // Verify APA content
    await expect(page.locator(".citation-text")).toContainText(
      "Unknown Author (2025). Test Citation Paper. Aris Preprint."
    );

    // Copy button should be visible
    await expect(page.locator('[data-testid="copy-citation-button"]')).toBeVisible();

    // Test format switching - switch to BibTeX
    await page.click('.sc-wrapper button:has-text("BibTeX")');
    await expect(page.locator('.sc-wrapper button:has-text("BibTeX")')).toHaveClass(/active/);
    await page.waitForTimeout(500); // Allow format switch to complete
    await expect(page.locator(".citation-text")).toContainText("@article{test01,");

    // BibTeX should show download button
    await expect(page.locator('[data-testid="download-bibtex-button"]')).toBeVisible();

    // Test Chicago format
    await page.click('.sc-wrapper button:has-text("Chicago")');
    await expect(page.locator('.sc-wrapper button:has-text("Chicago")')).toHaveClass(/active/);
    await page.waitForTimeout(500); // Allow format switch to complete
    await expect(page.locator(".citation-text")).toContainText(
      '"Test Citation Paper." Aris Preprint'
    );

    // Test MLA format
    await page.click('.sc-wrapper button:has-text("MLA")');
    await expect(page.locator('.sc-wrapper button:has-text("MLA")')).toHaveClass(/active/);
    await page.waitForTimeout(500); // Allow format switch to complete
    await expect(page.locator(".citation-text")).toContainText(
      '"Test Citation Paper." Aris Preprint, 2025-07-17'
    );

    // Test copy functionality
    await page.click('[data-testid="copy-citation-button"]');
    // Modal should remain open after copy
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Switch back to BibTeX to test download
    await page.click('.sc-wrapper button:has-text("BibTeX")');
    await page.click('[data-testid="download-bibtex-button"]');
    // Modal should remain open after download
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Verify modal structure
    await expect(page.locator(".citation-content")).toBeVisible();
    await expect(page.locator('h4:has-text("Export to Reference Manager")')).toBeVisible();
    await expect(page.locator('h4:has-text("Publication Information")')).toBeVisible();
    await expect(page.locator("text=Authors")).toBeVisible();
    await expect(page.locator('.author-name:has-text("Unknown Author")')).toBeVisible();
  });

  test("citation modal keyboard shortcut @demo-content", async ({ page }) => {
    // Test 'q' keyboard shortcut
    await page.keyboard.press("q");
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Close and test again
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // Test shortcut again
    await page.keyboard.press("q");
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test("citation modal proper closure @demo-content", async ({ page }) => {
    // Open modal
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Close with escape
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // Open again and close with backdrop click
    await page.click('[data-testid="cite-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click outside modal to close
    await page.click("body", { position: { x: 50, y: 50 } });
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test("citation formats display correct content @demo-content", async ({ page }) => {
    await page.click('[data-testid="cite-button"]');

    // Wait for modal to load
    await expect(page.locator(".citation-text")).toBeVisible();

    // Test APA format (default)
    const apaText = await page.locator(".citation-text").textContent();
    expect(apaText).toContain("Unknown Author (2025)");
    expect(apaText).toContain("Test Citation Paper");
    expect(apaText).toContain("Aris Preprint");
    expect(apaText).toContain("https://aris.com/ication/test01");

    // Test BibTeX format
    await page.click('.sc-wrapper button:has-text("BibTeX")');
    await page.waitForTimeout(500); // Allow format switch
    await expect(page.locator(".citation-text")).toBeVisible();
    const bibtexText = await page.locator(".citation-text").textContent();
    expect(bibtexText).toContain("@article{test01,");
    expect(bibtexText).toContain("title={Test Citation Paper},");
    expect(bibtexText).toContain("author={Unknown Author},");
    expect(bibtexText).toContain("year={2025},");
    expect(bibtexText).toContain("journal={Aris Preprint},");

    // Test Chicago format
    await page.click('.sc-wrapper button:has-text("Chicago")');
    await page.waitForTimeout(500); // Allow format switch
    await expect(page.locator(".citation-text")).toBeVisible();
    const chicagoText = await page.locator(".citation-text").textContent();
    expect(chicagoText).toContain("Unknown Author");
    expect(chicagoText).toContain('"Test Citation Paper."');
    expect(chicagoText).toContain("Aris Preprint test01 (2025)");

    // Test MLA format
    await page.click('.sc-wrapper button:has-text("MLA")');
    await page.waitForTimeout(500); // Allow format switch
    await expect(page.locator(".citation-text")).toBeVisible();
    const mlaText = await page.locator(".citation-text").textContent();
    expect(mlaText).toContain("Unknown Author");
    expect(mlaText).toContain('"Test Citation Paper."');
    expect(mlaText).toContain("Aris Preprint, 2025-07-17");
  });
});
