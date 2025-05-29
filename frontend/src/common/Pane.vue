<script setup>
  import {} from "vue";
</script>

<template>
  <div class="pane">
    <slot />
  </div>
</template>

<style scoped>
  .pane {
    background-color: var(--surface-primary);
    padding: 16px 16px 0 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
  }
</style>
