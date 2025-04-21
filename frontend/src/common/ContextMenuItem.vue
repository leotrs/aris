<script setup>
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    icon: { type: String, required: true },
    caption: { type: String, required: true },
  });
</script>

<template>
  <div class="item">
    <component :is="Icons['Icon' + props.icon]" class="cmi-icon" />
    <span class="cmi-caption">{{ caption }}</span>
  </div>
</template>

<style scoped>
  .item {
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 16px;
    padding-block: 0px;
    gap: 10px;
    transition: var(--transition-bg-color);

    &:hover {
      background-color: var(--surface-hover);
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
</style>
