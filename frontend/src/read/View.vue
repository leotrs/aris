<script setup>
  import { ref, provide } from "vue";
  import { useRoute } from "vue-router";
  import { onKeyUp } from "@vueuse/core";
  import Sidebar from "./Sidebar.vue";
  import ArisManuscript from "./ArisManuscript.vue";

  const showMinimap = ref(false);
  const showSettings = ref(false);

  const docID = `${useRoute().params.doc_id}`;
  provide("docID", docID);

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
  </div>
</template>

<style scoped>
  .read-view {
    display: flex;
    width: 100%;
    background-color: transparent;
  }
</style>
