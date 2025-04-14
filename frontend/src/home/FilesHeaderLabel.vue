<script setup>
import { ref, computed, watch } from "vue";
import { IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-vue";

const props = defineProps({
  name: { type: String, required: true },
  sortable: { type: Boolean, default: true },
  filterable: { type: Boolean, default: true },
});
const emit = defineEmits(["sort", "filter"]);

// Sortable column: cycle through asc and desc on click
const sortState = defineModel({ default: null });
const nextSortState = () => {
  if (!props.sortable) return;
  sortState.value = sortState.value == "asc" ? "desc" : "asc";
  emit("sort", sortState.value);
};

// Filterable column: watch the tags of the MultiSelectTags and set the icon accordingly
const tagsSelectedForFilter = ref([]);
const filterableSVGColor = computed(() =>
  tagsSelectedForFilter.value.length > 0 ? "var(--extra-dark)" : "var(--light)",
);
watch(tagsSelectedForFilter, () => emit("filter", tagsSelectedForFilter.value));
</script>

<template>
  <template v-if="sortable">
    <div
      class="col-header"
      :class="[name.toLowerCase().replace(/ /g, '-'), 'sortable']"
      @click.stop="nextSortState"
    >
      <span>{{ name }}</span>
      <span v-if="sortState == 'desc'"><IconSortDescendingLetters /></span>
      <span v-if="sortState == 'asc'"><IconSortAscendingLetters /></span>
    </div>
  </template>

  <template v-else-if="filterable">
    <div
      class="col-header"
      :class="[name.toLowerCase().replace(' ', '-'), 'filterable']"
    >
      <span>{{ name }}</span>
      <span><MultiSelectTags v-model="tagsSelectedForFilter" icon="Filter" /></span>
    </div>
  </template>

  <template v-else>
    <div class="col-header" :class="name.toLowerCase().replace(' ', '-')">
      <span>{{ name }}</span>
    </div>
  </template>
</template>

<style scoped>
.col-header {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  height: 40px;
  color: var(--almost-black);
  background-color: var(--surface-information);

  &.sortable:hover {
    cursor: pointer;
  }

  &.filterable :deep(svg.cm-btn) {
    color: v-bind(filterableSVGColor);
  }
}

.col-header:hover {
  background-color: var(--gray-50);
  align-items: center;
}
</style>
