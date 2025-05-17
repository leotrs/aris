<script setup>
  import {} from "vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });
</script>

<template>
  <div class="editor">
    <div class="source">this is the content</div>
  </div>
</template>

<style scoped>
  .editor {
    border: var(--border-extrathin) solid var(--border-primary);
    min-height: 300px;
    box-shadow: inset var(--shadow-strong);
    border-radius: 16px;
    padding: 16px;
    cursor: text;
    margin-inline: 8px;
  }
</style>
