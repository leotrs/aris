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

const nextState = () => {
  if (props.sortable) {
    state.value = state.value == "asc" ? "desc" : "asc";
    emit("sort", state.value);
  } else if (props.filterable) {
    console.log("nope");
  }
};

const { filterDocs } = inject("userDocs");
watch(tags, () =>
  filterDocs((doc) => {
    const selectedTagIds = tags.value.map((t) => t.id);
    const docTagIds = doc.tags.map((t) => t.id);
    return selectedTagIds.filter((id) => docTagIds.includes(id));
  }),
);
</script>

<template>
  <div
    class="col-header"
    :class="[name.toLowerCase().replace(' ', '-'), { sortable: sortable, filterable: filterable }]"
    @click.stop="nextState"
  >
    <span>{{ name }}</span>
    <span v-if="sortable && state == 'desc'"><IconSortDescendingLetters /></span>
    <span v-if="sortable && state == 'asc'"><IconSortAscendingLetters /></span>
    <span v-if="filterable"><TagManagementMenu v-model="tags" icon="Filter" /></span>
  </div>
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
