<script setup>
  import {} from "vue";
</script>

<template>
  <div class="pane-header">
    <slot />
  </div>
</template>

<style>
  .pane-header {
    display: flex;
    justify-content: space-between;
    border: var(--border-extrathin) solid var(--border-primary);
    background-color: var(--surface-hover);
    height: 48px;
    border-radius: 8px;
    padding-inline: 8px;
  }
</style>
