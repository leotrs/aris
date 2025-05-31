<script setup>
  import { ref, inject, computed, watch, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const emit = defineEmits(["list", "cards"]);

  /* View mode segmented control */
  const controlState = ref(0);
  watch(controlState, (newVal) => emit(newVal == 0 ? "list" : "cards"));

  /* Search */
  const fileStore = inject("fileStore");
  const onSearchSubmit = (searchString) => {
    fileStore.value.clearFilterFiles();
    fileStore.value.filterFiles(
      (file) => !file.title.toLowerCase().includes(searchString.toLowerCase())
    );
  };
  const searchBar = useTemplateRef("search-bar-ref");

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      "v,l": { fn: () => (controlState.value = 0), description: "view as list" },
      "v,c": { fn: () => (controlState.value = 1), description: "view as cards" },
      "/": { fn: () => searchBar.value.focusInput(), description: "search" },
    },
    true,
    "Home view"
  );
</script>

<template>
  <div class="tb-wrapper">
    <!-- <div class="tb-control">
         <SegmentedControl v-model="controlState" :icons="segmentedControlIcons" :default-active="0" />
         </div> -->
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

  .tb-search {
    min-width: 192px;
    max-width: 500px;
  }
</style>
