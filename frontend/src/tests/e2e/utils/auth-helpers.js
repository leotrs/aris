import { expect } from "@playwright/test";
import { TEST_CREDENTIALS } from "../setup/test-data.js";
import { getTimeouts } from "./timeout-constants.js";

export class AuthHelpers {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.VITE_API_BASE_URL || "http://localhost:8001";
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

  /**
   * API-based token injection - bypasses UI login for speed
   */
  async fastAuth(email = TEST_CREDENTIALS.valid.email, password = TEST_CREDENTIALS.valid.password) {
    console.log("[AuthHelpers] Using fast API-based authentication");

    try {
      // Ensure we're on a page that allows localStorage access
      const currentUrl = this.page.url();
      if (!currentUrl.includes("localhost")) {
        await this.page.goto("/");
        await this.page.waitForLoadState("domcontentloaded");
      }

      // Direct API login request
      const response = await this.page.request.post(`${this.baseURL}/login`, {
        data: {
          email: email,
          password: password,
        },
      });

      if (!response.ok()) {
        throw new Error(`API login failed: ${response.status()}`);
      }

      const authData = await response.json();

      // Fetch user data using the access token
      const userResponse = await this.page.request.get(`${this.baseURL}/me`, {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      });

      if (!userResponse.ok()) {
        throw new Error(`Failed to fetch user data: ${userResponse.status()}`);
      }

      const userData = await userResponse.json();

      // Inject tokens and user data directly into localStorage
      await this.page.evaluate(
        ({ accessToken, refreshToken, user }) => {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", JSON.stringify(user));
        },
        {
          accessToken: authData.access_token,
          refreshToken: authData.refresh_token,
          user: userData,
        }
      );

      // Navigate to home page to activate the auth state
      await this.page.goto("/");
      await this.page.waitForLoadState("domcontentloaded");

      // Force Vue app to re-initialize by reloading after localStorage is set
      await this.page.reload();
      await this.page.waitForLoadState("domcontentloaded");

      // Wait for authenticated UI elements to be ready (deterministic wait)
      await this.page.waitForSelector('[data-testid="user-avatar"], [data-testid="user-menu"]', {
        timeout: getTimeouts().contentLoad,
      });

      // Wait for files container to be ready (indicates fileStore is initialized and has data)
      await this.page.waitForSelector(
        '[data-testid="files-container"], [data-testid="create-file-button"]',
        {
          timeout: getTimeouts().contentLoad,
        }
      );

      console.log("[AuthHelpers] Fast auth completed successfully");
      return true;
    } catch (error) {
      console.warn("[AuthHelpers] Fast auth failed, falling back to UI login:", error.message);
      return false;
    }
  }

  /**
   * Lightweight auth verification - no page loads or redirects
   */
  async verifyLoggedIn() {
    try {
      const tokens = await this.page.evaluate(() => ({
        accessToken: localStorage.getItem("accessToken"),
        user: localStorage.getItem("user"),
      }));

      if (!tokens.accessToken || !tokens.user) {
        console.log("[AuthHelpers] No valid tokens found, need to authenticate");
        return false;
      }

      console.log("[AuthHelpers] Valid tokens found, user is authenticated");
      return true;
    } catch (_error) {
      // localStorage access may fail if no page is loaded
      console.log("[AuthHelpers] Cannot access localStorage, need to navigate to page first");
      return false;
    }
  }

  /**
   * Storage state management for shared auth across tests
   */
  async saveAuthState(storageStatePath) {
    await this.page.context().storageState({ path: storageStatePath });
    console.log(`[AuthHelpers] Auth state saved to ${storageStatePath}`);
  }

  async loadAuthState(storageStatePath) {
    // Note: Storage state is loaded at context creation time
    console.log(`[AuthHelpers] Auth state loaded from ${storageStatePath}`);
  }

  /**
   * Fast authentication with multiple fallback strategies
   */
  async ensureLoggedIn(skipDOMVerification = false) {
    // Navigate to home page first to enable localStorage access
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");

    // Check if already authenticated (lightweight)
    if (await this.verifyLoggedIn()) {
      console.log("[AuthHelpers] Already authenticated, skipping login");
      return;
    }

    // Skip API auth in local development if test user isn't configured
    const hasTestUser = process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD;
    if (hasTestUser) {
      // Try fast API auth first
      const fastAuthSuccess = await this.fastAuth();
      if (fastAuthSuccess) {
        if (!skipDOMVerification) {
          await this.page.goto("/");
          await this.page.waitForLoadState("domcontentloaded");
        }
        return;
      }
    } else {
      console.log("[AuthHelpers] Test user not configured, skipping API auth");
    }

    // Fallback to original UI-based authentication
    console.log("[AuthHelpers] Falling back to UI-based authentication");
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
    let finalAccessToken, finalUser, finalRefreshToken;
    try {
      finalAccessToken = await this.page.evaluate(() => localStorage.getItem("accessToken"));
      finalUser = await this.page.evaluate(() => localStorage.getItem("user"));
      finalRefreshToken = await this.page.evaluate(() => localStorage.getItem("refreshToken"));
    } catch (error) {
      console.error("[AuthHelpers] Failed to verify tokens:", error.message);
      throw new Error("Failed to access localStorage for token verification");
    }

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

    // Skip DOM verification if requested (for speed)
    if (!skipDOMVerification) {
      // Verify we're logged in by checking for home page elements
      console.log("[AuthHelpers] Verifying home page elements");
      await expect(this.page).toHaveURL("/");
      await this.page.waitForSelector(
        '[data-testid="files-container"], [data-testid="create-file-button"], [data-testid="user-menu"]'
      );
    }

    console.log("[AuthHelpers] ensureLoggedIn completed successfully");
  }

  async logout() {
    await this.page.click('[data-testid="user-avatar"]');
    await this.page.click('[data-testid="user-logout"]');
  }

  async clearAuthState() {
    try {
      // Navigate to a page first to ensure proper context
      await this.page.goto("/login", { waitUntil: "domcontentloaded" });
      await this.page.waitForLoadState("load");
      
      // Clear storage after page is fully loaded
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch {
      // Ignore localStorage access errors in tests
    }
  }

  async getStoredTokens() {
    console.log("[DEBUG-CI] Getting stored tokens from localStorage");
    try {
      // Ensure page is ready for localStorage access
      await this.page.waitForLoadState("load");
      
      const tokens = await this.page.evaluate(() => {
        // Check if localStorage is available before accessing
        if (typeof Storage === "undefined" || typeof localStorage === "undefined") {
          return { accessToken: null, refreshToken: null, user: null };
        }
        
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
