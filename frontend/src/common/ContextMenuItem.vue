<script setup>
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    icon: { type: String, required: true },
    caption: { type: String, required: true },
  });
</script>

<template>
  <button type="button" class="item" role="menuitem" tabindex="-1">
    <component :is="Icons['Icon' + props.icon]" class="cmi-icon" />
    <span class="cmi-caption">{{ caption }}</span>
  </button>
</template>

<style scoped>
  .item {
    /* reset button default styles */
    background: transparent;
    border: none;
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 16px;
    padding-block: 0px;
    gap: 4px;
    transition: var(--transition-bg-color);

    &:hover {
      background-color: var(--surface-hover);
    }
    &:focus-visible {
      background-color: var(--surface-hover);
      outline: none;
    }
  }

  .item > .tabler-icon {
    stroke-width: 1.75px;
  }

  .item.danger {
    color: var(--text-error);

    &:hover {
      background-color: var(--surface-error);
    }

    & .tabler-icon {
      color: var(--icon-error);
    }
  }
  .item.focused {
    background-color: var(--surface-hover);
  }
</style>
