<script setup>
  import { inject } from "vue";

  const user = inject("user");
</script>

<template>
  <div class="view" :class="{ mobile: mobileMode }">
    {{ user }}
  </div>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;
    display: flex;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
  }
</style>
