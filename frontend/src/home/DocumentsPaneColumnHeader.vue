<script setup>
import { ref, computed, inject, watch } from "vue";
import { IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-vue";
import TagManagementMenu from "./TagManagementMenu.vue";

const props = defineProps({
  name: { type: String, required: true },
  sortable: { type: Boolean, default: true },
  filterable: { type: Boolean, default: true },
});
const state = defineModel();
const emit = defineEmits(["sort", "filter"]);
const tags = ref([]);
const filterableSVGColor = computed(() =>
  tags.value.length > 0 ? "var(--extra-dark)" : "var(--light)",
);

const nextSortableState = () => {
  if (!props.sortable) return;
  state.value = state.value == "asc" ? "desc" : "asc";
  emit("sort", state.value);
};

const { filterDocs } = inject("userDocs");
watch(tags, () => {
  console.log("tags changed");
  return filterDocs((doc) => {
    const selectedTagIds = tags.value.map((t) => t.id);
    const docTagIds = doc.tags.map((t) => t.id);
    return selectedTagIds.filter((id) => docTagIds.includes(id));
  });
});
</script>

<template>
  <template v-if="sortable">
    <div
      class="col-header"
      :class="[name.toLowerCase().replace(' ', '-'), 'sortable']"
      @click.stop="nextSortableState"
    >
      <span>{{ name }}</span>
      <span v-if="state == 'desc'"><IconSortDescendingLetters /></span>
      <span v-if="state == 'asc'"><IconSortAscendingLetters /></span>
    </div>
  </template>

  <template v-else-if="filterable">
    <div
      class="col-header"
      :class="[name.toLowerCase().replace(' ', '-'), 'filterable']"
    >
      <span>{{ name }}</span>
      <span><TagManagementMenu v-model="tags" icon="Filter" /></span>
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
