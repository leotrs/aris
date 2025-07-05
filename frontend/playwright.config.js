import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root .env file
dotenv.config({ path: path.resolve("../.env") });

// Get ports from environment - NO fallbacks, will crash if not set
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const BACKEND_PORT = process.env.BACKEND_PORT;

if (!FRONTEND_PORT || !BACKEND_PORT) {
  console.error("❌ FATAL: Required environment variables not set");
  console.error(
    "   Missing:",
    [!FRONTEND_PORT && "FRONTEND_PORT", !BACKEND_PORT && "BACKEND_PORT"].filter(Boolean).join(", ")
  );
  console.error("   Ensure .env file exists at project root with all required variables");
  process.exit(1);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./src/tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry configuration */
  retries: process.env.CI ? 1 : 0, // Minimal retries in CI, none locally
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2, // Limit workers for faster startup
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "github" : "line", // Use github reporter in CI for cleaner output
  /* Global timeout for each test */
  timeout: 10000, // 10 seconds - fast feedback for debugging
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${FRONTEND_PORT}`,
    /* Always run in headless mode */
    headless: true,
    /* Collect trace only on failure, not retry */
    trace: "retain-on-failure",
    /* Take screenshot on failure */
    screenshot: "only-on-failure",
    /* Disable video recording for faster execution */
    video: "off",
    /* Fast timeouts - if tests fail, fix the underlying issue */
    actionTimeout: 3000, // 3 seconds for actions
    navigationTimeout: 5000, // 5 seconds max for navigation
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        // CI: All browsers for comprehensive testing across different OS runners
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] },
        },
        {
          name: "webkit",
          use: { ...devices["Desktop Safari"] },
        },
        {
          name: "Mobile Chrome",
          use: { ...devices["Pixel 5"] },
        },
        {
          name: "Mobile Safari",
          use: { ...devices["iPhone 12"] },
        },
      ]
    : [
        // Development: Run on Chromium only for speed
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ],

  /* Use containerized dev server - no local webServer needed */
  webServer: undefined,
});
