<script setup>
  import { ref, watch, computed, inject, onBeforeMount, useTemplateRef, nextTick } from "vue";
  import Manuscript from "./Manuscript.vue";

  const props = defineProps({
    htmlString: { type: String, required: true },
    keys: { type: Boolean, required: true },
    showFooter: { type: Boolean, default: false },
    settings: { type: Object, default: () => {} },
  });
  const emit = defineEmits(["mounted-at"]);

  const api = inject("api");
  let onload = ref(null);
  onBeforeMount(async () => {
    const base = api.getUri();
    await import(/* @vite-ignore */ `${base}/static/jquery-3.6.0.js`);
    await import(/* @vite-ignore */ `${base}/static/tooltipster.bundle.js`);
    const module = await import(/* @vite-ignore */ `${base}/static/onload.js`);
    onload.value = module.onload;
  });

  const selfRef = useTemplateRef("self-ref");
  const tryExecuteOnload = async () => {
    if (!onload.value || !selfRef.value || !props.htmlString) return;
    await nextTick();
    onload.value(selfRef.value, { keys: props.keys });
  };
  watch([onload, () => selfRef.value, () => props.htmlString], tryExecuteOnload);

  const manuscriptRef = useTemplateRef("manuscript-ref");
  defineExpose({ mountPoint: computed(() => manuscriptRef.value?.mountPoint) });
</script>

<template>
  <div ref="self-ref" class="rsm-manuscript">
    <div class="css-links">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css"
      />
    </div>

    <Manuscript ref="manuscript-ref" :html-string="htmlString" :settings="settings" />

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
