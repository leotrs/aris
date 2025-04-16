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
  const userID = inject("userID");

  /*********** Proivde userDocs ***********/
  const userDocs = ref([]);
  const reloadDocs = async (docID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/${userID}/documents`
      );
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

  /*********** Provide userTags ***********/
  const userTags = ref([]);
  const updateUserTag = async (oldTag, newTag) => {
    if (oldTag) {
      const url = `http://localhost:8000/users/${userID}/tags/${oldTag.id}`;
      try {
        if (newTag == null) {
          await axios.delete(url);
        } else {
          await axios.put(url, newTag);
        }
        reloadDocs();
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }

    try {
      const response = await axios.get(`http://localhost:8000/users/${userID}/tags`);
      userTags.value = response.data;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };
  const createTag = async (name, color = null) => {
    try {
      await axios.post(`http://localhost:8000/users/${userID}/tags`, {
        name: name,
        color: color || "",
      });
      reloadDocs();
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };
  const addOrRemoveTag = async (tagID, docID, mode) => {
    console.log(mode);
    const url = `http://localhost:8000/users/${userID}/documents/${docID}/tags/${tagID}`;
    if (mode == "add") {
      try {
        await axios.post(url);
        reloadDocs();
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    } else if (mode == "remove") {
      try {
        await axios.delete(url);
        reloadDocs();
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }
  };
  provide("userTags", { userTags, updateUserTag, createTag, addOrRemoveTag });
  onMounted(async () => {
    updateUserTag();
  });

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
    activeIndex.value =
      activeIndex.value === null ? 0 : (activeIndex.value + 1) % numDocs.value;
  };
  const prevItemOnKey = (ev) => {
    ev.preventDefault();
    activeIndex.value =
      activeIndex.value === null
        ? 0
        : (activeIndex.value + numDocs.value - 1) % numDocs.value;
  };
  const focusSearchBar = (ev) => {
    console.log("focus search");
  };
  useKeyboardShortcuts({
    j: nextItemOnKey,
    J: nextItemOnKey,
    ArrowDown: nextItemOnKey,
    k: prevItemOnKey,
    K: prevItemOnKey,
    ArrowUp: prevItemOnKey,
    escape: (ev) => ev.preventDefault() || (activeIndex.value = null),
    Slash: focusSearchBar,
  });
</script>

<template>
  <Topbar @list="mode = 'list'" @cards="mode = 'cards'" />
  <div class="files-wrapper" :class="mode">
    <FilesHeader />

    <div class="files" :class="mode">
      <FilesItem
        v-for="(doc, idx) in userDocs.filter((doc) => !doc.filtered)"
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
    margin-top: 8px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
  .files-wrapper.list {
    container-type: inline-size;
  }
  .files-wrapper.list > :is(.pane-header, .files) {
    display: grid !important;
    grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 1fr 100px 16px 8px;
  }

  .files.list {
    overflow-y: auto;
    max-height: calc(100% - 40px);

    & > .item {
      display: contents;
      grid-column: 1 / 6;

      & > *:first-child {
        padding-left: 16px;
      }
    }
  }

  .files-wrapper.cards {
  }

  .files.cards {
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
