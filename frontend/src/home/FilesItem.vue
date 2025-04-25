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
  const emits = defineEmits(["click", "dblclick"]);

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

  const { activate, deactivate } = useKeyboardShortcuts({ ".": () => menuRef.value?.toggle() });
  watch(active, (newVal) => (newVal ? activate() : deactivate()));
</script>

<template>
  <div
    class="item"
    :class="[mode, active ? 'active' : '']"
    @click="emits('click')"
    @dblclick="emits('dblclick')"
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

      <!-- <div class="owner"><Avatar /></div> -->
      <!-- <div class="collaborators"><Avatar v-for="..."/></div> -->

      <FileMenu ref="menu-ref" />

      <!-- to complete the grid -->
      <span></span>
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
    &:hover > * {
      background-color: var(--gray-75);
    }

    & > * {
      height: calc(56px - 2 * var(--border-width));
      padding-right: 8px;
      transition: background 0.15s ease-in-out;
      border-top: var(--border-width) solid transparent;
      border-bottom: var(--border-width) solid transparent;
      border-bottom-color: var(--border-primary);
      overflow-y: hidden;
    }

    & > .dots {
      padding-inline: 0px;
    }

    & .file-title {
      border-left: var(--border-med) solid transparent;
    }

    &.active > * {
      background-color: var(--surface-hover);
      outline: var(--border-thin) solid var(--red);
    }

    &.active > *:first-child {
      border-left: var(--border-med) solid var(--border-action);
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
      background-color: var(--surface-page);
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
</style>
