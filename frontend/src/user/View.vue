<script setup>
  import { inject } from "vue";

  const user = inject("user");
  const mobileMode = inject("mobileMode");
</script>

<template>
  <HomeLayout>
    <Pane>
      {{ user }}
    </Pane>
  </HomeLayout>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;
    display: flex;
    width: 100%;
    height: 100%;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
  }
</style>
