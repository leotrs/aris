<script setup>
  import { useTemplateRef } from "vue";
  import { inject } from "vue";

  const props = defineProps({
    tag: { type: Object, required: true },
  });
  const state = defineModel({ type: Boolean, default: false });
  const { updateUserTag } = inject("userTags");

  const tagRef = useTemplateRef("tagRef");

  const colors = {
    red: "var(--red-400)",
    green: "var(--green-400)",
    purple: "var(--purple-400)",
    orange: "var(--orange-400)",
  };

  const setColor = (color) => {
    const newTag = JSON.parse(JSON.stringify(props.tag));
    newTag.color = color;
    updateUserTag(props.tag, newTag);
  };

  const deleteTag = () => {
    updateUserTag(props.tag, null);
  };

  const renameTag = (newName) => {
    const newTag = JSON.parse(JSON.stringify(props.tag));
    newTag.name = newName;
    updateUserTag(props.tag, newTag);
  };
</script>

<template>
  <div class="tag-control">
    <Tag
      ref="tagRef"
      :tag="tag"
      :active="state"
      :editable="true"
      @click="state = !state"
      @done-editing="(newName) => renameTag(newName)"
    />
    <ContextMenu>
      <ColorPicker :colors="colors" @change="setColor" />
      <ContextMenuItem
        icon="Edit"
        caption="Rename"
        @click="
          console.log('here');
          tagRef?.startEditing();
        "
        @dblclick.stop
      />
      <ContextMenuItem
        icon="TrashX"
        caption="Delete"
        class="danger"
        @click="deleteTag"
        @dblclick.stop
      />
    </ContextMenu>
  </div>
</template>

<style scoped>
  .tag-control :deep(.dots > .cm-menu) {
    transform: translateX(100%) translateY(-8px);
  }

  .tag:hover {
    background-color: var(--surface-hover);
  }

  .cp-wrapper {
    padding-inline: 16px;
  }
</style>
