<script setup>
  import { ref, reactive, computed, inject, provide, onBeforeMount } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import Sidebar from "./Sidebar.vue";
  import Canvas from "./Canvas.vue";

  const fileId = computed(() => `${useRoute().params.file_id}`);
  const user = inject("user");
  const file = ref({ id: -1, tags: [] });
  const api = inject("api");

  // Load and provide file
  onBeforeMount(async () => {
    try {
      const response = await api.get(`/files/${fileId.value}`);
      file.value = response.data;
    } catch (error) {
      console.error(`Failed to fetch file ${fileId.value}`, error);
    }
  });
  provide("file", file);

  /* Focus Mode */
  const focusMode = ref(false);
  provide("focusMode", focusMode);

  /* Keyboard shortcuts */
  const router = useRouter();
  useKeyboardShortcuts({
    "g,h": () => router.push("/"),
    c: () => (focusMode.value = !focusMode.value),
  });
</script>

<template>
  <div class="read-view" :class="{ focus: focusMode }">
    <Sidebar />
    <Canvas />
    <div class="menus" :class="{ focus: focusMode }">
      <FileMenu icon="Menu3" />
      <UserMenu />
    </div>
  </div>
</template>

<style scoped>
  .read-view {
    --transition-duration: 0.3s;
    display: flex;
    width: 100%;
    padding: 8px 8px 8px 0;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
    position: relative;
  }

  .read-view.focus {
    padding: 0;
  }

  .menus {
    position: absolute;
    right: 8px;
    top: 8px;
    height: calc(64px - var(--border-extrathin));
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

  .menus.focus {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
