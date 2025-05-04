<script setup>
  import { ref, watch, inject, useTemplateRef, onMounted } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import DrawerCitation from "./DrawerCitation.vue";
  import DrawerSettings from "./DrawerSettings.vue";

  const active = defineModel({ type: Boolean, default: false });
  const doc = inject("doc");

  /* State */
  const tabsRef = useTemplateRef("tabs-ref");
  const activeTabIndex = ref(0);

  /* Keys */
  useKeyboardShortcuts({
    d: () => (active.value = !active.value),
  });
</script>

<template>
  <div class="d-wrapper" :class="{ active }">
    <ButtonToggle
      v-model="active"
      :icon="active ? 'LayoutSidebarRightCollapse' : 'LayoutSidebarRightExpand'"
      button-size="btn-sm"
      class="d-btn"
    />
    <div class="drawer" :class="{ active }">
      <Tabs
        ref="tabs-ref"
        v-model="activeTabIndex"
        :labels="['Activity', 'History', 'Citation', 'Tags', 'Settings']"
        :icons="['Bolt', 'Clock', 'Quote', 'Tag', 'FileSettings']"
      >
        <TabPage>activity</TabPage>
        <TabPage>history</TabPage>
        <TabPage><DrawerCitation /></TabPage>
        <TabPage><TagRow v-model="doc.tags" :doc-id="doc.id" /></TabPage>
        <TabPage><DrawerSettings /></TabPage>
      </Tabs>
    </div>
  </div>
</template>

<style>
  .d-wrapper {
    --transition-duration: 0.3s;
    --tab-width: 64px;
    --padding: 8px;
    --border-width: var(--border-extrathin);

    position: fixed;
    display: flex;
    align-items: flex-start;
    top: calc(64px);
    right: 24px;
    z-index: 2;
    transform: translateX(calc(100% - 32px - 8px - 8px));
    will-change: transform;
    transition: transform var(--transition-duration) ease;
  }

  .d-wrapper.active {
    transform: translateX(0);
    right: 0;
  }

  .d-btn {
    position: relative;
    top: calc(var(--padding) + 8px);
    right: calc(-1 * var(--padding) - var(--border-width));
  }

  .d-btn.active {
    box-shadow: var(--shadow-strong), var(--shadow-soft);
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }

  .drawer {
    border: var(--border-width) solid var(--border-primary);
    border-right-color: transparent;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    background-color: var(--surface-primary);
    padding: var(--padding);
    pointer-events: none;
    box-shadow: var(--shadow-strong), var(--shadow-soft);
    width: calc(64px * 5 + + 4px * 4 + 2 * var(--padding));
    height: fit-content;
    max-height: 100%;

    opacity: 0;
    transition:
      opacity var(--transition-duration) ease,
      height var(--transition-duration) ease;
  }

  .drawer.active {
    pointer-events: all;
    opacity: 1;
  }
</style>
