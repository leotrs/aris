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
  const currentMatchText = computed(() => {
    if (searchInfo.matches.length < 1) return "0 matches";
    return `match ${searchInfo.lastMatchScrolledTo + 1} of ${searchInfo.matches.length}`;
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

  const advanced = ref(false);
  const selectScope = ref("both views");
  const selectMode = ref("exact match");
  const searchBar = useTemplateRef("searchBar");
  const replaceValue = ref("replace with...");
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
          <InputText v-model="replaceValue" />
        </div>
        <div class="bottom">
          <div class="match-count-row">
            <Button kind="tertiary" text="" icon="ChevronLeft" size="sm" />
            <span class="match-count text-caption">{{ currentMatchText }}</span>
            <Button kind="tertiary" text="" icon="ChevronRight" size="sm" />
          </div>
          <Button kind="tertiary" text="" icon="Replace" size="sm" class="cta replace" />
        </div>
      </div>
      <div class="right">
        <ButtonClose />
      </div>
    </template>
  </div>
</template>

<style scoped>
  .dockable-search {
    border-radius: 16px;
    display: flex;
    box-shadow: var(--shadow-soft);
    align-items: center;

    &.advanced {
      background-color: var(--surface-hover);
      outline: var(--border-extrathin) solid var(--border-primary);
      padding-inline: 14px;
      padding-block: 6px;
      gap: 16px;
      height: 64px;
      width: 472px;
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

  .left {
    min-width: 212px;
    max-width: 212px;
  }

  .middle {
    min-width: 180px;
    max-width: 180px;
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
    width: 108px !important;
    font-size: 14px;
  }

  .input-text {
    border-radius: 8px;
    background: var(--surface-page);
    height: 24px !important;
    width: 180px;

    & :deep(input) {
      border-radius: 8px !important;
      height: 100% !important;
      width: 180px !important;
    }
  }

  .match-count-row {
    flex: 1;
    display: flex;
    width: fit-content;
    align-items: center;
    & :deep(.tabler-icon) {
      color: var(--dark) !important;
    }
  }

  .match-count {
    flex: 1;
    text-wrap: nowrap;
  }

  .cta.search {
    background: var(--surface-hint) !important;
    border-color: var(--surface-hint) !important;
  }

  .cta.replace :deep(.tabler-icon) {
    color: var(--dark) !important;
  }

  .cta :deep(.tabler-icon) {
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
    width: 184px !important;
    height: 24px;
    border-width: 1px;
    padding-inline: 8px;
    border-radius: 8px;

    & :deep(input) {
      width: 184px !important;
      padding-inline: 0 !important;
    }
  }

  .btn-close {
  }
</style>

<style>
  .search-result {
    background-color: var(--secondary-200);
  }
</style>
