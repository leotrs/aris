<script setup>
  /**
   * FilesItem - Interactive file item component for displaying research manuscripts
   *
   * A versatile file display component that renders individual RSM research manuscripts
   * in either list or card layout modes. Provides interactive features including hover
   * states, keyboard navigation, file menu actions, and visual feedback for selection
   * and focus states. Integrates with the file management system for operations like
   * rename, duplicate, and delete.
   *
   * Features keyboard shortcuts (Enter/Space to open, . for menu), responsive design,
   * and accessibility support with proper ARIA roles and focus management.
   *
   * @displayName FilesItem
   * @example
   * // Basic list mode usage
   * <FilesItem v-model="fileObject" mode="list" />
   *
   * @example
   * // Card mode with reactive file object
   * <FilesItem
   *   v-model="manuscript"
   *   mode="cards"
   * />
   *
   * @example
   * // File object structure
   * const fileObject = ref({
   *   id: "file-123",
   *   title: "Research Paper Title",
   *   selected: false,
   *   focused: false,
   *   tags: ["biology", "research"],
   *   lastModified: "2023-12-01T10:30:00Z"
   * })
   */

  import { ref, inject, watch, useTemplateRef, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import { File } from "@/models/File.js";
  import Date from "./FilesItemDate.vue";
  import ConfirmationModal from "@/components/ConfirmationModal.vue";

  const props = defineProps({
    /**
     * Display mode for the file item
     * @values 'list', 'cards'
     */
    mode: { type: String, default: "list" },
  });

  /**
   * File object containing manuscript data and state
   * @example { id: "123", title: "Paper", selected: false, focused: false, tags: [] }
   */
  const file = defineModel({ type: Object, required: true });
  const fileStore = inject("fileStore");
  const xsMode = inject("xsMode");

  // State
  const hovered = ref(false);
  const router = useRouter();
  const showDeleteModal = ref(false);

  // Breakpoints
  const shouldShowColumn = inject("shouldShowColumn");

  // File menu callbacks
  const open = () => File.openFile(file.value, router);
  const menuRef = useTemplateRef("menu-ref");
  const fileTitleRef = useTemplateRef("file-title-ref");
  const user = inject("user");
  const onRename = () => fileTitleRef.value?.startEditing();
  const onDuplicate = () => {
    const fileData = {
      ...File.toJSON(file.value),
      id: null,
      owner_id: user.value.id,
      title: file.value.title + " (Copy)",
    };
    fileStore.value.createFile(fileData);
  };
  const onDelete = () => {
    if (!file.value) return;
    showDeleteModal.value = true;
  };

  // Confirmation modal handlers
  const handleDeleteConfirm = async () => {
    // Prevent deletion if modal is not shown (race condition protection)
    if (!showDeleteModal.value) return;

    try {
      const success = await fileStore.value.deleteFile(file.value);
      if (success) {
        showDeleteModal.value = false;
      }
      // If deletion fails, keep modal open so user can try again or cancel
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Keep modal open on error
    }
  };

  const handleDeleteCancel = () => {
    showDeleteModal.value = false;
  };

  const handleDeleteClose = () => {
    showDeleteModal.value = false;
  };

  // Generate confirmation message with file name
  const deleteMessage = computed(() => {
    const fileName = file.value?.title || "this file";
    return `Are you sure you want to delete "${fileName}"? This action cannot be undone.`;
  });

  // Keyboard shortcuts - activated when file is focused
  const { activate, deactivate } = useKeyboardShortcuts(
    {
      ".": { fn: () => menuRef.value?.toggle(), description: "open file menu" },
      enter: open,
      " ": { fn: open, description: "open file" },
    },
    false,
    "When a file item is selected"
  );

  // Watch file focus state to enable/disable keyboard shortcuts
  watch(
    () => file.value?.focused,
    (newVal) => (newVal ? activate() : deactivate())
  );
</script>

<template>
  <!--
    Main file item container with interactive states and accessibility support.
    Supports both list and card display modes with hover, focus, and selection states.
    
    @example
    // The component automatically applies appropriate CSS classes based on props and state:
    // - .list or .cards based on mode prop
    // - .active when file.selected is true  
    // - .focused when file.focused is true
    // - .hovered during mouse hover
  -->
  <div
    class="item"
    role="button"
    tabindex="0"
    :class="{
      list: mode === 'list',
      cards: mode === 'cards',
      active: file?.selected,
      focused: file?.focused,
      hovered: hovered,
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="open"
    @dblclick="open"
  >
    <template v-if="!!file">
      <template v-if="mode === 'cards'"> </template>

      <!-- List mode layout: displays file information in a grid row format -->
      <template v-if="mode === 'list'">
        <!-- Editable file title component -->
        <FileTitle
          ref="file-title-ref"
          :file="file"
          :class="mode === 'cards' ? 'text-label' : ''"
        />

        <!-- Tags and spacer (hidden on extra small screens) -->
        <template v-if="!xsMode">
          <TagRow :file="file" />
          <!-- necessary because tags tend to overflow -->
          <div class="spacer"></div>
        </template>

        <!-- File modification date -->
        <Date :file="file" />

        <!-- 
          File action menu (hidden when file is selected to prevent interference with selection UI)
          Emits rename, duplicate, and delete events handled by parent callbacks
        -->
        <FileMenu
          v-if="!file.selected"
          ref="menu-ref"
          @rename="onRename"
          @duplicate="onDuplicate"
          @delete="onDelete"
        />

        <!-- Grid layout spacer to complete the row -->
        <span class="spacer"></span>
      </template>
    </template>

    <!-- Delete confirmation modal -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="Delete File?"
      :message="deleteMessage"
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      :file-data="file"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
      @close="handleDeleteClose"
    />
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

  .item .fm-wrapper :deep(.context-menu-trigger) {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  :is(.item:hover, .item.focused, .item.hovered) .fm-wrapper :deep(.context-menu-trigger) {
    opacity: 1;
  }

  /* MultiSelectTags icon color behavior - dark on hover, focus, or when menu is open */
  :is(.item:hover, .item.focused, .item.hovered) :deep(.cm-btn svg),
  :deep(.cm-open .cm-btn svg) {
    color: var(--extra-dark);
  }
</style>
