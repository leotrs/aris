import { ref, computed, watch } from "vue";

/**
 * Composable for standardized form field management
 * Extracts common form patterns used across InputText, SearchBar, EditableText
 *
 * @param {Object} options - Configuration options
 * @param {string} options.direction - Layout direction ('row' or 'column')
 * @param {boolean} options.required - Whether field is required
 * @param {Function} options.validator - Custom validation function
 * @param {boolean} options.validateOnBlur - Whether to validate on blur
 * @param {Object} options.props - Component props (for v-model support)
 * @param {Function} options.emit - Component emit function
 */
export function useFormField(options = {}) {
  const {
    direction = "row",
    required = false,
    validator = null,
    validateOnBlur = false,
    props = null,
    emit = null,
  } = options;

  // Internal state
  const focused = ref(false);
  const error = ref("");

  // Use ref for value, sync with props if provided
  const value = ref(props?.modelValue ?? "");

  // Watch for external prop changes
  if (props) {
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== undefined && newValue !== value.value) {
          value.value = newValue;
        }
      }
    );
  }

  // Watch value changes and emit updates
  watch(value, (newValue) => {
    if (emit) {
      emit("update:modelValue", newValue);
    }
  });

  // Computed input classes
  const inputClass = computed(() => ({
    focused: focused.value,
    error: Boolean(error.value),
    [direction]: true,
  }));

  // Focus management
  const setFocus = () => {
    focused.value = true;
    if (emit) {
      emit("focus");
    }
  };

  const setBlur = () => {
    focused.value = false;
    if (emit) {
      emit("blur");
    }

    // Validate on blur if enabled
    if (validateOnBlur) {
      validate();
    }
  };

  // Validation
  const validate = () => {
    let validationError = "";

    // Check required field
    if (required && (!value.value || value.value.trim() === "")) {
      validationError = "This field is required";
    }
    // Check custom validator
    else if (validator && typeof validator === "function") {
      const customError = validator(value.value);
      if (customError) {
        validationError = customError;
      }
    }

    error.value = validationError;

    if (emit) {
      emit("validation", {
        isValid: !validationError,
        error: validationError,
      });
    }

    return !validationError;
  };

  const clearError = () => {
    error.value = "";
  };

  return {
    value,
    focused,
    error,
    inputClass,
    validate,
    setFocus,
    setBlur,
    clearError,
  };
}
