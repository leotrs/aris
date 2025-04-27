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
    <div class="drawer" :class="{ active }">
      <Tabs
        :labels="['activity', 'history', 'settings', 'citation', 'tags']"
        :icons="['Bolt', 'Clock', 'FileSettings', 'Quote', 'Tag']"
      >
        <TabPage>activity</TabPage>
        <TabPage>history</TabPage>
        <TabPage>settings</TabPage>
        <TabPage>citation</TabPage>
        <TabPage>tags</TabPage>
      </Tabs>
    </div>
  </div>
</template>

<style>
  .d-wrapper {
    --transition-duration: 0.3s;

    position: fixed;
    right: calc(var(--scrollbar-size));
    z-index: 1;
  }

  .drawer {
    height: 500px;
    border: var(--border-thin) solid var(--border-primary);
    border-right-color: transparent;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    background-color: var(--surface-primary);
    padding: 16px;
    width: 0;
    transition: width var(--transition-duration) ease;
  }

  .drawer.active {
    width: 300px;
  }
</style>
