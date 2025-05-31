<script setup>
  import { ref, toRef, computed, inject, provide, watch, useTemplateRef, onMounted } from "vue";
  import { useListKeyboardNavigation } from "@/composables/useListKeyboardNavigation.js";
  import Topbar from "./FilesTopbar.vue";
  import FilesHeader from "./FilesHeader.vue";
  import FilesItem from "./FilesItem.vue";

  const props = defineProps({});
  const fileStore = inject("fileStore");

  /* Selected file */
  const filesRef = useTemplateRef("files-ref");
  const numFiles = computed(() => fileStore.value?.numFiles?.value ?? 0);
  const { activeIndex } = useListKeyboardNavigation(numFiles, filesRef, true);
  watch(activeIndex, (newVal) => {
    const currentFocused = fileStore.value.files.filter((d) => d.focused);
    currentFocused.forEach((d) => (d.focused = false));
    if (newVal === null) return;
    fileStore.value.files.value[newVal].focused = true;
  });

  /* Breakpoints */
  const xsMode = inject("xsMode");
  const gridTemplateColumns = computed(() => {
    return xsMode.value
      ? "minmax(144px, 2fr) 104px 16px 8px"
      : "minmax(144px, 2fr) minmax(96px, 1.5fr) 8px 104px 16px 8px";
  });
  const shouldShowColumn = (columnName, mode) => {
    if (["Spacer"].includes(columnName) && xsMode.value) return false;
    return true;
  };
  provide("shouldShowColumn", shouldShowColumn);

  /* Mode: list or cards */
  const mode = ref("list");
</script>

<template>
  <Pane :custom-header="true">
    <template #header>
      <Topbar @list="mode = 'list'" @cards="mode = 'cards'" />
    </template>

    <div class="files-wrapper" :class="mode">
      <FilesHeader :mode="mode" />

      <Suspense>
        <div ref="files-ref" class="files" :class="mode">
          <template v-for="(file, idx) in fileStore?.files">
            <FilesItem
              v-if="!file.filtered"
              :key="file"
              v-model="fileStore.files[idx]"
              :mode="mode"
            />
          </template>
        </div>

        <template #fallback><div class="loading">loading files...</div></template>
      </Suspense>
    </div>
  </Pane>
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
    /* grid-template-columns: minmax(144px, 2fr) minmax(48px, 1.25fr) 8px 104px 16px 8px; */
    grid-template-columns: v-bind("gridTemplateColumns");
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
