<script setup>
  import { inject, computed } from "vue";
  import Dock from "./Dock.vue";

  const props = defineProps({
    showTitle: { type: Boolean, required: true },
    component: { type: Object, default: null },
  });
  const file = inject("file");

  const columnSizes = inject("columnSizes");
  const leftColumnWidth = computed(() => `${columnSizes.left.width}px`);
  const middleColumnWidth = computed(() => `${columnSizes.middle.width}px`);

  const fileSettings = inject("fileSettings");
  const focusMode = inject("focusMode");
</script>

<template>
  <div class="tb-wrapper" :class="{ 'with-shadow': showTitle, focus: focusMode }">
    <Dock class="middle-column top">
      <FileTitle v-if="!component && showTitle" :file="file" class="text-h6" />
      <component :is="component" v-if="component" ref="middle-comp" :file="file" side="top" />
    </Dock>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --sidebar-width: 64px;
    --links-width: 121px;

    display: flex;
    height: 64px;
    position: relative;
    background-color: v-bind("fileSettings.background");
    z-index: 2;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding-inline: calc(var(--links-width) - 16px);

    opacity: 1;
    transform: translateY(0);
    width: 100%;
    will-change: opacity, transform, width;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .tb-wrapper.with-shadow::after {
    --thickness: 4px;
    content: "";
    position: absolute;
    right: -16px;
    bottom: calc(-1 * var(--thickness));
    width: calc(200% + 32px + 32px + 1px);
    height: var(--thickness);
    box-shadow: inset 0 var(--thickness) var(--thickness) calc(-1 * var(--thickness))
      rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  .tb-wrapper.focus {
    opacity: 0;
    transform: translateY(-100%);
    width: 100%;
  }

  .left-column,
  .middle-column {
    position: relative;
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
    text-align: center;
    width: v-bind("middleColumnWidth");
  }

  .file-title {
    text-align: right;
  }
</style>
