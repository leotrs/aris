<script setup>
import { ref, watch, onBeforeMount, useTemplateRef, nextTick } from "vue";

const props = defineProps({ html: { type: String, required: true } });

let onload = ref(null);
onBeforeMount(async () => {
  await import("http://localhost:8000/static/jquery-3.6.0.js");
  await import("http://localhost:8000/static/tooltipster.bundle.js");
  const module = await import("http://localhost:8000/static/onload.js");
  onload.value = module.onload;
});

const manuscript = useTemplateRef("manuscript-ref");
const tryExecuteOnload = async () => {
  if (!onload.value || !manuscript.value || !props.html) return;
  await nextTick();
  onload.value(manuscript.value);
};
watch([onload, () => manuscript.value, () => props.html], tryExecuteOnload);
</script>

<template>
  <div class="rsm-manuscript">
    <div class="css-links">
      <link
        rel="stylesheet"
        type="text/css"
        href="http://localhost:8000/static/rsm.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css"
      />
    </div>
    <div class="manuscriptwrapper" v-html="html" ref="manuscript-ref"></div>
  </div>
</template>

<style>
/* Overwrite RSM's CSS but be CAREFUL!!! */
.manuscriptwrapper {
  /* The background color comes from the user's choice within the settings overlay */
  background-color: transparent !important;

  /* Overwrite size and whitespace */
  margin: 0 !important;
  max-width: unset !important;
  padding-top: 40px !important;
  padding-bottom: 48px !important;
  padding-inline: 0px !important;
  border-radius: 0px !important;

  & section.level-1 {
    margin-block: 0px !important;
  }

  /* Patches - for some reason the RSM CSS is broken? */
  & .hr .hr-border-zone .hr-border-dots .icon.dots {
    padding-bottom: 0 !important;
  }

  & .hr .hr-collapse-zone .hr-collapse .icon.collapse {
    padding-bottom: 0 !important;
  }
}
</style>
