<script setup>
  import { reactive, watch, inject, onMounted, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { highlightSearchMatches, clearHighlights } from "./highlightSearchMatches.js";

  const searchInfo = reactive({
    isSearching: false,
    searchString: "",
    matches: [],
    lastMatchScrolledTo: null,
  });

  const startSearch = () => {
    console.log("starting new search");
    searchInfo.matches = highlightSearchMatches(manuscriptRef.value.$el, searchInfo.searchString);
    searchInfo.lastMatchScrolledTo = null;
    onNext();
  };

  const cancelSearch = () => {
    console.log("cancelling search");
    clearHighlights(manuscriptRef.value.$el);
    searchInfo.isSearching = false;
    searchInfo.searchString = "";
    searchInfo.matches = [];
    searchInfo.lastMatchScrolledTo = null;
  };

  watch(
    () => searchInfo.isSearching,
    (newVal) => (newVal ? startSearch() : cancelSearch())
  );

  const manuscriptRef = inject("manuscriptRef");
  const onSubmit = (searchString) => {
    console.log("submit", searchString);
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
    console.log("next", scrollTo);
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
    console.log("prev", scrollTo);
    searchInfo.matches[scrollTo].mark.scrollIntoView({ behavior: "smooth", block: "center" });
    searchInfo.lastMatchScrolledTo = scrollTo;
  };

  const searchBar = useTemplateRef("searchBar");
  onMounted(() => searchBar.value?.focusInput());

  useKeyboardShortcuts({ "/": () => searchBar.value?.focusInput() });
</script>

<template>
  <SearchBar
    ref="searchBar"
    :with-buttons="true"
    :buttons-disabled="!searchInfo.isSearching"
    @submit="onSubmit"
    @next="onNext"
    @prev="onPrev"
    @cancel="cancelSearch"
  />
</template>

<style>
  .search-result {
    background-color: var(--secondary-200);
  }
</style>
