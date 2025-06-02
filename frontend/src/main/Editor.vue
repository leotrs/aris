<script setup>
  import { ref, inject, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { useAutoSave } from "@/composables/useAutoSave.js";
  import { File } from "../File.js";
  import EditorTopbar from "./EditorTopbar.vue";
  import EditorSource from "./EditorSource.vue";
  import EditorFiles from "./EditorFiles.vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  // Editor topbar state
  const tabIndex = ref(0);

  // Compilation and saving
  const api = inject("api");
  const onCompile = async () => {
    const response = await api.post("render", { source: file.value.source });
    file.value.html = response.data;
  };
  const saveFile = async (fileToSave) => {
    await File.update(fileToSave, { source: file.value.source });
  };
  const { saveStatus, onInput, manualSave } = useAutoSave({
    file,
    saveFunction: saveFile,
    compileFunction: onCompile,
  });

  // Keys
  const editorSourceRref = useTemplateRef("editor-source-ref");
  const onEscape = () =>
    editorSourceRref.value === document.activeElement && editorSourceRref.value.blur();
  const onSaveShortcut = () => manualSave();
  useKeyboardShortcuts({
    escape: onEscape,
    s: onSaveShortcut,
  });
</script>

<template>
  <div class="editor">
    <EditorTopbar v-model="tabIndex" @compile="onCompile" />
    <div class="content">
      <EditorSource
        v-if="tabIndex == 0"
        ref="editor-source-ref"
        v-model="file"
        :save-status="saveStatus"
        @input="onInput"
      />
      <EditorFiles v-if="tabIndex == 1" v-model="file" />
    </div>
  </div>
</template>

<style scoped>
  .editor {
    --toolbar-height: 40px;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--surface-page);
    z-index: 1;
  }

  .content {
    height: calc(100% - 16px);
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 0 8px 8px 8px;
  }
</style>
