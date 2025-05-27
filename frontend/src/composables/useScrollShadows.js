import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable for managing dynamic scroll shadows on horizontally scrollable elements
 * @returns {Object} - Object containing refs and template ref function
 */
export function useScrollShadows() {
  const scrollElementRef = ref(null);
  const showLeftShadow = ref(false);
  const showRightShadow = ref(false);

  let resizeObserver = null;

  const updateShadows = () => {
    if (!scrollElementRef.value) return;

    const element = scrollElementRef.value;
    const { scrollLeft, scrollWidth, clientWidth } = element;

    // Show left shadow when scrolled right (content hidden on left)
    showLeftShadow.value = scrollLeft > 0;

    // Show right shadow when there's more content to scroll right
    showRightShadow.value = scrollLeft < (scrollWidth - clientWidth);
  };

  const setupScrollShadows = () => {
    if (!scrollElementRef.value) return;

    // Initial check
    updateShadows();

    // Listen for scroll events
    scrollElementRef.value.addEventListener('scroll', updateShadows);

    // Listen for resize events to handle dynamic content changes
    window.addEventListener('resize', updateShadows);

    // Use ResizeObserver to detect element size changes
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateShadows);
      resizeObserver.observe(scrollElementRef.value);
    }
  };

  const cleanupScrollShadows = () => {
    if (scrollElementRef.value) {
      scrollElementRef.value.removeEventListener('scroll', updateShadows);
    }

    window.removeEventListener('resize', updateShadows);

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  onMounted(() => {
    setupScrollShadows();
  });

  onUnmounted(() => {
    cleanupScrollShadows();
  });

  return {
    scrollElementRef,
    showLeftShadow,
    showRightShadow,
    updateShadows,
    setupScrollShadows,
    cleanupScrollShadows
  };
}
