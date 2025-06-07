<script setup>
  import { ref, computed, inject, provide, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { File } from "../File.js";
  import Sidebar from "./Sidebar.vue";
  import Canvas from "./Canvas.vue";
  import DockableSearch from "./DockableSearch.vue";

  // Load and provide file
  const fileStore = inject("fileStore");
  const route = useRoute();
  const file = computed(() => {
    const files = fileStore?.value?.files;
    const fileId = route?.params?.file_id;
    if (!files || files.length == 0 || !fileId) return {};

    const found = files.find((f) => f.id == fileId);
    return found || {};
  });
  provide("file", file);

  const api = inject("api");
  const fileSettings = ref({});
  onMounted(async () => {
    const fromDb = await File.getSettings(file.value, api);
    Object.assign(fileSettings.value, fromDb);
  });
  provide("fileSettings", fileSettings);

  // Panel component management
  const showEditor = ref(false);
  const showSearch = ref(false);
  const showComponent = (compName) => {
    if (compName == "DockableEditor") {
      showEditor.value = true;
      return;
    } else if (compName == "DockableSearch") {
      showSearch.value = true;
      return;
    }
  };
  const hideComponent = (compName) => {
    if (compName == "DockableEditor") {
      showEditor.value = false;
      return;
    } else if (compName == "DockableSearch") {
      showSearch.value = false;
      return;
    }
  };

  // Sidebar drawer
  const drawerOpen = ref(false);
  provide("drawerOpen", drawerOpen);
  const sidebarWidth = computed(() => (drawerOpen.value ? "360px" : "64px"));

  // Focus Mode
  const focusMode = ref(false);
  provide("focusMode", focusMode);

  // Responsiveness
  const mobileMode = inject("mobileMode");

  // Keyboard shortcuts
  const goHome = () => router.push("/");
  const router = useRouter();
  useKeyboardShortcuts({
    "g,h": goHome,
    c: () => (focusMode.value = !focusMode.value),
  });
</script>

<template>
  <div class="view" :class="{ focus: focusMode, mobile: mobileMode }">
    <Sidebar @show-component="showComponent" @hide-component="hideComponent" />
    <Canvas v-if="file" v-model="file" :show-editor="showEditor" />
    <DockableSearch v-if="showSearch" />
    <div class="menus" :class="{ focus: focusMode, mobile: mobileMode }">
      <Button v-if="mobileMode" kind="tertiary" icon="Home" @click="goHome" />
      <!-- <UserMenu /> -->
    </div>
  </div>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;
    --sidebar-width: v-bind(sidebarWidth);

    display: flex;
    width: 100%;
    padding: 8px 8px 8px 0;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
    position: relative;
    overflow-x: hidden;
  }

  .view.mobile {
    padding: 0;
  }

  .view.focus {
    padding: 0;
  }

  .outer {
    width: calc(100% - 64px);
    position: relative;
    left: var(--sidebar-width);
  }

  .view.mobile > .outer {
    width: 100%;
    left: 0;
  }

  .menus {
    position: absolute;
    bottom: 0px;
    left: 0px;
    height: 64px;
    display: flex;
    align-items: center;
    z-index: 2;
    padding: 8px;
    gap: 8px;
    background-color: transparent;

    opacity: 1;
    transform: translateX(0);
    will-change: opacity, transform;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease;
  }

  .view.mobile > .menus {
    display: none;
  }

  .menus.focus {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
