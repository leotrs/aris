<script setup>
  import { ref, watchEffect } from "vue";
  const props = defineProps({
    file: { type: Object, required: true },
  });

  const selectedTags = ref([]);
  watchEffect(() => {
    selectedTags.value = [...(props.file.tags || [])];
  });
</script>

<template>
  <div class="tag-row">
    <Tag v-for="tag in selectedTags.slice(0, -1)" :key="tag" :tag="tag" :active="true" />
    <!-- the last tag is wrapped in a div together with MultiSelectTags so if the row needs to wrap, the MultiSelect is never alone on the second row -->
    <div class="nowrap">
      <Tag
        v-if="selectedTags.length > 0"
        :key="selectedTags.at(-1) ?? {}"
        :tag="selectedTags.at(-1) ?? {}"
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
