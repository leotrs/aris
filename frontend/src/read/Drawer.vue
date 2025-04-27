<script setup>
  import {} from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const active = defineModel({ type: Boolean, default: false });
  useKeyboardShortcuts({
    d: () => (active.value = !active.value),
  });
</script>

<template>
  <div class="d-wrapper">
    <ButtonToggle
      v-model="active"
      :icon="active ? 'LayoutSidebarRightCollapse' : 'LayoutSidebarRightExpand'"
      :class="{ active }"
    />
    <div class="drawer" :class="{ active }">hi</div>
  </div>
</template>

<style>
  .d-wrapper {
    --transition-duration: 0.3s;

    position: fixed;
    right: calc(var(--scrollbar-size));
  }

  .drawer {
    height: 500px;

    border: var(--border-thin) solid var(--border-primary);
    border-right-color: transparent;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    padding: 16px;
    width: 0;
    transition: width var(--transition-duration) ease;
  }

  .drawer.active {
    width: 200px;
  }
</style>
