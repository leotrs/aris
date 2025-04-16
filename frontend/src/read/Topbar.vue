<script setup>
  import Drawer from "./Drawer.vue";

  const props = defineProps({
    title: { type: String },
  });
</script>

<template>
  <div class="tb-wrapper">
    <Drawer class="left" side="top" :scroll="false" />
    <Drawer class="middle" side="top" :scroll="false" />
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --links-width: 144px;

    display: flex;
    height: var(--sidebar-width);
    width: calc(
      100% - var(--sidebar-width) - var(--links-width) - 2 * var(--outer-padding)
    );
    position: fixed;
    top: 8px;
    background-color: transparent;
    border-bottom: var(--border-extrathin) solid var(--border-primary);
    z-index: 1;
  }

  .drawer {
    background-color: var(--surface-page);
  }

  .left {
    flex-basis: 292px;
    display: flex;
    align-items: center;
    border-top-left-radius: 16px;
    padding-inline: 16px;
  }

  .middle {
    flex-grow: 1;
  }
</style>
