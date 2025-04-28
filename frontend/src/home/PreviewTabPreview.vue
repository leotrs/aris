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
      <span class="last-edit">{{ doc.last_edited_at }}</span>
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
    top: 17px;
    right: 0;
    align-items: center;
    gap: 48px;
  }

  .tag-row {
  }

  :deep(h3) {
    border-bottom: var(--border-thin) solid var(--border-information);
  }
</style>
