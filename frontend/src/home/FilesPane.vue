<script setup>
  import { ref, inject, provide, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import axios from "axios";
  import Topbar from "./FilesTopbar.vue";
  import FilesHeader from "./FilesHeader.vue";
  import FilesItem from "./FilesItem.vue";

  const emit = defineEmits(["set-selected"]);
  const mode = ref("list");
  const numDocs = computed(() => userDocs.value.length);
  const user = inject("user");

  /*********** Proivde userDocs ***********/
  const userDocs = ref([]);
  const reloadDocs = async (docID) => {
    try {
      const response = await axios.get(`http://localhost:8000/users/${user.id}/documents`);
      if (!userDocs.value) {
        userDocs.value = response.data.map((doc) => ({ ...doc, filtered: false }));
      } else {
        /* FIX ME: take the filtered value from the current userDocs, not from response.data */
        userDocs.value = response.data.map((doc) => ({ ...doc, filtered: false }));
      }
    } catch (error) {
      console.error(`Failed to fetch document`, error);
    }
  };
  const sortDocs = async (func) => {
    userDocs.value.sort((a, b) => func(a, b));
  };
  const filterDocs = async (func) => {
    userDocs.value = userDocs.value.map((doc) => ({ ...doc, filtered: func(doc) }));
  };
  const clearFilterDocs = async () => {
    filterDocs((_) => false);
  };
  provide("userDocs", { userDocs, reloadDocs, sortDocs, filterDocs, clearFilterDocs });
  onMounted(async () => reloadDocs());

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
