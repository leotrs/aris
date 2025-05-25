<script setup>
  import { ref } from "vue";
  const props = defineProps({
    file: { type: Object, required: true },
  });
  const tags = defineModel({ type: Array });

  const selectedTags = ref([...(tags.value || [])]);
</script>

<template>
  <div class="tag-row">
    <!-- wrap the last element in a div together with MultiSelectTags so if the row needs to wrap, the MultiSelect is never alone on the second row -->
    <template v-if="tags && tags.length > 1">
      <Tag v-for="tag in tags.slice(0, -1)" :key="tag" :tag="tag" :active="true" />
    </template>
    <div class="nowrap">
      <Tag
        v-if="tags && tags.length > 0"
        :key="tags.at(-1) ?? {}"
        :tag="tags.at(-1) ?? {}"
        :active="true"
      />
      <MultiSelectTags v-model="selectedTags" :file="file" />
    </div>
  </div>
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
