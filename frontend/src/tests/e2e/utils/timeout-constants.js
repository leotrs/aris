/**
 * Centralized timeout constants for E2E tests
 *
 * These constants provide consistent timeout values across all test files
 * and replace the scattered timeout values throughout the codebase.
 */

export const TIMEOUTS = {
  // Core timeout categories
  QUICK_ACTION: 1500, // Button clicks, form inputs, simple interactions
  CONTENT_LOAD: 3000, // Component mounting, content rendering, API responses
  HEAVY_OPERATION: 5000, // File operations, complex navigation, heavy computations

  // Specific operation timeouts
  NAVIGATION: 3000, // Page navigation and URL changes
  ELEMENT_RENDER: 1500, // Element visibility and DOM updates
  API_RESPONSE: 3000, // Backend API calls and data loading
  ANIMATION: 500, // CSS animations and transitions

  // Mobile-specific multipliers
  MOBILE_MULTIPLIER: 1.5, // Apply to base timeouts for mobile browsers

  // Legacy timeouts (to be phased out)
  LEGACY_SHORT: 3000,
  LEGACY_MEDIUM: 5000,
  LEGACY_LONG: 10000,
};

/**
 * Get timeout values optimized for the current browser/device
 * @param {boolean} isMobile - Whether running on mobile browser
 * @returns {Object} Timeout configuration object
 */
export function getTimeouts(isMobile = false) {
  const multiplier = isMobile ? TIMEOUTS.MOBILE_MULTIPLIER : 1;

  return {
    quickAction: Math.round(TIMEOUTS.QUICK_ACTION * multiplier),
    contentLoad: Math.round(TIMEOUTS.CONTENT_LOAD * multiplier),
    heavyOperation: Math.round(TIMEOUTS.HEAVY_OPERATION * multiplier),
    navigation: Math.round(TIMEOUTS.NAVIGATION * multiplier),
    elementRender: Math.round(TIMEOUTS.ELEMENT_RENDER * multiplier),
    apiResponse: Math.round(TIMEOUTS.API_RESPONSE * multiplier),
    animation: TIMEOUTS.ANIMATION, // Don't scale animations
  };
}

/**
 * Get timeout for specific operations
 * @param {string} operation - Operation type
 * @param {boolean} isMobile - Whether running on mobile browser
 * @returns {number} Timeout in milliseconds
 */
export function getTimeoutFor(operation, isMobile = false) {
  const timeouts = getTimeouts(isMobile);

  const operationMap = {
    click: timeouts.quickAction,
    input: timeouts.quickAction,
    visibility: timeouts.elementRender,
    navigation: timeouts.navigation,
    api: timeouts.apiResponse,
    content: timeouts.contentLoad,
    heavy: timeouts.heavyOperation,
    animation: timeouts.animation,
  };

  return operationMap[operation] || timeouts.contentLoad;
}
