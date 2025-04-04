<script setup>
 import { ref } from 'vue';

 const props = defineProps({
     name: { type: String, required: true },
     active: { type: Boolean, required: true }
 });
</script>


<template>
  <span class="pill" :class=" active ? 'on' : 'off'">
    {{ name }}
  </span>
</template>


<style scoped>
 .pill {
     border-radius: 16px;
     padding-inline: 8px;
     padding-block: 4px;
     text-wrap: nowrap;
 }

 .pill.on {
     background-color: var(--secondary-800);
     color: var(--extra-light);
 }

 .pill.off {
     border: var(--border-thin) solid var(--secondary-100);
     color: var(--extra-dark);
 }
</style>
