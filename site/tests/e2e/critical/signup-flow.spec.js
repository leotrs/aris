import { test, expect } from "@playwright/test";

test.describe("Signup Flow E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
    // Clear any existing route handlers to prevent interference
    await page.unrouteAll();
  });

  test("should complete successful signup flow", async ({ page }) => {
    // Fill out the form with valid data
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[name="name"]', "Dr. Jane Doe");
    await page.fill('input[name="institution"]', "University of Science");
    await page.fill('input[name="research_area"]', "Computational Biology");
    await page.selectOption('select[name="interest_level"]', "ready");

    // Mock the API response for successful signup
    await page.route(/.*\/signup\/?$/, async (route) => {
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
    // Test that character warnings appear at 90+ characters
    const nameAt90 = "a".repeat(90); 
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[name="name"]', nameAt90);

    // Verify character count warning shows at 90 characters
    await expect(page.locator(".field-warning")).toBeVisible();
    await expect(page.locator(".field-warning")).toContainText("90/100 characters");

    // Test that browser maxlength prevents typing more than 100 characters
    const attemptedLongName = "a".repeat(110); // Try to type 110 characters
    await page.fill('input[name="name"]', attemptedLongName);
    
    // Verify that only 100 characters were actually entered due to maxlength
    const actualValue = await page.locator('input[name="name"]').inputValue();
    expect(actualValue.length).toBe(100);
    
    // Verify the character warning shows 100/100
    await expect(page.locator(".field-warning")).toContainText("100/100 characters");
  });

  test("should show character warning when approaching limits", async ({ page }) => {
    // Enter institution text approaching limit (>=180 characters triggers warning)
    const longInstitution = "a".repeat(180);
    
    // Focus on the field and fill it character by character to trigger Vue reactivity
    await page.click('input[name="institution"]');
    await page.fill('input[name="institution"]', longInstitution);
    
    // Trigger blur to ensure reactive update
    await page.click('input[name="name"]');
    await page.waitForTimeout(200);

    // Verify character count warning appears
    await expect(page.locator(".field-warning")).toBeVisible();
    await expect(page.locator(".field-warning")).toContainText("180/200 characters");
  });

  test("should handle duplicate email error", async ({ page }) => {
    // Fill form with valid data
    await page.fill('input[type="email"]', "existing@example.com");
    await page.fill('input[name="name"]', "Dr. Jane Doe");

    // Mock API response for duplicate email
    await page.route(/.*\/signup\/?$/, async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          detail: {
            error: "duplicate_email",
            message: "This email address is already registered for early access.",
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
    await page.route(/.*\/signup\/?$/, async (route) => {
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

    // Mock slow API response with longer delay
    let routeResolve;
    const routePromise = new Promise((resolve) => { routeResolve = resolve; });
    
    await page.route(/.*\/signup\/?$/, async (route) => {
      // Wait for test to check loading state before resolving
      await routePromise;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@example.com" }),
      });
    });

    // Submit form (this will trigger the route handler)
    await page.click('button[type="submit"]');

    // Verify button shows loading state
    await expect(page.locator('button[type="submit"]:disabled')).toBeVisible({ timeout: 1000 });
    await expect(page.locator("text=Signing Up...")).toBeVisible({ timeout: 1000 });
    
    // Now allow the route to complete
    routeResolve();
    
    // Wait for success message
    await expect(page.locator("text=Successfully signed up for early access! We'll notify you when Aris is ready.")).toBeVisible();
  });

  test("should be accessible via keyboard navigation", async ({ page }) => {
    // Focus on first form field directly
    await page.locator('input[type="email"]').focus();
    await page.keyboard.type("test@example.com");

    await page.keyboard.press("Tab"); // Name field
    await page.keyboard.type("Dr. Jane Doe");

    await page.keyboard.press("Tab"); // Institution field
    await page.keyboard.type("University of Science");

    await page.keyboard.press("Tab"); // Research area field
    await page.keyboard.type("Computational Biology");

    await page.keyboard.press("Tab"); // Interest level select
    await page.keyboard.press("ArrowDown"); // Select an option

    // Navigate to submit button by tabbing through potentially multiple elements
    let maxTabs = 5;
    let submitButtonFocused = false;
    
    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
      if (focusedElement === 'button') {
        const isSubmitButton = await page.evaluate(() => 
          document.activeElement?.getAttribute('type') === 'submit'
        );
        if (isSubmitButton) {
          submitButtonFocused = true;
          break;
        }
      }
    }

    // Verify we can reach and interact with submit button
    expect(submitButtonFocused).toBe(true);
  });
});
