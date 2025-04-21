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
      box-shadow:
        0px 1px 2px rgba(0, 0, 0, 30%),
        0px 2px 6px rgba(0, 0, 0, 15%);

      & > *:not(:last-child) {
        margin-bottom: 8px;
      }

      & > .item {
        display: flex;
        align-items: center;
        padding-left: 10px;
        padding-right: 16px;
        padding-block: 0px;
        gap: 10px;

        &:hover {
          background-color: var(--surface-hover);
        }

        &.danger {
          color: var(--text-error);

          &:hover {
            background-color: var(--surface-error);
          }

          & .tabler-icon {
            color: var(--icon-error);
          }
        }
      }

      & > .item > .tabler-icon {
        display: inline-block;
        stroke-width: 1.75px;
      }
    }
  }
</style>
