<script setup>
import { ref, reactive, inject, watch, watchEffect } from "vue";

const props = defineProps({
  docID: { type: Number, default: -1 },
  icon: { type: String, default: "CirclePlus" },
});
const tags = defineModel();
const { userTags, createTag, addOrRemoveTag } = inject("userTags");

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

      isNowAssigned,
        wasAssigned ? console.log(`${idx}: ${isNowAssigned} -> ${wasAssigned}`) : null;

      if (isNowAssigned && !wasAssigned) {
        if (props.docID !== -1) addOrRemoveTag(tag.id, props.docID, "add");
        if (!tags.value.some((t) => t.id === tag.id))
          tags.value = tags.value.concat([tag]);
      }

      if (!isNowAssigned && wasAssigned) {
        if (props.docID !== -1) addOrRemoveTag(tag.id, props.docID, "remove");
        tags.value = tags.value.filter((t) => t.id !== tag.id);
      }
    });
  },
  { deep: true },
);

const newTagPlaceholder = {
  id: null,
  name: "new tag...",
  color: "new-tag-color",
};
const renaming = ref(false);
</script>

<template>
  <ContextMenu :icon="icon">
    <TagControl
      v-for="(tag, idx) in userTags"
      class="item"
      :tag="tag"
      :key="tag.id"
      v-model="state.tagIsAssigned[idx]"
    />
    <div class="new-tag-wrapper item">
      <Tag
        :tag="newTagPlaceholder"
        :active="false"
        @rename="(name) => createTag(name)"
        v-model="renaming"
        @click.stop="renaming = true"
        @dblclick.stop
      />
    </div>
  </ContextMenu>
</template>

<style scoped>
.pill {
  margin-right: 4px;
  border-radius: 16px;
  padding-inline: 8px;
  padding-block: 4px;
  text-wrap: nowrap;
}

.cm-wrapper > :deep(.cm-click-target > .cm-btn) {
  color: var(--light);
}

.cm-wrapper > :deep(.cm-menu) {
  right: 0;
  transform: translateX(0) translateY(32px);
}

.cm-wrapper > :deep(.cm-menu > .item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 8px;
  gap: 8px;
}

.new-tag {
  &:hover {
    background-color: var(--surface-hint);
  }
}
</style>
