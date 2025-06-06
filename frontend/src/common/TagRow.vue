<script setup>
  import { ref, watchEffect, computed } from "vue";

  const props = defineProps({
    file: { type: Object, required: true },
    maxTags: { type: Number, default: 3 },
  });

  const selectedTags = ref([]);
  const showAll = ref(false);

  // Use a more stable way to sync tags
  watchEffect(() => {
    const fileTags = props.file.tags || [];
    // Only update if the tags have actually changed (by id)
    const currentIds = selectedTags.value.map((t) => t.id).sort();
    const newIds = fileTags.map((t) => t.id).sort();

    if (JSON.stringify(currentIds) !== JSON.stringify(newIds)) {
      selectedTags.value = [...fileTags];
    }
  });

  const visibleTags = computed(() => {
    if (showAll.value || selectedTags.value.length <= props.maxTags) {
      return selectedTags.value;
    }
    return selectedTags.value.slice(0, props.maxTags);
  });

  const hasOverflow = computed(() => {
    return selectedTags.value.length > props.maxTags;
  });

  const overflowCount = computed(() => {
    return selectedTags.value.length - props.maxTags;
  });

  const toggleShowAll = () => (showAll.value = !showAll.value);
</script>

<template>
  <div class="tag-row">
    <!-- Always use tag.id as key for consistency -->
    <Tag v-for="tag in visibleTags" :key="tag.id" :tag="tag" :active="true" />

    <!-- Overflow controls in a separate container -->
    <div class="controls">
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

      <!-- Tag selector always at the end -->
      <MultiSelectTags v-model="selectedTags" :file="file" />
    </div>
  </div>
</template>

<style scoped>
  .tag-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .controls {
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
    flex-shrink: 0;
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
</style>
