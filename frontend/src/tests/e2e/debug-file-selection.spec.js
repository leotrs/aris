import { test } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";
import { TEST_CREDENTIALS } from "./setup/test-data.js";

test.describe("Debug File Selection", () => {
  let authHelpers;
  let fileHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    // Clear auth state and login
    await authHelpers.clearAuthState();

    // Skip tests if no valid credentials available
    const hasValidCredentials = TEST_CREDENTIALS.valid.password;
    test.skip(!hasValidCredentials, "Requires valid test credentials");

    // Login with valid credentials
    await authHelpers.login(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);

    try {
      await authHelpers.expectToBeLoggedIn();
    } catch {
      test.skip(true, "Login failed - cannot test file operations");
    }
  });

  test("debug file selection mechanism", async ({ page }) => {
    // Listen for console messages and errors
    const consoleMessages = [];
    const jsErrors = [];

    page.on("console", (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    page.on("pageerror", (error) => {
      jsErrors.push(`JS Error: ${error.message}`);
      console.log("Page error:", error.message);
    });

    page.on("requestfailed", (request) => {
      jsErrors.push(
        `Failed request: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`
      );
    });

    // Create a test file
    const fileId = await fileHelpers.createNewFile();
    await fileHelpers.navigateToHome();

    // Wait for files to load
    await fileHelpers.waitForFilesLoaded();

    // Check what Vue components are available
    console.log("=== Checking Vue components ===");
    const componentCheck = await page.evaluate(() => {
      const results = {
        filesContainer: null,
        anyVueComponents: [],
        fileStoreFromRoot: null,
      };

      // Check for files-container
      const filesContainer = document.querySelector('[data-testid="files-container"]');
      results.filesContainer = {
        exists: !!filesContainer,
        hasVue: !!(filesContainer && filesContainer.__vue__),
        childCount: filesContainer ? filesContainer.children.length : 0,
      };

      // Look for any Vue components
      const allElements = document.querySelectorAll("*");
      let vueComponentCount = 0;
      allElements.forEach((el) => {
        if (el.__vue__) {
          vueComponentCount++;
          if (vueComponentCount <= 3) {
            // Only collect first few
            results.anyVueComponents.push({
              tagName: el.tagName,
              hasFileStore: !!el.__vue__.fileStore,
              className: el.className,
              id: el.id,
            });
          }
        }
      });
      results.totalVueComponents = vueComponentCount;

      // Try to get fileStore from root app
      const rootApp = document.querySelector("#app");
      if (rootApp && rootApp.__vue__) {
        const rootFileStore = rootApp.__vue__.fileStore;
        results.fileStoreFromRoot = {
          exists: !!rootFileStore,
          hasValue: !!(rootFileStore && rootFileStore.value),
          isNull: rootFileStore ? rootFileStore.value === null : "no fileStore",
        };
      }

      return results;
    });
    console.log("Component check:", JSON.stringify(componentCheck, null, 2));

    // Get the file item
    const fileItem = await fileHelpers.getFileItem(fileId);

    // Debug: Print initial state
    console.log("=== Initial State ===");
    const initialClasses = await fileItem.getAttribute("class");
    console.log("Initial classes:", initialClasses);

    // Debug: Check if Vue store exists
    const storeExists = await page.evaluate(() => {
      return window.Vue && window.Vue.config && window.Vue.config.globalProperties;
    });
    console.log("Vue store accessible:", storeExists);

    // Debug: Check if fileStore is available
    const fileStoreAvailable = await page.evaluate(() => {
      // Try to access fileStore from the Vue app
      const app = document.querySelector('[data-testid="files-container"]');
      if (app && app.__vue__) {
        return !!app.__vue__.fileStore;
      }
      return false;
    });
    console.log("FileStore available:", fileStoreAvailable);

    // Debug: Focus and click the file item
    console.log("=== Focusing file item ===");
    await fileItem.focus();

    const focusedClasses = await fileItem.getAttribute("class");
    console.log("Classes after focus:", focusedClasses);

    console.log("=== Clicking file item ===");
    await fileItem.click();

    // Wait a bit for Vue reactivity
    await page.waitForTimeout(500);

    const clickedClasses = await fileItem.getAttribute("class");
    console.log("Classes after click:", clickedClasses);

    // Debug: Check if selectFile was called
    const selectFileCalled = await page.evaluate((fileId) => {
      // Check if we can access the file object and its selected property
      const app = document.querySelector('[data-testid="files-container"]');
      if (app && app.__vue__) {
        const fileStore = app.__vue__.fileStore;
        if (fileStore && fileStore.value && fileStore.value.files && fileStore.value.files.value) {
          const file = fileStore.value.files.value.find((f) => f.id.toString() === fileId);
          if (file) {
            console.log("File found in store:", file.id, "selected:", file.selected);
            return file.selected;
          }
        }
      }
      return null;
    }, fileId);
    console.log("File selected in store:", selectFileCalled);

    // Debug: Check the file's selected property directly
    const fileSelected = await page.evaluate((fileId) => {
      const fileItem = document.querySelector(`[data-testid="file-item-${fileId}"]`);
      if (fileItem && fileItem.__vue__) {
        const fileModel = fileItem.__vue__.file;
        return fileModel ? fileModel.selected : null;
      }
      return null;
    }, fileId);
    console.log("File selected property:", fileSelected);

    // Debug: Check if click handler exists
    const clickHandlerExists = await page.evaluate((fileId) => {
      const fileItem = document.querySelector(`[data-testid="file-item-${fileId}"]`);
      if (fileItem && fileItem.__vue__) {
        const vm = fileItem.__vue__;
        return {
          hasSelect: typeof vm.select === "function",
          hasFileStore: !!vm.fileStore,
          fileStoreType: typeof vm.fileStore,
          fileStoreValue: vm.fileStore?.value ? "has value" : "no value",
        };
      }
      return null;
    }, fileId);
    console.log("Component state:", clickHandlerExists);

    // Check if Vue is loaded
    const vueLoaded = await page.evaluate(() => {
      return {
        vueGlobal: typeof window.Vue,
        createApp: typeof window.createApp,
        hasVueScript: !!document.querySelector('script[src*="vue"]'),
        scriptTags: Array.from(document.querySelectorAll("script"))
          .map((s) => s.src)
          .filter((src) => src),
      };
    });
    console.log("=== Vue Loading Check ===");
    console.log("Vue loaded:", JSON.stringify(vueLoaded, null, 2));

    // Print console messages and errors from the browser
    console.log("=== Console Messages ===");
    consoleMessages.forEach((msg) => console.log(msg));

    console.log("=== JavaScript Errors ===");
    jsErrors.forEach((error) => console.log(error));

    // Clean up - don't clean up for now to avoid the context menu error
    // await fileHelpers.deleteFile(fileId);
  });
});
