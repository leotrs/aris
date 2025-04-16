<script setup>
  import { ref, onMounted, inject } from "vue";

  const props = defineProps({
    side: { type: String, required: true },
    scroll: { type: Boolean, required: true },
  });
</script>

<template>
  <div class="drawer"></div>
</template>

<style scoped>
  .drawer {
  }
</style>
