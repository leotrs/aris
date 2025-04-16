<script setup>
  const props = defineProps({
    doc: { type: Object, required: true },
  });
</script>

<template>
  <span class="file-title">{{ doc?.title ?? "" }}</span>
</template>

<style scoped>
  .file-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
