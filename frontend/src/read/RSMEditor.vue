<script setup>
  import { inject, useTemplateRef, ref, onMounted, onBeforeUnmount } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import {
    IconFiles,
    IconCode,
    IconCheck,
    IconClock,
    IconDeviceFloppy,
    IconX,
  } from "@tabler/icons-vue";
  import { File } from "../File.js";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });
  const user = inject("user");
  const api = inject("api");

  // Auto-save related variables
  const saveStatus = ref("idle");
  const lastSaved = ref(Date.now());
  const debounceTimeout = ref(null);
  const autoSaveInterval = 30000;

  const onCompile = async () => {
    const response = await api.post("render", { source: file.value.source });
    file.value.html = response.data;
  };

  function onInput(e) {
    file.value.source = e.target.value;
    saveStatus.value = "pending";
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(() => saveFile(), 2000);
  }

  async function saveFile() {
    if (!file.value?.source) return;

    try {
      saveStatus.value = "saving";
      await File.save(file.value, api, user);
      lastSaved.value = Date.now();
      saveStatus.value = "saved";

      setTimeout(() => {
        if (saveStatus.value === "saved") {
          saveStatus.value = "idle";
        }
      }, 3000);
    } catch (error) {
      console.error("Error saving file:", error);
      saveStatus.value = "error";
      setTimeout(() => {
        if (saveStatus.value === "error") {
          saveStatus.value = "pending";
        }
      }, 5000);
    }
  }

  // Keys
  const onSaveShortcut = () => {
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = null;
    }
    saveFile();
  };
  const onEscape = () => {
    editorRef.value === document.activeElement && editorRef.value.blur();
  };

  const editorRef = useTemplateRef("editor-ref");
  useKeyboardShortcuts({
    escape: onEscape,
    s: onSaveShortcut,
  });

  // Set up auto-save interval
  let autoSaveTimer;
  onMounted(() => {
    autoSaveTimer = setInterval(() => {
      if (
        saveStatus.value === "pending" ||
        (Date.now() - lastSaved.value >= autoSaveInterval && file.value?.source)
      ) {
        saveFile();
      }
    }, autoSaveInterval);
  });

  onBeforeUnmount(() => {
    clearInterval(autoSaveTimer);
    clearTimeout(debounceTimeout.value);
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
    <div class="statusbar">
      <div class="left"><IconFiles /></div>
      <div class="middle"><IconCode /><span>main.rsm > 1.3 > Figure 1.1</span></div>
      <div class="right">
        <IconClock v-if="saveStatus === 'pending'" class="icon-pending" />
        <IconDeviceFloppy v-if="saveStatus === 'saving'" class="icon-saving" />
        <IconCheck
          v-if="saveStatus === 'saved' || saveStatus === 'idle'"
          :class="{ 'icon-idle': saveStatus === 'idle', 'icon-saved': saveStatus === 'saved' }"
        />
        <IconX v-if="saveStatus === 'error'" class="icon-error" />
      </div>
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

  .statusbar {
    flex: 0;
    border-top: var(--border-extrathin) solid var(--border-primary);
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-inline: 8px;
  }

  .statusbar > * {
    font-size: 12px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: var(--dark);
    padding-block: 2px;
  }

  .statusbar > .left {
    padding-right: 8px;
  }

  .statusbar > :is(.left, .middle) > :deep(svg) {
    color: var(--dark);
  }

  .statusbar > .middle > :deep(svg) {
    margin-right: 4px;
  }

  .statusbar > .middle {
    flex: 1;
  }

  .statusbar > .middle:hover {
    background-color: var(--surface-hint);
  }

  .statusbar > :is(.left, .right) {
    flex: 0;
  }

  .statusbar > * > :deep(svg) {
    margin: 0;
    transition: color 0.3s ease;
  }

  .icon-idle {
    color: var(--text-tertiary);
    opacity: 0.5;
  }

  .icon-pending {
    color: var(--warning-500);
  }

  .icon-saving {
    color: var(--primary-500);
  }

  .icon-saved {
    color: var(--success-500);
  }

  .icon-error {
    color: var(--error-500);
  }
</style>
