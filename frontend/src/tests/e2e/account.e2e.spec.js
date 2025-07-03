import { test, expect } from "@playwright/test";

// @auth
import { AuthHelpers } from "./utils/auth-helpers.js";

test.describe("Account View E2E Tests @auth @desktop-only", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Ensure authenticated state for account tests
    await authHelpers.ensureLoggedIn();
  });
});
