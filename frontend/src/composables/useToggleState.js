import { ref, watch } from "vue";

/**
 * Composable for standardized toggle state management
 * Extracts common toggle patterns used across ButtonToggle, ButtonDots, Tab, etc.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.defaultValue - Initial value
 * @param {Object} options.props - Component props (for v-model support)
 * @param {Function} options.emit - Component emit function
 */
export function useToggleState(options = {}) {
  const { defaultValue = false, props = null, emit = null } = options;

  // Use ref for internal state
  const active = ref(props?.modelValue ?? defaultValue);

  // Watch for external prop changes
  if (props) {
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== undefined && newValue !== active.value) {
          active.value = newValue;
        }
      }
    );
  }

  // Watch for changes and emit appropriate events
  watch(active, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // Emit v-model update
      if (emit) {
        emit("update:modelValue", newValue);

        // Emit toggle events
        if (newValue) {
          emit("on");
        } else {
          emit("off");
        }
      }
    }
  });

  const toggle = () => {
    active.value = !active.value;
  };

  return {
    active,
    toggle,
  };
}
