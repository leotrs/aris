<script setup>
  import { ref, reactive, computed, inject, provide, watchEffect, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import Sidebar from "./Sidebar.vue";
  import Canvas from "./Canvas.vue";

  // Load and provide file
  const fileStore = inject("fileStore");
  const file = ref({});
  const route = useRoute();
  watchEffect(() => {
    if (!fileStore?.value || !fileStore.value.files || !route) return;
    const fileId = computed(() => `${route.params.file_id}`);
    if (!fileId.value) return;
    file.value = fileStore.value.files.find((f) => f.id == fileId.value);
    if (!file.value) {
      console.error("Could not find file with ID", fileId.value);
    } else {
      console.log("found file with ID", file.value.id);
    }
  });
  provide("file", file);

  // Panel component management
  const leftComponents = reactive([]);
  const topComponents = reactive([]);
  const rightComponents = reactive([]);
  const sideRefMap = { left: leftComponents, top: topComponents, right: rightComponents };
  const showEditor = ref(false);
  const showComponent = (compName, side) => {
    if (compName == "DockableEditor") {
      showEditor.value = true;
      return;
    }
    if (!sideRefMap[side]) {
      console.warn(`Invalid side specified: ${side}`);
      return;
    }
    if (!sideRefMap[side].includes(compName)) sideRefMap[side].push(compName);
  };

  const hideComponent = (compName, side) => {
    if (compName == "DockableEditor") {
      showEditor.value = false;
      return;
    }
    if (!sideRefMap[side]) {
      console.warn(`Invalid side specified: ${side}`);
      return;
    }
    const index = sideRefMap[side].indexOf(compName);
    if (index !== -1) sideRefMap[side].splice(index, 1);
  };
  provide("panelManager", {
    showComponent,
    hideComponent,
    panels: sideRefMap,
  });

  /* Focus Mode */
  const focusMode = ref(false);
  provide("focusMode", focusMode);

  /* Responsiveness */
  const mobileMode = inject("mobileMode");

  /* Keyboard shortcuts */
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
    <Canvas
      v-if="file"
      v-model="file"
      :show-editor="showEditor"
      :left="leftComponents"
      :right="rightComponents"
      :top="topComponents"
    />
    <div class="menus" :class="{ focus: focusMode }">
      <Button v-if="mobileMode" kind="tertiary" icon="Home" @click="goHome" />
      <FileMenu icon="Menu3" />
      <UserMenu />
    </div>
  </div>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;
    display: flex;
    width: 100%;
    padding: 8px 8px 8px 0;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
    position: relative;
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
    right: 16px;
    top: 16px;
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
    right: 8px;
    top: 0px;
  }

  .menus.focus {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
