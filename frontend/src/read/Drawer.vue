<script setup>
import { ref, onMounted, inject } from "vue";

const props = defineProps({});
</script>

<template>
  <div class="drawer">
    <slot />
  </div>
</template>

<style scoped>
.drawer {}
</style>
