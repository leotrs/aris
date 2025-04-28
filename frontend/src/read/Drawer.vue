<script setup>
  import { ref, watch, inject, useTemplateRef, onMounted } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import DrawerCitation from "./DrawerCitation.vue";
  import DrawerSettings from "./DrawerSettings.vue";

  const active = defineModel({ type: Boolean, default: false });
  const doc = inject("doc");
  const columnSizes = inject("columnSizes");

  /* State */
  const tabsRef = useTemplateRef("tabs-ref");
  const activeTabIndex = ref(0);

  const updatePages = () => {
    if (!tabsRef.value || !tabsRef.value.$el) return;
    const pages = tabsRef.value.$el.querySelectorAll(".tab-page-wrapper");
    pages.forEach((page) => (page.style.display = "none"));
    pages[activeTabIndex.value].style.display = "block";
  };
  watch(activeTabIndex, () => updatePages(), { immediate: true });
  onMounted(() => updatePages());

  /* Keys */
  useKeyboardShortcuts({
    d: () => (active.value = !active.value),
  });
</script>

<template>
  <div class="d-wrapper" :class="{ active }" :style="{ height: `${columnSizes.right.height}px` }">
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
        :labels="['activity', 'history', 'citation', 'tags', 'settings']"
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

    position: fixed;
    display: flex;
    align-items: flex-start;
    right: 0;
    z-index: 2;
    transform: translateX(calc(100% - 32px - 8px - 8px));
    will-change: transform;
    transition: transform var(--transition-duration) ease;
  }

  .d-wrapper.active {
    transform: translateX(0);
  }

  .d-btn {
    position: relative;
    top: 20px;
  }

  .d-btn.active {
    box-shadow: var(--shadow-strong), var(--shadow-soft);
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }

  .drawer {
    border: var(--border-extrathin) solid var(--border-primary);
    border-right-color: transparent;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    background-color: var(--surface-primary);
    padding: var(--padding);
    height: calc(100%);
    pointer-events: none;
    box-shadow: var(--shadow-strong), var(--shadow-soft);
    width: calc(64px * 5 + + 4px * 4 + 2 * var(--padding));

    opacity: 0;
    transition: opacity var(--transition-duration) ease;
  }

  .drawer.active {
    pointer-events: all;
    opacity: 1;
  }
</style>
