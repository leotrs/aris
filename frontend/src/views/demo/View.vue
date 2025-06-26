<script setup>
  import { ref, reactive, computed, provide, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { demoFile, demoUser, demoFileStore, demoAnnotations, createDemoApi } from "./demoData.js";
  import { File } from "@/models/File.js";
  import Sidebar from "@/views/workspace/Sidebar.vue";
  import Canvas from "@/views/workspace/Canvas.vue";
  import Icon from "@/components/base/Icon.vue";

  // Create demo API instance
  const api = createDemoApi();
  provide("api", api);

  // Provide viewport info
  const breakpoints = useBreakpoints({ xs: 425, ...breakpointsTailwind });
  provide("breakpoints", breakpoints);

  const xsMode = computed(() => breakpoints.smallerOrEqual("xs").value);
  provide("xsMode", xsMode);
  const mobileMode = computed(() => breakpoints.smallerOrEqual("sm").value);
  provide("mobileMode", mobileMode);

  // Demo user and file store
  const user = ref(demoUser);
  const fileStore = ref(demoFileStore);
  provide("user", user);
  provide("fileStore", fileStore);

  // Create reactive demo file
  const demoFileReactive = reactive(new File(demoFile));
  const file = computed(() => demoFileReactive);
  provide("file", file);

  // Demo annotations
  const annotations = reactive(demoAnnotations);
  provide("annotations", annotations);

  // Demo file settings
  const fileSettings = ref(demoFile._settings);
  provide("fileSettings", fileSettings);

  // Panel component management
  const showEditor = ref(false);
  const showSearch = ref(false);
  const showComponent = (compName) => {
    if (compName === "DockableEditor") {
      showEditor.value = true;
      return;
    } else if (compName === "DockableSearch") {
      showSearch.value = true;
      return;
    }
  };
  const hideComponent = (compName) => {
    if (compName === "DockableEditor") {
      showEditor.value = false;
      return;
    } else if (compName === "DockableSearch") {
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

  // Initialize demo content
  onMounted(async () => {
    try {
      console.log(
        "Initializing demo content with source:",
        file.value.source.substring(0, 100) + "..."
      );
      const response = await api.post("/render", { source: file.value.source });
      demoFileReactive.html = response.data;
      console.log("Demo content initialized, HTML length:", demoFileReactive.html.length);
    } catch (error) {
      console.error("Failed to initialize demo content:", error);
    }
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    c: () => (focusMode.value = !focusMode.value),
  });

  // Main sidebar collapsed state
  const sidebarIsCollapsed = ref(false);
  provide("sidebarIsCollapsed", sidebarIsCollapsed);

  // Development mode
  const isDev = ref(false);
  provide("isDev", isDev);
</script>

<template>
  <div class="demo-root">
    <!-- Demo banner -->
    <div v-if="!focusMode" class="demo-banner">
      <div class="demo-banner-content">
        <Icon name="InfoCircle" icon-class="demo-icon" />
        <span>Demo Mode - Experience Aris workspace with sample content</span>
        <a href="/" class="demo-link">← Back to homepage</a>
      </div>
    </div>

    <div
      class="view demo-view"
      data-testid="demo-container"
      :class="{ focus: focusMode, mobile: mobileMode }"
    >
      <Sidebar @show-component="showComponent" @hide-component="hideComponent" />

      <!-- Demo state -->
      <div class="outer" :class="{ focus: focusMode, mobile: mobileMode }">
        <Canvas
          v-if="file && file.id"
          v-model="demoFileReactive"
          data-testid="workspace-canvas"
          :show-editor="showEditor"
          :show-search="showSearch"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .demo-root {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .view {
    --transition-duration: 0.3s;
    --sidebar-width: v-bind(sidebarWidth);

    display: flex;
    width: 100%;
    flex: 1;
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

  .demo-banner {
    background: linear-gradient(135deg, var(--blue-100) 0%, var(--purple-100) 100%);
    border-bottom: 1px solid var(--border-primary);
    padding: 8px 16px;
    z-index: 1000;
  }

  .demo-banner-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
  }

  .demo-link {
    color: var(--blue-600);
    text-decoration: none;
    margin-left: auto;
  }

  .demo-link:hover {
    text-decoration: underline;
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
</style>
