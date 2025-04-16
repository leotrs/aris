import { onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from "vue";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts.js";

/* Makes a component closable via ESC key, clicking outside, or close button */
export default function ({
  onClose,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  closeOnCloseButton = true,
  closeButtonSelector = "button.btn-close",
  autoActivate = true,
}) {
  const instance = getCurrentInstance();

  // Handle ESC key press
  const keyController = closeOnEsc
    ? useKeyboardShortcuts({ escape: onClose }, autoActivate)
    : null;
  const setupEscKey = () => keyController.activate();
  const tearDownEscKey = () => keyController.deactivate();

  // Handle clicks outside the component
  const handleOutsideClick = (event) => {
    if (!instance || !instance.proxy.$el) return;
    if (!instance.proxy.$el.contains(event.target)) onClose();
  };
  const setupOutsideClick = () =>
    nextTick(() => document.addEventListener("click", handleOutsideClick));
  const tearDownOutsideClick = () =>
    document.removeEventListener("click", handleOutsideClick);

  // Handle clicking the close button
  const getCloseButton = () => {
    if (!closeButtonSelector || !instance || !instance.$el) return null;
    const closeButton = instance.$el.querySelector(closeButtonSelector);
    return closeButton ? closeButton : console.error("No close button found") || null;
  };
  const setupCloseButton = () => getCloseButton()?.addEventListener("click", onClose);
  const tearDownCloseButton = () =>
    getCloseButton()?.removeEventListener("click", onClose);

  // General handlers
  const activate = () => {
    if (closeOnEsc) setupEscKey();
    if (closeOnOutsideClick) setupOutsideClick();
    if (closeOnCloseButton) setupCloseButton();
  };
  const deactivate = () => {
    if (closeOnEsc) tearDownEscKey();
    if (closeOnOutsideClick) tearDownOutsideClick();
    if (closeOnCloseButton) tearDownCloseButton();
  };

  onBeforeUnmount(() => deactivate());
  if (autoActivate) onMounted(() => nextTick(activate));
  return { activate, deactivate };
}
