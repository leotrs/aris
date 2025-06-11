<script setup>
  import { ref, computed, reactive, watch, inject, onMounted, useTemplateRef } from "vue";
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
  const numMatchesText = computed(() => {
    if (!searchInfo.isSearching) return "0";
    const numMatches = searchInfo.matches.length;
    if (numMatches == 0) return "0";
    const text = `${searchInfo.lastMatchScrolledTo + 1}/${numMatches}`;
    return text;
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

  const searchInDraft = ref(true);
  const searchInSource = ref(false);
</script>

<template>
  <div class="dockable-search">
    <SearchBar
      ref="searchBar"
      :with-buttons="true"
      placeholder="Search this draft..."
      @submit="onSubmit"
      @next="onNext"
      @prev="onPrev"
      @cancel="cancelSearch"
    >
    </SearchBar>
    <div class="match-counts">
      <div class="match-count" @click.stop="searchInDraft = !searchInDraft">
        <Checkbox v-model="searchInDraft" text="draft" icon="File" />
        <span class="text-caption"> {{ numMatchesText }} matches </span>
      </div>
      <div class="match-count" @click.stop="searchInSource = !searchInSource">
        <Checkbox v-model="searchInSource" text="source" icon="Code" />
        <span class="text-caption" @click="s"> {{ numMatchesText }} matches </span>
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
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;

    & > * {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    & .btn-toggle {
      border-radius: 8px;
      width: 96px;
      height: 24px;
      font-size: 11px;
    }

    & .text-caption {
      color: var(--text-disabled);
      font-size: 12px;
      transition: color 0.3s ease;
      width: 80px;
      text-align: right;
    }

    & .checkbox {
      width: 80px;
    }

    & .checkbox > :deep(.text) {
      font-size: 14px;
    }
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
