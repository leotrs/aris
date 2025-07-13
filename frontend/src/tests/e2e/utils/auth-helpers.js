import { expect } from "@playwright/test";
import { TEST_CREDENTIALS } from "../setup/test-data.js";
import { getTimeouts } from "./timeout-constants.js";

export class AuthHelpers {
  constructor(page) {
    this.page = page;
  }

  async login(email, password) {
    console.log("[DEBUG-CI] AuthHelpers.login() called with email:", email);

    await this.page.goto("/login");
    console.log("[DEBUG-CI] Navigated to login page, URL:", this.page.url());

    await this.page.fill('[data-testid="email-input"]', email);
    console.log("[DEBUG-CI] Filled email input");

    await this.page.fill('[data-testid="password-input"]', password);
    console.log("[DEBUG-CI] Filled password input");

    // Click login button and wait for response
    console.log("[DEBUG-CI] About to click login button and wait for response");
    await Promise.all([
      this.page.waitForResponse(
        (response) => {
          const isLoginResponse =
            response.url().includes("/login") && response.request().method() === "POST";
          console.log(
            "[DEBUG-CI] Response received:",
            response.url(),
            response.status(),
            "is login response:",
            isLoginResponse
          );
          return isLoginResponse;
        },
        { timeout: 10000 }
      ),
      this.page.click('[data-testid="login-button"]'),
    ]);

    // Wait for successful login redirect (deterministic wait)
    await this.page.waitForLoadState("load");
    await this.page.waitForURL(/^(?!.*\/login)/, { timeout: getTimeouts().contentLoad });
  }

  async ensureLoggedIn() {
    // Go to home page
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");

    // Wait for potential auth redirect to complete (deterministic)
    try {
      await this.page.waitForURL(/^(?!.*\/login)/, { timeout: getTimeouts().contentLoad });
    } catch {
      // If we're still on login page or got redirected there, need to login
      const currentUrl = this.page.url();
      if (currentUrl.includes("/login")) {
        const email = TEST_CREDENTIALS.valid.email;
        const password = TEST_CREDENTIALS.valid.password;

        await this.login(email, password);

        // Verify login was successful by checking URL
        await this.page.waitForURL("/", { timeout: getTimeouts().contentLoad });
      }
    }

    // Verify we have authentication tokens
    const finalAccessToken = await this.page.evaluate(() => localStorage.getItem("accessToken"));
    const finalUser = await this.page.evaluate(() => localStorage.getItem("user"));
    const finalRefreshToken = await this.page.evaluate(() => localStorage.getItem("refreshToken"));

    console.log("[AuthHelpers] Final authentication verification:", {
      hasAccessToken: !!finalAccessToken,
      hasRefreshToken: !!finalRefreshToken,
      hasUser: !!finalUser,
      accessTokenLength: finalAccessToken?.length,
      refreshTokenLength: finalRefreshToken?.length,
      currentUrl: this.page.url(),
    });

    if (!finalAccessToken || !finalUser) {
      console.error("[AuthHelpers] Authentication verification failed:", {
        accessToken: !!finalAccessToken,
        user: !!finalUser,
        currentUrl: this.page.url(),
      });
      throw new Error(
        `Authentication verification failed - accessToken: ${!!finalAccessToken}, user: ${!!finalUser}`
      );
    }

    // Verify we're logged in by checking for home page elements
    console.log("[AuthHelpers] Verifying home page elements");
    await expect(this.page).toHaveURL("/");
    await this.page.waitForSelector(
      '[data-testid="files-container"], [data-testid="create-file-button"], [data-testid="user-menu"]'
    );

    console.log("[AuthHelpers] ensureLoggedIn completed successfully");
  }

  async logout() {
    await this.page.click('[data-testid="user-avatar"]');
    await this.page.click('[data-testid="user-logout"]');
  }

  async clearAuthState() {
    try {
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await this.page.goto("/login", { waitUntil: "domcontentloaded" });
    } catch {
      // Ignore localStorage access errors in tests
    }
  }

  async getStoredTokens() {
    console.log("[DEBUG-CI] Getting stored tokens from localStorage");
    try {
      const tokens = await this.page.evaluate(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userStr = localStorage.getItem("user");

        console.log("[DEBUG-CI] localStorage contents:");
        console.log("[DEBUG-CI] - accessToken length:", accessToken?.length || 0);
        console.log("[DEBUG-CI] - refreshToken length:", refreshToken?.length || 0);
        console.log("[DEBUG-CI] - user data:", userStr);

        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: JSON.parse(userStr || "null"),
        };
      });

      console.log("[DEBUG-CI] Tokens retrieved:", {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        hasUser: !!tokens.user,
        userEmail: tokens.user?.email,
      });

      return tokens;
    } catch (error) {
      console.log("[DEBUG-CI] Error getting stored tokens:", error.message);
      return { accessToken: null, refreshToken: null, user: null };
    }
  }

  async expectToBeOnLoginPage() {
    // Verify we're on the login page
    await expect(this.page).toHaveURL("/login");

    // Verify login form elements are visible
    await expect(this.page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible();
  }

  async expectToBeLoggedIn() {
    // Verify we're on the home page (not login page)
    await expect(this.page).toHaveURL("/");

    // Verify that we have logged-in user elements visible (check for user-avatar specifically)
    await expect(this.page.locator('[data-testid="user-avatar"]')).toBeVisible();
  }
}
