<script setup>
  import { reactive, watch, inject, onMounted, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import {
    highlightSearchMatches,
    highlightSearchMatchesSource,
    clearHighlights,
  } from "@/utils/highlightSearchMatches.js";

  const props = defineProps({});
  const manuscriptRef = inject("manuscriptRef");
  const file = inject("file");

  const searchInfo = reactive({
    isSearching: false,
    searchString: "",
    matches: [],
    sourceMatches: [],
    lastMatchScrolledTo: null,
  });

  const startSearch = () => {
    searchInfo.matches = highlightSearchMatches(manuscriptRef.value.$el, searchInfo.searchString);
    searchInfo.sourceMatches = highlightSearchMatchesSource(
      file.value.source,
      searchInfo.searchString
    );
    console.log(searchInfo.sourceMatches);
    searchInfo.lastMatchScrolledTo = null;
    onNext();
  };

  const cancelSearch = () => {
    clearHighlights(manuscriptRef.value.$el);
    searchInfo.isSearching = false;
    searchInfo.searchString = "";
    searchInfo.matches = [];
    searchInfo.sourceMatches = [];
    searchInfo.lastMatchScrolledTo = null;
  };

  watch(
    () => searchInfo.isSearching,
    (newVal) => (newVal ? startSearch() : cancelSearch())
  );

  const onSubmit = (searchString) => {
    if (!manuscriptRef.value) return;
    searchInfo.searchString = searchString.trim();
    // set the flag and let the watcher above handle the rest
    searchInfo.isSearching = searchInfo.searchString !== "";
  };

  const onNext = () => {
    if (!searchInfo.isSearching) return;
    const lastMatchScrolledTo =
      searchInfo.lastMatchScrolledTo === null ? -1 : searchInfo.lastMatchScrolledTo;
    const scrollTo = (lastMatchScrolledTo + 1) % searchInfo.matches.length;
    searchInfo.matches[scrollTo].mark.scrollIntoView({ behavior: "smooth", block: "center" });
    searchInfo.lastMatchScrolledTo = scrollTo;
  };

  const onPrev = () => {
    if (!searchInfo.isSearching) return;
    const lastMatchScrolledTo =
      searchInfo.lastMatchScrolledTo === null
        ? searchInfo.matches.length + 1
        : searchInfo.lastMatchScrolledTo;
    const scrollTo =
      (lastMatchScrolledTo - 1 + searchInfo.matches.length) % searchInfo.matches.length;
    searchInfo.matches[scrollTo].mark.scrollIntoView({ behavior: "smooth", block: "center" });
    searchInfo.lastMatchScrolledTo = scrollTo;
  };

  const searchBar = useTemplateRef("searchBar");
  onMounted(() => searchBar.value?.focusInput());
  useKeyboardShortcuts({ "/": () => searchBar.value?.focusInput() });
</script>

<template>
  <div class="dockable-search">
    <div class="match-count source">
      <span class="text-caption">0 source matches</span>
    </div>
    <SearchBar
      ref="searchBar"
      :with-buttons="true"
      :buttons-disabled="!searchInfo.isSearching"
      @submit="onSubmit"
      @next="onNext"
      @prev="onPrev"
      @cancel="cancelSearch"
    >
      <template #buttons>
        <!-- <ButtonToggle icon="File" />
           <ButtonToggle icon="Code" /> -->
        <!-- <ButtonToggle icon="Regex" /> -->
      </template>
    </SearchBar>
    <div class="match-count file">
      <span class="text-caption">0 text matches</span>
    </div>
    <ButtonClose />
  </div>
</template>

<style scoped>
  .dockable-search {
    background-color: var(--surface-hover);
    border: var(--border-extrathin) solid var(--border-action);
    height: calc(64px + 1px);
    width: 100%;
    position: sticky;
    right: 8px;
    /* right: 8px;
       left: 64px; */
    border-radius: 16px;
    z-index: 998;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 16px;
    box-shadow: var(--shadow-soft);
  }

  .match-count {
    height: 100%;
    display: flex;
    align-items: flex-end;
    padding-block: 8px;
  }

  .s-wrapper {
    background-color: var(--surface-page) !important;
  }
</style>

<style>
  .search-result {
    background-color: var(--secondary-200);
  }
</style>
