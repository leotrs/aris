<script setup>
  import { computed, watch, inject, provide, useTemplateRef } from "vue";
  import { useScroll } from "@vueuse/core";
  import { useKeyboardShortcuts, registerAsFallback } from "@/composables/useKeyboardShortcuts.js";
  import Topbar from "./Topbar.vue";
  import RSMEditor from "./RSMEditor.vue";

  const props = defineProps({
    left: { type: Array, default: () => [] },
    right: { type: Array, default: () => [] },
    top: { type: Array, default: () => [] },
  });
  const file = inject("file");
  const innerRef = useTemplateRef("inner-ref");

  const manuscriptRef = useTemplateRef("manuscript-ref");
  watch(
    () => manuscriptRef.value?.mountPoint,
    (newVal) => {
      if (!newVal) return;
      file.value.isMountedAt = newVal;
      console.log(file.value);
    },
    { immediate: true }
  );
  provide("manuscriptRef", manuscriptRef);

  const api = inject("api");
  const editorRef = useTemplateRef("editor-ref");
  const onCompile = async () => {
    console.log("compiling...");
    try {
      const response = await api.post("render/", { source: file.value.source });
      file.value.html = response.data;
    } catch (error) {
      console.error("Error compiling:", error);
    }
  };

  /* Scroll position */
  const { y: yScroll } = useScroll(innerRef);
  const yScrollPercent = computed(
    () => (yScroll.value / (manuscriptRef.value?.$el.clientHeight ?? 1)) * 100
  );
  provide("yScroll", yScrollPercent);

  /* Keyboard shortcuts */
  useKeyboardShortcuts({ c: onCompile });
  registerAsFallback(manuscriptRef);
</script>

<template>
  <Suspense>
    <div class="outer-wrapper">
      <Topbar @compile="onCompile" />

      <div ref="inner-ref" class="inner-wrapper">
        <div ref="left-column-ref" class="left-column">
          <RSMEditor ref="editor-ref" v-model="file" />
        </div>

        <div ref="right-column-ref" class="right-column">
          <ManuscriptWrapper
            v-if="file.html"
            ref="manuscript-ref"
            :html-string="file.html || ''"
            :keys="true"
          />
          <div v-else>compile your source...</div>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<style scoped>
  .outer-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 64px;

    position: relative;
    z-index: 1;
    box-shadow: var(--shadow-soft);

    width: calc(100% - 64px);
    left: 64px;
    border-radius: 16px;
    will-change: width, left, border-radius;
    transition:
      width var(--transition-duration) ease,
      left var(--transition-duration) ease,
      border-radius var(--transition-duration) ease;
  }

  .inner-wrapper {
    display: flex;
    width: 100%;
    height: calc(100% - var(--topbar-height));
    position: relative;
    top: v-bind(innerTop);
    background-color: var(--surface-page);
    overflow-y: auto;
    justify-content: center;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    top: var(--topbar-height);
    will-change: border-radius, height, top;
    transition:
      border-radius var(--transition-duration) ease,
      height var(--transition-duration) ease,
      top var(--transition-duration) ease;
  }

  .left-column,
  .right-column {
    flex-basis: 600px;
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 360px;
    max-width: 720px;
    z-index: 1;
    overflow-x: visible;
    height: fit-content;
    padding-top: 8px;
    will-change: padding-top;
    transition: padding-top var(--transition-duration) ease;
  }

  :deep(.float-minimap-wrapper) {
    display: none !important;
  }
</style>
