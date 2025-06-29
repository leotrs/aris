import { test, expect } from "@playwright/test";

// @core

test("homepage loads successfully @core", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Aris/);
});
