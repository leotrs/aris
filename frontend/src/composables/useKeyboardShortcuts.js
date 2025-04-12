import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";

/* Utilities */
// Use a string rather than a ref because string keys are much simpler
const refToKey = (ref) => ref ? `${ref.uid || ref.value.uid}` : null;

/* Global state */
const activeComponent = ref(null);
const listeners = ref({});
const handleKeyDown = (event) => {
  console.log(activeComponent);
  console.log(refToKey(activeComponent));
  const shortcuts = listeners.value[refToKey(activeComponent)];
  if (!activeComponent.value || !shortcuts) return;
  const key = event.key.toLowerCase();
  if (shortcuts[key]) {
    event.preventDefault();
    shortcuts[key](event);
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handleKeyDown);
}

export function useKeyboardManagerState() {
  return { activeComponent };
}

/* Composable for components */
export function useKeyboardShortcuts(shortcuts, autoActivate = true) {
  const instance = getCurrentInstance();
  if (!instance) {
    console.error("useKeyboardShortcuts must be used within setup()");
    return {};
  }

  // Register component keyboard shortcuts;
  const componentId = refToKey(instance);
  console.log(`registering ${componentId}`);
  listeners.value[componentId] = shortcuts;

  // Handle component lifecycle
  const isActive = () => activeComponent.value === instance;
  const activate = () => (activeComponent.value = instance);
  const deactivate = () => (isActive() ? (activeComponent.value = null) : null);
  onMounted(() => (autoActivate ? activate() : null));
  onBeforeUnmount(() => deactivate() || delete listeners.value[componentId]);

  return { activate, deactivate, isActive };
}
