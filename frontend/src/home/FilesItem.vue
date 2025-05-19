<script setup>
  import { ref, inject, watch, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { File } from "../File.js";

  const props = defineProps({ mode: { type: String, default: "list" } });
  const file = defineModel({ type: Object, required: true });
  const { selectFile } = inject("fileStore");

  // State
  const hovered = ref(false);
  const selectThisFile = () => selectFile(file.value);
  const router = useRouter();
  const readFile = () => {
    /* selectFile(file.value); */
    router.push(`/${file.value.id}/read`);
  };

  // Breakpoints
  const shouldShowColumn = inject("shouldShowColumn");

  // File menu callbacks
  const menuRef = useTemplateRef("menu-ref");
  const fileTitleRef = useTemplateRef("file-title-ref");
  const fileStore = inject("fileStore");
  const user = inject("user");
  const onRename = () => fileTitleRef.value?.startEditing();
  const onDuplicate = () => {
    let fileData = {
      ...File.toJSON(file.value),
      id: null,
      owner_id: user.id,
      title: file.value.title + " (Copy)",
    };
    fileStore.createFile(fileData);
  };
  const onDelete = () => fileStore.deleteFile(file.value);

  // Keys
  const { activate, deactivate } = useKeyboardShortcuts(
    {
      ".": () => menuRef.value?.toggle(),
      enter: readFile,
      " ": readFile,
    },
    false
  );
  watch(
    () => file.value.focused,
    (newVal) => (newVal ? activate() : deactivate())
  );
</script>

<template>
  <div
    class="item"
    role="button"
    tabindex="0"
    :class="{
      list: mode == 'list',
      cards: mode == 'cards',
      active: file.selected,
      focused: file.focused,
      hovered: hovered,
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="readFile"
    @dblclick="readFile"
  >
    <template v-if="!!file">
      <template v-if="mode == 'cards'"> </template>

      <template v-if="mode == 'list'">
        <FileTitle ref="file-title-ref" :file="file" :class="mode == 'cards' ? 'text-label' : ''" />

        <TagRow v-model="file.tags" :file="file" />
        <!-- necessary because tags tend to overflow -->
        <div class="spacer"></div>

        <div class="last-edited">{{ file.getFormattedDate() }}</div>

        <FileMenu
          v-if="!file.selected"
          ref="menu-ref"
          @rename="onRename"
          @duplicate="onDuplicate"
          @delete="onDelete"
        />

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

    &:hover,
    &.focused > * {
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

    & .tag-row :deep(.cm-wrapper) {
      visibility: hidden;
    }

    & > .mm-wrapper {
      width: 100%;

      & :deep(.mm-main) {
        width: 100%;
        height: 100%;
      }

      & :deep(.mm-main svg) {
        width: 100%;
        height: 100%;
      }
    }
  }

  .item.list.active {
    & > :is(.mm-wrapper) {
      display: none;
    }

    & > .file-title {
      font-size: 18px;
      font-weight: var(--weight-semi);
      width: 100%;
    }

    & > .tag-row :deep(.cm-wrapper) {
      visibility: visible;
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

  :is(.item:hover, .item.focused, .item.hovered) .fm-wrapper :deep(.cm-btn) {
    opacity: 1;
  }

  :is(.item:hover, .item.focused, .item.hovered) .tag-row :deep(.cm-wrapper) {
    visibility: visible;
  }
</style>
