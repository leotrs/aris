<script setup>
  const props = defineProps({
    file: { type: Object, required: true },
  });
</script>

<template>
  <span class="file-title">{{ file?.title ?? "" }}</span>
</template>

<style scoped>
  .file-title {
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1;
  }
</style>
