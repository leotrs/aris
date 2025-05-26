<script setup>
  import { inject, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { useAutoSave } from "@/composables/useAutoSave.js";
  import { File } from "../File.js";
  import Toolbar from "./EditorToolbar.vue";
  import StatusBar from "./EditorStatusBar.vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });
  const editorRef = useTemplateRef("editor-ref");
  const api = inject("api");

  // Toolbar functions
  const onInsert = (text) => {
    if (!editorRef.value) return;
    console.log("insert", text);
    const textarea = editorRef.value;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + text + after;

    const cursor = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = cursor;
    textarea.focus();
  };
  const onCompile = async () => {
    const response = await api.post("render", { source: file.value.source });
    file.value.html = response.data;
  };

  // File saving
  const saveFile = async (fileToSave) => {
    await File.update(fileToSave, { source: file.value.source });
  };
  const { saveStatus, onInput, manualSave } = useAutoSave({
    file,
    saveFunction: saveFile,
    compileFunction: onCompile,
  });

  // Keys
  const onEscape = () => editorRef.value === document.activeElement && editorRef.value.blur();
  const onSaveShortcut = () => manualSave();
  useKeyboardShortcuts({
    escape: onEscape,
    s: onSaveShortcut,
  });
</script>

<template>
  <div class="editor-wrapper text-mono">
    <Toolbar @compile="onCompile" @insert="onInsert" />

    <textarea
      ref="editor-ref"
      class="editor"
      :value="file.source"
      spellcheck="false"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      @input="onInput"
    ></textarea>
    <StatusBar :save-status="saveStatus" />
  </div>
</template>

<style scoped>
  .editor-wrapper {
    --toolbar-height: 48px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 16px);
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 0 8px 8px 8px;
    background-color: var(--surface-page);
  }

  .editor-wrapper:has(> textarea.editor:focus) {
    border-color: var(--border-action);
  }

  button.primary.cta {
    padding-inline: 8px;
  }

  textarea.editor {
    font-family: "Source Code Pro", monospace;
    box-shadow: inset var(--shadow-strong);
    flex: 1;
    width: 100%;
    font-size: 14px;
    padding: 8px;
    border: none;
    resize: none;
    cursor: text;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    background-color: transparent;
    color: var(--text-primary);
  }

  textarea.editor:focus {
    outline: none;
  }
</style>
