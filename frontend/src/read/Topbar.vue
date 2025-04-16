<script setup>
  import { inject } from "vue";
  import Drawer from "./Drawer.vue";

  const props = defineProps({ showTitle: { type: Boolean, required: true } });
  const doc = inject("doc");
</script>

<template>
  <div class="tb-wrapper" :class="{ 'with-border': showTitle }">
    <Drawer class="left" side="top" :scroll="false">
      <FileTitle v-if="showTitle" :doc="doc" />
    </Drawer>

    <Drawer class="middle" side="top" :scroll="false"> </Drawer>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --links-width: 152px;

    display: flex;
    height: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width) - 2 * var(--outer-padding));
    position: fixed;
    top: 8px;
    background-color: transparent;
    z-index: 1;
    border-bottom: var(--border-extrathin) solid var(--surface-page);
    padding-right: var(--links-width);

    &.with-border {
      border-bottom-color: var(--border-primary);
    }
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
