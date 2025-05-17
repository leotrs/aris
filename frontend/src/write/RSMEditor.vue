<script setup>
  import { useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  function onInput(e) {
    file.value.source = e.target.textContent;
  }

  // Keys
  const editorRef = useTemplateRef("editor-ref");
  useKeyboardShortcuts({
    escape: () => editorRef.value === document.activeElement && editorRef.value.blur(),
  });
</script>

<template>
  <pre
    ref="editor-ref"
    class="editor"
    contenteditable="true"
    :textContent="file.source"
    @input="onInput"
  ></pre>
</template>

<style scoped>
  pre.editor {
    position: fixed;
    height: calc(100% - 64px - 16px - 8px - 16px - 8px);
    width: calc((100% - 64px - 16px - 8px - 32px) * 0.5);
    max-width: 720px;
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    overflow: auto;
    padding: 8px;
    margin-inline: 16px 8px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
    box-shadow: inset var(--shadow-strong);
    resize: none;
    cursor: text;
    scrollbar-gutter: stable;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  pre.editor:focus {
    outline-color: var(--border-action);
  }
</style>
