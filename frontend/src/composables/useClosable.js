import { onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts.js";

/* Makes a component closable via ESC key, clicking outside, or close button */
export default function ({
  onClose,
  closeButtonSelector = null,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}) {
  const instance = getCurrentInstance();

  // Handle ESC key press
  const keyboardController = closeOnEsc ? useKeyboardShortcuts({ escape: () => onClose() }) : null;

  // Handle clicks outside the component
  const handleOutsideClick = (event) => {
    if (!instance.value) return;
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

  // Set up event listeners on mount
  let cleanupCloseButton = null;
  onMounted(() => {
    if (closeOnEsc) keyboardController?.activate();
    if (closeOnOutsideClick) cleanupCloseButton = setupCloseButton();
    if (closeButtonSelector) XXXX;
  });

  // Clean up all event listeners on unmount
  onBeforeUnmount(() => {
    if (closeOnEsc) keyboardController?.deactivate();
    if (closeOnOutsideClick) document.removeEventListener("click", handleOutsideClick);
    if (cleanupCloseButton) cleanupCloseButton();
  });
}
