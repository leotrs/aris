<script setup>
  import {
    ref,
    computed,
    watch,
    provide,
    inject,
    useTemplateRef,
    useSlots,
    nextTick,
  } from "vue";
  import { useFloatingUI } from "@/composables/useFloatingUI.js";
  import { useListKeyboardNavigation } from "@/composables/useListKeyboardNavigation.js";
  import useClosable from "@/composables/useClosable.js";
  import { useDebounceFn } from "@vueuse/core";

  const props = defineProps({
    // New simplified props
    variant: { type: String, default: null }, // 'dots', 'close', 'custom'
    placement: { type: String, default: "left-start" },
    floatingOptions: { type: Object, default: () => ({}) },
    size: { type: String, default: "md" },
    
    // Deprecated props (maintain backwards compatibility)
    icon: { type: String, default: "Dots" },
    text: { type: String, default: "" },
    btnComponent: { type: String, default: "ButtonToggle" },
    iconClass: { type: String, default: "" },
  });
  defineOptions({ inheritAttrs: false });

  // Sub-menu and mobile mode support
  const isSubMenu = inject("isSubMenu", false);
  const parentMenu = inject("parentMenu", null);
  const mobileMode = inject("mobileMode", false);

  // Generate unique ID for ARIA
  const triggerId = `cm-trigger-${Math.random().toString(36).substr(2, 9)}`;

  // Backwards compatibility and computed variant
  const computedVariant = computed(() => {
    if (props.variant) return props.variant;
    // Map old icon prop to new variant prop
    if (props.icon === 'Dots') return 'dots';
    if (props.icon === 'X') return 'close';
    return 'dots';
  });

  // Deprecation warnings for old props
  if (import.meta.env.DEV) {
    if (props.icon !== 'Dots') {
      console.warn('ContextMenu: "icon" prop is deprecated. Use "variant" instead.');
    }
    if (props.text) {
      console.warn('ContextMenu: "text" prop is deprecated.');
    }
    if (props.btnComponent !== 'ButtonToggle') {
      console.warn('ContextMenu: "btnComponent" prop is deprecated. Use "variant" or trigger slot instead.');
    }
  }

  // Computed classes for trigger button
  const triggerClasses = computed(() => [
    'context-menu-trigger',
    `variant-${computedVariant.value}`,
    `size-${props.size}`,
  ]);

  // Computed classes for menu
  const menuClasses = computed(() => [
    'context-menu',
    `placement-${props.placement}`,
    {
      'is-open': show.value,
      'mobile-mode': mobileMode.value,
      'desktop-mode': !mobileMode.value,
    }
  ]);

  // Provide context for child menus (this menu provides context for its children)
  provide("isSubMenu", true);
  provide("parentMenu", { placement: props.placement });

  /* State */
  const show = ref(false);
  const lastFocusedElement = ref(null);
  defineExpose({
    toggle: () => (show.value = !show.value),
    effectivePlacement: computed(() => effectivePlacement.value),
  });

  // Floating styles
  const slots = useSlots();
  const slotRef = useTemplateRef("slot-ref");
  const dotsRef = useTemplateRef("dots-ref");
  const compRef = useTemplateRef("comp-ref");
  const btnRef = computed(() => {
    let element = null;
    if (slots.trigger) {
      element = slotRef.value?.$el || slotRef.value;
    } else if (props.icon == "Dots") {
      element = dotsRef.value?.$el || dotsRef.value;
    } else {
      element = compRef.value?.$el || compRef.value;
    }
    return element;
  });
  const menuRef = useTemplateRef("menu-ref");

  // Smart placement for sub-menus
  const effectivePlacement = computed(() => {
    if (isSubMenu && parentMenu) {
      const parentPlacement = parentMenu.placement;
      if (parentPlacement.includes("right")) return "right-start";
      if (parentPlacement.includes("left")) return "left-start";
      return "right-start"; // Default for sub-menus
    }
    return props.placement;
  });

  // Mobile mode overrides positioning
  const shouldUseMobileMode = computed(() => mobileMode);

  // Use new floating UI composable
  const { floatingStyles, update } = useFloatingUI(btnRef, menuRef, {
    placement: effectivePlacement.value,
    strategy: "fixed",
    offset: computedVariant.value === "dots" ? 4 : 0,
    ...props.floatingOptions
  });

  // Debounced floating update
  const updateFloating = useDebounceFn(() => {
    // Trigger re-computation of floating styles
    if (menuRef.value && btnRef.value && update) {
      update();
    }
  }, 100);

  // Computed property to handle menu styles
  const menuStyles = computed(() => {
    if (shouldUseMobileMode.value) {
      // Mobile mode: use CSS class for centering, no inline styles
      return {};
    } else {
      // Desktop mode: use floating UI styles for adjacent positioning
      return (floatingStyles && floatingStyles.value) || {};
    }
  });


  /* Keys */
  const numItems = computed(() => menuRef.value?.querySelectorAll(".item").length || 0);

  // List keyboard navigation for the context menu items
  const {
    activeIndex,
    clearSelection: clearMenuSelection,
    activate: activateNav,
    deactivate: deactivateNav,
  } = useListKeyboardNavigation(numItems, menuRef, false, false);

  /* Closable */
  const close = () => {
    show.value = false;
    clearMenuSelection();
    // Restore focus to trigger
    if (lastFocusedElement.value && lastFocusedElement.value.focus) {
      lastFocusedElement.value.focus();
      lastFocusedElement.value = null;
    }
  };
  const { activate: activateClosable, deactivate: deactivateClosable } = useClosable({
    onClose: close,
    closeOnEsc: true,
    closeOnOutsideClick: true,
    closeOnCloseButton: false,
    autoActivate: false,
  });
  provide("closeMenu", close);

  watch(
    show,
    async (isShown) => {
      if (isShown) {
        // Store current focus for restoration later
        lastFocusedElement.value = document.activeElement;
        activateClosable();
        activateNav();

        // Wait for DOM to be fully rendered
        await nextTick();

        // Ensure refs are available before updating floating UI
        if (!shouldUseMobileMode.value && update && btnRef.value && menuRef.value) {
          // Double nextTick to ensure DOM is fully settled
          await nextTick();
          update();
        }

        // Focus first menu item
        const firstItem = menuRef.value?.querySelector('.item[tabindex="0"], .item');
        if (firstItem && firstItem.focus) {
          firstItem.focus();
        }

      } else {
        deactivateNav();
        deactivateClosable();
        // Restore focus when closing via watcher
        if (lastFocusedElement.value && lastFocusedElement.value.focus) {
          lastFocusedElement.value.focus();
          lastFocusedElement.value = null;
        }
      }
    },
    { immediate: true }
  );
  // Focus the menu item when navigated via keyboard
  watch(activeIndex, (newIndex) => {
    const menuEl = menuRef.value;
    if (!menuEl) return;
    const items = menuEl.querySelectorAll(".item");
    if (newIndex !== null && newIndex >= 0 && newIndex < items.length) {
      items[newIndex].focus();
    }
  });

  // Watch for prop changes and debounce updates
  watch(() => props.placement, updateFloating);

  // Touch interaction handling
  const touchStartTime = ref(0);
  const handleTouchStart = () => {
    touchStartTime.value = Date.now();
  };

  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime.value;
    if (touchDuration < 300) {
      // Short tap
      show.value = !show.value;
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent browser context menu
  };
