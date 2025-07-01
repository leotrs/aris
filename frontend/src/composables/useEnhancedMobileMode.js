/**
 * Enhanced Mobile Mode Composable
 *
 * Vue composable that provides reactive mobile mode detection
 * combining viewport size with device and touch capabilities.
 */

import { computed } from "vue";
import { getEnhancedMobileMode } from "@/utils/mobileDetection.js";

/**
 * Create a reactive enhanced mobile mode detector
 *
 * @param {Ref<boolean>} isSmallViewport - Reactive reference to small viewport state
 * @returns {ComputedRef<boolean>} Reactive mobile mode state
 */
export const useEnhancedMobileMode = (isSmallViewport) => {
  return computed(() => {
    return getEnhancedMobileMode(isSmallViewport.value);
  });
};
