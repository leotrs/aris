<script setup>
 import { onMounted, useTemplateRef } from 'vue';
 const { html } = defineProps({ html: { type: String, required: true }} );

 const manuscript = useTemplateRef('manuscript-ref');
 onMounted(async () => {
     if (!manuscript.value) return;
     await import("http://localhost:8000/static/jquery-3.6.0.js");
     await import("http://localhost:8000/static/tooltipster.bundle.js");
     const { onload } = await import("http://localhost:8000/static/onload.js");
     const lsp_ws = onload();
 });
</script>


<template>
  <div class="rsm-manuscript">
    <div class="css-links">
      <link rel="stylesheet" type="text/css" href="http://localhost:8000/static/rsm.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css">
    </div>
    <div class="manuscriptwrapper" v-html="html" ref="manuscript-ref"></div>
  </div>
</template>


<style scoped>

</style>
