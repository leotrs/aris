import { expect } from "@playwright/test";
import { TEST_CREDENTIALS } from "../setup/test-data.js";

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

      // Wait for the home page to load - the test user should always have files
      // so we expect either the files container with files or the create button to be present
      await this.page.waitForSelector(
        '[data-testid="files-container"], [data-testid="create-file-button"]',
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
    // Wait for backend to be available before checking auth status
    let backendAvailable = false;
    const maxRetries = 10;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const healthResponse = await this.page.request.get("http://localhost:8000/health");
        if (healthResponse.ok()) {
          backendAvailable = true;
          break;
        }
      } catch {
        console.log(`Backend health check attempt ${i + 1}/${maxRetries} failed, retrying...`);
        await this.page.waitForTimeout(2000);
      }
    }

    if (!backendAvailable) {
      throw new Error(
        "Backend server at http://localhost:8000 is not accessible after multiple attempts. Check if the server is running and reachable."
      );
    }

    try {
      // When DISABLE_AUTH=true, we need to send a fake token to bypass OAuth2PasswordBearer
      // The current_user dependency will still return mock user regardless of token validity
      const response = await this.page.request.get("http://localhost:8000/me", {
        headers: {
          Authorization: "Bearer fake-token-for-disabled-auth",
        },
      });

      // If we get a successful response, check if it's the mock user (auth disabled)
      if (response.ok()) {
        const data = await response.json();
        // Check if we got the mock user response indicating auth is disabled
        return data.email === "test@example.com" && data.name === "Test User";
      }

      // If we get 401, auth is enabled and working normally
      return false;
    } catch (error) {
      console.log(`Auth check failed: ${error.message}`);
      // If there's a network error or other issue, assume auth is enabled for safety
      return false;
    }
  }

  async ensureLoggedIn() {
    // First, check if auth is disabled (this will also verify backend connectivity)
    const authDisabled = await this.isAuthDisabled();

    if (authDisabled) {
      // Auth is disabled, just go to home page
      await this.page.goto("/");
      await this.page.waitForLoadState("networkidle");
      await this.expectToBeLoggedIn();
      return;
    }

    // Auth is enabled, need to login
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");

    // Wait a moment for any potential redirects to happen
    await this.page.waitForTimeout(1500);

    // Check where we ended up
    const currentUrl = this.page.url();

    if (currentUrl.includes("/login")) {
      // We were redirected to login, so auth is enabled - need to login
      const email = TEST_CREDENTIALS.valid.email;
      const password =
        process.env.VITE_DEV_LOGIN_PASSWORD || TEST_CREDENTIALS.valid.password || "testpassword123";
      console.log(
        `Attempting login with email: ${email}, password length: ${password?.length || "undefined"}, from env: ${!!process.env.VITE_DEV_LOGIN_PASSWORD}`
      );

      // Add backend connectivity check before attempting login
      try {
        const healthCheck = await this.page.request.get("http://localhost:8000/health");
        if (!healthCheck.ok()) {
          throw new Error(`Backend health check failed with status ${healthCheck.status()}`);
        }
        console.log("Backend health check passed, proceeding with login");
      } catch (error) {
        throw new Error(
          `Backend connectivity check failed before login attempt: ${error.message}. Please ensure backend server is running and accessible.`
        );
      }

      await this.login(email, password);

      // Check if login was successful
      await this.page.waitForTimeout(1000);
      const postLoginUrl = this.page.url();
      if (postLoginUrl.includes("/login")) {
        // Check for error messages on the page
        const errorElement = await this.page
          .locator('[data-testid="login-error"]')
          .textContent()
          .catch(() => "Network Error");

        // Provide specific error messages based on the error type
        let errorMessage = `Login failed: still on login page after attempting login with ${email}.`;

        if (errorElement === "Network Error" || errorElement.includes("Network Error")) {
          errorMessage += ` Network Error detected - this usually means the backend server is not accessible or the API request failed. Check that the backend is running at http://localhost:8000 and is reachable from the test environment.`;
        } else if (errorElement === "No error message found") {
          errorMessage += ` No specific error message found on page. This could indicate invalid credentials or backend connectivity issues.`;
        } else {
          errorMessage += ` Error: ${errorElement}.`;
        }

        errorMessage += ` Check if test user exists, password is correct, and backend is accessible.`;

        throw new Error(errorMessage);
      }
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
