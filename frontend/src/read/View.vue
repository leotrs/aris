<script setup>
  import { ref, reactive, provide, onBeforeMount } from "vue";
  import { useRoute } from "vue-router";
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
</script>

<template>
  <div class="read-view">
    <Sidebar @show-component="showComponent" @hide-component="hideComponent" />

    <ArisManuscript :left="leftComponents" :right="rightComponents" :top="topComponents" />

    <div class="links">
      <Button kind="tertiary" icon="Share3" />
      <Button kind="tertiary" icon="Lifebuoy" />
      <Button kind="tertiary">
        <Avatar name="TER" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
  .read-view {
    display: flex;
    width: 100%;
    background-color: transparent;
  }

  .links {
    position: absolute;
    right: 8px;
    top: 8px;
    height: calc(64px - var(--border-extrathin));
    display: flex;
    z-index: 3;
    padding: 8px;
    background-color: transparent;
    border-top-right-radius: 16px;
  }
</style>
