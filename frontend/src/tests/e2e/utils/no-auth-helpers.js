import { expect } from "@playwright/test";

export class NoAuthHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * For tests that don't require authentication, simply navigate to the page
   * when backend is in SKIP_AUTH_FOR_TESTS mode
   */
  async skipAuthAndNavigate(path = "/") {
    // Just navigate directly - no authentication needed
    await this.page.goto(path);
    await this.page.waitForLoadState("domcontentloaded");

    // Verify we're not redirected to login
    const currentUrl = this.page.url();
    if (currentUrl.includes("/login")) {
      throw new Error("Backend auth bypass not working - redirected to login");
    }
  }

  /**
   * Verify that we can access protected routes without authentication
   */
  async verifyNoAuthRequired() {
    // Try accessing the workspace directly
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");

    // Should not be redirected to login
    await expect(this.page).not.toHaveURL(/\/login/);

    // Should have some indication the page loaded (no specific user menu needed)
    // Just verify we're not on an error page
    const bodyText = await this.page.textContent("body");
    if ((bodyText && bodyText.includes("404")) || bodyText.includes("Error")) {
      throw new Error("Page appears to have errors");
    }
  }
}
