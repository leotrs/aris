import { computed } from "vue";

/**
 * Mobile menu positioning composable
 * Uses CSS classes for modal-style positioning
 */
export function useMobileMenu(mobileMode = null, options = {}) {
  const { placement = null, isOpen = null } = options || {};

  // Always return empty styles - CSS handles mobile positioning
  const menuStyles = computed(() => ({}));

  // Compute CSS classes for mobile menu
  const menuClasses = computed(() => {
    const classes = ["context-menu"];

    // Add mobile/desktop mode class
    const isMobile = mobileMode?.value ?? false;
    if (isMobile) {
      classes.push("mobile-mode");
    } else {
      classes.push("desktop-mode");
    }

    // Add placement class if provided
    if (placement?.value) {
      classes.push(`placement-${placement.value}`);
    } else if (typeof placement === "string") {
      classes.push(`placement-${placement}`);
    }

    // Add open state class
    if (isOpen?.value) {
      classes.push("is-open");
    } else if (isOpen === true) {
      classes.push("is-open");
    }

    return classes;
  });

  // Simple activation - no positioning calculations needed
  const activate = async () => {
    // Mobile mode uses CSS for positioning, no JS calculations needed
    return Promise.resolve();
  };

  // Simple deactivation
  const deactivate = async () => {
    // No cleanup needed for mobile mode
    return Promise.resolve();
  };

  return {
    menuStyles,
    menuClasses,
    activate,
    deactivate,
  };
}
