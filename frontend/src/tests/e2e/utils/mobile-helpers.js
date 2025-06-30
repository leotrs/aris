import { expect } from "@playwright/test";

export class MobileHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Check if we're running on a mobile viewport
   */
  isMobileViewport() {
    const viewportSize = this.page.viewportSize();
    return viewportSize && viewportSize.width < 640;
  }

  /**
   * Check if we're running on webkit (Safari/Mobile Safari)
   */
  isWebkit() {
    const browserName = this.page.context().browser()?.browserType()?.name();
    return browserName === "webkit";
  }

  /**
   * Check if we're running on Mobile Chrome (chromium with mobile viewport)
   */
  isMobileChrome() {
    const browserName = this.page.context().browser()?.browserType()?.name();
    return browserName === "chromium" && this.isMobileViewport();
  }

  /**
   * Get mobile-optimized timeout values
   */
  getTimeouts() {
    const isMobile = this.isMobileViewport();
    return {
      short: isMobile ? 3000 : 2000,
      medium: isMobile ? 8000 : 5000,
      long: isMobile ? 15000 : 10000,
      navigation: isMobile ? 15000 : 10000,
    };
  }

  /**
   * Wait with mobile-specific timing
   */
  async waitForMobileRendering() {
    if (this.isMobileViewport()) {
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Perform mobile-friendly interaction (tap vs hover)
   */
  async interactWithElement(locator) {
    if (this.isMobileViewport()) {
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(100);
      await locator.tap();
    } else {
      await locator.hover();
    }
  }

  /**
   * Wait for element visibility with mobile and webkit-optimized checks
   */
  async expectToBeVisible(locator, customTimeout = null) {
    const timeouts = this.getTimeouts();
    const timeout = customTimeout || timeouts.medium;

    // For webkit and mobile chrome, ensure element is scrolled into view first
    if (this.isWebkit() || this.isMobileChrome()) {
      try {
        await locator.scrollIntoViewIfNeeded({ timeout: 2000 });
        await this.page.waitForTimeout(300);
      } catch {
        // Continue if scroll fails
      }

      // Force a repaint on webkit/mobile chrome
      if (this.isWebkit()) {
        await this.page.evaluate(() => {
          document.body.style.transform = "translateZ(0)";
          setTimeout(() => {
            document.body.style.transform = "";
          }, 50);
        });
      } else if (this.isMobileChrome()) {
        // For mobile chrome, trigger a different type of repaint
        await this.page.evaluate(() => {
          window.dispatchEvent(new Event("resize"));
        });
        await this.page.waitForTimeout(100);
      }
    }

    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Enhanced element click for mobile browsers
   */
  async clickElement(locator) {
    if (this.isMobileViewport()) {
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(100);
    }
    await locator.click();
  }

  /**
   * Wait for navigation with mobile-optimized timeout
   */
  async waitForURLPattern(pattern, customTimeout = null) {
    const timeouts = this.getTimeouts();
    const timeout = customTimeout || timeouts.navigation;
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Webkit-specific visibility check using DOM evaluation
   */
  async isElementVisibleInDOM(locator) {
    try {
      return await locator.evaluate((element) => {
        if (!element) return false;

        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        // Enhanced visibility check for mobile browsers
        const isDisplayed = style.display !== "none";
        const hasSize = rect.width > 0 && rect.height > 0;
        const isNotHidden = style.visibility !== "hidden" && style.opacity !== "0";

        // Check if element is in viewport for mobile browsers
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        const isInViewport =
          rect.top < viewport.height &&
          rect.bottom > 0 &&
          rect.left < viewport.width &&
          rect.right > 0;

        // More comprehensive check for mobile browsers
        return (
          isDisplayed && hasSize && isNotHidden && (element.offsetParent !== null || isInViewport)
        );
      });
    } catch {
      return false;
    }
  }

  /**
   * Enhanced content loading wait for mobile
   */
  async waitForContentLoaded(selector) {
    const timeouts = this.getTimeouts();

    await this.page.waitForLoadState("networkidle");
    await this.waitForMobileRendering();

    // Wait for element to be visible
    await this.expectToBeVisible(this.page.locator(selector));

    // On mobile, also verify the element is actually rendered
    if (this.isMobileViewport()) {
      await this.page.waitForFunction(
        (sel) => {
          const element = document.querySelector(sel);
          return (
            element && getComputedStyle(element).display !== "none" && element.offsetParent !== null
          );
        },
        selector,
        { timeout: timeouts.medium }
      );
    }
  }
}
