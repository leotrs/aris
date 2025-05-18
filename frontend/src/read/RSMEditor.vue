<script setup>
  import { useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  function onInput(e) {
    file.value.source = e.target.value;
  }

  // Keys
  const editorRef = useTemplateRef("editor-ref");
  useKeyboardShortcuts({
    escape: () => editorRef.value === document.activeElement && editorRef.value.blur(),
  });
</script>

<template>
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
</template>

<style scoped>
  textarea.editor {
    position: fixed;
    height: calc(100% - 64px - 16px - 8px - 16px - 8px);
    width: calc((100% - 64px - 16px - 8px - 32px) * 0.5);
    max-width: 720px;
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    padding: 8px;
    margin-inline: 16px 8px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
    box-shadow: inset var(--shadow-strong);
    resize: none;
    cursor: text;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    background-color: var(--surface-page);
    color: var(--text-primary);
  }

  textarea.editor:focus {
    outline-color: var(--border-action);
  }
</style>
