<script setup>
  import { ref, watch } from "vue";
  import { IconArrowsSort, IconArrowNarrowDown, IconArrowNarrowUp } from "@tabler/icons-vue";

  const props = defineProps({
    name: { type: String, required: true },
    sortable: { type: Boolean, default: true },
    filterable: { type: Boolean, default: true },
  });
  const emit = defineEmits(["sort", "filter"]);

  // Sortable column: cycle through asc and desc on click
  const sortState = defineModel({ type: String, default: "" });
  const nextSortState = () => {
    if (!props.sortable) return;
    sortState.value = sortState.value == "asc" ? "desc" : "asc";
    emit("sort", sortState.value);
  };

  // Filterable column: watch the tags of the MultiSelectTags and set the icon accordingly
  const tagsSelectedForFilter = ref([]);
  const filterableSVGColor = ref("transparent");
  watch(tagsSelectedForFilter, () => {
    filterableSVGColor.value =
      tagsSelectedForFilter.value.length > 0 ? "var(--extra-dark)" : "transparent";
    emit("filter", tagsSelectedForFilter.value);
  });
</script>

<template>
  <template v-if="sortable">
    <div
      class="col-header"
      :class="[name.toLowerCase().replace(/ /g, '-'), 'sortable']"
      @click.stop="nextSortState"
    >
      <span class="col-header-label text-label">{{ name }}</span>
      <component :is="IconArrowsSort" v-if="!sortState" class="no-sort" />
      <component :is="IconArrowNarrowDown" v-if="sortState == 'desc'" />
      <component :is="IconArrowNarrowUp" v-if="sortState == 'asc'" />
    </div>
  </template>

  <template v-else-if="filterable">
    <div
      class="col-header"
      :class="[name.toLowerCase().replace(' ', '-'), 'filterable']"
      @mouseenter="filterableSVGColor = 'var(--medium)'"
      @mouseleave="filterableSVGColor = 'transparent'"
    >
      <span class="col-header-label text-label">{{ name }}</span>
      <MultiSelectTags v-model="tagsSelectedForFilter" icon="Filter" />
    </div>
  </template>

  <template v-else>
    <div class="col-header" :class="name.toLowerCase().replace(' ', '-')">
      <span class="col-header-label text-label">{{ name }}</span>
    </div>
  </template>
</template>

<style scoped>
  .col-header {
    display: flex;
    align-items: center;
    gap: 4px;
    height: calc(40px -- 2 * var(--border-extrathin));
    color: var(--almost-black);
    background-color: var(--surface-information);
    width: 100%;
    padding-right: 8px;

    &.sortable:hover,
    &.filterable:hover {
      cursor: pointer;
    }

    &.filterable :deep(.cm-btn svg) {
      color: v-bind(filterableSVGColor);
    }
  }

  .col-header .no-sort {
    color: transparent;
  }

  .col-header:hover .no-sort {
    color: var(--medium);
  }
</style>
