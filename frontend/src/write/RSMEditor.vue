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
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    height: 100%;
    min-height: 300px;
    overflow: auto;
    padding: 16px;
    margin-inline: 16px 8px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
    box-shadow: inset var(--shadow-strong);
    resize: none;
    cursor: text;
  }

  pre.editor:focus {
    outline-color: var(--border-action);
  }
</style>
