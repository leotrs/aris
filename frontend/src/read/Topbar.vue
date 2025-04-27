<script setup>
  import { inject, computed } from "vue";
  import Dock from "./Dock.vue";

  const props = defineProps({
    showTitle: { type: Boolean, required: true },
    component: { type: Object, default: null },
  });
  const doc = inject("doc");

  const columnSizes = inject("columnSizes");
  const leftColumnWidth = computed(() => `${columnSizes.left.width}px`);
  const middleColumnWidth = computed(() => `${columnSizes.middle.width}px`);

  const fileSettings = inject("fileSettings");

  const focusMode = inject("focusMode");
  const topbarOpacity = computed(() => (focusMode.value ? "0" : "1"));
  const topbarHeight = computed(() => (focusMode.value ? "0" : "64px"));
  const topbarWidth = computed(() =>
    focusMode.value ? "100%" : "calc(100% - var(--sidebar-width) - var(--outer-padding))"
  );
</script>

<template>
  <div
    class="tb-wrapper"
    :class="{ 'with-border': showTitle }"
    :style="{ height: topbarHeight, width: topbarWidth }"
  >
    <Dock class="left-column top" :style="{ opacity: topbarOpacity }">
      <FileTitle v-if="showTitle && component" :doc="doc" class="text-h6" />
    </Dock>

    <Dock class="middle-column top" :style="{ opacity: topbarOpacity }">
      <FileTitle v-if="showTitle && !component" :doc="doc" class="text-h6" />
      <component :is="component" ref="middle-comp" :doc="doc" />
    </Dock>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --links-width: 151px;

    display: flex;

    position: fixed;
    background-color: v-bind("fileSettings.background");
    z-index: 2;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding-right: var(--links-width);
    transition:
      height var(--transition-duration) ease,
      width var(--transition-duration) ease;

    &.with-border {
      box-shadow: var(--shadow-soft);
    }
  }

  .left-column,
  .middle-column {
    background-color: v-bind("fileSettings.background");
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: opacity var(--transition-duration) ease;
  }

  .left-column {
    margin-inline: 16px;
    border-top-left-radius: 16px;
    width: v-bind("leftColumnWidth");
  }

  .middle-column {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-inline: 48px;
    text-align: center;
    width: v-bind("middleColumnWidth");
  }

  .file-title {
    text-align: right;
  }
</style>
