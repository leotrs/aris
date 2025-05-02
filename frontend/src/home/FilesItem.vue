<script setup>
  import { ref, inject, watch, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

  const props = defineProps({ mode: { type: String, default: "list" } });
  const doc = defineModel({ type: Object, required: true });
  const { selectFile } = inject("userDocs");

  /* State */
  const selectThisFile = () => selectFile(doc.value);
  const router = useRouter();
  const readFile = () => {
    selectFile(doc.value);
    router.push(`/${doc.value.id}/read`);
  };

  /* Breakpoints */
  const shouldShowColumn = inject("shouldShowColumn");

  /* File menu callbacks */
  const fileTitleActive = ref(false);
  const menuRef = useTemplateRef("menu-ref");

  /* Keys */
  const { activate, deactivate } = useKeyboardShortcuts({
    ".": () => menuRef.value?.toggle(),
    enter: selectThisFile,
  });
  watch(
    () => doc.value?.selected,
    (newVal) => (newVal ? activate() : deactivate())
  );
</script>

<template>
  <div
    class="item"
    role="button"
    tabindex="0"
    :class="[mode, doc.selected ? 'active' : '']"
    @click="selectThisFile"
    @dblclick="readFile"
    @keydown.enter.prevent="selectThisFile"
    @keydown.space.prevent="selectThisFile"
  >
    <template v-if="!!doc">
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
            <Minimap :doc="doc" orientation="horizontal" :highlight-scroll="false" />
            <template #fallback><span class="loading">loading...</span></template>
          </Suspense>
          <Abstract :doc="doc" />
        </div>

        <div class="card-footer">
          <div class="card-footer-left">
            <TagRow v-model="doc.tags" :doc-id="doc.id" />
          </div>
          <div class="card-footer-right">
            <div class="last-edited">{{ doc.last_edited_at }}</div>
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
            <Minimap :doc="doc" orientation="horizontal" :highlight-scroll="false" />
            <template #fallback><span class="loading">loading...</span></template>
          </Suspense>
        </template>

        <TagRow v-model="doc.tags" :doc-id="doc.id" />
        <!-- necessary because tags tend to overflow -->
        <div class="spacer"></div>

        <div class="last-edited">{{ doc.last_edited_at }}</div>

        <FileMenu v-if="!doc.selected" ref="menu-ref" />

        <!-- to complete the grid -->
        <span class="spacer"></span>
      </template>
    </template>
  </div>
</template>

<style scoped>
  .item {
    --border-width: var(--border-extrathin);

    color: var(--extra-dark);
    overflow-y: visible;
    transition: var(--transition-bg-color);
    &:focus-visible {
      background-color: var(--surface-hover);
      outline: none;
    }
  }

  .item.list {
    & > * {
      height: 56px;
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
