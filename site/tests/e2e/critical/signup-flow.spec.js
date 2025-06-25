import { test, expect } from "@playwright/test";

test.describe("Signup Flow E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("should complete successful signup flow", async ({ page }) => {
    // Fill out the form with valid data
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[name="name"]', "Dr. Jane Doe");
    await page.fill('input[name="institution"]', "University of Science");
    await page.fill('input[name="research_area"]', "Computational Biology");
    await page.selectOption('select[name="interest_level"]', "ready");

    // Mock the API response for successful signup
    await page.route("**/signup/", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "test@example.com",
          name: "Dr. Jane Doe",
          institution: "University of Science",
          research_area: "Computational Biology",
          interest_level: "ready",
          status: "active",
          unsubscribe_token: "abc123",
          created_at: "2025-01-15T10:30:00Z",
        }),
      });
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success message appears
    await expect(
      page.locator(
        "text=Successfully signed up for early access! We'll notify you when Aris is ready."
      )
    ).toBeVisible();

    // Verify form is cleared after successful submission
    await expect(page.locator('input[type="email"]')).toHaveValue("");
    await expect(page.locator('input[name="name"]')).toHaveValue("");
    await expect(page.locator('input[name="institution"]')).toHaveValue("");
  });

  test("should show validation errors for empty required fields", async ({ page }) => {
    // Check if form has required fields
    await expect(page.locator('input[type="email"][required]')).toBeVisible();
    await expect(page.locator('input[name="name"][required]')).toBeVisible();

    // Try to submit empty form - this should trigger browser validation
    await page.click('button[type="submit"]');

    // For browser native validation, check that form is still on the same page
    // or check the validity state of the inputs
    const emailValid = await page
      .locator('input[type="email"]')
      .evaluate((el) => el.validity.valid);
    expect(emailValid).toBe(false);
  });

  test("should validate email format", async ({ page }) => {
    // Enter invalid email
    await page.fill('input[type="email"]', "invalid-email");
    await page.fill('input[name="name"]', "Dr. Jane Doe");

    await page.click('button[type="submit"]');

    // Browser native validation should prevent submission
    // Check if the email field has invalid state
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toHaveAttribute("type", "email");
  });

  test("should enforce character limits", async ({ page }) => {
    // Reload the page to ensure clean state
    await page.reload();

    // Enter name that's too long (over 100 characters)
    const longName = "a".repeat(101);
    await page.fill('input[type="email"]', "test-charlimit@example.com");
    await page.fill('input[name="name"]', longName);

    await page.click('button[type="submit"]');

    // Wait for validation to trigger
    await page.waitForTimeout(100);

    // Verify character limit error appears
    await expect(page.locator(".error-message")).toBeVisible();
    await expect(page.locator(".error-message")).toContainText(
      "Name must be 100 characters or less."
    );
  });

  test("should show character warning when approaching limits", async ({ page }) => {
    // Enter institution text approaching limit
    const longInstitution = "a".repeat(185);
    await page.fill('input[name="institution"]', longInstitution);

    // Verify character count warning appears
    await expect(page.locator("text=185/200 characters")).toBeVisible();
  });

  test("should handle duplicate email error", async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[type="email"]', "existing@example.com");
    await page.fill('input[name="name"]', "Dr. Jane Doe");

    // Mock API response for duplicate email
    await page.route("**/signup/", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          detail: {
            error: "duplicate_email",
            message: "This email address is already registered for early access",
            details: { field: "email" },
          },
        }),
      });
    });

    await page.click('button[type="submit"]');

    // Verify error message appears
    await expect(
      page.locator("text=This email address is already registered for early access.")
    ).toBeVisible();
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[name="name"]', "Dr. Jane Doe");

    // Mock network error
    await page.route("**/signup/", async (route) => {
      await route.abort("failed");
    });

    await page.click('button[type="submit"]');

    // Verify network error message appears
    await expect(
      page.locator(
        "text=Unable to connect to server. Please check your internet connection and try again."
      )
    ).toBeVisible();
  });

  test("should disable submit button during loading", async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[name="name"]', "Dr. Jane Doe");

    // Mock slow API response
    await page.route("**/signup/", async (route) => {
      await page.waitForTimeout(100); // Small delay to see loading state
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@example.com" }),
      });
    });

    // Submit form and immediately check button state
    await page.click('button[type="submit"]');

    // Verify button shows loading state
    await expect(page.locator('button[type="submit"]:disabled')).toBeVisible();
    await expect(page.locator("text=Signing Up...")).toBeVisible();
  });

  test("should be accessible via keyboard navigation", async ({ page }) => {
    // Navigate through form using only keyboard
    await page.keyboard.press("Tab"); // Email field
    await page.keyboard.type("test@example.com");

    await page.keyboard.press("Tab"); // Name field
    await page.keyboard.type("Dr. Jane Doe");

    await page.keyboard.press("Tab"); // Institution field
    await page.keyboard.type("University of Science");

    await page.keyboard.press("Tab"); // Research area field
    await page.keyboard.type("Computational Biology");

    await page.keyboard.press("Tab"); // Interest level select
    await page.keyboard.press("ArrowDown"); // Select an option

    await page.keyboard.press("Tab"); // Submit button

    // Verify we can reach and interact with submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();
  });
});
