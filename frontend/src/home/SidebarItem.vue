<script setup>
  import { computed } from "vue";
  import {
    IconHome,
    IconPencil,
    IconBook,
    IconFileCheck,
    IconFiles,
    IconLayoutSidebarLeftCollapse,
    IconQuote,
    IconMessage,
    IconCirclePlus,
  } from "@tabler/icons-vue";

  const props = defineProps({
    text: String,
    collapsed: Boolean,
    active: { type: Boolean, default: false },
  });

  const icons = {
    New: IconCirclePlus,
    Home: IconHome,
    "All Files": IconFiles,
    Read: IconBook,
    Write: IconPencil,
    Review: IconFileCheck,
    Feedback: IconMessage,
    References: IconQuote,
    Collapse: IconLayoutSidebarLeftCollapse,
  };

  const selectedIcon = computed(() => icons[props.text] || null);
</script>

<template>
  <div class="sb-item" :class="{ collapsed: collapsed, active: active }">
    <!--:key forces Vue to re-render when collapsing so we can animate it-->
    <component v-if="selectedIcon" :is="selectedIcon" class="sb-icon" />

    <span v-if="!collapsed" class="text-h6 sb-text">{{ text }}</span>
  </div>
</template>

<style scoped>
  .sb-item {
    --padding-inline: 16px;
    --border-left-width: var(--border-med);

    height: 32px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-block: 8px;
    border-left: var(--border-left-width) solid transparent;
    padding-left: calc(var(--padding-inline) - var(--border-left-width));
    padding-right: var(--padding-inline);

    transition: background 0.15s ease-in-out;

    &:hover {
      background-color: var(--gray-200);
      border-left-color: var(--light);
      cursor: pointer;
    }

    &.active {
      background-color: var(--surface-primary);
      border-left-color: var(--border-action);

      & > svg {
        color: var(--primary-600);
      }

      & > .sb-text {
        color: var(--primary-600);
      }
    }

    & .sb-text {
      text-wrap: nowrap;
    }

    &.collapsed {
      justify-content: center;
    }
  }
</style>
