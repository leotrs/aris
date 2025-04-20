import {
  ref,
  reactive,
  computed,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
} from "vue";


/* Utilities */
// Use a string rather than a ref because string keys are much simpler
const refToKey = (ref) => (ref ? `${ref.uid || ref.value?.uid}` : null);


/* Global state */
const components = reactive([]);
const activeComponent = computed(() => components.at(-1));
const listeners = ref({});
const lastKeyPressed = ref("");
const sequenceTimeout = ref(null);
const SEQUENCE_DELAY = 500;


/* Main event handlers */
const dispatchSequenceKey = (event, shortcuts, key) => {
  console.log("trying sequence", lastKeyPressed.value);
  if (lastKeyPressed.value) {
    const sequenceKey = `${lastKeyPressed.value},${key}`;
    console.log("trying sequence", sequenceKey);
    if (shortcuts[sequenceKey]) {
      event.preventDefault();
      shortcuts[sequenceKey](event);
      clearTimeout(sequenceTimeout.value);
      lastKeyPressed.value = "";
      return true;
    }
  }
  return false;
};

const dispatchSingleKey = (event, shortcuts, key) => {
  console.log("dispatching single", event.key);

  const isFirstKeyInSequence = Object.keys(shortcuts).some(k => k.startsWith(`${key},`));

  if (isFirstKeyInSequence) {
    event.preventDefault();

    // Restart the sequence tracking
    lastKeyPressed.value = key;
    clearTimeout(sequenceTimeout.value);

    // After a delay, execute the single key shortcut, if it exists
    sequenceTimeout.value = setTimeout(() => {
      shortcuts[key]?.(event);
      lastKeyPressed.value = "";
    }, SEQUENCE_DELAY);
  } else if (shortcuts[key]) {
    event.preventDefault();
    shortcuts[key](event);
    lastKeyPressed.value = "";
  }
}

const handleKeyDown = (event) => {
  console.log(event.key);
  const shortcuts = listeners.value[refToKey(activeComponent)];
  const key = event.key.toLowerCase();
  if (!activeComponent.value || !shortcuts) return;

  if (dispatchSequenceKey(event, shortcuts, key)) return;
  dispatchSingleKey(event, shortcuts, key);
};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handleKeyDown);
}


/* Public interface */
export function useKeyboardManagerState() {
  return { activeComponent };
}

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
