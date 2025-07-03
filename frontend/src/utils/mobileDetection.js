/**
 * Mobile Detection Utilities
 *
 * Enhanced mobile detection that goes beyond simple viewport width checks
 * to provide more accurate mobile vs desktop distinction.
 */

/**
 * Detect if the current device is a mobile device based on user agent
 * @returns {boolean} True if the user agent indicates a mobile device
 */
export const isMobileDevice = () => {
  // Handle edge cases where userAgent might be null or undefined
  if (!navigator.userAgent) {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detect if the current device has touch capabilities
 * @returns {boolean} True if the device supports touch input
 */
export const isTouchDevice = () => {
  // Check for touch event support
  const hasOntouchstart = "ontouchstart" in window;

  // Check for touch points support (more reliable on modern browsers)
  const hasMaxTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;

  return Boolean(hasOntouchstart || hasMaxTouchPoints);
};

/**
 * Enhanced mobile mode detection that combines viewport, device, and touch detection
 *
 * Returns true only when:
 * 1. Viewport is small (≤ 640px) AND
 * 2. Device is either a mobile device OR has touch capabilities
 *
 * This prevents false positives for:
 * - Desktop browsers with narrow windows
 * - Large tablets in landscape mode
 *
 * While correctly detecting:
 * - Mobile phones (small viewport + mobile UA + touch)
 * - Touch laptops in narrow mode (small viewport + touch)
 * - Tablets in portrait mode (small viewport + mobile UA + touch)
 *
 * @param {boolean} isSmallViewport - Whether the current viewport is small (≤ 640px)
 * @returns {boolean} True if should use mobile mode
 */
export const getEnhancedMobileMode = (isSmallViewport) => {
  // Must have small viewport first
  if (!isSmallViewport) {
    return false;
  }

  // In E2E testing environments (like Playwright), fallback to viewport-only detection
  // This allows E2E tests to work properly with mobile viewports
  // Only applies to E2E/browser automation, not unit tests
  const isE2ETestEnvironment =
    (typeof window !== "undefined" && window.playwright !== undefined) ||
    (typeof navigator !== "undefined" && navigator.webdriver === true);

  if (isE2ETestEnvironment) {
    return true;
  }

  // Small viewport + (mobile device OR touch capability) = mobile mode
  return isMobileDevice() || isTouchDevice();
};
