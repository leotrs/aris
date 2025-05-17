<script setup>
  import {
    ref,
    computed,
    watch,
    inject,
    provide,
    onMounted,
    onBeforeUnmount,
    useTemplateRef,
  } from "vue";
  import { useScroll } from "@vueuse/core";
  import { useKeyboardShortcuts, registerAsFallback } from "@/composables/useKeyboardShortcuts.js";
  import Topbar from "./Topbar.vue";
  import RSMEditor from "./RSMEditor.vue";
  import { File } from "../File.js";

  const props = defineProps({});
  const file = inject("file");
  const innerRef = useTemplateRef("inner-ref");

  const manuscriptRef = useTemplateRef("manuscript-ref");
  watch(
    () => manuscriptRef.value?.mountPoint,
    (newVal) => {
      if (!newVal) return;
      file.value.isMountedAt = newVal;
    },
    { immediate: true }
  );
  provide("manuscriptRef", manuscriptRef);

  // Auto-save
  const autoSaveInterval = ref(30000);
  const lastSaved = ref(Date.now());
  const isSaving = ref(false);
  const saveStatus = ref("");
  const saveFile = async () => {
    if (isSaving.value || !file.value?.source) return;

    try {
      isSaving.value = true;
      saveStatus.value = "Saving...";
      /* await api.post("save/", { id: file.value.id, source: file.value.source }); */
      File.update(file.value, { source: file.value.source });
      File.save(file.value, api);
      lastSaved.value = Date.now();
      saveStatus.value = "Saved";

      setTimeout(() => {
        saveStatus.value === "Saved" && (saveStatus.value = "");
      }, 3000);
    } catch (error) {
      console.error("Error saving file:", error);
      saveStatus.value = "Save failed";
    } finally {
      isSaving.value = false;
    }
  };

  // Watch for changes to file content
  watch(
    () => file.value?.source,
    (newVal, oldVal) => {
      if (!newVal || newVal == oldVal) return;
      // Schedule a save after a short delay to avoid saving while typing
      const debounceTime = 2000;
      saveStatus.value = "Unsaved changes";
      if (window._saveTimeout) clearTimeout(window._saveTimeout);
      window._saveTimeout = setTimeout(() => saveFile(), debounceTime);
    }
  );

  // Set up interval for periodic auto-save
  let autoSaveTimer;
  onMounted(() => {
    autoSaveTimer = setInterval(() => {
      // Only save if there are changes and it's been more than the interval since last save
      const timeSinceLastSave = Date.now() - lastSaved.value;
      if (timeSinceLastSave >= autoSaveInterval.value && file.value?.source) {
        saveFile();
      }
    }, autoSaveInterval.value);
  });
  onBeforeUnmount(() => {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    if (window._saveTimeout) clearTimeout(window._saveTimeout);
  });

  const api = inject("api");
  const editorRef = useTemplateRef("editor-ref");
  const onCompile = async () => {
    if (!file.value || !file.value.source) return;
    try {
      const response = await api.post("render/", { source: file.value.source });
      file.value.html = response.data;
    } catch (error) {
      console.error("Error compiling:", error);
    }
  };
  watch(
    () => file.value?.source,
    (newSource) => {
      newSource && onCompile();
    }
  );

  /* Scroll position */
  const { y: yScroll } = useScroll(innerRef);
  const yScrollPercent = computed(
    () => (yScroll.value / (manuscriptRef.value?.$el.clientHeight ?? 1)) * 100
  );
  provide("yScroll", yScrollPercent);

  /* Keyboard shortcuts */
  useKeyboardShortcuts({ c: onCompile, s: saveFile });
  registerAsFallback(manuscriptRef);
</script>

<template>
  <Suspense>
    <div class="outer-wrapper">
      <Topbar :save-status="saveStatus" :is-saving="isSaving" @compile="onCompile" />

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
  }

  .inner-wrapper {
    display: flex;
    width: 100%;
    height: calc(100% - var(--topbar-height));
    position: relative;
    background-color: var(--surface-page);
    justify-content: center;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    top: var(--topbar-height);
  }

  .left-column,
  .right-column {
    flex-basis: 600px;
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 360px;
    max-width: 720px;
    z-index: 1;
    height: 100%;
    padding-top: 16px;
    overflow-y: auto;
  }

  :deep(.float-minimap-wrapper) {
    display: none !important;
  }
</style>
