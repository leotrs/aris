<script setup>
  import { ref, reactive, watch, watchEffect, computed, inject, provide } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import Topbar from "./FilesTopbar.vue";
  import FilesHeader from "./FilesHeader.vue";
  import FilesItem from "./FilesItem.vue";

  const props = defineProps({});
  const emit = defineEmits(["set-selected"]);
  const mode = ref("list");
  const { userDocs } = inject("userDocs");
  const numDocs = computed(() => userDocs.value.length);

  /* Open a file */
  const router = useRouter();
  const openRead = (doc) => {
    clearTimeout(clickTimeout.value);
    router.push(`/${doc.id}/read`);
  };

  /*********** File list ***********/
  const activeIndex = ref(null);
  const state = reactive({ itemActive: userDocs.value.map(() => false) });
  watchEffect(() => {
    userDocs.value.forEach((doc, idx) => {
      state.itemActive = userDocs.value.map(() => false);
    });
  });
  let clickTimeout = ref(null);
  const selectForPreview = (doc, idx) => {
    activeIndex.value = idx;
    clickTimeout.value = setTimeout(() => emit("set-selected", doc || {}), 200);
  };
  watch(activeIndex, (idx) => {
    if (Number.isNaN(idx)) return;
    state.itemActive.fill(false);
    state.itemActive[idx] = true;
    if (idx === null) return;
    const el = document.querySelector(`.files .item:nth-child(${idx + 1})`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

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
    k: prevItemOnKey,
    arrowdown: nextItemOnKey,
    arrowup: prevItemOnKey,
    escape: (ev) => ev.preventDefault() || (activeIndex.value = null),
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
    /* console.log(columnName, mode, breakpoints.isGreater("md"));
     * if (mode == "cards") {
     *   return ["Title", "Tags", "Last edit"].includes(columnName);
     * }

     * if (mode == "list") {
     *   if (breakpoints.greater("md")) return true;
     *   return columnName != "Map";
     * }

     * return false; */
  };
  provide("shouldShowColumn", shouldShowColumn);
</script>

<template>
  <div class="pane">
    <Topbar @list="mode = 'list'" @cards="mode = 'cards'" />

    <div class="files-wrapper" :class="mode">
      <FilesHeader :mode="mode" />

      <Suspense>
        <div class="files" :class="mode">
          <FilesItem
            v-for="(doc, idx) in userDocs.filter((doc) => !doc.filtered)"
            :key="doc"
            v-model="state.itemActive[idx]"
            :doc="doc"
            :mode="mode"
            @click="selectForPreview(doc, idx)"
            @dblclick="openRead(doc)"
          />
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

  .pane-header.list {
    margin-bottom: 4px;
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
