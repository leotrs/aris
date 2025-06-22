<script setup>
  /**
   * Tooltip - Floating informational overlay component
   *
   * Provides contextual information when hovering over an anchor element. Uses Floating UI
   * for intelligent positioning with collision detection and automatic repositioning.
   * Supports custom content via slots and various placement options.
   *
   * @displayName Tooltip
   * @example
   * // Basic tooltip with text content
   * <Tooltip :anchor="buttonRef" content="Click to save your changes" />
   *
   * @example
   * // Tooltip with custom placement
   * <Tooltip :anchor="iconRef" content="Settings" placement="top" />
   *
   * @example
   * // Tooltip with custom HTML content via slot
   * <Tooltip :anchor="helpIconRef" placement="right">
   *   <div>
   *     <strong>Advanced Feature</strong>
   *     <p>This feature requires premium access</p>
   *   </div>
   * </Tooltip>
   *
   * @example
   * // Tooltip with template ref anchor
   * <template>
   *   <button ref="saveButton">Save</button>
   *   <Tooltip :anchor="saveButton" content="Save your work" />
   * </template>
   *
   * @example
   * // Tooltip positioned above element
   * <Tooltip
   *   :anchor="warningIconRef"
   *   content="This action cannot be undone"
   *   placement="top-start"
   * />
   */

  import { toRef, ref, watch, watchEffect, nextTick } from "vue";
  import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/vue";

  defineOptions({
    name: "Tooltip",
  });

  const props = defineProps({
    /**
     * DOM element or template ref to anchor the tooltip to
     * @example buttonRef.value, document.querySelector('#my-button')
     */
    anchor: {
      type: [Object, null],
      required: true,
    },

    /**
     * Text content to display in the tooltip (alternative to slot content)
     */
    content: {
      type: String,
      default: "",
    },

    /**
     * Floating UI placement string for tooltip positioning relative to anchor
     * @values 'top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'
     * @see https://floating-ui.com/docs/tutorial#placements
     */
    placement: {
      type: String,
      default: "bottom",
      validator: (value) =>
        [
          "top",
          "top-start",
          "top-end",
          "right",
          "right-start",
          "right-end",
          "bottom",
          "bottom-start",
          "bottom-end",
          "left",
          "left-start",
          "left-end",
        ].includes(value),
    },
  });

  // Internal tooltip element reference
  const selfRef = ref(null);

  // Floating UI positioning system with collision detection
  const { floatingStyles } = useFloating(
    toRef(() => props.anchor),
    selfRef,
    {
      middleware: [
        offset(4), // 4px gap between tooltip and anchor
        flip(), // Flip to opposite side if no space
        shift(), // Shift along axis if overflowing
      ],
      placement: props.placement,
      strategy: "fixed",
      whileElementsMounted: autoUpdate, // Auto-update position on scroll/resize
    }
  );

  // Visibility state and control functions
  const isVisible = ref(false);
  const show = () => (isVisible.value = true);
  const hide = () => (isVisible.value = false);

  // Watch for anchor changes and manage hover event listeners
  watch(
    toRef(() => props.anchor),
    (newVal, oldVal) => {
      // Clean up old anchor event listeners
      if (oldVal) {
        oldVal.removeEventListener("mouseenter", show);
        oldVal.removeEventListener("mouseleave", hide);
      }

      // Set up new anchor event listeners
      if (newVal) {
        newVal.addEventListener("mouseenter", show);
        newVal.addEventListener("mouseleave", hide);

        // Handle case where anchor changes while mouse is already hovering
        if (newVal.matches(":hover")) show();
      }
    },
    { immediate: true }
  );
</script>

<template>
  <!-- Tooltip is teleported to body to avoid z-index and overflow issues -->
  <Teleport to="body">
    <div
      v-if="anchor"
      ref="selfRef"
      class="tooltip"
      role="tooltip"
      :style="{
        ...floatingStyles,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }"
    >
      <!--
        @slot default - Custom tooltip content (overrides content prop)
        @example
        <Tooltip :anchor="buttonRef">
          <strong>Important:</strong> This action is irreversible
        </Tooltip>
      -->
      <slot>{{ content }}</slot>
    </div>
  </Teleport>
</template>

<style scoped>
  .tooltip {
    position: fixed;
    z-index: 1000;
    background-color: var(--gray-800);
    color: var(--extra-light);
    padding: 8px;
    border-radius: 8px;
    font-size: 14px;
    max-width: 250px;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    box-shadow: var(--shadow-soft);
    pointer-events: none;
  }
</style>
