<script setup>
  /**
   * BaseSidebarItem - A reusable sidebar navigation item component.
   *
   * This component represents an individual navigation item within any sidebar.
   * It displays an icon and text, and can visually indicate its active, collapsed,
   * or non-clickable states. It also provides a tooltip for additional information
   * on hover, especially useful when the sidebar is collapsed.
   *
   * @displayName BaseSidebarItem
   * @example
   * // Basic usage
   * <BaseSidebarItem icon="Home" text="Dashboard" />
   *
   * @example
   * // Active item
   * <BaseSidebarItem icon="User" text="Profile" :active="true" />
   *
   * @example
   * // Collapsed item (requires `collapsed` to be provided by parent)
   * <BaseSidebarItem icon="Settings" text="Settings" :collapsed="true" />
   *
   * @example
   * // Non-clickable item
   * <BaseSidebarItem icon="Info" text="About" :clickable="false" />
   *
   * @example
   * // Item with different icon when collapsed
   * <BaseSidebarItem icon="LayoutSidebarLeftCollapse" icon-collapsed="LayoutSidebarLeftExpand" text="Collapse" />
   */
  import { inject, useTemplateRef } from "vue";

  const props = defineProps({
    icon: { type: String, default: "" },
    iconCollapsed: { type: String, default: "" },
    text: { type: String, required: true },
    tooltip: { type: String, default: "" },
    tooltipAlways: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    clickable: { type: Boolean, default: true },
    isSubItem: { type: Boolean, default: false },
  });
  const collapsed = inject("collapsed");
  const selfRef = useTemplateRef("self-ref");
</script>

<template>
  <div
    ref="self-ref"
    class="sb-item"
    :data-testid="`sidebar-item-${text.toLowerCase().replace(/\s+/g, '-')}`"
    :class="{ collapsed: collapsed, active: active, 'not-clickable': !clickable, 'sub-item': isSubItem }"
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

  /* Sub-item styling */
  .sb-item.sub-item {
    background-color: var(--gray-200) !important;
    padding-inline: 0 !important;
    margin-inline: 12px;
  }


  .sb-item.sub-item:not(.collapsed) {
    padding-left: calc(var(--padding-inline) - var(--border-left-width) + 8px); /* Add 8px indentation only when expanded */
  }

  .sb-item.sub-item {
    /* All sub-items get background tint when their parent section is active */
    background-color: var(--gray-50); /* Very light gray background for ALL sub-items (inactive) */
    margin-block: 0; /* Remove vertical spacing for tighter grouping */
  }

  .sb-item.sub-item.collapsed {
    /* No indentation when collapsed - icons need to be centered */
    background-color: var(--gray-50); /* Same very light gray background in collapsed mode */
  }

  .sb-item.sub-item .sb-text {
    font-weight: 300;
    color: var(--gray-600); /* Slightly darker than before for better contrast on gray background */
    transition: color 0.3s ease;
  }

  .sb-item.sub-item .sb-icon {
    stroke-width: 1.5px;
    color: var(--gray-600); /* Slightly darker than before for better contrast on gray background */
    transition: color 0.3s ease, stroke-width 0.3s ease;
  }

  .sb-item.sub-item:hover .sb-text {
    color: var(--gray-800); /* Darker on hover */
  }

  .sb-item.sub-item:hover .sb-icon {
    color: var(--gray-800);
    stroke-width: 1.75px;
  }

  .sb-item.sub-item:hover {
    background-color: var(--gray-200); /* Darker background on hover */
  }

  /* Active sub-item styling - different from main item active styling */
  .sb-item.sub-item.active {
    background-color: var(--gray-300); /* Darker gray background for active sub-item */
    border-left-color: var(--gray-500); /* Gray left border instead of primary blue */
  }

  .sb-item.sub-item.active .sb-text {
    color: var(--gray-900); /* Dark gray text instead of primary blue */
    font-weight: 400; /* Slightly bolder than other sub-items */
  }

  .sb-item.sub-item.active .sb-icon {
    color: var(--gray-900); /* Dark gray icon instead of primary blue */
    stroke-width: 2px; /* Bold stroke for active state */
  }
</style>
