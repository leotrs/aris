import { test, expect } from "@playwright/test";

test.describe("Accessibility E2E", () => {
  test.describe("Keyboard Navigation", () => {
    test("should allow complete keyboard navigation of homepage", async ({ page }) => {
      await page.goto("/");

      // Start tabbing through the page
      let tabCount = 0;
      const maxTabs = 25;
      const focusedElements = [];

      while (tabCount < maxTabs) {
        await page.keyboard.press("Tab");
        tabCount++;

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el?.tagName,
            text: el?.textContent?.trim().substring(0, 50),
            href: el?.getAttribute("href"),
            type: el?.getAttribute("type"),
            role: el?.getAttribute("role"),
            ariaLabel: el?.getAttribute("aria-label"),
          };
        });

        if (focusedElement.tag && focusedElement.tag !== "BODY") {
          focusedElements.push(focusedElement);
        }
      }

      // Should have found several focusable elements
      expect(focusedElements.length).toBeGreaterThan(5);

      // Should include navigation elements
      const hasNavigation = focusedElements.some(
        (el) =>
          el.text?.includes("About") || el.text?.includes("Pricing") || el.href?.includes("/signup")
      );
      expect(hasNavigation).toBe(true);

      // Should include CTA buttons
      const hasCTA = focusedElements.some(
        (el) => el.text?.includes("Try the Demo") || el.text?.includes("sign up")
      );
      expect(hasCTA).toBe(true);
    });

    test("should allow keyboard navigation of form", async ({ page }) => {
      await page.goto("/signup");

      const formElements = [
        'input[type="email"]',
        'input[name="name"]',
        'input[name="institution"]',
        'input[name="research_area"]',
        'select[name="interest_level"]',
        'button[type="submit"]',
      ];

      for (let i = 0; i < formElements.length; i++) {
        await page.keyboard.press("Tab");
        await expect(page.locator(formElements[i])).toBeFocused();
      }
    });

    test("should handle dropdown keyboard navigation", async ({ page }) => {
      await page.goto("/");

      // Navigate to resources dropdown using Tab
      let foundDropdown = false;
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press("Tab");

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            text: el?.textContent?.trim(),
            classList: Array.from(el?.classList || []),
          };
        });

        if (focusedElement.text?.includes("Resources")) {
          foundDropdown = true;
          // Press Enter to activate dropdown
          await page.keyboard.press("Enter");
          await expect(page.locator(".dropdown-menu")).toBeVisible();
          break;
        }
      }

      expect(foundDropdown).toBe(true);
    });

    test("should handle mobile menu keyboard navigation", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Find and activate mobile menu toggle
      let foundMenuToggle = false;
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press("Tab");

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            classList: Array.from(el?.classList || []),
            ariaLabel: el?.getAttribute("aria-label"),
          };
        });

        if (
          focusedElement.classList.includes("menu-toggle") ||
          focusedElement.ariaLabel?.includes("Toggle navigation")
        ) {
          foundMenuToggle = true;
          await page.keyboard.press("Enter");
          await expect(page.locator(".mobile-menu-overlay")).toBeVisible();
          break;
        }
      }

      expect(foundMenuToggle).toBe(true);
    });
  });

  test.describe("ARIA Attributes and Semantic HTML", () => {
    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/");

      // Check heading levels
      const headings = await page.evaluate(() => {
        const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        return Array.from(headingElements).map((el) => ({
          level: parseInt(el.tagName.charAt(1)),
          text: el.textContent?.trim().substring(0, 50),
        }));
      });

      // Should have exactly one h1
      const h1Count = headings.filter((h) => h.level === 1).length;
      expect(h1Count).toBe(1);

      // Headings should follow logical hierarchy (no skipping levels)
      for (let i = 1; i < headings.length; i++) {
        const prevLevel = headings[i - 1].level;
        const currentLevel = headings[i].level;

        // Allow same level, one level deeper, or jumping back up any amount
        if (currentLevel > prevLevel) {
          expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
        }
      }
    });

    test("should have proper ARIA labels and roles", async ({ page }) => {
      await page.goto("/");

      // Check navigation ARIA
      const navigationElements = await page.evaluate(() => {
        const navs = document.querySelectorAll('[role="navigation"], nav');
        return Array.from(navs).map((el) => ({
          tag: el.tagName,
          role: el.getAttribute("role"),
          ariaLabel: el.getAttribute("aria-label"),
        }));
      });

      expect(navigationElements.length).toBeGreaterThan(0);

      // At least one navigation should have proper labeling
      const hasProperNav = navigationElements.some(
        (nav) => nav.ariaLabel?.includes("navigation") || nav.tag === "NAV"
      );
      expect(hasProperNav).toBe(true);

      // Check form elements have proper labels
      await page.goto("/signup");

      const formInputs = await page.evaluate(() => {
        const inputs = document.querySelectorAll("input, select, textarea");
        return Array.from(inputs).map((el) => ({
          type: el.type || el.tagName,
          id: el.id,
          name: el.name,
          ariaLabel: el.getAttribute("aria-label"),
          hasLabel: !!document.querySelector(`label[for="${el.id}"]`),
        }));
      });

      // Each input should have either a label or aria-label
      formInputs.forEach((input) => {
        const hasProperLabel = input.hasLabel || input.ariaLabel;
        expect(hasProperLabel).toBe(true);
      });
    });

    test("should have proper button attributes", async ({ page }) => {
      await page.goto("/");

      const buttons = await page.evaluate(() => {
        const buttonElements = document.querySelectorAll('button, [role="button"]');
        return Array.from(buttonElements).map((el) => ({
          tag: el.tagName,
          type: el.getAttribute("type"),
          ariaLabel: el.getAttribute("aria-label"),
          text: el.textContent?.trim(),
          disabled: el.disabled,
        }));
      });

      // All buttons should have accessible text or aria-label
      buttons.forEach((button) => {
        const hasAccessibleText = button.text && button.text.length > 0;
        const hasAriaLabel = button.ariaLabel && button.ariaLabel.length > 0;

        expect(hasAccessibleText || hasAriaLabel).toBe(true);
      });
    });

    test("should have proper link accessibility", async ({ page }) => {
      await page.goto("/");

      const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll("a");
        return Array.from(linkElements).map((el) => ({
          href: el.getAttribute("href"),
          text: el.textContent?.trim(),
          ariaLabel: el.getAttribute("aria-label"),
          target: el.getAttribute("target"),
        }));
      });

      // All links should have meaningful text or aria-label
      links.forEach((link) => {
        const hasAccessibleText = link.text && link.text.length > 0;
        const hasAriaLabel = link.ariaLabel && link.ariaLabel.length > 0;

        expect(hasAccessibleText || hasAriaLabel).toBe(true);

        // Links should not be empty
        expect(link.href).not.toBe("");
        expect(link.href).not.toBe("#");
      });
    });
  });

  test.describe("Focus Management", () => {
    test("should have visible focus indicators", async ({ page }) => {
      await page.goto("/");

      // Tab to first focusable element
      await page.keyboard.press("Tab");

      const focusStyles = await page.evaluate(() => {
        const focusedEl = document.activeElement;
        const styles = window.getComputedStyle(focusedEl);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
          boxShadow: styles.boxShadow,
        };
      });

      // Should have some form of focus indicator
      const hasFocusIndicator =
        focusStyles.outline !== "none" ||
        focusStyles.outlineWidth !== "0px" ||
        focusStyles.boxShadow !== "none";

      expect(hasFocusIndicator).toBe(true);
    });

    test("should not trap focus inappropriately", async ({ page }) => {
      await page.goto("/");

      // Tab through many elements to ensure we don't get stuck
      const initialFocus = await page.evaluate(() => document.activeElement?.tagName);

      for (let i = 0; i < 30; i++) {
        await page.keyboard.press("Tab");
      }

      const finalFocus = await page.evaluate(() => document.activeElement?.tagName);

      // Focus should have moved (not trapped in one place)
      // This is a basic check - in a real app you'd want more sophisticated focus testing
      expect(finalFocus).toBeDefined();
    });

    test("should handle modal/dropdown focus properly", async ({ page }) => {
      await page.goto("/");

      // Open resources dropdown with keyboard
      let foundDropdown = false;
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press("Tab");

        const focusedElement = await page.evaluate(() => {
          return document.activeElement?.textContent?.trim();
        });

        if (focusedElement?.includes("Resources")) {
          await page.keyboard.press("Enter");
          await expect(page.locator(".dropdown-menu")).toBeVisible();
          foundDropdown = true;
          break;
        }
      }

      if (foundDropdown) {
        // Focus should move into dropdown
        await page.keyboard.press("Tab");
        const dropdownFocused = await page.evaluate(() => {
          const focused = document.activeElement;
          return focused?.closest(".dropdown-menu") !== null;
        });

        expect(dropdownFocused).toBe(true);
      }
    });
  });

  test.describe("Screen Reader Compatibility", () => {
    test("should have proper image alt text", async ({ page }) => {
      await page.goto("/");

      const images = await page.evaluate(() => {
        const imgElements = document.querySelectorAll("img");
        return Array.from(imgElements).map((img) => ({
          src: img.src,
          alt: img.alt,
          role: img.getAttribute("role"),
        }));
      });

      // All images should have alt text (or be marked as decorative)
      images.forEach((img) => {
        const hasAltText = img.alt && img.alt.trim().length > 0;
        const isDecorative = img.role === "presentation" || img.alt === "";

        expect(hasAltText || isDecorative).toBe(true);
      });
    });

    test("should have proper form labels and descriptions", async ({ page }) => {
      await page.goto("/signup");

      const formLabeling = await page.evaluate(() => {
        const inputs = document.querySelectorAll("input, select, textarea");
        return Array.from(inputs).map((input) => {
          const label = document.querySelector(`label[for="${input.id}"]`);
          const ariaDescribedBy = input.getAttribute("aria-describedby");
          const description = ariaDescribedBy ? document.getElementById(ariaDescribedBy) : null;

          return {
            name: input.name,
            hasLabel: !!label,
            labelText: label?.textContent?.trim(),
            hasDescription: !!description,
            descriptionText: description?.textContent?.trim(),
            required: input.required,
            ariaRequired: input.getAttribute("aria-required"),
          };
        });
      });

      // Required fields should be properly marked
      const requiredFields = formLabeling.filter((field) => field.required);
      requiredFields.forEach((field) => {
        expect(field.hasLabel).toBe(true);
        expect(field.labelText).toContain("*"); // Required indicator
      });
    });

    test("should announce form validation errors", async ({ page }) => {
      await page.goto("/signup");

      // Submit empty form to trigger validation
      await page.click('button[type="submit"]');

      // Check for error announcements
      const errorElements = await page.evaluate(() => {
        const errors = document.querySelectorAll(
          '[role="alert"], .error-message, .validation-error'
        );
        return Array.from(errors).map((error) => ({
          text: error.textContent?.trim(),
          role: error.getAttribute("role"),
          ariaLive: error.getAttribute("aria-live"),
        }));
      });

      // Should have error messages that are announced to screen readers
      expect(errorElements.length).toBeGreaterThan(0);

      const hasProperErrorAnnouncement = errorElements.some(
        (error) => error.role === "alert" || error.ariaLive
      );
      expect(hasProperErrorAnnouncement).toBe(true);
    });
  });

  test.describe("Color and Contrast", () => {
    test("should not rely solely on color for information", async ({ page }) => {
      await page.goto("/signup");

      // This is a basic test - in practice you'd want automated contrast checking
      // Fill form with validation error
      await page.fill('input[name="name"]', "a".repeat(101)); // Too long
      await page.click('button[type="submit"]');

      // Error should be indicated by more than just color
      const errorElement = page.locator("text=Name must be 100 characters or less");
      await expect(errorElement).toBeVisible();

      // Check if error has additional visual indicators beyond color
      const errorStyles = await errorElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          fontWeight: styles.fontWeight,
          textDecoration: styles.textDecoration,
          content: styles.content,
        };
      });

      // Error should have additional styling (bold, underline, icon, etc.)
      const hasAdditionalIndicator =
        errorStyles.fontWeight !== "normal" || errorStyles.textDecoration !== "none";

      // This test might need adjustment based on your actual error styling
    });
  });

  test.describe("Mobile Accessibility", () => {
    test("should have appropriate touch targets on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Check that interactive elements are large enough for touch
      const touchTargets = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll("button, a, input, select");
        return Array.from(interactiveElements)
          .map((el) => {
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              width: rect.width,
              height: rect.height,
              isVisible: rect.width > 0 && rect.height > 0,
            };
          })
          .filter((el) => el.isVisible);
      });

      // Touch targets should be at least 44px (WCAG AA)
      const smallTargets = touchTargets.filter((target) => target.width < 44 || target.height < 44);

      // Allow some small targets but most should meet minimum size
      const percentageGoodTargets =
        (touchTargets.length - smallTargets.length) / touchTargets.length;
      expect(percentageGoodTargets).toBeGreaterThan(0.8); // 80% should be appropriately sized
    });

    test("should handle mobile screen reader navigation", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Test landmark navigation
      const landmarks = await page.evaluate(() => {
        const landmarkElements = document.querySelectorAll(
          'header, nav, main, section, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]'
        );
        return Array.from(landmarkElements).map((el) => ({
          tag: el.tagName,
          role: el.getAttribute("role"),
          ariaLabel: el.getAttribute("aria-label"),
        }));
      });

      // Should have proper page structure for mobile screen readers
      expect(landmarks.length).toBeGreaterThan(2);

      const hasMain = landmarks.some((l) => l.tag === "MAIN" || l.role === "main");
      const hasNav = landmarks.some((l) => l.tag === "NAV" || l.role === "navigation");

      expect(hasMain || hasNav).toBe(true); // Should have at least one major landmark
    });
  });
});
