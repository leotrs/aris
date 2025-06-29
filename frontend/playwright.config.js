import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

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
  timeout: 15000, // 15 seconds - allows for auth operations
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",
    /* Always run in headless mode */
    headless: true,
    /* Collect trace only on failure, not retry */
    trace: "retain-on-failure",
    /* Take screenshot on failure */
    screenshot: "only-on-failure",
    /* Disable video recording for faster execution */
    video: "off",
    /* Fast timeouts - if tests fail, fix the underlying issue */
    actionTimeout: 5000, // 5 seconds for actions
    navigationTimeout: 8000, // 8 seconds max for navigation
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        // CI: Run on all browsers for comprehensive testing
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

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: !process.env.CI,
      },
});
