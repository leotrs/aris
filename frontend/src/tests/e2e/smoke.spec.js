import { test, expect } from "@playwright/test";

test.describe("Smoke Tests @standard", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Aris/);
  });
});