</script>

<template>
  <div
    class="cm-wrapper"
    @click.stop
    @dblclick.stop
    @contextmenu="handleContextMenu"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Custom trigger slot (new preferred way) -->
    <template v-if="$slots.trigger">
      <Button
        :id="triggerId"
        ref="slot-ref"
        kind="tertiary"
        :class="triggerClasses"
        :aria-expanded="show"
        data-testid="trigger-button"
        @click.stop="show = !show"
      >
        <slot name="trigger" />
      </Button>
    </template>
    <!-- New variant-based system -->
    <template v-else-if="variant === 'dots' || (variant === null && computedVariant === 'dots')">
      <ButtonDots
        :id="triggerId"
        ref="dots-ref"
        v-model="show"
        :class="triggerClasses"
        :aria-expanded="show"
        data-testid="trigger-button"
      />
    </template>
    <template v-else-if="variant === 'close' || computedVariant === 'close'">
      <ButtonClose
        :id="triggerId"
        ref="comp-ref"
        :class="triggerClasses"
        :aria-expanded="show"
        data-testid="trigger-button"
        @click.stop="show = !show"
      />
    </template>
    <!-- Backwards compatibility for old props -->
    <template v-else>
      <component
        :is="btnComponent"
        :id="triggerId"
        ref="comp-ref"
        v-model="show"
        :icon="icon"
        :text="text"
        :class="triggerClasses"
        hover-color="var(--surface-hint)"
        :aria-expanded="show"
        data-testid="trigger-button"
        v-bind="$attrs"
      />
    </template>
    <Teleport to="body">
      <Transition
        name="cm-menu"
        enter-active-class="cm-menu-enter-active"
        leave-active-class="cm-menu-leave-active"
        enter-from-class="cm-menu-enter-from"
        leave-to-class="cm-menu-leave-to"
      >
        <div
          v-if="show"
          ref="menu-ref"
          :class="menuClasses"
          role="menu"
          aria-orientation="vertical"
          :aria-labelledby="triggerId"
          :style="menuStyles"
          data-testid="context-menu"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style>
  .cm-wrapper {
    width: fit-content;
    overflow: visible;
  }

  .cm-menu {
    /* Position will be set by floating UI or mobile mode CSS */
    overflow: hidden;
    z-index: 999;
    background-color: var(--surface-primary);
    padding-block: 8px;
    border-radius: 16px;
    min-width: fit-content;
    box-shadow: var(--shadow-strong), var(--shadow-soft);

    & > *:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  /* Mobile modal positioning */
  .cm-menu-mobile {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 90vw;
    max-width: 320px;
    max-height: 80vh;
    overflow-y: auto;
  }

  /* CSS Animations */
  .cm-menu-enter-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cm-menu-leave-active {
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cm-menu-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }

  .cm-menu-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }

  /* Mobile modal animations */
  .cm-menu-mobile.cm-menu-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }

  .cm-menu-mobile.cm-menu-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }

  /* Touch interactions */
  @media (hover: none) and (pointer: coarse) {
    .cm-wrapper {
      -webkit-tap-highlight-color: transparent;
    }

    .cm-btn {
      touch-action: manipulation;
    }
  }

  /* New variant-based classes */
  .context-menu-trigger {
    /* Base trigger styles */
    transition: all 0.2s ease;
    
    &.variant-dots {
      /* Dots variant specific styles */
    }
    
    &.variant-close {
      /* Close variant specific styles */
    }
    
    &.size-sm {
      /* Small size variant */
    }
    
    &.size-md {
      /* Medium size variant */
    }
    
    &.size-lg {
      /* Large size variant */
    }
  }

  .context-menu {
    /* Inherit all base cm-menu styles */
    overflow: hidden;
    z-index: 999;
    background-color: var(--surface-primary);
    padding-block: 8px;
    border-radius: 16px;
    min-width: fit-content;
    box-shadow: var(--shadow-strong), var(--shadow-soft);

    & > *:not(:last-child) {
      margin-bottom: 8px;
    }
    
    &.placement-bottom-start {
      /* Placement-specific adjustments */
    }
    
    &.is-open {
      /* Open state styles */
    }
    
    &.mobile-mode {
      /* Mobile mode styles */
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 90vw;
      max-width: 320px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    &.desktop-mode {
      /* Desktop mode styles */
    }
  }
</style>
