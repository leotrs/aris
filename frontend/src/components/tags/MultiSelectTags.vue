<script setup>
  import { ref, reactive, inject, watch, watchEffect, nextTick, computed } from "vue";

  const props = defineProps({
    file: { type: Object, default: null },
    icon: { type: String, default: "Tag" },
  });

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
  <ContextMenu
    variant="custom"
    component="ButtonToggle"
    :icon="icon"
    placement="bottom-end"
    size="sm"
  >
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
