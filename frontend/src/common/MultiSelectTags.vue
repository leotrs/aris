<script setup>
  import { ref, reactive, inject, watch, watchEffect } from "vue";

  const props = defineProps({
    fileId: { type: Number, default: -1 },
    icon: { type: String, default: "Tag" },
  });
  const tags = defineModel({ type: Array });
  const { tags: userTags } = inject("fileStore");

  const state = reactive({
    tagIsAssigned: userTags.value.map(() => false),
  });
  watchEffect(() => {
    const tagIds = tags.value.map((t) => t.id);
    userTags.value.forEach((tag, idx) => {
      state.tagIsAssigned[idx] = tagIds.includes(tag.id);
    });
  });
  watch(
    () => [...state.tagIsAssigned],
    (newVal, oldVal) => {
      // On the first change, oldVal will be an empty array
      if (oldVal.length == 0) oldVal = userTags.value.map(() => false);

      newVal.forEach((isNowAssigned, idx) => {
        const wasAssigned = oldVal[idx];
        const tag = userTags.value[idx];

        if (isNowAssigned && !wasAssigned) {
          if (props.fileId !== -1) addOrRemoveTag(tag.id, props.fileId, "add");
          if (!tags.value.some((t) => t.id === tag.id)) tags.value = tags.value.concat([tag]);
        }

        if (!isNowAssigned && wasAssigned) {
          if (props.fileId !== -1) addOrRemoveTag(tag.id, props.fileId, "remove");
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
  const renaming = ref(false);
</script>

<template>
  <ContextMenu :icon="icon" placement="bottom-end">
    <TagControl
      v-for="(tag, idx) in userTags"
      :key="tag.id"
      v-model="state.tagIsAssigned[idx]"
      class="item"
      :tag="tag"
    />
    <div class="new-tag">
      <Tag
        v-model="renaming"
        :tag="newTagPlaceholder"
        :active="false"
        @rename="(name) => createTag(name)"
        @click.stop="renaming = true"
        @dblclick.stop
      />
    </div>
  </ContextMenu>
</template>

<style scoped>
  .tag {
    margin-right: 4px;
    border-radius: 16px;
    padding-inline: 8px;
    padding-block: 4px;
    text-wrap: nowrap;
  }

  .cm-wrapper > :deep(.cm-menu > .item) {
    padding-inline: 8px;
    gap: 8px;
  }

  :deep(.cm-btn svg) {
    color: var(--light);
  }

  :deep(.cm-btn:hover svg) {
    color: var(--extra-dark);
  }

  .new-tag {
    &:hover {
      background-color: var(--surface-hint);
    }
  }
</style>
