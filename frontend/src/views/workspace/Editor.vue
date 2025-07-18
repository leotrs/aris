<script setup>
  import { ref, inject, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { useAutoSave } from "@/composables/useAutoSave.js";
  import { File } from "@/models/File.js";
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

  // File asset upload
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:mime/type;base64, prefix
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onUpload = async (asset) => {
    console.log("upload", asset);

    try {
      const base64Content = await fileToBase64(asset);

      const payload = {
        filename: asset.name,
        mime_type: asset.type,
        content: base64Content,
        file_id: file.value.id,
      };

      const response = await api.post("/assets", payload);
      const result = response.data;
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error uploading asset:", error);
    }
  };

  // Keys
  const editorSourceRef = useTemplateRef("editor-source-ref");
  const onEscape = () =>
    editorSourceRef.value === document.activeElement && editorSourceRef.value.blur();
  const onSaveShortcut = () => manualSave();
  useKeyboardShortcuts({
    escape: onEscape,
    s: onSaveShortcut,
  });
</script>

<template>
  <div class="editor">
    <EditorTopbar v-model="tabIndex" @compile="onCompile" @upload="onUpload" />
    <div class="content">
      <EditorSource
        v-if="tabIndex === 0"
        ref="editor-source-ref"
        v-model="file"
        :save-status="saveStatus"
        @input="onInput"
      />
      <EditorFiles v-if="tabIndex === 1" v-model="file" />
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
