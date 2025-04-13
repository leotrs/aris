import { ref, reactive, computed, getCurrentInstance, onMounted, onBeforeUnmount } from "vue";

/* Utilities */
// Use a string rather than a ref because string keys are much simpler
const refToKey = (ref) => (ref ? `${ref.uid || ref.value?.uid}` : null);

/* Global state */
const components = reactive([]);
const activeComponent = computed(() => components.at(-1));
const listeners = ref({});
const handleKeyDown = (event) => {
  const shortcuts = listeners.value[refToKey(activeComponent)];
  const key = event.key.toLowerCase();
  if (!activeComponent.value || !shortcuts || !shortcuts[key]) return;
  console.log(refToKey(activeComponent), key, shortcuts);
  event.preventDefault();
  shortcuts[key](event);
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
  listeners.value[componentId] = shortcuts;

  // Handle component lifecycle
  const isActive = () => refToKey(activeComponent.value) == refToKey(instance);
  const activate = () => components.push(instance);
  const deactivate = () => (isActive() ? components.pop() : null);
  onMounted(() => (autoActivate ? activate() : null));
  onBeforeUnmount(() => deactivate());

  return { activate, deactivate, isActive };
}
