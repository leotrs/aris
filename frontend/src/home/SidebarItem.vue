<script setup>
 import { computed } from 'vue';
 import { IconHome, IconUserCircle, IconLifebuoy, IconBrandGit, IconPencil, IconBook, IconFileCheck, IconFiles, IconLayoutSidebarLeftCollapse, IconCirclePlus } from '@tabler/icons-vue';

 const props = defineProps({
     text: String,
     collapsed: Boolean,
     active: { type: Boolean, default: false }
 });

 const icons = {
     Home: IconHome,
     Write: IconPencil,
     Read: IconBook,
     Review: IconFileCheck,
     'All Files': IconFiles,
     Account: IconUserCircle,
     Help: IconLifebuoy,
     Contribute: IconBrandGit,
     Collapse: IconLayoutSidebarLeftCollapse,
     New: IconCirclePlus
 };

 const selectedIcon = computed(() => icons[props.text] || null);

</script>


<template>
  <div class="sb-item" :class="{ collapsed: collapsed, active: active }">

    <!--:key forces Vue to re-render when collapsing so we can animate it-->
    <component
        v-if="selectedIcon"
        :is="selectedIcon"
        class="sb-icon" />

    <span v-if="!collapsed" class="text-h6 sb-text">{{ text }}</span>

  </div>
</template>


<style scoped>
 .sb-item {
     height: 32px;
     display: flex;
     align-items: center;
     gap: 8px;
     padding-inline: 12px;
     border-left: var(--border-med) solid transparent;
     transition: background 0.15s ease-in-out;

     &:hover {
         background-color: var(--gray-200);
         border-left-color: var(--light);
         cursor: pointer;
     }

     &.active {
         background-color: var(--surface-primary);
         border-left-color: var(--border-action);
         & > svg { color: var(--primary-600); }
         & > .sb-text { color: var(--primary-600); }
     }

     & .sb-text { text-wrap: nowrap };

     &.collapsed { justify-content: center };
 }

 /* @keyframes fade {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
    } */

 /* .collapsed .sb-icon,
    :not(.collapsed) .sb-icon {
    animation: fade 0.5s ease-in-out;
    } */

 /* .v-enter-active, .v-leave-active { transition: opacity 0.5s ease , max-width 0.4s ease, margin 0.4s ease; } */
 /* .v-enter-from, .v-leave-to { opacity: 0; max-width: 0; margin-left: -4px; } */
 /* .v-enter-to, .v-leave-from { opacity: 1; max-width: 100px; margin-left: 0; } */
</style>
