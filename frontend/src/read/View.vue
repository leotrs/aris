<script setup>
  import { ref, computed, reactive, inject, provide, onBeforeMount } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import axios from "axios";
  import Sidebar from "./Sidebar.vue";
  import ArisManuscript from "./ArisManuscript.vue";

  const docID = `${useRoute().params.doc_id}`;
  const user = inject("user");
  const doc = ref({});

  onBeforeMount(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/users/${user.id}/documents/${docID}`);
      doc.value = response.data;
    } catch (error) {
      console.error(`Failed to fetch document ${docID}`, error);
    }
  });
  provide("doc", doc);

  const leftComponents = reactive([]);
  const topComponents = reactive([]);
  const rightComponents = reactive([]);
  const sideRefMap = { left: leftComponents, top: topComponents, right: rightComponents };
  const showComponent = (compName, side) => {
    sideRefMap[side].push(compName);
  };
  const hideComponent = (compName, side) => {
    const index = sideRefMap[side].indexOf(compName);
    if (index !== -1) sideRefMap[side].splice(index, 1);
  };

  /* Keyboard shortcuts */
  const router = useRouter();
  useKeyboardShortcuts({
    "g,h": () => router.push("/"),
  });

  /* Focus Mode */
  const focusMode = ref(false);
  const onFocusModeChange = (mode) => (focusMode.value = mode);
  provide("focusMode", focusMode);

  const menuOpacity = computed(() => (focusMode.value ? "0" : "1"));
</script>

<template>
  <div class="read-view" :style="{ padding: focusMode ? '0' : '8px 8px 8px 0' }">
    <Sidebar
      @show-component="showComponent"
      @hide-component="hideComponent"
      @focus-mode="onFocusModeChange"
    />
    <ArisManuscript :left="leftComponents" :right="rightComponents" :top="topComponents" />
    <div class="menus" :style="{ opacity: menuOpacity }">
      <FileMenu icon="Menu3" />
      <UserMenu />
    </div>
  </div>
</template>

<style scoped>
  .read-view {
    --transition-duration: 0.75s;
    display: flex;
    width: 100%;
    transition: padding var(--transition-duration) ease;
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
    transition: opacity var(--transition-duration) ease;
  }
</style>
