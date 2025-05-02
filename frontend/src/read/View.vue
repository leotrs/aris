<script setup>
  import { ref, reactive, inject, provide, onBeforeMount } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import axios from "axios";
  import Sidebar from "./Sidebar.vue";
  import Canvas from "./Canvas.vue";

  const docID = `${useRoute().params.doc_id}`;
  const user = inject("user");
  const doc = ref({ id: -1, tags: [] });

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
    console.log("showing: ", compName, "on side: ", side);
    sideRefMap[side].push(compName);
  };
  const hideComponent = (compName, side) => {
    const index = sideRefMap[side].indexOf(compName);
    if (index !== -1) sideRefMap[side].splice(index, 1);
  };

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
    <Sidebar @show-component="showComponent" @hide-component="hideComponent" />
    <Canvas :left="leftComponents" :right="rightComponents" :top="topComponents" />
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
