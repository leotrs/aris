<script setup>
  import { ref, provide, onBeforeMount } from "vue";
  import { useRoute } from "vue-router";
  import { onKeyUp } from "@vueuse/core";
  import axios from "axios";
  import Sidebar from "./Sidebar.vue";
  import ArisManuscript from "./ArisManuscript.vue";

  const showMinimap = ref(false);
  const showSettings = ref(false);

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

  onKeyUp(["m", "M"], (e) => {
    e.preventDefault();
    showMinimap.value = !showMinimap.value;
  });
  onKeyUp(["s", "S"], (e) => {
    e.preventDefault();
    showSettings.value = !showSettings.value;
  });
</script>

<template>
  <div class="read-view">
    <Sidebar />

    <ArisManuscript />

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
    height: 64px;
    display: flex;
    z-index: 1;
    padding: 8px;
    background-color: var(--surface-page);
    border-top-right-radius: 16px;
    border-bottom: var(--border-extrathin) solid var(--border-primary);
  }
</style>
