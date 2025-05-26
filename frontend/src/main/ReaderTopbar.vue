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
    --links-width: 120px;

    display: flex;
    height: 64px;
    position: relative;
    background-color: transparent;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding-inline: calc(var(--links-width) - 16px - 8px + 1px);
    opacity: 1;
    transform: translateY(0);
    width: 100%;
    will-change: opacity, transform, width;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .tb-wrapper .middle-column::after {
    --thickness: 4px;
    content: "";
    position: absolute;
    bottom: calc(-1 * var(--thickness));
    width: 100%;
    height: var(--thickness);
    pointer-events: none;
  }

  .tb-wrapper:not(.with-shadow) .middle-column::after {
    box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
    bottom: -4px;
  }

  .tb-wrapper.with-shadow .middle-column::after {
    box-shadow: inset 0 var(--thickness) var(--thickness) calc(-1 * var(--thickness))
      rgba(0, 0, 0, 0.3);
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
  }

  .middle-column {
    background-color: transparent;
    width: v-bind("middleColumnWidth");
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    border-radius: 8px 8px 0 0;
  }

  .tb-wrapper.with-shadow .middle-column {
    background-color: var(--surface-page);
    /* margin-top: 16px;
       height: calc(64px - 16px); */
    /* border-top-left-radius: 8px;
       border-top-right-radius: 8px; */
  }

  .file-title {
    text-align: right;
  }
</style>
