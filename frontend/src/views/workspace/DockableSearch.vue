<script setup>
  import { ref, computed, reactive, watch, inject, onMounted, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import useClosable from "@/composables/useClosable.js";
  import {
    highlightSearchMatches,
    highlightSearchMatchesSource,
    clearHighlights,
    updateCurrentMatch,
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
  const currentMatchText = computed(() => {
    if (searchInfo.matches.length < 1) return "0 matches";
    return `match ${searchInfo.lastMatchScrolledTo + 1} of ${searchInfo.matches.length}`;
  });
  const simpleMatchText = computed(() => {
    if (!searchInfo.isSearching || searchInfo.matches.length === 0) return "";
    const idx = (searchInfo.lastMatchScrolledTo ?? 0) + 1;
    return `${idx}/${searchInfo.matches.length} document matches`;
  });

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

    // Update current match highlighting
    updateCurrentMatch(searchInfo.matches, scrollTo);
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

    // Update current match highlighting
    updateCurrentMatch(searchInfo.matches, scrollTo);
  };

  const advanced = ref(false);
  const selectScope = ref("both views");
  const selectMode = ref("exact match");
  const replaceMode = computed(() => selectMode.value === "replace");
  const searchBar = useTemplateRef("searchBar");
  const replaceValue = ref("");
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
  <div class="dockable-search" :class="advanced ? 'advanced' : 'simple'">
    <div v-if="!advanced">
      <SearchBar
        ref="searchBar"
        :with-buttons="true"
        placeholder="search term..."
        :show-icon="true"
        :button-close="true"
        @submit="onSubmit"
        @next="onNext"
        @prev="onPrev"
        @cancel="cancelSearch"
      >
        <template #buttons>
          <Button
            kind="tertiary"
            icon="Adjustments"
            text=""
            size="sm"
            @click.stop="advanced = true"
          />
        </template>
      </SearchBar>
      <span v-if="searchInfo.isSearching" class="match-count text-caption">
        {{ simpleMatchText }}
      </span>
    </div>

    <template v-if="advanced">
      <div class="left">
        <div class="top">
          <SearchBar
            ref="searchBar"
            :with-buttons="false"
            placeholder="search term..."
            :show-icon="false"
            @submit="onSubmit"
            @next="onNext"
            @prev="onPrev"
            @cancel="cancelSearch"
          />
          <Button kind="primary" text="" icon="Search" size="sm" class="cta search" />
        </div>
        <div class="bottom">
          <SelectBox v-model="selectScope" :options="['both views', 'text', 'source']" />
          <SelectBox v-model="selectMode" :options="['exact match', 'regex', 'replace']" />
        </div>
      </div>

      <div class="middle">
        <div class="top">
          <template v-if="replaceMode">
            <InputText v-model="replaceValue" class="replace-input" placeholder="replace with..." />
            <Button kind="tertiary" text="" icon="Replace" size="sm" class="cta replace" />
          </template>
        </div>
        <div class="bottom">
          <div class="match-count-row">
            <Button kind="tertiary" text="" icon="ChevronLeft" size="sm" />
            <span class="match-count text-caption">match 133 of 234</span>
            <Button kind="tertiary" text="" icon="ChevronRight" size="sm" />
          </div>
        </div>
      </div>

      <div class="right">
        <ButtonClose />
        <Button
          kind="tertiary"
          text=""
          icon="AdjustmentsOff"
          size="sm"
          class="cta simple"
          @click="advanced = false"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
  .dockable-search {
    --search-input-width: calc(192px + 32px);

    border-radius: 16px;
    display: flex;
    box-shadow: var(--shadow-soft);
    align-items: center;

    &.advanced {
      background-color: var(--surface-hover);
      outline: var(--border-extrathin) solid var(--border-primary);
      padding-inline: 14px 4px;
      padding-block: 6px;
      gap: 16px;
      height: 64px;
      width: fit-content;
      max-width: 720px;
      margin-inline: auto;
      margin-top: 16px;
    }

    &.simple {
      position: fixed;
      top: 0px;
      right: 0px;
      height: 36px;
      width: 288px;
      z-index: 999;
    }
  }

  .left,
  .middle,
  .right {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .right {
    min-width: 32px;
    max-width: 32px;
  }

  .top,
  .bottom {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: max-content;

    & > * {
      height: 24px;
    }
  }

  .select-box {
    border-width: var(--border-extrathin);
    width: calc((var(--search-input-width) - 8px) * 0.5) !important;
    font-size: 14px;
  }

  .input-text {
    border-radius: 8px;
    background: var(--surface-page);
    width: calc(var(--search-input-width) - 48px);

    & :deep(input) {
      border-radius: 8px !important;
      height: 100% !important;
      width: 100%;
    }
  }

  .match-count-row {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: calc(var(--search-input-width) - 48px + 24px + 8px);
    gap: 4px;

    & :deep(.tabler-icon) {
      color: var(--dark) !important;
    }

    & .match-count {
      flex: 1;
      text-wrap: nowrap;
      display: flex;
      justify-content: center;
    }
  }

  .cta.search {
    background: var(--surface-hint) !important;
    border-color: var(--surface-hint) !important;
  }

  .cta.replace :deep(.tabler-icon) {
    color: var(--dark) !important;
  }

  button.tertiary {
    height: 24px;
    width: 24px;
    display: flex;
    justify-content: center;
  }

  :deep(.tabler-icon) {
    margin: 0 !important;
    color: var(--almost-black) !important;
  }

  .dockable-search.simple .s-wrapper {
    height: 36px !important;
    padding-inline: 4px !important;
    gap: 0px;

    & :deep(input) {
      padding-inline: 0 !important;
    }

    & :deep(.btn-close) {
      height: 24px !important;
      width: 24px !important;
      margin-inline: 4px;
      color: var(--dark);
    }

    & :deep(.tabler-icon) {
      height: 24px !important;
      width: 24px !important;
      margin: 0 !important;
      color: var(--dark);
    }

    & :deep(> svg:first-child) {
      margin-right: 8px !important;
    }
  }

  .dockable-search.advanced .s-wrapper {
    flex: 1;
    width: 192px !important;
    width: var(--search-input-width) !important;
    height: 24px;
    border-width: var(--border-extrathin);
    padding-inline: 8px;
    border-radius: 8px;

    & :deep(input) {
      padding-inline: 0 !important;
    }
  }

  .dockable-search.simple .s-wrapper {
    border-radius: 8px;
    padding-inline: 6px 0px !important;
  }

  .btn-close {
  }
</style>

<style>
  .search-result {
    background-color: var(--secondary-200);
  }

  .search-result-current {
    background-color: var(--orange-300);
  }
</style>
