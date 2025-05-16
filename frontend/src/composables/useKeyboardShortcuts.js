import {
  ref,
  computed,
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
let isForwardingEvent = false;
let fallbackComponent = computed(() => null);


/* Event dispatching */
const dispatchSequenceKey = (ev, shortcuts, key) => {
  if (hasModifiers(ev)) return false;

  if (!lastKeyPressed.value) return false;
  const sequenceKey = `${lastKeyPressed.value},${key}`;
  if (!shortcuts[sequenceKey]) return false;
  // console.log("dispatching sequence", sequenceKey);
  ev.preventDefault();

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
        // console.log("dispatching delayed", key);
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
    // console.log("dispatching", key);
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
};

const tryHandleKeyEvent = (ev, componentRef, key) => {
  if (hasModifiers(ev)) return false;
  const componentId = refToKey(componentRef);
  const componentShortcuts = listeners.value[componentId];
  if (!componentShortcuts) return false;
  return dispatchSequenceKey(ev, componentShortcuts, key) ||
    dispatchSingleKey(ev, componentShortcuts, key);
};

const handleKeyDown = (ev) => {
  const tag = ev.target.tagName?.toUpperCase();
  const isEditableElement = tag === 'INPUT' || tag === 'TEXTAREA' || ev.target.isContentEditable;
  const shouldIgnore =
    isForwardingEvent ||
    hasModifiers(ev) ||
    (isEditableElement && !['Enter', 'Escape'].includes(ev.key));
  if (shouldIgnore) return;

  const key = ev.key.toLowerCase();
  if (components.length === 0 && !fallbackComponent.value) return;
  // console.log('Key pressed:', key, '. Last key:', lastKeyPressed.value);

  // Try components in reverse order (most recently activated first)
  for (let i = components.length - 1; i >= 0; i--) {
    if (tryHandleKeyEvent(ev, components[i], key)) return;
  }

  // Try the fallback component
  if (!fallbackComponent.value) return;
  isForwardingEvent = true;
  // console.log("trying fallback:", fallbackComponent.value.$el);
  try {
    const clonedEvent = new KeyboardEvent('keydown', {
      key: ev.key,
      code: ev.code,
      keyCode: ev.keyCode,
      charCode: ev.charCode,
      which: ev.which,
      altKey: ev.altKey,
      ctrlKey: ev.ctrlKey,
      metaKey: ev.metaKey,
      shiftKey: ev.shiftKey,
      repeat: ev.repeat,
      bubbles: true,
      cancelable: true
    });
    fallbackComponent.value.$el.dispatchEvent(clonedEvent);
    if (clonedEvent.defaultPrevented) ev.preventDefault();
  } finally {
    isForwardingEvent = false;
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handleKeyDown);
}


/* Global state management */
function registerShortcuts(componentId, shortcuts) {
  const existingShortcuts = listeners.value[componentId];

  const conflicts = Object.keys(shortcuts).filter(key =>
    existingShortcuts &&
    existingShortcuts[key] &&
    existingShortcuts[key].toString() !== shortcuts[key].toString()
  );

  if (conflicts.length > 0) {
    console.warn(`Component ${componentId} overwriting shortcuts: ${conflicts.join(', ')}`);
  }

  listeners.value[componentId] = {
    ...existingShortcuts,
    ...shortcuts
  };
}


/* Public interface */
export function getActiveComponents() {
  return [...components];
}

export function getRegisteredComponents() {
  return listeners.value;
}

export function useKeyboardShortcuts(shortcuts = {}, autoActivate = true) {
  const instance = getCurrentInstance();
  if (!instance) {
    console.error("useKeyboardShortcuts must be used within setup()");
    return {};
  }

  const componentId = refToKey(instance);
  registerShortcuts(componentId, shortcuts);

  // Handle component lifecycle
  const isRegistered = () => components.some(comp => refToKey(comp) === componentId);
  const deactivate = () => {
    const idx = components.findIndex(comp => refToKey(comp) === componentId);
    if (idx !== -1) components.splice(idx, 1);
  };
  const activate = () => { deactivate(); components.push(instance); };
  const addShortcuts = (newShortcuts) => registerShortcuts(componentId, newShortcuts);
  const removeShortcuts = (keys) => {
    if (!listeners.value[componentId]) return;
    if (Array.isArray(keys)) {
      keys.forEach(key => delete listeners.value[componentId][key]);
    } else if (keys === undefined) {
      listeners.value[componentId] = {};
    }
  };
  onMounted(() => autoActivate && activate());
  onBeforeUnmount(() => { deactivate(); removeShortcuts(); });
  return {
    activate, deactivate, isRegistered, addShortcuts, removeShortcuts, getShortcuts: () => ({ ...listeners.value[componentId] }),
  };
}

export function registerAsFallback(component) {
  fallbackComponent = computed(() => component?.value || null);

  if (!getCurrentInstance()) return;
  onBeforeUnmount(() => {
    if (refToKey(fallbackComponent.value) === refToKey(component.value))
      fallbackComponent = computed(() => null);
  });
}
