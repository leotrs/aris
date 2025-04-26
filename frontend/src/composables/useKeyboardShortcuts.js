import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
} from "vue";


/* Utilities */
// Use a string rather than a ref because string keys are much simpler
const refToKey = (ref) => (ref ? `${ref.uid || ref.value?.uid}` : null);

const hasModifiers = (ev) => {
  return ev.ctrlKey || ev.altKey || ev.shiftKey || ev.metaKey;
};


/* Global state */
const components = reactive([]);
const listeners = ref({});
const lastKeyPressed = ref("");
const sequenceTimeout = ref(null);
const SEQUENCE_DELAY = 500;


/* Event dispatching */
const dispatchSequenceKey = (ev, shortcuts, key) => {
  if (hasModifiers(ev)) return false;

  if (!lastKeyPressed.value) return false;
  const sequenceKey = `${lastKeyPressed.value},${key}`;
  if (!shortcuts[sequenceKey]) return false;
  console.log("dispatching sequence", sequenceKey);
  ev.prevDefault();

  try {
    shortcuts[sequenceKey](ev);
  } catch (error) {
    console.error(`Error executing sequence shortcut "${sequenceKey}":`, error);
  }

  clearTimeout(sequenceTimeout.value);
  lastKeyPressed.value = "";
  return true;
};

const dispatchSingleKey = (ev, shortcuts, key) => {
  if (hasModifiers(ev)) return false;
  const isFirstKeyInSequence = Object.keys(shortcuts).some(k => k.startsWith(`${key},`));

  if (isFirstKeyInSequence) {
    ev.preventDefault();

    // Restart the sequence tracking
    lastKeyPressed.value = key;
    clearTimeout(sequenceTimeout.value);

    // After a delay, execute the single key shortcut, if it exists
    sequenceTimeout.value = setTimeout(() => {
      if (shortcuts[key]) {
        console.log("dispatching delayed", key);
        try {
          shortcuts[key](ev);
        } catch (error) {
          console.error(`Error executing shortcut "${key}:"`, error);
        }
      }
      lastKeyPressed.value = "";
    }, SEQUENCE_DELAY);

    return true;
  } else if (shortcuts[key]) {
    console.log("dispatching", key);
    ev.preventDefault();

    try {
      shortcuts[key](ev);
    } catch (error) {
      console.error(`Error executing shortcut "${key}:"`, error);
    }

    lastKeyPressed.value = "";
    return true;
  }

  return false;
}

const tryHandleKeyEvent = (ev, componentRef, key) => {
  if (hasModifiers(ev)) return false;
  const componentId = refToKey(componentRef);
  const componentShortcuts = listeners.value[componentId];
  if (!componentShortcuts) return false;
  return dispatchSequenceKey(ev, componentShortcuts, key) ||
    dispatchSingleKey(ev, componentShortcuts, key);
};

const handleKeyDown = (ev) => {
  if (ev.target.tagName === 'INPUT'
    || ev.target.tagName === 'TEXTAREA'
    || ev.target.isContentEditable
    || hasModifiers(ev)) {
    return;
  }

  const key = ev.key.toLowerCase();
  if (components.length === 0) return;
  console.log('Key pressed:', key, '. Last key:', lastKeyPressed.value);

  // Try components in reverse order (most recently activated first)
  for (let i = components.length - 1; i >= 0; i--) {
    if (tryHandleKeyEvent(ev, components[i], key)) return;
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handleKeyDown);
}


/* Global state management */
function registerShortcuts(componentId, shortcuts) {
  const existingShortcuts = listeners.value[componentId];
  let result = true;

  if (existingShortcuts) {
    const conflicts = Object.keys(shortcuts).filter(key => existingShortcuts[key]);
    if (conflicts.length > 0) {
      console.error(`Component ${componentId} requesting to overwrite shortcuts ${conflicts.join(', ')}`);
      result = false;
    }
  }

  listeners.value[componentId] = {
    ...(existingShortcuts || {}),
    ...shortcuts
  };

  return result;
}


/* Public interface */
export function getRegisteredComponents() {
  return [...components];
}

export function useKeyboardShortcuts(shortcuts, autoActivate = true) {
  const instance = getCurrentInstance();
  if (!instance) {
    console.error("useKeyboardShortcuts must be used within setup()");
    return {};
  }

  const componentId = refToKey(instance);
  if (!registerShortcuts(componentId, shortcuts)) {
    console.error("Error: clashing shortcuts");
    return {};
  }

  // Handle component lifecycle
  const isRegistered = () => components.some(comp => refToKey(comp) === componentId);
  const deactivate = () => {
    const idx = components.findIndex(comp => refToKey(comp) === componentId);
    if (idx !== -1) components.splice(idx, 1);
  };
  const activate = () => { deactivate(); components.push(instance); };
  onMounted(() => (autoActivate ? activate() : null));
  onBeforeUnmount(() => { deactivate(); listeners.value[componentId] = {}; });
  return { activate, deactivate, isRegistered };
}
