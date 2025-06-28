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
    // Check if auth is disabled (backend env var)
    const isAuthDisabled = await this.isAuthDisabled();

    if (isAuthDisabled) {
      // In disabled auth mode, just go to home page and verify it loads
      await this.page.goto("/");
      await this.page.waitForLoadState("networkidle");
      await expect(this.page).toHaveURL("/");

      // Wait for the page to load with mock user
      await this.page.waitForSelector(
        '[data-testid="file-list"], [data-testid="empty-state"], .file-item',
        { timeout: 10000 }
      );
      return;
    }

    // Normal auth flow
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

  async isAuthDisabled() {
    try {
      // Try to access a protected endpoint without auth headers
      const response = await this.page.request.get("http://localhost:8000/me");

      // If we get a successful response without sending auth headers, auth is disabled
      if (response.ok()) {
        const data = await response.json();
        // Check if we got the mock user response
        return data.email === "test@example.com" && data.full_name === "Test User";
      }

      return false;
    } catch {
      // Backend might not be ready yet, retry once
      try {
        await this.page.waitForTimeout(1000);
        const response = await this.page.request.get("http://localhost:8000/me");
        if (response.ok()) {
          const data = await response.json();
          return data.email === "test@example.com" && data.full_name === "Test User";
        }
      } catch {
        // Still failing, auth is likely enabled
      }
      return false;
    }
  }

  async ensureLoggedIn() {
    // First, try to go directly to home - this will work if auth is disabled
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");

    // Wait a moment for any potential redirects to happen
    await this.page.waitForTimeout(1500);

    // Check where we ended up
    const currentUrl = this.page.url();

    if (currentUrl.includes("/login")) {
      // We were redirected to login, so auth is enabled - need to login
      const testPassword = process.env.VITE_DEV_LOGIN_PASSWORD || "testpassword123";
      await this.login("testuser@aris.pub", testPassword);
    }

    // Always call expectToBeLoggedIn to verify final state
    await this.expectToBeLoggedIn();
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
