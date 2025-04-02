<script setup>
 import { ref } from 'vue';

 const props = defineProps({
     name: { type: String, required: true }
 })

</script>


<template>
  <span class="pill">{{ name }}</span>
</template>


<style scoped>
 .pill {
     border-radius: 8px;
     background-color: var(--secondary-100);
     padding-inline: 8px;
     padding-block: 4px;
 }
</style>
