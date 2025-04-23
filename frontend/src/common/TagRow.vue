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
  }

  .nowrap {
    display: flex;
    align-items: center;
  }

  .new-tag {
    &:hover {
      background-color: var(--surface-hint);
    }
  }
</style>
