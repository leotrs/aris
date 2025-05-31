<script setup>
  import { inject } from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    icon: { type: String, default: "" },
    iconCollapsed: { type: String, default: "" },
    text: { type: String, required: true },
    active: { type: Boolean, default: false },
  });
  const collapsed = inject("collapsed");
</script>

<template>
  <div class="sb-item" :class="{ collapsed: collapsed, active: active }">
    <template v-if="!collapsed">
      <component :is="Icons['Icon' + icon]" v-if="icon" class="sb-icon" />
    </template>
    <template v-else-if="iconCollapsed">
      <component :is="Icons['Icon' + iconCollapsed]" class="sb-icon" />
    </template>
    <template v-else>
      <component :is="Icons['Icon' + icon]" v-if="icon" class="sb-icon" />
    </template>
    <span class="text-h6 sb-text">{{ text }}</span>

    <!--for seamless transition to the panes-->
    <span class="join"></span>
  </div>
</template>

<style scoped>
  .sb-item {
    --padding-inline: 16px;
    --border-left-width: var(--border-med);

    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-block: 8px;
    border-left: var(--border-left-width) solid transparent;
    padding-left: calc(var(--padding-inline) - var(--border-left-width));
    padding-right: var(--padding-inline);
    transition: var(--transition-bg-color);

    &:hover {
      background-color: var(--gray-200);
      border-left-color: var(--light);
      cursor: pointer;
    }

    &.collapsed {
    }
  }

  .sb-item.active {
    background-color: var(--surface-primary);
    border-left-color: var(--border-action);
    box-shadow: var(--shadow-soft);

    & > svg {
      color: var(--primary-600);
    }

    & > .sb-text {
      color: var(--primary-600);
    }

    & > .join {
      position: absolute;
      width: 8px;
      height: 100%;
      background-color: var(--surface-primary);
      right: 0px;
      z-index: 1;
    }
  }

  .sb-text {
    text-wrap: nowrap;
  }

  .sb-icon {
    flex-shrink: 0;
  }
</style>
