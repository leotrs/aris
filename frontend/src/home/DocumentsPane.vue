<script setup>
import { ref, inject, computed } from "vue";
import { useRouter } from "vue-router";
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
import DocumentsPaneHeader from "./DocumentsPaneHeader.vue";
import DocumentsPaneItem from "./DocumentsPaneItem.vue";

const props = defineProps({
  mode: { type: String, default: "list" },
});
const emit = defineEmits(["set-selected"]);
const { userDocs } = inject("userDocs");
const numDocs = computed(() => userDocs.value.length);

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
  <div class="documents" :class="mode">
    <DocumentsPaneHeader />

    <div class="docs-group" :class="mode">
      <DocumentsPaneItem
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
.documents {
  margin-top: 8px;
  overflow-y: auto;
  width: 100%;
}

.documents.list {
  container-type: inline-size;
}

.documents.list > :is(.pane-header, .docs-group) {
  display: grid !important;
  grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 1fr 100px 16px 8px;
}

.docs-group.list {
  overflow-y: auto;
  height: calc(100% - 40px);

  & > .item {
    display: contents;
    grid-column: 1 / 6;

    & > *:first-child {
      padding-left: 16px;
    }
  }
}

.documents.cards {
}

.docs-group.cards {
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

/* @container (max-width: 744px) {
    .pane-header, .docs-group  {
    grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 1fr 100px 16px 8px !important;
    }
    .pane-header, .item { grid-column: 1 / 6 !important }
    :deep(.owner) { display: none }
    }
    @container (max-width: 684px) {
    .pane-header, .docs-group  {
    grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 100px 16px 8px !important;
    }
    .pane-header, .item { grid-column: 1 / 5 !important }
    :deep(.tags) { display: none }
    }
    @container (max-width: 480px) {
    .pane-header, .docs-group  {
    grid-template-columns: minmax(75px, 2fr) 100px 16px 8px !important;
    }
    .pane-header, .item { grid-column: 1 / 4 !important }
    :deep(.progress) { display: none }
    }
    @container (max-width: 432px) {

    } */
</style>
