<script setup>
  import { inject, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { IconCheck } from "@tabler/icons-vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  const api = inject("api");
  const onCompile = async () => {
    const response = await api.post("render", { source: file.value.source });
    file.value.html = response.data;
  };

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
  <div class="editor-wrapper text-mono">
    <div class="toolbar">
      <div class="left">
        <!-- <Button kind="tertiary" size="sm" icon="Files" /> -->
        <Button kind="tertiary" size="sm" icon="Heading" />
        <Button kind="tertiary" size="sm" icon="Bold" />
        <Button kind="tertiary" size="sm" icon="Italic" />
        <Button kind="tertiary" size="sm" icon="List" />
        <Button kind="tertiary" size="sm" icon="ListNumbers" />
        <Button kind="tertiary" size="sm" icon="Math" />
        <Button kind="tertiary" size="sm" icon="Photo" />
        <Button kind="tertiary" size="sm" icon="Table" />
        <Button kind="tertiary" size="sm" icon="Quote" />
      </div>
      <div class="right">
        <Button kind="primary" size="sm" text="compile" class="cta" @click="onCompile" />
      </div>
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
    <div class="echo">
      <div class="left"><span>1.3 > Figure 1.1</span></div>
      <div class="right"><IconCheck /></div>
    </div>
  </div>
</template>

<style scoped>
  .editor-wrapper {
    --toolbar-height: 48px;

    display: flex;
    flex-direction: column;
    height: calc(100% - 16px);
    margin-inline: 16px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
    background-color: var(--surface-page);
  }

  .editor-wrapper:has(> textarea.editor:focus) {
    border-color: var(--border-action);
  }

  .toolbar {
    flex: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    min-height: var(--toolbar-height);
    max-height: calc(var(--toolbar-height) * 2 + 8px);
    border-radius: 8px 8px 0 0;
    padding: 8px;
    background-color: var(--surface-hover);
  }

  .toolbar > .left {
    display: flex;
  }

  .toolbar > .right {
    display: flex;
  }

  .toolbar > .left :deep(.sc-btn) {
    padding: 0;
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

  .echo {
    flex: 0;
    border-top: var(--border-extrathin) solid var(--border-primary);
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-block: 2px;
    padding-inline: 8px;
  }

  .echo > :is(.left, .right) {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: var(--dark);
  }

  .echo > .left {
    flex: 1;
  }

  .echo > .right {
    flex: 0;
  }

  .echo > .right :deep(svg) {
    color: var(--success-500);
    margin: 0;
  }
</style>
