import { expect } from "@playwright/test";

export class AuthHelpers {
  constructor(page) {
    this.page = page;
  }

  async login(email, password) {
    await this.page.goto("/login");
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);

    // Click login button and wait for either navigation or error message
    await this.page.click('[data-testid="login-button"]');

    try {
      // Try to wait for navigation (successful login)
      await this.page.waitForNavigation({ timeout: 10000 });
      await this.page.waitForLoadState("networkidle");
    } catch (error) {
      // If no navigation, check if we're still on login page (failed login)
      const currentUrl = this.page.url();
      if (currentUrl.includes("/login")) {
        // Failed login - wait for any error messages to appear
        await this.page.waitForLoadState("networkidle");
        // Don't throw error here, let the test handle the failed login scenario
      } else {
        // Some other navigation issue, re-throw the error
        throw error;
      }
    }
  }

  async expectToBeLoggedIn() {
    // Wait for redirect to home page with increased timeout
    await expect(this.page).toHaveURL("/", { timeout: 10000 });

    // Wait for user menu to be visible, indicating successful authentication
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });

    // Verify authentication tokens exist
    const tokens = await this.getStoredTokens();
    if (!tokens.accessToken) {
      throw new Error("Authentication tokens not found after login");
    }
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL("/login");
    await expect(this.page.locator('input[type="email"]')).toBeVisible();
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click("text=Logout");
  }

  async clearAuthState() {
    try {
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      // Force a hard reload to ensure clean state
      await this.page.goto("/login", { waitUntil: "load" });
      await this.page.reload({ waitUntil: "load" });

      // Double-check that tokens are actually cleared
      const tokens = await this.getStoredTokens();
      if (tokens.accessToken || tokens.refreshToken) {
        await this.page.evaluate(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        });
        await this.page.reload({ waitUntil: "load" });
      }
    } catch {
      // Ignore localStorage access errors in tests
    }
  }

  async setAuthState(accessToken, refreshToken, user) {
    await this.page.goto("/");
    await this.page.evaluate(
      ({ accessToken, refreshToken, user }) => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      },
      { accessToken, refreshToken, user }
    );
  }

  async getStoredTokens() {
    try {
      return await this.page.evaluate(() => ({
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: JSON.parse(localStorage.getItem("user") || "null"),
      }));
    } catch {
      return { accessToken: null, refreshToken: null, user: null };
    }
  }
}
