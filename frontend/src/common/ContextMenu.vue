<script setup>
  import { ref, watch, computed, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, shift } from "@floating-ui/vue";
  import { useListKeyboardNavigation } from "@/composables/useListKeyboardNavigation.js";
  import useClosable from "@/composables/useClosable.js";

  const props = defineProps({
    icon: { type: String, default: "Dots" },
    buttonSize: { type: String, default: "btn-sm" },
    iconClass: { type: String, default: "" },
    placement: { type: String, default: "left-start" },
  });

  /* State */
  const show = ref(false);
  defineExpose({ toggle: () => (show.value = !show.value) });

  /* Floating-UI config */
  const btnRef = useTemplateRef("btn-ref");
  const menuRef = useTemplateRef("menu-ref");
  const { floatingStyles } = useFloating(btnRef, menuRef, {
    strategy: "absolute",
    placement: props.placement,
    middleware: [offset({ mainAxis: 0, crossAxis: props.icon == "Dots" ? -8 : 0 }), shift()],
    whileElementsMounted: autoUpdate,
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
  };
  const { activate: activateClosable, deactivate: deactivateClosable } = useClosable({
    onClose: close,
    closeOnEsc: true,
    closeOnOutsideClick: true,
    closeOnCloseButton: false,
    autoActivate: false,
  });

  watch(
    show,
    (isShown) => {
      if (isShown) {
        activateClosable();
        activateNav();
      } else {
        deactivateNav();
        deactivateClosable();
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
    <template v-if="icon == 'Dots'">
      <ButtonDots ref="btn-ref" v-model="show" class="cm-btn" />
    </template>
    <template v-else-if="icon">
      <ButtonToggle
        ref="btn-ref"
        v-model="show"
        :icon="icon"
        :icon-class="iconClass"
        class="cm-btn"
        hover-color="var(--surface-hint)"
        :button-size="buttonSize"
      />
    </template>

    <div v-if="show" ref="menu-ref" class="cm-menu" role="menu" :style="floatingStyles">
      <slot />
    </div>
  </div>
</template>

<style>
  .cm-wrapper {
    width: fit-content;
    overflow: visible;

    & > .cm-menu {
      position: absolute;
      top: 0;
      left: 0;
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
  }
</style>
