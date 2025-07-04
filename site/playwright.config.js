import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry failed tests - more retries on CI, fewer locally */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Global test timeout - max time for individual test */
  timeout: 60000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${process.env.SITE_PORT}`,
    /* Timeout for individual actions like click, fill, etc. */
    actionTimeout: 10000,
    /* Timeout for navigation actions like goto, waitForLoadState */
    navigationTimeout: 30000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Take screenshot on failure */
    screenshot: "only-on-failure",
    /* Disable video recording for performance */
    video: "off",
    /* Enable touch support for mobile tests */
    hasTouch: true,
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        // CI: All browsers for comprehensive testing
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
          name: "Mobile Firefox",
          use: { ...devices["Pixel 5"], channel: "firefox" },
        },
        {
          name: "Mobile Safari",
          use: { ...devices["iPhone 12"] },
        },
      ]
    : [
        // Local: Run only Chromium for faster development
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ],

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "NODE_ENV=test npm run dev",
    url: `http://localhost:${process.env.SITE_PORT}`,
    reuseExistingServer: true, // Always reuse existing server (CI starts it manually)
  },
});
