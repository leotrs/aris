<script setup>
 import { ref, watch, defineEmits } from 'vue';
 import * as Icons from '@tabler/icons-vue';

 const props = defineProps({
     icon: String,
     text: String
 });
 const active = defineModel();
 const emit = defineEmits(['on', 'off']);

 watch(active, (newValue, oldValue) => {
     if (newValue) emit('on');
     if (!newValue) emit('off');
 });
</script>


<template>
  <button
      class="text-h6 btn-toggle"
      :class="{ active: active }"
      @click="active = !active" >
    <template v-if="icon">
      <component :is="Icons['Icon' + props.icon]" class="btn-icon" />
    </template>
    <span class="btn-text" v-if="text">{{ text }}</span>
    <slot />
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

     &:hover {
         cursor: pointer;
         background-color: var(--gray-50);
         color: var(--text-action-hover);
     }

     &.active {
         background-color: var(--surface-hint);
         color: var(--almost-black);
     }
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
</style>
