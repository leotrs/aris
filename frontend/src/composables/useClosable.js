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
  keyboardController = null, // Optional existing keyboard shortcuts controller
}) {
  const instance = getCurrentInstance();

  // Handle ESC key press
  let keyController = null;
  let setupEscKey, tearDownEscKey;

  if (closeOnEsc) {
    if (keyboardController) {
      // Use existing keyboard controller and add escape shortcut
      keyboardController.addShortcuts({ escape: onClose });
      setupEscKey = () => {}; // No need to activate, already handled by existing controller
      tearDownEscKey = () => keyboardController.removeShortcuts(["escape"]);
      keyController = keyboardController;
    } else {
      // Create new keyboard controller
      keyController = useKeyboardShortcuts({ escape: onClose }, autoActivate);
      setupEscKey = () => keyController.activate();
      tearDownEscKey = () => keyController.deactivate();
    }
  }

  // Handle clicks outside the component
  const handleOutsideClick = (event) => {
    if (!instance || !instance.proxy.$el) return;
    if (!instance.proxy.$el.contains(event.target)) {
      onClose();
    }
  };
  const setupOutsideClick = () =>
    // Using nextTick with setTimeout essentially waits for "two ticks". This is
    // necessary because for components that call useClosable that appear by clicking on
    // a button _and the button is *outside* the component_, the following event
    // listener was being called on the very same click that opened the component in the
    // first place, immediately closing it, and thus it would never show. Waiting for
    // "two ticks" is enough to fix this.
    nextTick(() => setTimeout(() => document.addEventListener("click", handleOutsideClick), 0));
  const tearDownOutsideClick = () => document.removeEventListener("click", handleOutsideClick);

  // Handle clicking the close button
  const getCloseButton = () => {
    if (!closeButtonSelector || !instance || !instance.proxy.$el) return null;
    const el = instance.proxy.$el;
    let closeButton;
    if (el.querySelector) {
      closeButton = el.querySelector(closeButtonSelector);
    } else if (el.parentElement) {
      closeButton = el.parentElement.querySelector(closeButtonSelector);
    }
    if (!closeButton) return null;
    return closeButton;
  };
  const setupCloseButton = () => getCloseButton()?.addEventListener("click", onClose);
  const tearDownCloseButton = () => getCloseButton()?.removeEventListener("click", onClose);

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
