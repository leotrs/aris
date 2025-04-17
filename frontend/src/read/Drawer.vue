<script setup>
  import { ref, onMounted, inject } from "vue";

  const props = defineProps({
    doc: { type: String, required: true },
  });
</script>

<template>
  <div class="drawer">
    <slot />
  </div>
</template>

<style scoped>
  .drawer {
  }
</style>
