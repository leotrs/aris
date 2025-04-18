<script setup>
import { ref } from "vue";
const props = defineProps({
  docID: { type: Number, required: true },
});
const tags = defineModel();

const selectedTags = ref([...tags.value]);
</script>

<template>
  <Tag v-for="tag in tags" :tag="tag" :active="true" />
  <MultiSelectTags v-model="selectedTags" :docID="docID" />
</template>

<style scoped>
.pill {
  margin-right: 4px;
  border-radius: 16px;
  padding-inline: 8px;
  padding-block: 4px;
  text-wrap: nowrap;
}

.cm-wrapper> :deep(.cm-click-target > .cm-btn) {
  color: var(--light);
}

.cm-wrapper> :deep(.cm-menu) {
  right: 0;
  transform: translateX(0) translateY(32px);
}

.cm-wrapper> :deep(.cm-menu > .item) {
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
