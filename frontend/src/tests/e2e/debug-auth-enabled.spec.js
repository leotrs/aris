import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// @auth
import { AuthHelpers } from "./utils/auth-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

// Load environment variables from root .env file
dotenv.config({ path: path.resolve("../../../.env") });

const BACKEND_PORT = process.env.BACKEND_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

if (!BACKEND_PORT || !FRONTEND_PORT) {
  console.error("❌ FATAL: Required environment variables not set");
  process.exit(1);
}

test.describe("Debug Auth-Enabled Desktop Failures @auth", () => {
  let authHelpers;
  let consoleMessages = [];
  let jsErrors = [];

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    consoleMessages = [];
    jsErrors = [];

    // Capture all console messages and errors
    page.on("console", (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    page.on("pageerror", (error) => {
      jsErrors.push(error.message);
    });

    page.on("requestfailed", (request) => {
      console.log(
        `❌ Request failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`
      );
    });

    // Clear auth state
    await authHelpers.clearAuthState();
  });

  test("diagnose auth-enabled store initialization failure", async ({ page }) => {
    console.log("🔍 Starting diagnostic test for auth-enabled desktop failure");

    // Step 1: Verify backend is accessible
    console.log("📡 Testing backend connectivity...");
    const healthResponse = await page.request.get(`http://localhost:${BACKEND_PORT}/health`);
    console.log(`Backend health: ${healthResponse.status()}`);
    expect(healthResponse.ok()).toBeTruthy();

    // Step 2: Go to home page (should redirect to login)
    console.log("🏠 Navigating to home page...");
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Verify redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    console.log("✅ Correctly redirected to login page");

    // Step 3: Attempt login
    console.log("🔐 Attempting login...");
    await authHelpers.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);

    // Step 4: Wait for post-login navigation and capture state
    console.log("⏳ Waiting for post-login navigation...");
    try {
      await expect(page).toHaveURL("/", { timeout: 15000 });
      console.log("✅ Successfully navigated to home page after login");
    } catch (error) {
      console.log(`❌ Failed to navigate to home page: ${error.message}`);
      console.log(`Current URL: ${page.url()}`);
    }

    // Step 5: Check authentication state in localStorage
    console.log("🔍 Checking localStorage authentication state...");
    const authState = await page.evaluate(() => ({
      accessToken: localStorage.getItem("accessToken"),
      user: JSON.parse(localStorage.getItem("user") || "null"),
    }));

    console.log(`Auth token exists: ${!!authState.accessToken}`);
    console.log(`User data exists: ${!!authState.user}`);
    if (authState.user) {
      console.log(`User ID: ${authState.user.id}, Email: ${authState.user.email}`);
    }

    // Step 6: Check Vue app and store state
    console.log("🔍 Checking Vue app and store state...");
    const vueState = await page.evaluate(() => {
      try {
        // Try multiple ways to access the Vue app instance
        const appElement = document.querySelector("#app");
        let app = null;
        let root = null;

        // Method 1: Check if app is attached to DOM element
        if (appElement && appElement.__vue_app__) {
          app = appElement.__vue_app__;
          root = app._instance;
        }

        // Method 2: Check global Vue app instance
        if (!app && window.app) {
          app = window.app;
          root = app._instance;
        }

        // Method 3: Try to access via Vue devtools global
        if (!app && window.__VUE__) {
          app = window.__VUE__;
          root = app._instance;
        }

        // Get provides/inject values from the root component
        let provides = null;
        if (root && root.provides) {
          provides = root.provides;
        } else if (root && root.ctx && root.ctx.provides) {
          provides = root.ctx.provides;
        }

        // Extract values from reactive refs
        const getUserValue = () => {
          if (!provides?.user) return null;
          // Handle both ref objects and direct values
          return provides.user.value || provides.user;
        };

        const getFileStoreValue = () => {
          if (!provides?.fileStore) return null;
          // Handle both ref objects and direct values
          return provides.fileStore.value || provides.fileStore;
        };

        const user = getUserValue();
        const fileStore = getFileStoreValue();

        return {
          hasApp: !!app,
          hasRoot: !!root,
          hasProvides: !!provides,
          hasUser: !!user,
          hasFileStore: !!fileStore,
          hasApi: !!provides?.api,
          userValue: user
            ? {
                id: user.id,
                email: user.email,
                name: user.name,
              }
            : null,
          fileStoreState: fileStore
            ? {
                hasFiles: !!fileStore.files,
                filesLoaded:
                  Array.isArray(fileStore.files?.value) || Array.isArray(fileStore.files),
                filesCount: fileStore.files?.value?.length || fileStore.files?.length || 0,
                hasTags: !!fileStore.tags,
                tagsLoaded: Array.isArray(fileStore.tags?.value) || Array.isArray(fileStore.tags),
                tagsCount: fileStore.tags?.value?.length || fileStore.tags?.length || 0,
                isLoading: fileStore.isLoading?.value || fileStore.isLoading || false,
              }
            : null,
          appLoading: provides?.isAppLoading?.value || provides?.isAppLoading,
          debugInfo: {
            appElement: !!appElement,
            hasVueApp: !!(appElement && appElement.__vue_app__),
            hasWindowApp: !!window.app,
            hasVueGlobal: !!window.__VUE__,
            providesKeys: provides ? Object.keys(provides) : [],
            rootType: root ? typeof root : "null",
            providesType: provides ? typeof provides : "null",
          },
        };
      } catch (error) {
        return {
          error: error.message,
          stack: error.stack,
          hasApp: false,
          hasRoot: false,
          hasProvides: false,
          hasUser: false,
          hasFileStore: false,
        };
      }
    });

    console.log("Vue State Analysis:");
    if (vueState.error) {
      console.log(`  ❌ ERROR: ${vueState.error}`);
      console.log(`  Stack: ${vueState.stack}`);
    } else {
      console.log(`  - App mounted: ${vueState.hasApp}`);
      console.log(`  - Root instance: ${vueState.hasRoot}`);
      console.log(`  - Provides available: ${vueState.hasProvides}`);
      console.log(`  - User available: ${vueState.hasUser}`);
      console.log(`  - FileStore available: ${vueState.hasFileStore}`);
      console.log(`  - API available: ${vueState.hasApi}`);
      console.log(`  - App loading: ${vueState.appLoading}`);

      if (vueState.userValue) {
        console.log(`  - User ID: ${vueState.userValue.id}`);
        console.log(`  - User email: ${vueState.userValue.email}`);
      }

      if (vueState.fileStoreState) {
        console.log(
          `  - Files loaded: ${vueState.fileStoreState.filesLoaded} (count: ${vueState.fileStoreState.filesCount})`
        );
        console.log(
          `  - Tags loaded: ${vueState.fileStoreState.tagsLoaded} (count: ${vueState.fileStoreState.tagsCount})`
        );
        console.log(`  - Store loading: ${vueState.fileStoreState.isLoading}`);
      }

      console.log("Debug Info:");
      console.log(`  - App element exists: ${vueState.debugInfo.appElement}`);
      console.log(`  - Vue app attached: ${vueState.debugInfo.hasVueApp}`);
      console.log(`  - Window.app exists: ${vueState.debugInfo.hasWindowApp}`);
      console.log(`  - Provides keys: [${vueState.debugInfo.providesKeys.join(", ")}]`);
    }

    // Step 7: Check for specific UI elements that should be present
    console.log("🔍 Checking UI element availability...");

    const uiElements = {
      userAvatar: await page.locator('[data-testid="user-avatar"]').count(),
      filesContainer: await page.locator('[data-testid="files-container"]').count(),
      createFileButton: await page.locator('[data-testid="create-file-button"]').count(),
    };

    console.log("UI Elements:");
    console.log(`  - User avatar: ${uiElements.userAvatar} elements found`);
    console.log(`  - Files container: ${uiElements.filesContainer} elements found`);
    console.log(`  - Create file button: ${uiElements.createFileButton} elements found`);

    // Step 8: Test API calls that are failing
    console.log("🔍 Testing critical API endpoints...");

    // Test backend user state endpoint
    try {
      const debugResponse = await page.request.get(
        `http://localhost:${BACKEND_PORT}/debug/user-state`
      );
      console.log(`Debug user state endpoint: ${debugResponse.status()}`);
      if (debugResponse.ok()) {
        const debugData = await debugResponse.json();
        console.log("Backend user state:", JSON.stringify(debugData, null, 2));
      }
    } catch (error) {
      console.log(`❌ Debug user state endpoint failed: ${error.message}`);
    }

    if (authState.user?.id) {
      const userId = authState.user.id;

      // Test avatar endpoint (known to fail)
      try {
        const avatarResponse = await page.request.get(
          `http://localhost:${BACKEND_PORT}/users/${userId}/avatar`,
          {
            headers: authState.accessToken
              ? { Authorization: `Bearer ${authState.accessToken}` }
              : {},
          }
        );
        console.log(`Avatar endpoint: ${avatarResponse.status()}`);
      } catch (error) {
        console.log(`❌ Avatar endpoint failed: ${error.message}`);
      }

      // Test user settings endpoint (known to fail)
      try {
        const settingsResponse = await page.request.get(
          `http://localhost:${BACKEND_PORT}/settings/${userId}`,
          {
            headers: authState.accessToken
              ? { Authorization: `Bearer ${authState.accessToken}` }
              : {},
          }
        );
        console.log(`Settings endpoint: ${settingsResponse.status()}`);
      } catch (error) {
        console.log(`❌ Settings endpoint failed: ${error.message}`);
      }
    }

    // Step 9: Capture page content for analysis
    console.log("📄 Capturing page content...");
    const pageContent = await page.textContent("body");
    const hasErrorContent =
      pageContent.includes("Error") ||
      pageContent.includes("404") ||
      pageContent.includes("Network Error");
    console.log(`Page contains error indicators: ${hasErrorContent}`);

    // Step 10: Report all captured console messages and errors
    console.log("\n📝 Console Messages:");
    consoleMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg}`);
    });

    console.log("\n❌ JavaScript Errors:");
    jsErrors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });

    // Final assessment
    console.log("\n🎯 DIAGNOSTIC SUMMARY:");
    console.log(`✅ Backend accessible: ${healthResponse.ok()}`);
    console.log(`✅ Login successful: ${authState.accessToken && authState.user}`);
    console.log(`✅ Vue app mounted: ${vueState.hasApp}`);
    console.log(`✅ FileStore initialized: ${vueState.hasFileStore}`);
    console.log(
      `✅ UI elements present: ${uiElements.userAvatar > 0 && uiElements.filesContainer > 0}`
    );
    console.log(`Console errors: ${jsErrors.length}`);
    console.log(
      `Failed requests: ${consoleMessages.filter((msg) => msg.includes("failed")).length}`
    );

    // This test is for diagnostics - we expect it might "fail" to gather information
    // The actual assertion just ensures we captured the state
    expect(authState.accessToken).toBeTruthy(); // At minimum, login should work
  });
});
