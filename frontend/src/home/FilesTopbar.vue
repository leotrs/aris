<script setup>
  import { ref, inject, computed, watch, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const emit = defineEmits(["list", "cards"]);

  /* View mode segmented control */
  const controlState = ref(0);
  watch(controlState, (newVal) => emit(newVal == 0 ? "list" : "cards"));
  useKeyboardShortcuts({
    "v,l": () => (controlState.value = 0),
    "v,c": () => (controlState.value = 1),
  });

  /* Search */
  const { filterDocs, clearFilterDocs } = inject("userDocs");
  const onSearchSubmit = (searchString) => {
    clearFilterDocs();
    filterDocs((doc) => !doc.title.toLowerCase().includes(searchString.toLowerCase()));
  };
  const searchBar = useTemplateRef("search-bar-ref");
  useKeyboardShortcuts({ "/": () => searchBar.value.focusInput() });

  /* Breakpoints */
  const isMobile = inject("isMobile");
  const segmentedControlIcons = computed(() =>
    isMobile.value ? ["LayoutList", "LayoutCards", "CropPortrait"] : ["LayoutList", "LayoutCards"]
  );
</script>

<template>
  <div class="tb-wrapper" :class="{ mobile: isMobile }">
    <div class="tb-control">
      <SegmentedControl v-model="controlState" :icons="segmentedControlIcons" :default-active="0" />
    </div>
    <div class="tb-search">
      <SearchBar ref="search-bar-ref" @submit="onSearchSubmit" />
    </div>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    column-gap: 48px;
    row-gap: 8px;
    max-width: calc(100% - (100px + 48px));

    &.mobile {
      background-color: var(--extra-light);
    }
  }

  .tb-wrapper .tb-search {
    flex: 1;
  }

  .tb-control {
    align-content: center;
    flex: 0;
  }
</style>
