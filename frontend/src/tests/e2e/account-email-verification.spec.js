import { test, expect } from "@playwright/test";
import { AuthHelpers } from "./utils/auth-helpers.js";

// @auth
test.describe("Account Email Verification E2E Tests @auth", () => {
  let authHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    await authHelpers.ensureLoggedIn();
  });

  test("displays email verification status correctly", async ({ page }) => {
    // Navigate to security page
    await page.goto("/account/security");

    // Wait for the page to load
    await expect(page.locator("h2:has-text('Account Status')")).toBeVisible();

    // Check for email verification status section
    const emailStatusItem = page.locator(".status-item").filter({ hasText: "Email" });
    await expect(emailStatusItem).toBeVisible();

    // The status should show either verified or unverified
    const statusIndicator = emailStatusItem.locator(".status-indicator");
    await expect(statusIndicator).toBeVisible();

    // Check for email address display
    const emailText = emailStatusItem.locator("p");
    await expect(emailText).toBeVisible();
    await expect(emailText).toContainText("@"); // Should contain an email
  });

  test("send verification email workflow for unverified users", async ({ page }) => {
    console.log("🧪 [EMAIL_VERIFICATION_TEST] Starting test");

    // Navigate to security page
    await page.goto("/account/security");
    console.log("🧪 [EMAIL_VERIFICATION_TEST] Navigated to /account/security");

    // EXTENSIVE LOGGING: Authentication state
    const authState = await page.evaluate(() => ({
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
      url: window.location.href,
    }));
    console.log("🧪 [EMAIL_VERIFICATION_TEST] Auth state:", JSON.stringify(authState, null, 2));

    // EXTENSIVE LOGGING: User object from component
    const componentState = await page.evaluate(() => {
      // Try to access Vue component data
      const app = window.__VUE_APP__;
      return {
        hasVueApp: !!app,
        userFromComponent: window.user || "not accessible",
      };
    });
    console.log(
      "🧪 [EMAIL_VERIFICATION_TEST] Component state:",
      JSON.stringify(componentState, null, 2)
    );

    // EXTENSIVE LOGGING: JavaScript console errors
    const jsErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        jsErrors.push(msg.text());
        console.log("🧪 [EMAIL_VERIFICATION_TEST] JS Error:", msg.text());
      }
    });

    // Look for email verification section
    const emailSection = page.locator(".status-item").filter({ hasText: "Email" });
    await expect(emailSection).toBeVisible();
    console.log("🧪 [EMAIL_VERIFICATION_TEST] Email section found and visible");

    // EXTENSIVE LOGGING: Email section content
    const emailSectionHTML = await emailSection.innerHTML();
    console.log("🧪 [EMAIL_VERIFICATION_TEST] Email section HTML:", emailSectionHTML);

    // Check if user is unverified (has warning indicator and send button)
    const isUnverified = await emailSection.locator(".status-indicator.warning").isVisible();
    const isVerified = await emailSection.locator(".status-indicator.verified").isVisible();
    console.log("🧪 [EMAIL_VERIFICATION_TEST] Verification status:", { isUnverified, isVerified });

    // EXTENSIVE LOGGING: All buttons on page
    const allButtons = await page.locator("button").all();
    const buttonInfo = [];
    for (const button of allButtons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      buttonInfo.push({ text, isVisible, isEnabled });
    }
    console.log(
      "🧪 [EMAIL_VERIFICATION_TEST] All buttons on page:",
      JSON.stringify(buttonInfo, null, 2)
    );

    // EXTENSIVE LOGGING: Specific verification buttons
    const verificationButtons = await page
      .locator("button")
      .filter({ hasText: /Send Verification Email|Sending|verification|email/i })
      .all();
    const verificationButtonInfo = [];
    for (const button of verificationButtons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      const classes = await button.getAttribute("class");
      verificationButtonInfo.push({ text, isVisible, isEnabled, classes });
    }
    console.log(
      "🧪 [EMAIL_VERIFICATION_TEST] Verification-related buttons:",
      JSON.stringify(verificationButtonInfo, null, 2)
    );

    // EXTENSIVE LOGGING: Check for verification actions div
    const verificationActionsExists = await page.locator(".verification-actions").isVisible();
    console.log(
      "🧪 [EMAIL_VERIFICATION_TEST] .verification-actions div visible:",
      verificationActionsExists
    );

    if (verificationActionsExists) {
      const verificationActionsHTML = await page.locator(".verification-actions").innerHTML();
      console.log(
        "🧪 [EMAIL_VERIFICATION_TEST] .verification-actions content:",
        verificationActionsHTML
      );
    }

    // Take screenshot for visual debugging
    await page.screenshot({ path: "test-results/email-verification-debug.png", fullPage: true });
    console.log(
      "🧪 [EMAIL_VERIFICATION_TEST] Screenshot saved to test-results/email-verification-debug.png"
    );

    if (isUnverified) {
      console.log(
        "🧪 [EMAIL_VERIFICATION_TEST] User appears unverified, looking for Send Verification Email button"
      );

      // Should have a "Send Verification Email" button (check for both possible states)
      const sendButton = page
        .locator("button")
        .filter({ hasText: /Send Verification Email|Sending/ })
        .first();

      // EXTENSIVE LOGGING: Button search results
      const sendButtonExists = await sendButton.count();
      console.log("🧪 [EMAIL_VERIFICATION_TEST] Send button count:", sendButtonExists);

      if (sendButtonExists > 0) {
        const buttonText = await sendButton.textContent();
        const buttonVisible = await sendButton.isVisible();
        const buttonEnabled = await sendButton.isEnabled();
        console.log("🧪 [EMAIL_VERIFICATION_TEST] Send button details:", {
          buttonText,
          buttonVisible,
          buttonEnabled,
        });
      }

      await expect(sendButton).toBeVisible();
      await expect(sendButton).toBeEnabled();

      // Click the send verification button
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes("/send-verification") && response.request().method() === "POST"
        ),
        sendButton.click(),
      ]);

      // Should show success message
      await expect(
        page
          .locator(".toast, .status-message")
          .filter({ hasText: /verification email sent|Verification email sent/i })
      ).toBeVisible({ timeout: 5000 });

      // Button should be disabled after sending
      await expect(sendButton).toBeDisabled();
    } else {
      // User is already verified, should show verified status
      const verifiedIndicator = emailSection.locator(".status-indicator.verified");
      await expect(verifiedIndicator).toBeVisible();

      // Should NOT have a send verification button
      const sendButton = page.locator('button:has-text("Send Verification Email")');
      await expect(sendButton).not.toBeVisible();
    }
  });

  test("handles verification errors gracefully", async ({ page }) => {
    // Navigate to security page
    await page.goto("/account/security");

    // Mock a network error for the verification request
    await page.route("**/send-verification", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ detail: "Internal server error" }),
      });
    });

    const _emailSection = page.locator(".status-item").filter({ hasText: "Email" });
    const sendButton = page.locator('button:has-text("Send Verification Email")');

    // Only test if user is unverified and button exists
    if (await sendButton.isVisible()) {
      await sendButton.click();

      // Should show error message
      await expect(
        page.locator(".toast, .status-message").filter({ hasText: "Failed" })
      ).toBeVisible({ timeout: 5000 });

      // Button should be re-enabled after error
      await expect(sendButton).toBeEnabled();
    }
  });

  test("email verification status updates correctly", async ({ page }) => {
    console.log("🧪 [EMAIL_STATUS_TEST] Starting test");

    // Navigate to security page
    await page.goto("/account/security");
    console.log("🧪 [EMAIL_STATUS_TEST] Navigated to /account/security");

    // EXTENSIVE LOGGING: Authentication state
    const authState = await page.evaluate(() => ({
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
      url: window.location.href,
    }));
    console.log("🧪 [EMAIL_STATUS_TEST] Auth state:", JSON.stringify(authState, null, 2));

    // EXTENSIVE LOGGING: Component state
    const componentState = await page.evaluate(() => {
      return {
        hasVueApp: !!window.__VUE_APP__,
        userFromComponent: window.user || "not accessible",
      };
    });
    console.log("🧪 [EMAIL_STATUS_TEST] Component state:", JSON.stringify(componentState, null, 2));

    // EXTENSIVE LOGGING: JavaScript console errors
    const jsErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        jsErrors.push(msg.text());
        console.log("🧪 [EMAIL_STATUS_TEST] JS Error:", msg.text());
      }
    });

    // Check initial email verification status
    const emailSection = page.locator(".status-item").filter({ hasText: "Email" });
    await expect(emailSection).toBeVisible();
    console.log("🧪 [EMAIL_STATUS_TEST] Email section found and visible");

    // EXTENSIVE LOGGING: Email section content
    const emailSectionHTML = await emailSection.innerHTML();
    console.log("🧪 [EMAIL_STATUS_TEST] Email section HTML:", emailSectionHTML);

    const statusIndicator = emailSection.locator(".status-indicator");
    await expect(statusIndicator).toBeVisible();

    // The status indicator should have either 'verified' or 'warning' class
    const hasVerifiedClass = await statusIndicator.evaluate((el) =>
      el.classList.contains("verified")
    );
    const hasWarningClass = await statusIndicator.evaluate((el) =>
      el.classList.contains("warning")
    );
    console.log("🧪 [EMAIL_STATUS_TEST] Status classes:", { hasVerifiedClass, hasWarningClass });

    expect(hasVerifiedClass || hasWarningClass).toBe(true);

    // EXTENSIVE LOGGING: All buttons on page
    const allButtons = await page.locator("button").all();
    const buttonInfo = [];
    for (const button of allButtons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      buttonInfo.push({ text, isVisible, isEnabled });
    }
    console.log("🧪 [EMAIL_STATUS_TEST] All buttons on page:", JSON.stringify(buttonInfo, null, 2));

    // EXTENSIVE LOGGING: Specific verification buttons
    const verificationButtons = await page
      .locator("button")
      .filter({ hasText: /Send Verification Email|Sending|verification|email/i })
      .all();
    const verificationButtonInfo = [];
    for (const button of verificationButtons) {
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      const classes = await button.getAttribute("class");
      verificationButtonInfo.push({ text, isVisible, isEnabled, classes });
    }
    console.log(
      "🧪 [EMAIL_STATUS_TEST] Verification-related buttons:",
      JSON.stringify(verificationButtonInfo, null, 2)
    );

    // Take screenshot for visual debugging
    await page.screenshot({ path: "test-results/email-status-debug.png", fullPage: true });
    console.log("🧪 [EMAIL_STATUS_TEST] Screenshot saved to test-results/email-status-debug.png");

    if (hasWarningClass) {
      console.log("🧪 [EMAIL_STATUS_TEST] User appears unverified, checking elements");

      // User is unverified
      await expect(emailSection.locator("h3")).toContainText("Email Not Verified");
      const sendButton = page
        .locator("button")
        .filter({ hasText: /Send Verification Email|Sending/ })
        .first();

      // EXTENSIVE LOGGING: Button search results
      const sendButtonExists = await sendButton.count();
      console.log("🧪 [EMAIL_STATUS_TEST] Send button count:", sendButtonExists);

      if (sendButtonExists > 0) {
        const buttonText = await sendButton.textContent();
        const buttonVisible = await sendButton.isVisible();
        const buttonEnabled = await sendButton.isEnabled();
        console.log("🧪 [EMAIL_STATUS_TEST] Send button details:", {
          buttonText,
          buttonVisible,
          buttonEnabled,
        });
      }

      await expect(sendButton).toBeVisible();
    } else {
      console.log("🧪 [EMAIL_STATUS_TEST] User appears verified, checking elements");

      // User is verified
      await expect(emailSection.locator("h3")).toContainText("Email Verified");
      const sendButton = page
        .locator("button")
        .filter({ hasText: /Send Verification Email|Sending/ });

      // EXTENSIVE LOGGING: Button should not exist
      const sendButtonCount = await sendButton.count();
      console.log("🧪 [EMAIL_STATUS_TEST] Send button count (should be 0):", sendButtonCount);

      await expect(sendButton).not.toBeVisible();
    }

    console.log("🧪 [EMAIL_STATUS_TEST] Test completed");
  });

  test("verification button loading state", async ({ page }) => {
    await page.goto("/account/security");

    const sendButton = page.locator('button:has-text("Send Verification Email")');

    // Only test if button exists (user is unverified)
    if (await sendButton.isVisible()) {
      // Mock slow response to test loading state
      await page.route("**/send-verification", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "Verification email sent successfully" }),
        });
      });

      await sendButton.click();

      // Should show loading state
      await expect(sendButton).toContainText("Sending...");
      await expect(sendButton).toBeDisabled();

      // Wait for response
      await expect(sendButton).toContainText("Send Verification Email", { timeout: 3000 });
    }
  });
});
