<script setup>
  import { ref, computed, reactive, watch, inject, onMounted, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import useClosable from "@/composables/useClosable.js";
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
  const numMatchesDraft = computed(() =>
    searchInfo.isSearching ? searchInfo.matches.length : "0"
  );
  const numMatchesSource = computed(() =>
    searchInfo.isSearching ? searchInfo.sourceMatches.length : "0"
  );
  const currentMatchNumber = computed(
    () => `match ${searchInfo.lastMatchScrolledTo + 1} of ${numMatchesDraft.value}`
  );

  const startSearch = () => {
    searchInfo.matches = highlightSearchMatches(manuscriptRef.value.$el, searchInfo.searchString);
    searchInfo.sourceMatches = highlightSearchMatchesSource(
      file.value.source,
      searchInfo.searchString
    );
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

  useClosable({
    onClose: () => console.log("closing"),
    closeOnEsc: true,
    closeOnOutsideClick: false,
    closeOnCloseButton: true,
  });
</script>

<template>
  <div class="dockable-search">
    <SearchBar
      ref="searchBar"
      :with-buttons="true"
      placeholder="Search this draft..."
      :hint-text="searchInfo.isSearching && currentMatchNumber"
      @submit="onSubmit"
      @next="onNext"
      @prev="onPrev"
      @cancel="cancelSearch"
    >
    </SearchBar>
    <div class="match-counts">
      <div class="match-count">
        <span class="text-caption"> Draft: {{ numMatchesDraft }} matches </span>
      </div>
      <div class="match-count">
        <span class="text-caption" @click="searchInSource = !searchInSource">
          Source: {{ numMatchesSource }} matches
        </span>
      </div>
    </div>
    <ButtonClose />
  </div>
</template>

<style scoped>
  .dockable-search {
    --border-width: var(--border-extrathin);
    background-color: var(--surface-hover);
    outline: var(--border-width) solid var(--blue-300);
    height: 48px;
    width: calc(100% - 32px);
    max-width: 720px;
    margin-inline: auto;
    margin-top: 16px;
    border-radius: 16px;
    display: flex;
    gap: 24px;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-soft);
    padding-right: 8px;
  }

  .match-counts {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 2px;

    & > * {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    & .text-caption {
      color: var(--gray-600);
      font-size: 12px;
      transition: color 0.3s ease;
      text-align: right;
    }
  }

  .match-count {
    text-wrap: nowrap;
  }

  .match-count:has(.checkbox.active) > .text-caption {
    color: var(--almost-black);
  }

  .s-wrapper {
    flex: 1;
    background-color: var(--surface-page) !important;
    width: 360px;
    height: 48px;
    border-width: 1px;
  }
</style>

<style>
  .search-result {
    background-color: var(--secondary-200);
  }
</style>
