<script setup>
 import * as Icons from '@tabler/icons-vue';

 const props = defineProps({
     kind: String,
     icon: String,
     text: String,
 });
</script>


<template>
  <button class="text-h6" :class="kind">
    <template v-if="icon">
      <component :is="Icons['Icon' + props.icon]" class="btn-icon" />
    </template>
    <span class="btn-text" v-if="text">{{ text }}</span>
    <slot v-if="!icon && !text"></slot>
  </button>
</template>


<style scoped>
 button {
     display: flex;
     align-items: center;
     border: unset;
     border-radius: 16px;
     transition: background 0.15s ease-in-out;
     gap: 2px;

     padding-block: 6px;
     &:has(.btn-icon):has(.btn-text) {
         padding-left: 2px;
         padding-right: 8px;
     };
     &:has(.btn-icon):not(:has(.btn-text)) {
         padding: 8px;
     };

     &:hover { cursor: pointer; }
 }

 button.btn-sm {
     border-radius: 8px;
     padding-block: 0px;

     &:has(.btn-icon):has(.btn-text) {
         padding-left: 2px;
         padding-right: 8px;
     };
     &:has(.btn-icon):not(:has(.btn-text)) {
         padding: 0px;
     };
     &:not(:has(.btn-icon)):has(.btn-text) {
         padding-left: 2px;
         padding-right: 8px;
     };
 }

 button.btn-md {
     border-radius: 16px;
     padding-inline: 16px;
     padding-block: 6px;

     &:has(.btn-icon):has(.btn-text) {
         padding-left: 2px;
         padding-right: 8px;
     };
     &:has(.btn-icon):not(:has(.btn-text)) {
         padding: 8px;
     };
 }

 button.btn-lg {
     padding-inline: 24px;
     padding-block: 24px;
     border-radius: 24px;
 }

 button.primary {
     background-color: var(--surface-action);
     color: var(--primary-50);
     &:hover { background-color: var(--surface-action-hover); }
     & .btn-icon { color: var(--primary-50); }
 }

 /* a lot of these styles only work when the button has an icon... */
 button.secondary {
     background-color: var(--surface-primary);
     color: var(--primary-600);
     border: var(--border-thin) solid var(--border-information);

     &:hover {
         color: var(--text-action-hover);
         background-color: var(--surface-information);
         border-color: var(--border-action-hover);
     }

     & .btn-icon {
         color: var(--icon-action);
     }

     &:has(span.btn-text) {
         padding-right: 16px;
     }

     &:has(.btn-icon):not(:has(.btn-text)) {
         padding: 6px;
     };
 }

 button.tertiary {
     background-color: transparent;
     color: var(--extra-dark);
     padding-inline: 8px;

     &:hover {
         background-color: var(--surface-hint);
         color: var(--almost-black);
         & > svg { color: var(--almost-black) };
     }

     &:has(.btn-icon):not(:has(.btn-text)) {
         padding-inline: 8px;
     };
 }
</style>
