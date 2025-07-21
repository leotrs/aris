import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 400, height: 800 }, // Mobile size
  });
  const page = await context.newPage();

  // Add console logging
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message));

  try {
    await page.goto("http://localhost:3002");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check if navbar exists first
    const navbar = await page.locator(".navbar");
    console.log("Navbar visible:", await navbar.isVisible());

    // Check current viewport
    const viewport = page.viewportSize();
    console.log("Viewport:", viewport);

    // Check if menu toggle element exists (even if not visible)
    const menuToggleExists = (await page.locator('[data-testid="menu-toggle"]').count()) > 0;
    console.log("Menu toggle exists in DOM:", menuToggleExists);

    if (!menuToggleExists) {
      console.log("Menu toggle not found in DOM! Checking for navbar elements...");
      const allTestIds = await page.$$eval("[data-testid]", (els) =>
        els.map((el) => el.getAttribute("data-testid"))
      );
      console.log("All data-testid elements found:", allTestIds);
    }

    // Wait for menu toggle to be visible
    await page.waitForSelector('[data-testid="menu-toggle"]', { timeout: 10000 });

    // Check if the menu toggle is visible and clickable
    const menuToggle = page.locator('[data-testid="menu-toggle"]');
    console.log("Menu toggle visible:", await menuToggle.isVisible());
    console.log("Menu toggle enabled:", await menuToggle.isEnabled());

    // Try to click it
    console.log("Attempting to click menu toggle...");
    await menuToggle.click();

    // Check if mobile menu opened
    const mobileMenu = page.locator('[data-testid="mobile-menu-overlay"]');
    await mobileMenu.waitFor({ state: "visible", timeout: 5000 });
    console.log("Mobile menu opened successfully!");
  } catch (error) {
    console.error("Error:", error.message);

    // Take a screenshot for debugging
    await page.screenshot({ path: "navbar-debug.png" });
    console.log("Screenshot saved as navbar-debug.png");
  } finally {
    await browser.close();
  }
})();
