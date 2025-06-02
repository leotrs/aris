<script setup>
  import { ref, watchEffect, computed } from "vue";
  const props = defineProps({
    file: { type: Object, required: true },
    maxTags: { type: Number, default: 3 },
  });

  const selectedTags = ref([]);
  const showAll = ref(false);

  watchEffect(() => {
    selectedTags.value = [...(props.file.tags || [])];
  });

  const visibleTags = computed(() => {
    if (showAll.value || selectedTags.value.length <= props.maxTags) {
      return selectedTags.value;
    }
    return selectedTags.value.slice(0, props.maxTags - 1);
  });

  const hasOverflow = computed(() => {
    return selectedTags.value.length > props.maxTags;
  });

  const overflowCount = computed(() => {
    return selectedTags.value.length - (props.maxTags - 1);
  });

  const toggleShowAll = () => (showAll.value = !showAll.value);
</script>

<template>
  <div class="tag-row">
    <Tag
      v-for="tag in visibleTags.slice(0, -1)"
      :key="tag.name + tag.color"
      :tag="tag"
      :active="true"
    />
    <!-- The last visible tag + overflow indicator + MultiSelectTags wrapped together -->
    <div class="nowrap">
      <!-- Last visible tag -->
      <Tag
        v-if="visibleTags.length > 0"
        :key="visibleTags.at(-1).name"
        :tag="visibleTags.at(-1)"
        :active="true"
      />

      <!-- Overflow indicator -->
      <button
        v-if="hasOverflow && !showAll"
        class="overflow-tag"
        :title="`Show ${overflowCount} more tags`"
        @click.stop="toggleShowAll"
      >
        +{{ overflowCount }} more
      </button>

      <!-- Show less button when expanded -->
      <button
        v-if="hasOverflow && showAll"
        class="overflow-tag show-less"
        title="Show less"
        @click.stop="toggleShowAll"
      >
        show less
      </button>

      <MultiSelectTags v-model="selectedTags" :file="file" />
    </div>
  </div>
</template>

<style scoped>
  .tag-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 8px;
    row-gap: 0px;
  }

  .nowrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .overflow-tag {
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 16px;
    padding: 4px 8px;
    font-size: 12px;
    color: var(--gray-700);
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .overflow-tag:hover {
    background-color: var(--surface-hint);
    border-color: var(--border-action);
    color: var(--almost-black);
  }

  .overflow-tag.show-less {
    color: var(--gray-700);
    font-size: 12px;
  }

  .new-tag {
    &:hover {
      background-color: var(--surface-hint);
    }
  }
</style>
