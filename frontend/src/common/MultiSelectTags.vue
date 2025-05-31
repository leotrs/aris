<script setup>
  import { ref, reactive, inject, watch, watchEffect } from "vue";
  const props = defineProps({
    file: { type: Object, default: null },
    icon: { type: String, default: "Tag" },
  });
  const tags = defineModel({ type: Array });
  const fileStore = inject("fileStore");
  const state = reactive({ tagIsAssigned: [] });

  // Add this flag to track initialization
  const isInitialized = ref(false);

  watchEffect(() => {
    if (!fileStore.value?.tags || !tags.value) return;
    const tagIds = tags.value.map((t) => t.id);

    // Use map instead of forEach for cleaner array assignment
    state.tagIsAssigned = fileStore.value.tags.map((tag) => tagIds.includes(tag.id));

    // Mark as initialized after first setup
    if (!isInitialized.value) {
      isInitialized.value = true;
    }
  });

  watch(
    () => [...(state.tagIsAssigned || [])],
    (newVal, oldVal) => {
      // Skip processing during initialization
      if (!isInitialized.value || !props.file) return;

      // Handle the case where oldVal is empty (shouldn't happen now, but safety check)
      if (oldVal.length === 0) return;

      newVal.forEach((isNowAssigned, idx) => {
        const wasAssigned = oldVal[idx];
        const tag = fileStore.value.tags[idx];

        if (isNowAssigned && !wasAssigned) {
          fileStore.value.toggleFileTag(props.file, tag.id);
          if (!tags.value.some((t) => t.id === tag.id)) {
            tags.value = tags.value.concat([tag]);
          }
        } else if (!isNowAssigned && wasAssigned) {
          fileStore.value.toggleFileTag(props.file, tag.id);
          tags.value = tags.value.filter((t) => t.id !== tag.id);
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

  const createTag = () => {
    fileStore.value.createTag(newTagPlaceholder.name);
  };
</script>

<template>
  <ContextMenu :icon="icon" placement="bottom-end" button-size="btn-sm">
    <TagControl
      v-for="(tag, idx) in fileStore.tags"
      :key="tag.id"
      v-model="state.tagIsAssigned[idx]"
      class="item"
      :tag="tag"
    />
    <Separator />
    <div class="new-tag item">
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

<style scoped>
  .cm-menu > .item {
    padding-inline: 8px;
  }

  :deep(.cm-btn svg) {
    color: var(--light);
  }

  :deep(.cm-btn:hover svg) {
    color: var(--extra-dark);
  }

  .new-tag {
    &:hover {
      background-color: var(--surface-hover);
    }
  }
</style>
