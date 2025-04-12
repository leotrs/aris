import { onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from "vue";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts.js";

/* Makes a component closable via ESC key, clicking outside, or close button */
export default function ({
  onClose,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  closeOnCloseButton = true,
  closeButtonSelector = "button.btn-close",
}) {
  const instance = getCurrentInstance();

  // Handle ESC key press
  const keyboardController = closeOnEsc ? useKeyboardShortcuts({ escape: onClose }) : null;
  const setupEscKey = () => keyboardController?.activate();
  const tearDownEscKey = () => keyboardController?.deactivate();

  // Handle clicks outside the component
  const handleOutsideClick = (event) => {
    if (!instance || !instance.$el) return;
    if (!instance.$el.contains(event.target)) onClose();
  };
  const setupOutsideClick = () =>
    nextTick(() => document.addEventListener("click", handleOutsideClick));
  const tearDownOutsideClick = () => document.removeEventListener("click", handleOutsideClick);

  // Handle clicking the close button
  const getCloseButton = () => {
    if (!closeButtonSelector || !instance || !instance.$el) return null;
    const closeButton = instance.$el.querySelector(closeButtonSelector);
    return closeButton ? closeButton : console.error("No close button found") || null;
  };
  const setupCloseButton = () => getCloseButton()?.addEventListener("click", onClose);
  const tearDownCloseButton = () => getCloseButton()?.removeEventListener("click", onClose);

  onMounted(() => {
    nextTick(() => {
      if (closeOnEsc) setupEscKey();
      if (closeOnOutsideClick) setupOutsideClick();
      if (closeOnCloseButton) setupCloseButton();
    });
  });
  onBeforeUnmount(() => {
    if (closeOnEsc) tearDownEscKey();
    if (closeOnOutsideClick) tearDownOutsideClick();
    if (closeOnCloseButton) tearDownCloseButton();
  });
}
