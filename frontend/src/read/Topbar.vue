<script setup>
  import { inject } from "vue";
  import Drawer from "./Drawer.vue";

  const props = defineProps({
    showTitle: { type: Boolean, required: true },
    drawer: { type: String, default: "" },
  });
  const doc = inject("doc");
</script>

<template>
  <div class="tb-wrapper" :class="{ 'with-border': showTitle }">
    <Drawer class="left" side="top" :scroll="false">
      <FileTitle v-if="showTitle && drawer" :doc="doc" />
    </Drawer>

    <Drawer class="middle" side="top" :scroll="false">
      <FileTitle v-if="showTitle && !drawer" :doc="doc" class="text-h6" />
    </Drawer>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --links-width: 151px;

    display: flex;
    height: var(--sidebar-width);
    width: calc(100% - var(--sidebar-width) - var(--outer-padding));
    position: fixed;
    top: 8px;
    background-color: transparent;
    z-index: 2;
    border-bottom: var(--border-extrathin) solid var(--surface-page);
    padding-right: var(--links-width);

    &.with-border {
      box-shadow:
        0px 4px 2px -2px rgba(0, 0, 0, 15%),
        0px 8px 6px -6px rgba(0, 0, 0, 05%);
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
    display: flex;
    align-items: center;
    justify-content: center;

    & .file-title {
    }
  }
</style>
