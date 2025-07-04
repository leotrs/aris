<script setup>
  /**
   * Icon - Robust icon component with error handling and fallback support
   *
   * Renders Tabler icons and custom icons with comprehensive error handling. Automatically
   * falls back to an alert triangle icon when the requested icon doesn't exist, with
   * helpful console warnings for debugging. Supports all Tabler icons plus custom icons
   * like "Therefore".
   *
   * @displayName Icon
   * @example
   * // Basic icon usage
   * <Icon name="Home" />
   *
   * @example
   * // Icon with custom CSS classes
   * <Icon name="Settings" iconClass="w-6 h-6 text-blue-500" />
   *
   * @example
   * // Multiple custom classes
   * <Icon name="Download" iconClass="icon-large primary-color" />
   *
   * @example
   * // Custom icon (non-Tabler)
   * <Icon name="Therefore" />
   *
   * @example
   * // Error handling - invalid icon shows warning and fallback
   * <Icon name="NonExistentIcon" />
   * <!-- Logs: [Icon] Icon 'NonExistentIcon' not found. Using fallback error icon. -->
   * <!-- Renders: AlertTriangle icon with 'icon-error-fallback' class -->
   *
   * @example
   * // Icon in button context
   * <button class="btn">
   *   <Icon name="Plus" iconClass="btn-icon" />
   *   Add Item
   * </button>
   *
   * @example
   * // Icon with hover effects
   * <Icon name="Heart" iconClass="hover:text-red-500 transition-colors" />
   */

  import { computed } from "vue";
  import * as TablerIcons from "@tabler/icons-vue";
  import IconTherefore from "./IconTherefore.vue";

  defineOptions({
    name: "Icon",
  });

  const Icons = {
    ...TablerIcons,
    IconTherefore,
  };

  const props = defineProps({
    /**
     * Name of the icon to render (without 'Icon' prefix)
     *
     * For Tabler icons, use the name without the 'Icon' prefix (e.g., 'Home' for IconHome).
     * For custom icons, use the exact name (e.g., 'Therefore' for IconTherefore).
     *
     * @example "Home", "Settings", "Plus", "Download", "Heart"
     * @example "Therefore" // Custom icon
     * @see https://tabler-icons.io/ for available Tabler icons
     */
    name: {
      type: String,
      required: true,
      validator: (value) => {
        if (!value || value.trim() === "") {
          console.warn("[Icon] Icon name cannot be empty. Using fallback error icon.");
          return true; // Allow to continue with fallback
        }
        return true;
      },
    },

    /**
     * Additional CSS classes to apply to the icon element
     *
     * Multiple classes can be provided as a space-separated string.
     * Classes are applied to the rendered SVG element alongside 'tabler-icon'.
     *
     * @example "w-6 h-6"
     * @example "text-blue-500 hover:text-blue-700"
     * @example "btn-icon primary-color"
     */
    iconClass: {
      type: String,
      default: "",
    },
  });

  /**
   * Validates icon name and determines which component to render.
   *
   * This computed property handles the core logic of icon resolution:
   * 1. Validates the icon name is not empty
   * 2. Attempts to find the icon in the Icons registry
   * 3. Falls back to AlertTriangle icon with console warning if not found
   *
   * @returns {Component} Vue component to render (either the requested icon or fallback)
   */
  const iconComponent = computed(() => {
    // Handle empty/null names
    if (!props.name || props.name.trim() === "") {
      console.warn("[Icon] Icon name cannot be empty. Using fallback error icon.");
      return TablerIcons.IconAlertTriangle;
    }

    const iconName = `Icon${props.name}`;
    const component = Icons[iconName];

    // Handle non-existent icons
    if (!component) {
      console.warn(`[Icon] Icon '${props.name}' not found. Using fallback error icon.`);
      return TablerIcons.IconAlertTriangle;
    }

    return component;
  });

  /**
   * Computes CSS classes to apply to the icon element.
   *
   * Combines the base 'tabler-icon' class with any custom classes from iconClass prop,
   * and adds 'icon-error-fallback' class when displaying the fallback error icon.
   * This class can be used for styling or testing purposes.
   *
   * @returns {string[]} Array of CSS class names
   */
  const iconClasses = computed(() => {
    const classes = ["tabler-icon"];

    if (props.iconClass) {
      classes.push(...props.iconClass.split(" ").filter(Boolean));
    }

    // Add error fallback class when using fallback icon
    if (iconComponent.value === TablerIcons.IconAlertTriangle) {
      classes.push("icon-error-fallback");
    }

    return classes;
  });
</script>

<template>
  <!--
    Dynamic icon component that renders either the requested icon or fallback error icon.

    The component attribute is determined by iconComponent computed property, which handles
    validation and fallback logic. CSS classes include 'tabler-icon' base class plus any
    custom classes from iconClass prop, and 'icon-error-fallback' when showing fallback.
  -->
  <component :is="iconComponent" :class="iconClasses" />
</template>

<style scoped>
  /*
    Base icon styles - commented out to inherit from Tabler defaults.

    TODO: Address this later - consider whether default sizing should be restored
    for consistency across the application. The commented styles represent
    standard Tabler icon dimensions and stroke properties.

    Original styles:
    - width: 24px
    - height: 24px
    - stroke-width: 1.75px
    - stroke-linecap: round
    - stroke-linejoin: round
  */
  .tabler-icon {
    /* Tabler icon base styles - see TODO above */
  }

  /*
    Error fallback icon styling hook.

    The 'icon-error-fallback' class is automatically added when an invalid
    icon name is provided and the AlertTriangle fallback is shown. This can
    be used for:
    - Testing: Easily identify when fallbacks are being used
    - Styling: Apply different visual treatment to error states
    - Debugging: Visually distinguish invalid icon usage
  */
  .icon-error-fallback {
    /* Add custom styling for fallback icons if needed */
  }
</style>
