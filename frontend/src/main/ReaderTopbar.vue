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

  const width = computed(() => {
    console.log(columnSizes);
    return columnSizes.middle.width || "0px";
  });
</script>

<template>
  <div class="tb-wrapper" :class="{ 'show-title': showTitle, focus: focusMode }">
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
    align-items: center;
    position: relative;
    border: var(--border-extrathin) solid transparent;
    border-radius: 8px 8px 0 0;
    opacity: 1;
    transform: translateY(0);
    will-change: opacity, transform, width;
    background-color: transparent;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .tb-wrapper.show-title {
    height: 64px;
    border-color: var(--border-primary);
    background-color: var(--surface-page);
  }

  .tb-wrapper.focus {
    opacity: 0;
    transform: translateY(-100%);
  }
</style>
