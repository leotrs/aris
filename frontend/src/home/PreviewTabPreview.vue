<script setup>
  const props = defineProps({
    doc: { type: Object, required: true },
  });
</script>

<template>
  <div class="preview">
    <div class="left">
      <Minimap :doc="doc" />
      <Abstract :doc="doc" />
    </div>
    <div class="right">
      <TagRow v-model="doc.tags" :doc-id="doc.id" />
    </div>
  </div>
</template>

<style scoped>
  .preview {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: flex-start;
    position: relative;
  }

  .left {
    display: flex;
    height: 100%;
    width: 100%;
    gap: 16px;
  }

  .right {
    display: flex;
    position: absolute;
    top: 7px;
    right: 0;
    align-items: center;
  }

  :deep(h3) {
    margin-block: 8px;
    border-bottom: var(--border-thin) solid var(--border-information);
  }
</style>
