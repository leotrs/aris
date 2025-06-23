<script setup>
  import { inject, useTemplateRef } from "vue";

  const props = defineProps({
    icon: { type: String, default: "" },
    iconCollapsed: { type: String, default: "" },
    text: { type: String, required: true },
    tooltip: { type: String, default: "" },
    tooltipAlways: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    clickable: { type: Boolean, default: true },
  });
  const collapsed = inject("collapsed");
  const selfRef = useTemplateRef("self-ref");
</script>

<template>
  <div
    ref="self-ref"
    class="sb-item"
    :data-testid="`sidebar-item-${text.toLowerCase().replace(/\s+/g, '-')}`"
    :class="{ collapsed: collapsed, active: active, 'not-clickable': !clickable }"
  >
    <template v-if="!collapsed">
      <Icon v-if="icon" :name="icon" class="sb-icon" />
    </template>
    <template v-else-if="iconCollapsed">
      <Icon :name="iconCollapsed" class="sb-icon" />
    </template>
    <template v-else>
      <Icon v-if="icon" :name="icon" class="sb-icon" />
    </template>
    <span class="text-h6 sb-text">{{ text }}</span>

    <!--for seamless transition to the panes-->
    <span class="join"></span>

    <Tooltip
      v-if="tooltipAlways || (collapsed && (tooltip || text))"
      :content="tooltip || text"
      :anchor="selfRef"
      placement="right"
    />
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

    &:hover:not(:is(.not-clickable, .active)) {
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
      stroke-width: 2px;
      color: var(--primary-600);
    }

    & > .sb-text {
      font-weight: var(--weight-medium);
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
    font-weight: var(--weight-regular);
    text-wrap: nowrap;
  }

  .sb-icon {
    flex-shrink: 0;
    stroke-width: 1.75px;
  }
</style>
