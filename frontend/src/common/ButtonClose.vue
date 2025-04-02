<script setup>
 import { defineEmits } from 'vue';
 import { IconX } from '@tabler/icons-vue';
 defineEmits(["close"])
</script>


<template>
  <button
      class="tertiary btn-close"
      ref="buttonClose"
      @click="$emit('close')" >
    <IconX class="btn-icon" />
  </button>
</template>


<style scoped>
 button.btn-close {
     width: 32px;
     height: 32px;
     display: flex;
     align-items: center;
     border: unset;
     transition: background 0.15s ease-in-out;
     color: var(--extra-dark);
     background-color: transparent;
     border-radius: 8px;
     padding: 0;

     &:hover {
         cursor: pointer;
         background-color: var(--surface-hint);
         color: var(--almost-black);
         & > svg { color: var(--almost-black) };
     }

     & .btn-icon {
         stroke-width: 1px;
     }
 }
</style>
