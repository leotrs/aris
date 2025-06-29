<script setup>
  import { ref, reactive, inject, watch, watchEffect, nextTick, computed } from "vue";

  /**
   * MultiSelectTags - Advanced tag selection dropdown
   *
   * A comprehensive tag management component that provides a dropdown interface for selecting,
   * deselecting, and creating tags. Supports both file-specific tagging and filter contexts
   * with reactive state management and tag creation capabilities.
   *
   * Features:
   * - Multi-select tag interface with checkboxes
   * - Real-time tag creation with inline editing
   * - File-specific tagging or filter context mode
   * - Reactive state synchronization with store
   * - Tag color management and visual feedback
   * - Accessible dropdown menu with keyboard navigation
   *
   * @displayName MultiSelectTags
   * @example
   * // File-specific tagging
   * <MultiSelectTags
   *   :file="currentFile"
   *   v-model="selectedTags"
   * />
   *
   * @example
   * // Filter context (no file)
   * <MultiSelectTags
   *   v-model="filterTags"
   *   icon="Filter"
   * />
   *
   * @example
   * // Custom trigger icon
   * <MultiSelectTags
   *   :file="document"
   *   v-model="documentTags"
   *   icon="Hash"
   * />
   */

  defineOptions({
    name: "MultiSelectTags",
  });

  const props = defineProps({
    /**
     * File object to associate tags with (null for filter context)
     * @example { id: 123, name: "document.pdf", tags: [...] }
     */
    file: { type: Object, default: null },
    /**
     * Icon for the trigger button
     * @values "Tag", "Filter", "Hash", "Bookmark"
     */
    icon: { type: String, default: "Tag" },
  });

  /**
   * Array of currently selected tags (v-model)
   * @example [{ id: 1, name: "frontend", color: "blue" }, { id: 2, name: "urgent", color: "red" }]
   */
  const tags = defineModel({ type: Array });
  const fileStore = inject("fileStore");
  const state = reactive({ tagIsAssigned: [] });

  // Track when we're programmatically updating to avoid loops
  const updatingFromProps = ref(false);
  const isFilterContext = computed(() => !props.file);

  // Sync state with current tags
  watchEffect(async () => {
    if (!fileStore.value?.tags) return;

    // In filter context, only initialize once - don't keep syncing
    if (isFilterContext.value && state.tagIsAssigned.length > 0) return;

    updatingFromProps.value = true;
    const tagIds = (tags.value || []).map((t) => t.id);
    state.tagIsAssigned = fileStore.value.tags.map((tag) => tagIds.includes(tag.id));

    await nextTick();
    updatingFromProps.value = false;
  });

  // Handle UI changes to checkboxes
  watch(
    () => [...state.tagIsAssigned],
    (newVal, oldVal) => {
      // Ignore changes during programmatic updates or missing oldVal
      if (updatingFromProps.value || !oldVal) return;

      newVal.forEach((isAssigned, idx) => {
        const wasAssigned = oldVal[idx];
        const tag = fileStore.value.tags[idx];

        if (isAssigned && !wasAssigned) {
          // User checked a tag - add it
          if (props.file) {
            fileStore.value.toggleFileTag(props.file, tag.id);
          }
          tags.value = [...(tags.value || []), tag];
        } else if (!isAssigned && wasAssigned) {
          // User unchecked a tag - remove it
          if (props.file) {
            fileStore.value.toggleFileTag(props.file, tag.id);
          }
          tags.value = (tags.value || []).filter((t) => t.id !== tag.id);
        }
      });
    },
    { deep: true }
  );

  const newTagPlaceholder = {
    id: null,
    name: "new tag...",
    color: "new-tag-color",
  };

  const createTag = (newName) => {
    fileStore.value.createTag(newName);
  };
</script>

<template>
  <ContextMenu variant="slot" placement="bottom-end" menu-class="ms-tags">
    <template #trigger="{ toggle }">
      <ButtonToggle :icon="icon" size="sm" hover-color="var(--blue-300)" @click="toggle" />
    </template>
    <TagControl
      v-for="(tag, idx) in fileStore.tags"
      :key="tag.id"
      v-model="state.tagIsAssigned[idx]"
      class="item"
      :tag="tag"
    />
    <Separator />
    <div class="new-tag item" @click.stop>
      <Tag
        :tag="newTagPlaceholder"
        :active="false"
        :editable="true"
        :edit-on-click="true"
        :clear-on-start-renaming="true"
        @rename="createTag"
      />
    </div>
  </ContextMenu>
</template>

<style>
  /** Note these are NOT scoped
   *  Due to <Teleport> we cannot use scoped styles and instead must add a custom class
   *  to ContextMenu (ms-tags).
   **/
  .ms-tags.context-menu {
    padding-inline: 8px;
  }
</style>
