<script setup>
  import { computed } from "vue";
  import {
    IconHome,
    IconPencil,
    IconBook,
    IconFileCheck,
    IconFiles,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconQuote,
    IconMessage,
    IconCirclePlus,
  } from "@tabler/icons-vue";

  const props = defineProps({
    text: { type: String, required: true },
    collapsed: { type: Boolean, required: true },
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
    Collapse: {
      false: IconLayoutSidebarLeftCollapse,
      true: IconLayoutSidebarLeftExpand,
    },
  };

  const selectedIcon = computed(() => {
    const ic = icons[props.text];
    return typeof ic === "object" ? ic[props.collapsed] : ic;
  });
</script>

<template>
  <div class="sb-item" :class="{ collapsed: collapsed, active: active }">
    <component :is="selectedIcon" v-if="selectedIcon" class="sb-icon" />
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
    background-color: var(--white);
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
      background-color: white;
      right: 0px;
      z-index: 9999;
    }
  }

  .sb-text {
    text-wrap: nowrap;
  }

  .sb-icon {
    flex-shrink: 0;
  }
</style>
