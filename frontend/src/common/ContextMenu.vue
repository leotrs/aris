<script setup>
  import { ref, watch, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, shift } from "@floating-ui/vue";
  import useClosable from "@/composables/useClosable.js";

  const props = defineProps({
    icon: { type: String, default: "Dots" },
    buttonSize: { type: String, default: "btn-sm" },
    placement: { type: String, default: "left-start" },
  });
  const show = ref(false);

  const { activate, deactivate } = useClosable({
    onClose: () => (show.value = false),
    closeOnEsc: true,
    closeOnOutsideClick: true,
    closeOnCloseButton: false,
    autoActivate: false,
  });
  watch(show, (isShown) => (isShown ? activate() : deactivate()));

  defineExpose({ toggle: () => (show.value = !show.value) });

  const btnRef = useTemplateRef("btn-ref");
  const menuRef = useTemplateRef("menu-ref");
  const { floatingStyles } = useFloating(btnRef, menuRef, {
    strategy: "absolute",
    placement: props.placement,
    middleware: [offset({ mainAxis: 0, crossAxis: props.icon == "Dots" ? -8 : 0 }), shift()],
    whileElementsMounted: autoUpdate,
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
        class="cm-btn"
        hover-color="var(--surface-hint)"
        :button-size="buttonSize"
      />
    </template>

    <div v-if="show" ref="menu-ref" class="cm-menu" :style="floatingStyles"><slot /></div>
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
