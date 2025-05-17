<script setup>
  import {} from "vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  function onInput(e) {
    file.value.source = e.target.textContent;
  }
</script>

<template>
  <pre class="editor" contenteditable="true" :textContent="file.source" @input="onInput"></pre>
</template>

<style scoped>
  pre.editor {
    overflow: auto;
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    height: 100%;
    resize: none;
    border: none;
    padding: 16px;
    cursor: text;
    margin-inline: 16px 8px;
    box-shadow: inset var(--shadow-strong);
    border-radius: 8px;
    border: var(--border-extrathin) solid var(--border-primary);
    min-height: 300px;
  }
</style>
