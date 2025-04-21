<script setup>
  import { ref, watch } from "vue";
  import useClosable from "@/composables/useClosable.js";

  const props = defineProps({
    icon: { type: String, default: "Dots" },
    buttonSize: { type: String, default: "btn-sm" },
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
</script>

<template>
  <div class="cm-wrapper" @click.stop @dblclick.stop>
    <template v-if="icon == 'Dots'"><ButtonDots v-model="show" class="cm-btn" /></template>
    <template v-else-if="icon">
      <ButtonToggle
        v-model="show"
        :icon="icon"
        class="cm-btn"
        hover-color="var(--surface-hint)"
        :button-size="buttonSize"
      />
    </template>

    <div v-if="show" class="cm-menu"><slot /></div>
  </div>
</template>

<style>
  .cm-wrapper {
    position: relative;
    width: fit-content;

    & > .cm-menu {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateX(-100%);
      z-index: 999;
      background-color: var(--surface-primary);
      padding-block: 8px;
      border-radius: 16px;
      box-shadow: var(--shadow-strong), var(--shadow-soft);

      & > *:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
</style>
