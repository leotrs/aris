import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/vue";

/**
 * Composable for standardized floating UI configuration
 * Extracts common floating UI patterns used across ContextMenu, AnnotationMenu, Tooltip
 */
export function useFloatingUI(reference, floating, options = {}) {
  const {
    placement = "bottom",
    strategy = "fixed",
    middleware = [],
    offset: offsetValue = 4,
    ...restOptions
  } = options;

  // Build middleware array with defaults + custom middleware
  const defaultMiddleware = [offset(offsetValue), flip(), shift()];

  const combinedMiddleware = [...defaultMiddleware, ...middleware];

  return useFloating(reference, floating, {
    middleware: combinedMiddleware,
    placement,
    strategy,
    whileElementsMounted: autoUpdate,
    ...restOptions,
  });
}
