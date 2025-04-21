<script setup>
  import { ref, reactive, provide, onBeforeMount } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import axios from "axios";
  import Sidebar from "./Sidebar.vue";
  import ArisManuscript from "./ArisManuscript.vue";

  const docID = `${useRoute().params.doc_id}`;
  const doc = ref({});

  onBeforeMount(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/documents/${docID}`);
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

  const router = useRouter();
  useKeyboardShortcuts({
    "g,h": () => router.push("/"),
  });
</script>

<template>
  <div class="read-view">
    <Sidebar @show-component="showComponent" @hide-component="hideComponent" />
    <ArisManuscript :left="leftComponents" :right="rightComponents" :top="topComponents" />
    <div class="menus"><FileMenu /><UserMenu /></div>
  </div>
</template>

<style scoped>
  .read-view {
    display: flex;
    width: 100%;
    background-color: transparent;
  }

  .menus {
    position: absolute;
    right: 8px;
    top: 8px;
    height: calc(64px - var(--border-extrathin));
    display: flex;
    align-items: center;
    z-index: 3;
    padding: 8px;
    gap: 8px;
    background-color: transparent;
  }
</style>
