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
  .dots {
    position: relative;
    display: flex;
    color: var(--extra-dark);
    stroke-width: 2px;
    border-radius: 8px;
    padding-inline: 6px;
    padding-block: 7px;

    & > svg {
      width: 4px;
      height: 18px;
      margin: 0;
    }

    &:hover {
      background-color: var(--surface-hint);
    }
  }

  .menu {
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-16px) translateY(-8px);
    background-color: var(--surface-primary);
    padding-block: 8px;
    border-radius: 16px;
    box-shadow: var(--shadow-strong), var(--shadow-soft);

    & > *:not(:last-child) {
      margin-bottom: 8px;
    }
    & .item {
      display: flex;
      align-items: center;
      padding-left: 10px;
      padding-right: 16px;
      padding-block: 0px;
      gap: 10px;

      &:hover {
        background-color: var(--surface-hover);
        font-weight: var(--weight-medium);
      }
      &:hover .tabler-icon {
        stroke-width: 2px;
      }
    }

    & .item .tabler-icon {
      display: inline-block;
      stroke-width: 1.2px;
    }
  }

  .menu .item.danger {
    color: var(--text-error);

    &:hover {
      background-color: var(--surface-error);
    }
    & .tabler-icon {
      color: var(--icon-error);
    }
  }
</style>
