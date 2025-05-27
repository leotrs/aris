<script setup>
  import { inject, computed } from "vue";
  import Dock from "./Dock.vue";

  const props = defineProps({
    showTitle: { type: Boolean, required: true },
    component: { type: Object, default: null },
  });
  const file = inject("file");

  const columnSizes = inject("columnSizes");
  const fileSettings = inject("fileSettings");
  const focusMode = inject("focusMode");

  const width = computed(() => columnSizes.middle.width || "0px");
</script>

<template>
  <div class="tb-wrapper" :class="{ 'with-shadow': showTitle, focus: focusMode }">
    <template v-if="showTitle">
      <FileTitle v-if="!component && showTitle" :file="file" class="text-h6" />
      <component :is="component" v-if="component" ref="middle-comp" :file="file" side="top" />
    </template>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --sidebar-width: 64px;
    --links-width: 120px;

    display: flex;
    justify-content: center;
    position: relative;
    background-color: transparent;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom: var(--border-thin) solid transparent;
    opacity: 1;
    transform: translateY(0);
    width: v-bind(width);
    will-change: opacity, transform, width;
    background-color: var(--surface-page);
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .tb-wrapper.with-shadow {
    height: 64px;
    border-bottom-color: var(--border-primary);
  }

  .tb-wrapper.focus {
    opacity: 0;
    transform: translateY(-100%);
  }

  .tb-wrapper.with-shadow .middle-column {
    background-color: var(--surface-page);
    /* margin-top: 16px;
       height: calc(64px - 16px); */
    /* border-top-left-radius: 8px;
       border-top-right-radius: 8px; */
  }
</style>
