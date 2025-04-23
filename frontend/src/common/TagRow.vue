<script setup>
  import { ref } from "vue";
  const props = defineProps({
    docId: { type: Number, required: true },
  });
  const tags = defineModel({ type: Array });

  const selectedTags = ref([...tags.value]);
</script>

<template>
  <Tag v-for="tag in tags" :key="tag" :tag="tag" :active="true" />
  <MultiSelectTags v-model="selectedTags" :doc-id="docId" />
</template>

<style scoped>
  .tag-row {
    display: flex;
    align-items: center;
  }

  .tag {
    margin-right: 4px;
    border-radius: 16px;
    padding-inline: 8px;
    padding-block: 4px;
    text-wrap: nowrap;
  }

  .cm-wrapper > :deep(.cm-menu > .item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 8px;
    gap: 8px;
  }

  .new-tag {
    &:hover {
      background-color: var(--surface-hint);
    }
  }
</style>
