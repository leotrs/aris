<script setup>
  import { ref, watch, onBeforeMount, useTemplateRef, nextTick } from "vue";

  const props = defineProps({
    htmlString: { type: String, required: true },
    keys: { type: Boolean, required: true },
    showFooter: { type: Boolean, default: false },
  });

  let onload = ref(null);
  onBeforeMount(async () => {
    await import("http://localhost:8000/static/jquery-3.6.0.js");
    await import("http://localhost:8000/static/tooltipster.bundle.js");
    const module = await import("http://localhost:8000/static/onload.js");
    onload.value = module.onload;
  });

  const selfRef = useTemplateRef("self-ref");
  const tryExecuteOnload = async () => {
    if (!onload.value || !selfRef.value || !props.htmlString) return;
    await nextTick();
    onload.value(selfRef.value, { keys: props.keys });
  };
  watch([onload, () => selfRef.value, () => props.htmlString], tryExecuteOnload);
</script>

<template>
  <div ref="self-ref" class="rsm-manuscript">
    <div class="css-links">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css"
      />
    </div>

    <Manuscript :html-string="htmlString" />

    <div v-if="showFooter" class="middle-footer">
      <div class="footer-logo"><img src="../assets/logo-32px.svg" /></div>
    </div>
  </div>
</template>

<style scoped>
  .footer-logo {
    display: flex;
    justify-content: center;
    padding-top: 48px;
    padding-bottom: 96px;
  }
</style>
