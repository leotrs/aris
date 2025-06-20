import { computed, nextTick } from "vue";
import { useFloatingUI } from "./useFloatingUI.js";
import { useDebounceFn } from "@vueuse/core";

/**
 * Desktop menu positioning composable using Floating UI
 * Handles precise positioning relative to trigger elements
 */
export function useDesktopMenu(triggerRef, menuRef, options = {}) {
  // Extract options
  const {
    placement = "bottom-start",
    strategy = "fixed",
    offset = 0,
    variant = null,
    isSubMenu = false,
    parentPlacement = null,
    ...floatingOptions
  } = options;

  // Smart placement for sub-menus
  const effectivePlacement = computed(() => {
    if (isSubMenu && parentPlacement) {
      const parentPlacementValue =
        typeof parentPlacement === "object" && parentPlacement.value !== undefined
          ? parentPlacement.value
          : parentPlacement;

      if (typeof parentPlacementValue === "string") {
        if (parentPlacementValue.includes("right")) return "right-start";
        if (parentPlacementValue.includes("left")) return "left-start";
      }
      return "right-start"; // Default for sub-menus
    }
    return placement;
  });

  // Compute offset based on variant
  const computedOffset = computed(() => {
    if (variant === "dots" && offset === 0) {
      return 4; // Special offset for dots variant
    }
    return offset;
  });

  // Initialize floating UI with computed options
  const floatingUIOptions = computed(() => ({
    placement: effectivePlacement.value,
    strategy,
    offset: computedOffset.value,
    ...floatingOptions,
  }));

  const { floatingStyles, update } = useFloatingUI(triggerRef, menuRef, floatingUIOptions.value);

  // Menu styles (just pass through floating styles)
  const menuStyles = computed(() => {
    return (floatingStyles && floatingStyles.value) || {};
  });

  // Debounced position update function
  const updatePosition = useDebounceFn(() => {
    if (menuRef.value && triggerRef.value && update) {
      update();
    }
  }, 100);

  // Activation function with proper DOM settling
  const activate = async () => {
    // Wait for DOM to be fully rendered
    await nextTick();

    // Ensure refs are available before updating floating UI
    if (update && triggerRef.value && menuRef.value) {
      // Double nextTick to ensure DOM is fully settled
      await nextTick();
      update();
    }
  };

  // Deactivation function
  const deactivate = async () => {
    // Desktop mode doesn't need special deactivation
  };

  return {
    menuStyles,
    updatePosition,
    activate,
    deactivate,
    effectivePlacement,
  };
}
