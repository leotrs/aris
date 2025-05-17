<script setup>
  import {} from "vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });
</script>

<template>
  <div class="editor">
    <div class="source">
      <pre>{{ file.source }}</pre>
    </div>
  </div>
</template>

<style scoped>
  .editor {
    border: var(--border-extrathin) solid var(--border-primary);
    min-height: 300px;
    box-shadow: inset var(--shadow-strong);
    border-radius: 8px;
    padding: 16px;
    cursor: text;
    margin-inline: 16px 8px;
  }

  .source {
    overflow: auto;
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
  }
</style>
