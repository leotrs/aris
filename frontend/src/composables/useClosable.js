import { ref, watch, nextTick, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts.js";

/* Makes a component closable via ESC key, clicking outside, or close button */
export default function ({
  onClose,
  active = ref(true),
  closeButtonSelector = null,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}) {
  const instance = getCurrentInstance();

  // Handle ESC key press
  const keyboardController = closeOnEsc
    ? useKeyboardShortcuts({ escape: () => active.value && onClose() })
    : null;

  // Handle clicks outside the component
  const handleOutsideClick = (event) => {
    if (!active.value || !instance.value) return;
    if (!instance.value.$el.contains(event.target)) onClose();
  };

  // Handle clicking the close button
  const setupCloseButton = () => {
    if (!closeButtonSelector) return null;
    const closeButton = document.querySelector(closeButtonSelector);
    if (!closeButton) return null;

    closeButton.addEventListener("click", onClose);
    return () => closeButton.removeEventListener("click", onClose);
  };

  // Set up and tear down event listeners based on active state
  watch(
    active,
    (isActive) => {
      if (isActive) {
        if (closeOnEsc) keyboardController?.activate();
        if (closeOnOutsideClick) {
          nextTick(document.addEventListener("click", handleOutsideClick));
        }
      } else {
        if (closeOnEsc) keyboardController?.deactivate();
        if (closeOnOutsideClick) {
          document.removeEventListener("click", handleOutsideClick);
        }
      }
    },
    { immediate: true },
  );


  // Set up event listeners on mount
  let cleanupCloseButton = null;
  onMounted(() => {
    if (!active.value) return;
    if (closeOnEsc) keyboardController?.activate();
    cleanupCloseButton = setupCloseButton();
  });

  // Clean up all event listeners on unmount
  onBeforeUnmount(() => {
    if (closeOnEsc) keyboardController?.deactivate();
    if (closeOnOutsideClick) document.removeEventListener("click", handleOutsideClick);
    if (cleanupCloseButton) cleanupCloseButton();
  });
}
