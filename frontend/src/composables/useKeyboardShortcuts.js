// useKeyboardShortcuts.js - Enhanced version
import {
  ref,
  computed,
  reactive,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
} from "vue";

/* Utilities */
const refToKey = (ref) => (ref ? `${ref.uid || ref.value?.uid}` : null);

const hasModifiersAndNotQuestionMark = (ev) => {
  const notQuestionMark = ev.key !== '?';
  const hasModifiers = ev.ctrlKey || ev.altKey || ev.shiftKey || ev.metaKey;
  return notQuestionMark && hasModifiers;
};

/* Global state */
const components = reactive([]);
const listeners = ref({});
const componentMetadata = ref({}); // New: Store component metadata
const lastKeyPressed = ref("");
const sequenceTimeout = ref(null);
const SEQUENCE_DELAY = 500;
let isForwardingEvent = false;
let fallbackComponent = computed(() => null);

/* Event dispatching */
const dispatchSequenceKey = (ev, shortcuts, key) => {
  if (hasModifiersAndNotQuestionMark(ev)) return false;

  if (!lastKeyPressed.value) return false;
  const sequenceKey = `${lastKeyPressed.value},${key}`;
  if (!shortcuts[sequenceKey]) return false;

  ev.preventDefault();

  try {
    // Execute the actual function, not the wrapper
    const shortcutData = shortcuts[sequenceKey];
    const fn = typeof shortcutData === 'function' ? shortcutData : shortcutData.fn;
    fn(ev);
  } catch (error) {
    console.error(`Error executing sequence shortcut "${sequenceKey}":`, error);
  }

  clearTimeout(sequenceTimeout.value);
  lastKeyPressed.value = "";
  return true;
};

const dispatchSingleKey = (ev, shortcuts, key) => {
  if (hasModifiersAndNotQuestionMark(ev)) return false;
  const isFirstKeyInSequence = Object.keys(shortcuts).some(k => k.startsWith(`${key},`));

  if (isFirstKeyInSequence) {
    ev.preventDefault();

    lastKeyPressed.value = key;
    clearTimeout(sequenceTimeout.value);

    sequenceTimeout.value = setTimeout(() => {
      if (shortcuts[key]) {
        try {
          const shortcutData = shortcuts[key];
          const fn = typeof shortcutData === 'function' ? shortcutData : shortcutData.fn;
          fn(ev);
        } catch (error) {
          console.error(`Error executing shortcut "${key}:"`, error);
        }
      }
      lastKeyPressed.value = "";
    }, SEQUENCE_DELAY);

    return true;
  } else if (shortcuts[key]) {
    ev.preventDefault();

    try {
      const shortcutData = shortcuts[key];
      const fn = typeof shortcutData === 'function' ? shortcutData : shortcutData.fn;
      fn(ev);
    } catch (error) {
      console.error(`Error executing shortcut "${key}:"`, error);
    }

    lastKeyPressed.value = "";
    return true;
  }

  return false;
};

const tryHandleKeyEvent = (ev, componentRef, key) => {
  if (hasModifiersAndNotQuestionMark(ev)) return false;
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
    hasModifiersAndNotQuestionMark(ev) ||
    (isEditableElement && !['Enter', 'Escape'].includes(ev.key));
  if (shouldIgnore) return;

  const key = ev.key.toLowerCase();
  if (components.length === 0 && !fallbackComponent.value) return;
  // console.log('Key pressed:', key, '. Last key:', lastKeyPressed.value);

  for (let i = components.length - 1; i >= 0; i--) {
    if (tryHandleKeyEvent(ev, components[i], key)) return;
  }

  if (!fallbackComponent.value) return;
  isForwardingEvent = true;
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
function registerShortcuts(componentId, shortcuts, componentName = null) {
  const existingShortcuts = listeners.value[componentId];

  // Store component metadata
  if (componentName) {
    componentMetadata.value[componentId] = { name: componentName };
  }

  // Normalize shortcuts to support both old and new formats
  const normalizedShortcuts = {};
  Object.entries(shortcuts).forEach(([key, value]) => {
    if (typeof value === 'function') {
      // Legacy format - try to extract function name or use generic description
      normalizedShortcuts[key] = {
        fn: value,
        description: value.name || 'Execute action'
      };
    } else if (typeof value === 'object' && value.fn) {
      // New format with explicit description
      normalizedShortcuts[key] = value;
    } else {
      console.warn(`Invalid shortcut format for key "${key}"`);
      normalizedShortcuts[key] = {
        fn: () => {},
        description: 'Invalid shortcut'
      };
    }
  });

  const conflicts = Object.keys(normalizedShortcuts).filter(key =>
    existingShortcuts &&
    existingShortcuts[key] &&
    existingShortcuts[key].fn?.toString() !== normalizedShortcuts[key].fn?.toString()
  );

  if (conflicts.length > 0) {
    console.warn(`Component ${componentId} overwriting shortcuts: ${conflicts.join(', ')}`);
  }

  listeners.value[componentId] = {
    ...existingShortcuts,
    ...normalizedShortcuts
  };
}

/* Public interface */
export function getActiveComponents() {
  return [...components];
}

export function getRegisteredComponents() {
  return listeners.value;
}

export function getComponentMetadata() {
  return componentMetadata.value;
}

export function useKeyboardShortcuts(shortcuts = {}, autoActivate = true, componentName = null) {
  const instance = getCurrentInstance();
  if (!instance) {
    console.error("useKeyboardShortcuts must be used within setup()");
    return {};
  }

  const componentId = refToKey(instance);

  // Try to infer component name from Vue component if not provided
  const inferredName = componentName ||
    instance.type?.name ||
    instance.type?.__name ||
    instance.proxy?.$options?.name ||
    `Component-${componentId}`;

  registerShortcuts(componentId, shortcuts, inferredName);

  const isRegistered = () => components.some(comp => refToKey(comp) === componentId);
  const deactivate = () => {
    const idx = components.findIndex(comp => refToKey(comp) === componentId);
    if (idx !== -1) components.splice(idx, 1);
  };
  const activate = () => { deactivate(); components.push(instance); };
  const addShortcuts = (newShortcuts) => registerShortcuts(componentId, newShortcuts, inferredName);
  const removeShortcuts = (keys) => {
    if (!listeners.value[componentId]) return;
    if (Array.isArray(keys)) {
      keys.forEach(key => delete listeners.value[componentId][key]);
    } else if (keys === undefined) {
      listeners.value[componentId] = {};
    }
  };

  onMounted(() => autoActivate && activate());
  onBeforeUnmount(() => {
    deactivate();
    removeShortcuts();
    delete componentMetadata.value[componentId];
  });

  return {
    activate, deactivate, isRegistered, addShortcuts, removeShortcuts,
    getShortcuts: () => ({ ...listeners.value[componentId] }),
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
