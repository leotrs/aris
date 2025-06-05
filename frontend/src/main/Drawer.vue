<script setup>
  import { ref, inject } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import useClosable from "@/composables/useClosable.js";
  import DrawerCitation from "./DrawerCitation.vue";
  import DrawerSettings from "./DrawerSettings.vue";

  const active = defineModel({ type: Boolean, default: false });
  const file = inject("file");

  // State
  const activeTabIndex = ref(2);

  // Keys
  useKeyboardShortcuts({
    d: () => (active.value = !active.value),
  });

  // Closable
  useClosable({
    onClose: () => (active.value = false),
  });
</script>

<template>
  <div class="drawer-wrapper" :class="{ active }">
    <ButtonToggle
      v-model="active"
      icon="LayoutSidebarRightExpand"
      button-size="btn-sm"
      class="d-btn"
      :style="{ visibility: active ? 'hidden' : 'visible' }"
    />
    <div class="drawer" :class="{ active }">
      <Tabs
        ref="tabs-ref"
        v-model="activeTabIndex"
        :labels="['Citation', 'Tags', 'Settings']"
        :icons="['Quote', 'Tag', 'FileSettings']"
      >
        <!-- <TabPage>activity</TabPage> -->
        <!-- <TabPage>history</TabPage> -->
        <TabPage><DrawerCitation /></TabPage>
        <TabPage><TagRow v-model="file.tags" :file="file" /></TabPage>
        <TabPage><DrawerSettings :active="active" :file="file" /></TabPage>
      </Tabs>
      <ButtonClose @click="active = false" />
    </div>
  </div>
</template>

<style scoped>
  .drawer-wrapper {
    --transition-duration: 0.3s;
    --tab-width: 64px;
    --padding: 16px;
    --border-width: var(--border-extrathin);

    position: fixed;
    display: flex;
    align-items: flex-start;
    top: 24px;
    right: 32px;
    z-index: 2;
    width: calc(420px + 32px);
    transform: translateX(calc(100% - 32px - 8px - 8px));
    will-change: transform;
    transition: transform var(--transition-duration) ease;
  }

  .drawer-wrapper.active {
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
    padding-inline: 0px;
    padding-block: var(--padding);
    pointer-events: none;
    box-shadow: var(--shadow-strong), var(--shadow-soft);
    width: 100%;
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

  .tabs-wrapper {
    padding-inline: 16px;
    width: 100%;
  }

  .btn-close {
    position: absolute;
    top: 16px;
    right: 16px;
  }
</style>
