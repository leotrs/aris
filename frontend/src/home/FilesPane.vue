<script setup>
  import { ref, inject, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import axios from "axios";
  import Topbar from "./FilesTopbar.vue";
  import FilesHeader from "./FilesHeader.vue";
  import FilesItem from "./FilesItem.vue";

  const emit = defineEmits(["set-selected"]);
  const mode = ref("list");
  const { userDocs } = inject("userDocs");
  const numDocs = computed(() => userDocs.value.length);

  /*********** Handlers for child component events ***********/
  const activeIndex = ref(null);
  let clickTimeout = ref(null);
  const selectForPreview = (doc, idx) => {
    activeIndex.value = idx;
    clickTimeout.value = setTimeout(() => emit("set-selected", doc), 200);
  };

  const router = useRouter();
  const openRead = (doc) => {
    clearTimeout(clickTimeout.value);
    router.push(`/${doc.id}/read`);
  };

  /*********** Keyboard shortcuts ***********/
  const nextItemOnKey = (ev) => {
    ev.preventDefault();
    activeIndex.value = activeIndex.value === null ? 0 : (activeIndex.value + 1) % numDocs.value;
  };
  const prevItemOnKey = (ev) => {
    ev.preventDefault();
    activeIndex.value =
      activeIndex.value === null ? 0 : (activeIndex.value + numDocs.value - 1) % numDocs.value;
  };
  useKeyboardShortcuts({
    j: nextItemOnKey,
    J: nextItemOnKey,
    ArrowDown: nextItemOnKey,
    k: prevItemOnKey,
    K: prevItemOnKey,
    ArrowUp: prevItemOnKey,
    escape: (ev) => ev.preventDefault() || (activeIndex.value = null),
  });
</script>

<template>
  <Topbar @list="mode = 'list'" @cards="mode = 'cards'" />

  <div class="files-wrapper" :class="mode">
    <FilesHeader :mode="mode" />

    <Suspense>
      <div class="files" :class="mode">
        <FilesItem
          v-for="(doc, idx) in userDocs.filter((doc) => !doc.filtered)"
          :key="doc"
          :class="{ active: activeIndex == idx }"
          :doc="doc"
          :mode="mode"
          @click="selectForPreview(doc, idx)"
          @dblclick="openRead(doc)"
        />
      </div>

      <template #fallback><div class="loading">loading files...</div></template>
    </Suspense>
  </div>
</template>

<style scoped>
  .files-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
    overflow-y: auto;
    width: 100%;
    padding-inline: 8px;
    height: 100%;
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
    grid-template-columns: minmax(144px, 2fr) minmax(144px, 1.5fr) 1fr 8px 102px 16px 8px;
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
    padding-left: 16px;
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
