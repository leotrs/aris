<script setup>
  import { ref, inject, watch, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import axios from "axios";
  import RelativeTime from "@yaireo/relative-Time";

  const props = defineProps({
    doc: { type: Object, required: true },
    mode: { type: String, default: "list" },
  });
  const active = defineModel({ type: Boolean, required: true });
  const emit = defineEmits(["click", "dblclick"]);

  const relativeTime = new RelativeTime({ locale: "en" });
  const fileTitleActive = ref(false);
  const shouldShowColumn = inject("shouldShowColumn");

  /* File menu callbacks */
  const { reloadDocs } = inject("userDocs");
  const renameDoc = () => (fileTitleActive.value = true);
  const copyDoc = async () => {
    console.log("copy");
    const url = `http://localhost:8000/documents/${props.doc.id}/duplicate`;
    try {
      await axios.post(url);
      reloadDocs();
    } catch (error) {
      console.error(`Could not delete document ${props.doc.id}`);
    }
  };
  const deleteDoc = async () => {
    console.log("delete");
    const url = `http://localhost:8000/documents/${props.doc.id}`;
    try {
      await axios.delete(url);
      reloadDocs();
    } catch (error) {
      console.error(`Could not delete document ${props.doc.id}`);
    }
  };
  const menuRef = useTemplateRef("menu-ref");

  const { activate, deactivate } = useKeyboardShortcuts({
    ".": () => menuRef.value?.toggle(),
    enter: () => emit("click"),
  });
  watch(active, (newVal) => (newVal ? activate() : deactivate()));
</script>

<template>
  <div
    class="item"
    :class="[mode, active ? 'active' : '']"
    @click="emit('click')"
    @dblclick="emit('dblclick')"
  >
    <template v-if="mode == 'cards'">
      <div class="card-header">
        <FileTitle
          v-model="fileTitleActive"
          :doc="doc"
          :class="mode == 'cards' ? 'text-label' : ''"
        />
        <FileMenu ref="menu-ref" />
      </div>

      <div class="card-content">
        <Suspense>
          <Minimap :doc="doc" orientation="horizontal" />
          <template #fallback><span class="loading">loading...</span></template>
        </Suspense>
        <Abstract :doc="doc" />
      </div>

      <div class="card-footer">
        <div class="card-footer-left">
          <TagRow v-model="doc.tags" :doc-id="doc.id" />
        </div>
        <div class="card-footer-right">
          <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>
          <Avatar />
        </div>
      </div>
    </template>

    <template v-if="mode == 'list'">
      <FileTitle
        v-model="fileTitleActive"
        :doc="doc"
        :class="mode == 'cards' ? 'text-label' : ''"
      />

      <template v-if="shouldShowColumn('Map', 'list')">
        <Suspense>
          <Minimap :doc="doc" orientation="horizontal" />
          <template #fallback><span class="loading">loading...</span></template>
        </Suspense>
      </template>

      <TagRow v-model="doc.tags" :doc-id="doc.id" />
      <!-- necessary because tags tend to overflow -->
      <div class="spacer"></div>

      <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>

      <FileMenu v-if="!active" ref="menu-ref" />

      <!-- to complete the grid -->
      <span class="spacer"></span>
    </template>
  </div>
</template>

<style scoped>
  .item {
    --border-width: var(--border-extrathin);

    color: var(--extra-dark);
    overflow-y: visible;
    transition: var(--transition-bg-color);
  }

  .item.list {
    & > * {
      height: calc(56px - 2 * var(--border-width));
      padding-right: 8px;
      transition: background 0.15s ease-in-out;
      border-top: var(--border-width) solid transparent;
      border-bottom: var(--border-width) solid transparent;
      border-bottom-color: var(--border-primary);
      overflow-y: hidden;
    }

    &:hover > * {
      background-color: var(--gray-75);
    }

    & > *:first-child {
      padding-left: calc(16px - var(--border-med));
    }

    & > .dots {
      padding-inline: 0px;
    }

    & .file-title {
      border-left: var(--border-med) solid transparent;
    }
  }

  .item.list.active {
    & > :is(.mm-wrapper, .tag-row, .last-edited, .spacer) {
      display: none;
    }

    & > .file-title {
      font-size: 18px;
      font-weight: var(--weight-semi);
      grid-column: 1 / 8;
      width: 100%;
    }

    & > * {
      background-color: var(--surface-information);
    }

    & > *:first-child {
      border-left: var(--border-med) solid var(--border-action);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    & > *:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  .item.cards {
    border-radius: 16px;
    padding-block: 16px;
    margin-bottom: 16px;
    padding: 16px;
    border: var(--border-thin) solid var(--border-primary);
    background-color: var(--surface-page);
    display: flex;
    flex-direction: column;

    &:hover {
      border-color: var(--gray-400);
      box-shadow: var(--shadow-strong);
    }

    &.active {
      border-color: var(--border-action);
      background-color: var(--surface-information);
      box-shadow: var(--shadow-strong), var(--shadow-soft);
      /* used to artificially thicken the border without causing layout jiggle */
      outline: var(--border-extrathin) solid var(--border-action);
    }

    & > .card-header {
      display: flex;
      justify-content: space-between;
    }

    & > .card-content {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      margin-bottom: 16px;
    }

    & > .card-footer {
      display: flex;
      flex-wrap: wrap;
      column-gap: 8px;
      row-gap: 8px;
      justify-content: space-between;
      align-items: center;
    }

    & .card-footer-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    & .file-title {
      font-size: 18px;
      margin-top: 8px;
    }

    & > .dots,
    & > .file-title,
    & > .last-edited,
    & > .owner {
      display: inline-block;
    }

    & > .dots,
    & > .owner {
      float: right;
    }

    & :deep(.manuscriptwrapper) {
      margin-top: 8px !important;
      padding-block: 0px !important;
    }

    & :deep(.manuscriptwrapper .abstract > h3) {
      display: none;
    }

    & > .last-edited {
      height: 32px;
      align-content: center;
    }
  }

  .item .fm-wrapper :deep(.cm-btn) {
    opacity: 0;
    transition:
      opacity,
      0.3s ease;
  }

  :is(.item:hover, .item.active) .fm-wrapper :deep(.cm-btn) {
    opacity: 1;
  }
</style>
