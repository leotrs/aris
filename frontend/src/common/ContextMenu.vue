<script setup>
  import { ref, computed, watch, provide, useTemplateRef, useSlots } from "vue";
  import { useFloating, autoUpdate, flip, offset, shift } from "@floating-ui/vue";
  import { useListKeyboardNavigation } from "@/composables/useListKeyboardNavigation.js";
  import useClosable from "@/composables/useClosable.js";

  const props = defineProps({
    icon: { type: String, default: "Dots" },
    text: { type: String, default: "" },
    btnComponent: { type: String, default: "ButtonToggle" },
    iconClass: { type: String, default: "" },
    placement: { type: String, default: "left-start" },
  });
  defineOptions({ inheritAttrs: false });

  /* State */
  const show = ref(false);
  defineExpose({ toggle: () => (show.value = !show.value) });

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
  const { floatingStyles } = useFloating(btnRef, menuRef, {
    strategy: "fixed",
    placement: () => props.placement,
    middleware: [
      offset({ mainAxis: 0, crossAxis: props.icon == "Dots" ? -8 : 0 }),
      shift(),
      flip(),
    ],
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
  provide("closeMenu", close);

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
    <template v-if="$slots.trigger">
      <Button ref="slot-ref" kind="tertiary" @click.stop="show = !show">
        <slot name="trigger" />
      </Button>
    </template>
    <template v-else-if="icon == 'Dots'">
      <ButtonDots ref="dots-ref" v-model="show" class="cm-btn" />
    </template>
    <template v-else>
      <component
        :is="btnComponent"
        ref="comp-ref"
        v-model="show"
        :icon="icon"
        :text="text"
        class="cm-btn"
        hover-color="var(--surface-hint)"
        v-bind="$attrs"
      />
    </template>
    <Teleport to="body">
      <div v-if="show" ref="menu-ref" class="cm-menu" role="menu" :style="floatingStyles">
        <slot />
      </div>
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
</style>
