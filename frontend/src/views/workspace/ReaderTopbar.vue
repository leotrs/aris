<script setup>
  import { inject, computed } from "vue";

  const props = defineProps({
    showTitle: { type: Boolean, required: true },
    component: { type: Object, default: null },
  });
  const file = inject("file");
  const fileSettings = inject("fileSettings");

  const focusMode = inject("focusMode");
  const isActive = computed(() => props.showTitle || props.component);
</script>

<template>
  <div class="topbar" :class="{ active: isActive, focus: focusMode }">
    <FileTitle v-if="!component && showTitle" :file="file" class="text-h6" />
    <component :is="component" v-if="component" ref="middle-comp" :file="file" side="top" />
  </div>
</template>

<style scoped>
  .topbar {
    --sidebar-width: 64px;
    --links-width: 120px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: var(--border-extrathin) solid transparent;
    border-radius: 8px 8px 0 0;
    transform: translateY(0);
    will-change: opacity, transform, width;
    background-color: transparent;
    z-index: 9999;

    opacity: 1;
    max-width: 720px;
    margin: 0 auto;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .topbar.active {
    height: 48px;
    box-shadow: var(--shadow-soft);
    border-color: var(--border-primary);
    background-color: v-bind(fileSettings.background);
  }

  .topbar.focus {
    opacity: 0;
    transform: translateY(-100%);
  }
</style>
