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
  <div class="editor-wrapper">
    <div class="toolbar">
      <Button kind="primary" text="compile" class="cta" />
    </div>
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
  </div>
</template>

<style scoped>
  .editor-wrapper {
    --toolbar-height: 48px;

    height: calc(100% - 16px);
    margin-inline: 16px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
    box-shadow: inset var(--shadow-strong);
    background-color: var(--surface-page);
  }

  .editor-wrapper:has(> textarea.editor:focus) {
    border-color: var(--border-action);
  }

  .toolbar {
    display: flex;
    height: var(--toolbar-height);
    border-radius: 8px 8px 0 0;
    padding: 8px;
    background-color: var(--surface-hover);
    box-shadow: var(--shadow-strong);
  }

  button.cta {
    padding-inline: 16px;
  }

  textarea.editor {
    height: calc(100% - var(--toolbar-height));
    width: 100%;
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    padding: 8px;
    border: none;
    border-radius: 8px;
    resize: none;
    cursor: text;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    background-color: transparent;
    color: var(--text-primary);
    border-radius: 0 0 16px 16px;
  }

  textarea.editor:focus {
    outline: none;
  }
</style>
