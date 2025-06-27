import { expect } from "@playwright/test";

export class AuthHelpers {
  constructor(page) {
    this.page = page;
  }

  async login(email, password) {
    await this.page.goto("/login");
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);

    // Log what credentials we're using for debugging
    console.log(`Attempting login with email: ${email}, password length: ${password?.length || 0}`);

    // Click login button and wait for either navigation or error message
    await this.page.click('[data-testid="login-button"]');

    // Wait for either successful navigation away from login or error state
    try {
      await this.page.waitForURL(url => !url.includes('/login'), { timeout: 8000 });
      await this.page.waitForLoadState("domcontentloaded"); // Faster than networkidle
      console.log("Login successful - navigated away from login page");
    } catch (error) {
      // If still on login page, check for error messages or other issues
      await this.page.waitForLoadState("domcontentloaded");
      const currentUrl = this.page.url();
      if (currentUrl.includes("/login")) {
        // Check if there's an error message on the page
        const errorElement = await this.page.locator('[data-testid="login-error"]').isVisible();
        const errorText = errorElement ? await this.page.locator('[data-testid="login-error"]').textContent() : "No error message found";
        
        console.log(`Login attempt did not navigate away from login page. Error visible: ${errorElement}, Error text: ${errorText}`);
        console.log(`Current URL: ${currentUrl}`);
      } else {
        // Some other navigation issue, re-throw the error
        throw error;
      }
    }
  }

  async loginWithTestUser() {
    // Use test credentials from environment variables
    const testEmail = process.env.TEST_USER_EMAIL || "testuser@aris.pub";
    // In CI environment, use TEST_USER_PASSWORD, in dev use VITE_DEV_LOGIN_PASSWORD
    const testPassword = (process.env.CI || process.env.ENV === "CI") 
      ? process.env.TEST_USER_PASSWORD 
      : process.env.VITE_DEV_LOGIN_PASSWORD;
    
    if (!testPassword) {
      const envVar = (process.env.CI || process.env.ENV === "CI") ? "TEST_USER_PASSWORD" : "VITE_DEV_LOGIN_PASSWORD";
      throw new Error(`Test user password not configured. Required environment variable ${envVar} is missing.`);
    }
    
    await this.login(testEmail, testPassword);
    await this.expectToBeLoggedIn();
  }

  async expectToBeLoggedIn() {
    // Wait for redirect to home page with reduced timeout
    await expect(this.page).toHaveURL("/", { timeout: 8000 });

    // Wait for user menu to be visible, indicating successful authentication
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 6000 });

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
