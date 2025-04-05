<script setup>
 import { ref } from 'vue';

 const props = defineProps({
     tag: { type: Object, required: true },
     active: { type: Boolean, required: true }
 });
</script>


<template>
  <span
      class="pill"
      :class="[active ? 'on' : 'off', tag.color]">
    {{ tag.name }}
  </span>
</template>


<style scoped>
 .pill {
     border-radius: 16px;
     padding-inline: 8px;
     padding-block: 4px;
     text-wrap: nowrap;

     &.red { background-color: var(--red-500) }
     &.purple { background-color: var(--purple-500) }
     &.green { background-color: var(--green-500) }
     &.orange { background-color: var(--orange-500) }
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
