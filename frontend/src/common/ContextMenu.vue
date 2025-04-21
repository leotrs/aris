<script setup>
  import { ref, watch } from "vue";
  import { IconDotsVertical } from "@tabler/icons-vue";
  import useClosable from "@/composables/useClosable.js";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({ icon: { type: String, default: "Dots" } });
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
  <div class="cm-wrapper" :class="{ dots: icon == 'Dots' }" @click.stop @dblclick.stop>
    <div
      class="cm-click-target"
      :class="{ dots: icon == 'Dots' }"
      @click.stop="show = !show"
      @dblclick.stop
    >
      <template v-if="icon == 'Dots'">
        <IconDotsVertical class="cm-btn" width="4" height="18" viewBox="10 3 4 18.25" />
      </template>
      <template v-else>
        <component :is="Icons['Icon' + props.icon]" class="cm-btn" />
      </template>
    </div>

    <div v-if="show" class="cm-menu">
      <slot />
    </div>
  </div>
</template>

<style>
  .cm-wrapper {
    position: relative;

    & > .cm-click-target {
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.dots {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--extra-dark);
        stroke-width: 2px;
        width: 16px;
        height: 32px;

        & > svg {
          width: 4px;
          height: 18px;
          margin: 0;
        }
      }

      &:hover {
        background-color: var(--surface-hint);

        & .tabler-icon.cm-btn {
          color: var(--extra-dark);
        }
      }
    }

    & > .cm-menu {
      position: absolute;
      right: 0;
      top: 0;
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
