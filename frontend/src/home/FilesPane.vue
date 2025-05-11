<script setup>
  import { ref, computed, inject, provide, watch, useTemplateRef } from "vue";
  import { useListKeyboardNavigation } from "@/composables/useListKeyboardNavigation.js";
  import Topbar from "./FilesTopbar.vue";
  import FilesHeader from "./FilesHeader.vue";
  import FilesItem from "./FilesItem.vue";

  const props = defineProps({});
  const { userDocs } = inject("userDocs");

  /* Selected file */
  const filesRef = useTemplateRef("files-ref");
  const numDocs = computed(() => userDocs.value?.length || 0);
  const { activeIndex } = useListKeyboardNavigation(numDocs, filesRef, true);
  watch(activeIndex, (newVal) => {
    const currentFocused = userDocs.value.filter((d) => d.focused);
    currentFocused.forEach((d) => (d.focused = false));
    if (newVal === null) return;
    userDocs.value[newVal].focused = true;
  });

  /* Breakpoints */
  const breakpoints = inject("breakpoints");
  const gridTemplateColumns = computed(() => {
    return breakpoints.isGreater("md")
      ? "minmax(144px, 2fr) minmax(144px, 1.5fr) minmax(96px, 1.5fr) 8px 104px 16px 8px"
      : "minmax(144px, 2fr) minmax(96px, 1.5fr) 8px 104px 16px 8px";
  });
  const shouldShowColumn = (columnName, mode) => {
    return true;
  };
  provide("shouldShowColumn", shouldShowColumn);

  /* Mode: list or cards */
  const mode = ref("list");
</script>

<template>
  <div class="pane">
    <Topbar @list="mode = 'list'" @cards="mode = 'cards'" />

    <div class="files-wrapper" :class="mode">
      <FilesHeader :mode="mode" />

      <Suspense>
        <div ref="files-ref" class="files" :class="mode">
          <template v-for="(doc, idx) in userDocs">
            <FilesItem v-if="!doc.filtered" :key="doc" v-model="userDocs[idx]" :mode="mode" />
          </template>
        </div>

        <template #fallback><div class="loading">loading files...</div></template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
  .files-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    padding-bottom: 8px;
  }

  .files.list {
    flex: 1;
  }

  .pane-header.list,
  .files.list {
    overflow-y: auto;
    scrollbar-gutter: stable;
  }

  .pane-header.list,
  .files.list > .item {
    display: grid;
    grid-template-columns:
      minmax(144px, 2fr) minmax(144px, 1.5fr) minmax(48px, 1.25fr)
      8px 104px 16px 8px;
  }

  .pane-header.list > *,
  .files.list .item > * {
    overflow-x: auto;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .pane-header.list > *:first-child,
  .files.list .item > *:first-child {
  }

  .pane-header.list > *:last-child,
  .files.list .item > *:last-child {
    padding-right: 8px;
  }

  .files-wrapper.cards {
  }

  .files.cards {
    padding-top: 16px;
    overflow-y: auto;
    columns: auto 250px;
    column-gap: 16px;

    & > .cards {
      break-inside: avoid;
    }
  }

  .tags {
    display: flex;
    gap: 8px;
  }
</style>
