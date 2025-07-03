import { test, expect } from "@playwright/test";

// @auth @auth-flows @core @demo-content @demo-ui
import { AuthHelpers } from "./utils/auth-helpers.js";
import { MobileHelpers } from "./utils/mobile-helpers.js";

test.describe("Mobile Sidebar Navigation UX @core @demo-content @demo-ui", () => {
  let authHelpers, mobileHelpers;

  const mobileViewports = [
    { name: "iPhone SE", width: 375, height: 667 },
    { name: "iPhone 12", width: 390, height: 844 },
    { name: "Samsung Galaxy S21", width: 360, height: 800 },
  ];

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    mobileHelpers = new MobileHelpers(page);
  });

  test.describe("Mobile Drawer Functionality", () => {
    mobileViewports.forEach((viewport) => {
      test(`should show hamburger menu and drawer on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        await mobileHelpers.waitForMobileRendering();

        // Hamburger menu should be visible
        const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
        await mobileHelpers.expectToBeVisible(hamburgerButton);

        // Desktop sidebar should be hidden
        await expect(page.locator(".sb-wrapper .sb-menu")).not.toBeVisible();
        await expect(page.locator(".sb-wrapper #logo")).not.toBeVisible();

        // Mobile drawer should be closed initially
        await expect(page.locator(".sb-wrapper.drawer-open")).not.toBeVisible();

        // Click hamburger to open drawer
        await mobileHelpers.clickElement(hamburgerButton);
        await mobileHelpers.waitForMobileRendering();

        // Drawer should be open
        await expect(page.locator(".sb-wrapper.drawer-open")).toBeVisible();
        await expect(page.locator(".mobile-backdrop")).toBeVisible();

        // Sidebar menu should be visible in drawer
        await mobileHelpers.expectToBeVisible(page.locator(".sb-wrapper.drawer-open .sb-menu"));
        await mobileHelpers.expectToBeVisible(page.locator(".sb-wrapper.drawer-open #logo"));
      });

      test(`should close drawer when backdrop is tapped on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Open drawer
        const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
        await mobileHelpers.clickElement(hamburgerButton);
        await mobileHelpers.waitForMobileRendering();

        // Verify drawer is open
        await expect(page.locator(".sb-wrapper.drawer-open")).toBeVisible();

        // Click backdrop to close
        const backdrop = page.locator(".mobile-backdrop");
        await mobileHelpers.clickElement(backdrop);
        await mobileHelpers.waitForMobileRendering();

        // Drawer should be closed
        await expect(page.locator(".sb-wrapper.drawer-open")).not.toBeVisible();
        await expect(page.locator(".mobile-backdrop")).not.toBeVisible();
      });

      test(`should close drawer when navigation item is tapped on ${viewport.name}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        // Open drawer
        const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
        await mobileHelpers.clickElement(hamburgerButton);
        await mobileHelpers.waitForMobileRendering();

        // Click on Settings navigation item
        const settingsItem = page.locator('.sb-wrapper.drawer-open [data-testid*="settings"]');
        await mobileHelpers.clickElement(settingsItem);

        // Wait for navigation
        await mobileHelpers.waitForURLPattern(/\/settings/);
        await mobileHelpers.waitForMobileRendering();

        // Drawer should be closed after navigation
        await expect(page.locator(".sb-wrapper.drawer-open")).not.toBeVisible();
        await expect(page.locator(".mobile-backdrop")).not.toBeVisible();

        // Should be on settings page
        await expect(page).toHaveURL(/\/settings/);
      });
    });

    test("should handle escape key to close drawer", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open drawer
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);
      await mobileHelpers.waitForMobileRendering();

      // Verify drawer is open
      await expect(page.locator(".sb-wrapper.drawer-open")).toBeVisible();

      // Press escape to close
      await page.keyboard.press("Escape");
      await mobileHelpers.waitForMobileRendering();

      // Drawer should be closed
      await expect(page.locator(".sb-wrapper.drawer-open")).not.toBeVisible();
    });

    test("should prevent body scroll when drawer is open", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Check initial body overflow
      const initialOverflow = await page.evaluate(() => document.body.style.overflow);

      // Open drawer
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);
      await mobileHelpers.waitForMobileRendering();

      // Body should have overflow hidden
      const openOverflow = await page.evaluate(() => document.body.style.overflow);
      expect(openOverflow).toBe("hidden");

      // Close drawer
      const backdrop = page.locator(".mobile-backdrop");
      await mobileHelpers.clickElement(backdrop);
      await mobileHelpers.waitForMobileRendering();

      // Body overflow should be restored
      const closedOverflow = await page.evaluate(() => document.body.style.overflow);
      expect(closedOverflow).toBe(initialOverflow);
    });
  });

  test.describe("Mobile Navigation UX - Home View", () => {
    test("should provide mobile navigation on home page", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open mobile drawer
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);
      await mobileHelpers.waitForMobileRendering();

      // Should show main navigation items (Account moved to UserMenuDrawer)
      await mobileHelpers.expectToBeVisible(page.locator('[data-sidebar-item="Home"]'));
      await mobileHelpers.expectToBeVisible(page.locator('[data-sidebar-item="Settings"]'));

      // Should show recent files section if available
      const recentFiles = page.locator(".sb-menu .recent-files");
      if ((await recentFiles.count()) > 0) {
        await mobileHelpers.expectToBeVisible(recentFiles);
      }

      // Should show new file button/menu
      await mobileHelpers.expectToBeVisible(page.locator('[data-testid="create-file-button"]'));
    });

    test("should navigate from home to account via user menu drawer", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open user menu drawer and navigate to Account
      const userAvatar = page.locator('[data-testid="user-avatar"]');
      await mobileHelpers.clickElement(userAvatar);

      const accountProfileItem = page.locator('[data-testid="account-profile"]');
      await mobileHelpers.clickElement(accountProfileItem);

      await mobileHelpers.waitForURLPattern(/\/account\/profile/);
      await expect(page).toHaveURL("/account/profile");
    });

    test("should navigate from home to settings via mobile drawer", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open drawer and navigate to Settings
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);

      const settingsItem = page.locator('[data-sidebar-item="Settings"]');
      await mobileHelpers.clickElement(settingsItem);

      await mobileHelpers.waitForURLPattern(/\/settings/);
      await expect(page).toHaveURL(/\/settings/);
    });
  });

  test.describe("Mobile Navigation UX - Account View", () => {
    test("should provide mobile navigation on account page", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/account");
      await page.waitForLoadState("networkidle");

      // Open mobile drawer
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);
      await mobileHelpers.waitForMobileRendering();

      // Should show main navigation items (Account moved to UserMenuDrawer)
      const homeItem = page.locator('[data-sidebar-item="Home"]');
      const settingsItem = page.locator('[data-sidebar-item="Settings"]');

      await mobileHelpers.expectToBeVisible(homeItem);
      await mobileHelpers.expectToBeVisible(settingsItem);

      // Neither should be marked as active when on account page
      await expect(homeItem).not.toHaveClass(/active/);
      await expect(settingsItem).not.toHaveClass(/active/);
    });

    test("should navigate from account to home via mobile drawer", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/account");
      await page.waitForLoadState("networkidle");

      // Open drawer and navigate to Home
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);

      const homeItem = page.locator('[data-sidebar-item="Home"]');
      await mobileHelpers.clickElement(homeItem);

      await mobileHelpers.waitForURLPattern(/^\/$/);
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Mobile Navigation UX - Settings View", () => {
    test("should provide mobile navigation on settings page", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/settings");
      await page.waitForLoadState("networkidle");

      // Open mobile drawer
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);
      await mobileHelpers.waitForMobileRendering();

      // Should show main navigation with Settings active
      const homeItem = page.locator('[data-sidebar-item="Home"]');
      const settingsItem = page.locator('[data-sidebar-item="Settings"]');

      await mobileHelpers.expectToBeVisible(homeItem);
      await mobileHelpers.expectToBeVisible(settingsItem);

      // Settings should be marked as active
      await expect(settingsItem).toHaveClass(/active/);
      await expect(homeItem).not.toHaveClass(/active/);

      // Should show settings sub-navigation items
      await mobileHelpers.expectToBeVisible(page.locator('[data-sidebar-subitem="File"]'));
      await mobileHelpers.expectToBeVisible(page.locator('[data-sidebar-subitem="Behavior"]'));
      await mobileHelpers.expectToBeVisible(page.locator('[data-sidebar-subitem="Privacy"]'));
      await mobileHelpers.expectToBeVisible(page.locator('[data-sidebar-subitem="Security"]'));
    });

    test("should navigate between settings sub-sections via mobile drawer", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/settings");
      await page.waitForLoadState("networkidle");

      // Open drawer and navigate to Behavior settings
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);

      const behaviorItem = page.locator('[data-sidebar-subitem="Behavior"]');
      await mobileHelpers.clickElement(behaviorItem);

      await mobileHelpers.waitForURLPattern(/\/settings\/behavior/);
      await expect(page).toHaveURL("/settings/behavior");

      // Open drawer and navigate to Privacy settings
      await mobileHelpers.clickElement(hamburgerButton);

      const privacyItem = page.locator('[data-sidebar-subitem="Privacy"]');
      await mobileHelpers.clickElement(privacyItem);

      await mobileHelpers.waitForURLPattern(/\/settings\/privacy/);
      await expect(page).toHaveURL("/settings/privacy");
    });

    test("should navigate from settings to other views via mobile drawer", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/settings");
      await page.waitForLoadState("networkidle");

      // Navigate to Home from Settings
      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      await mobileHelpers.clickElement(hamburgerButton);

      const homeItem = page.locator('[data-sidebar-item="Home"]');
      await mobileHelpers.clickElement(homeItem);

      await mobileHelpers.waitForURLPattern(/^\/$/);
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Mobile Animation and UX Polish", () => {
    test("should animate drawer open/close transitions", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');
      const drawerWrapper = page.locator(".sb-wrapper");

      // Open drawer
      await mobileHelpers.clickElement(hamburgerButton);

      // Should have opening animation classes
      await expect(drawerWrapper).toHaveClass(/drawer-open/);
      await expect(drawerWrapper).toHaveClass(/mobile/);

      // Check for CSS transition properties
      const transitionDuration = await drawerWrapper.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("transition-duration")
      );
      expect(transitionDuration).not.toBe("0s");
    });

    test("should show visual feedback on hamburger button state", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hamburgerButton = page.locator('[data-testid="mobile-menu-button"]');

      // Button should show hamburger icon initially
      await expect(hamburgerButton.locator('[data-icon="Menu"]')).toBeVisible();

      // Open drawer
      await mobileHelpers.clickElement(hamburgerButton);
      await mobileHelpers.waitForMobileRendering();

      // Button should show close icon when drawer is open
      await expect(hamburgerButton.locator('[data-icon="X"]')).toBeVisible();
      await expect(hamburgerButton.locator('[data-icon="Menu"]')).not.toBeVisible();

      // Close drawer
      const backdrop = page.locator(".mobile-backdrop");
      await mobileHelpers.clickElement(backdrop);
      await mobileHelpers.waitForMobileRendering();

      // Button should show hamburger icon again
      await expect(hamburgerButton.locator('[data-icon="Menu"]')).toBeVisible();
      await expect(hamburgerButton.locator('[data-icon="X"]')).not.toBeVisible();
    });
  });

  test.describe("Desktop Mode Verification", () => {
    test("should not show mobile elements on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Mobile hamburger button should not be visible
      await expect(page.locator('[data-testid="mobile-menu-button"]')).not.toBeVisible();

      // Desktop sidebar should be visible
      await expect(page.locator(".sb-wrapper .sb-menu")).toBeVisible();
      await expect(page.locator(".sb-wrapper #logo")).toBeVisible();

      // Should not have mobile classes
      await expect(page.locator(".sb-wrapper.mobile")).not.toBeVisible();
    });
  });
});
