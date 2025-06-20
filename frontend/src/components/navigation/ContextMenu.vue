<script setup>
  /**
   * ContextMenu - Flexible dropdown menu component with multiple trigger variants
   *
   * Provides context-sensitive dropdown menus with support for dots, close, custom button,
   * and slot-based triggers. Features responsive mobile/desktop positioning, keyboard navigation,
   * focus management, and nested sub-menu support. Uses Floating UI for precise positioning.
   *
   * @displayName ContextMenu
   * @example
   * // Basic dots menu
   * <ContextMenu variant="dots" placement="bottom-start">
   *   <ContextMenuItem>Edit</ContextMenuItem>
   *   <ContextMenuItem>Delete</ContextMenuItem>
   * </ContextMenu>
   *
   * @example
   * // Custom button trigger
   * <ContextMenu variant="custom" component="Button" text="Actions" icon="Plus">
   *   <ContextMenuItem>New Item</ContextMenuItem>
   *   <ContextMenuItem>Import</ContextMenuItem>
   * </ContextMenu>
   *
   * @example
   * // Close button variant
   * <ContextMenu variant="close" placement="left-start">
   *   <ContextMenuItem>Save</ContextMenuItem>
   *   <ContextMenuItem>Cancel</ContextMenuItem>
   * </ContextMenu>
   *
   * @example
   * // Custom trigger via slot
   * <ContextMenu variant="slot">
   *   <template #trigger="{ toggle, isOpen }">
   *     <button @click="toggle" :class="{ active: isOpen }">
   *       Custom Trigger
   *     </button>
   *   </template>
   *   <ContextMenuItem>Option 1</ContextMenuItem>
   * </ContextMenu>
   *
   * @example
   * // Nested sub-menu
   * <ContextMenu variant="dots">
   *   <ContextMenuItem>Edit</ContextMenuItem>
   *   <ContextMenu variant="custom" text="More Actions" placement="right-start">
   *     <ContextMenuItem>Advanced Edit</ContextMenuItem>
   *     <ContextMenuItem>Export</ContextMenuItem>
   *   </ContextMenu>
   * </ContextMenu>
   */

  import { ref, computed, watch, provide, inject, useTemplateRef, useSlots } from "vue";
  import { useListKeyboardNavigation } from "@/composables/useListKeyboardNavigation.js";
  import useClosable from "@/composables/useClosable.js";
  import { useDesktopMenu } from "@/composables/useDesktopMenu.js";
  import { useMobileMenu } from "@/composables/useMobileMenu.js";
  import ContextMenuTrigger from "./ContextMenuTrigger.vue";

  const props = defineProps({
    /**
     * Menu trigger variant type
     * @values 'dots', 'close', 'custom', 'slot'
     */
    variant: {
      type: String,
      default: "dots",
      validator: (value) => ["dots", "close", "custom", "slot"].includes(value),
    },

    /**
     * Floating UI placement string for menu positioning relative to trigger
     * @see https://floating-ui.com/docs/tutorial#placements
     * @values 'top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'
     */
    placement: {
      type: String,
      default: "left-start",
    },

    /**
     * Additional Floating UI configuration options
     * @see https://floating-ui.com/docs/tutorial
     */
    floatingOptions: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Size of the menu trigger (affects custom and dots variants)
     * @values 'sm', 'md', 'lg'
     */
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
  });
  defineOptions({ inheritAttrs: false });
  const mobileMode = inject("mobileMode", false);
  const currentVariant = computed(() => props.variant);

  // Sub-menu setup
  // This menu provides context for its children:
  provide("isSubMenu", true);
  provide("parentMenu", { placement: props.placement });
  // This menu receives context from its parent:
  const isSubMenu = inject("isSubMenu", false);
  const parentMenu = inject("parentMenu", null);

  // State
  const show = ref(false);
  const lastFocusedElement = ref(null);

  // Floating styles
  const triggerRef = useTemplateRef("trigger-ref");
  const btnRef = computed(() => {
    return triggerRef.value?.triggerRef;
  });
  const menuRef = useTemplateRef("menu-ref");

  // Initialize positioning systems
  const positioningOptions = computed(() => ({
    placement: props.placement,
    strategy: "fixed",
    variant: currentVariant.value,
    offset: currentVariant.value === "dots" ? 4 : 0,
    isSubMenu,
    parentPlacement: parentMenu?.placement,
    ...props.floatingOptions,
  }));

  const desktopMenu = useDesktopMenu(btnRef, menuRef, positioningOptions.value);
  const mobileMenu = useMobileMenu(mobileMode, {
    placement: computed(() => props.placement),
    isOpen: show,
  });

  // Consolidated computed properties
  const triggerClasses = computed(() => [
    "context-menu-trigger",
    `variant-${currentVariant.value}`,
    `size-${props.size}`,
  ]);

  const menuClasses = computed(() => {
    return mobileMode.value
      ? mobileMenu.menuClasses.value
      : ["context-menu", `placement-${props.placement}`, "desktop-mode", { "is-open": show.value }];
  });

  // Consolidated positioning interface
  const menuStyles = computed(() =>
    mobileMode.value ? mobileMenu.menuStyles.value : desktopMenu.menuStyles.value
  );
  const updatePosition = () => !mobileMode.value && desktopMenu.updatePosition();

  /**
   * Exposes methods and computed properties for parent components
   * @expose {Function} toggle - Toggle menu open/closed state
   * @expose {ComputedRef<string>} effectivePlacement - The actual placement used by Floating UI
   */
  defineExpose({
    toggle: () => (show.value = !show.value),
    effectivePlacement: computed(() => desktopMenu.effectivePlacement?.value || props.placement),
  });
  watch(() => props.placement, updatePosition);

  // Keys
  const numItems = computed(() => menuRef.value?.querySelectorAll(".item").length || 0);
  const {
    activeIndex,
    clearSelection: clearMenuSelection,
    activate: activateNav,
    deactivate: deactivateNav,
  } = useListKeyboardNavigation(numItems, menuRef, false, false);

  // Closable
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

  // Menu lifecycle management
  watch(
    show,
    async (isShown) => {
      if (isShown) {
        // Opening sequence
        lastFocusedElement.value = document.activeElement;
        activateClosable();
        activateNav();

        // Activate positioning system
        const positioningSystem = mobileMode.value ? mobileMenu : desktopMenu;
        await positioningSystem.activate();

        // Focus management
        const firstItem = menuRef.value?.querySelector('.item[tabindex="0"], .item');
        firstItem?.focus?.();
      } else {
        // Closing sequence
        deactivateNav();
        deactivateClosable();

        // Deactivate positioning system
        const positioningSystem = mobileMode.value ? mobileMenu : desktopMenu;
        await positioningSystem.deactivate();

        // Restore focus
        if (lastFocusedElement.value?.focus) {
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
</script>

<template>
  <div class="cm-wrapper" @click.stop @dblclick.stop>
    <ContextMenuTrigger
      ref="trigger-ref"
      :variant="currentVariant"
      :size="size"
      :is-open="show"
      :class="triggerClasses"
      v-bind="$attrs"
      @toggle="show = !show"
    >
      <!-- 
        @slot trigger - Custom trigger element (only used when variant="slot")
        @binding {Function} toggle - Function to toggle menu open/closed
        @binding {boolean} isOpen - Whether the menu is currently open
        @example
        <template #trigger="{ toggle, isOpen }">
          <button @click="toggle" :class="{ active: isOpen }">
            Custom Trigger
          </button>
        </template>
      -->
      <slot v-if="$slots.trigger" name="trigger" />
    </ContextMenuTrigger>
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
          :aria-labelledby="triggerRef?.triggerId"
          :style="menuStyles"
          data-testid="context-menu"
        >
          <!-- 
            @slot default - Menu content (typically ContextMenuItem components)
            @binding {Function} close - Function to close the menu programmatically
            @example
            <ContextMenuItem @click="handleEdit">Edit</ContextMenuItem>
            <ContextMenuItem @click="handleDelete">Delete</ContextMenuItem>
            <ContextMenu variant="custom" text="More">
              <ContextMenuItem>Nested Option</ContextMenuItem>
            </ContextMenu>
          -->
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
    position: fixed;
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

  .context-menu-trigger {
    transition: all 0.3s ease;
  }

  .context-menu {
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

    &.mobile-mode {
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
    }
  }
</style>
