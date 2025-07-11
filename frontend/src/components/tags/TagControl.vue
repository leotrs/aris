<script setup>
  import { useTemplateRef } from "vue";
  import { inject } from "vue";

  /**
   * TagControl - Interactive tag with editing controls
   *
   * A complete tag management component that combines a Tag component with a context menu
   * for color changing, renaming, and deletion. Integrates with the file store for
   * persistent tag operations.
   *
   * @displayName TagControl
   * @example
   * // Basic usage
   * <TagControl
   *   :tag="{ name: 'Important', color: 'red' }"
   *   v-model="isTagActive"
   * />
   *
   * @example
   * // In a tag list
   * <TagControl
   *   v-for="tag in tags"
   *   :key="tag.id"
   *   :tag="tag"
   *   v-model="selectedTags[tag.id]"
   * />
   */

  const props = defineProps({
    /**
     * Tag data object containing name and color information
     * @example { name: "Frontend", color: "blue", id: "tag-123" }
     */
    tag: { type: Object, required: true },
  });

  /**
   * Whether this tag is currently active/selected (v-model)
   */
  const state = defineModel({ type: Boolean, default: false });
  const fileStore = inject("fileStore");
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
    fileStore.value.updateTag(props.tag, newTag);
  };

  const deleteTag = () => {
    fileStore.value.updateTag(props.tag, null);
  };

  const renameTag = (newName) => {
    const newTag = JSON.parse(JSON.stringify(props.tag));
    newTag.name = newName;
    fileStore.value.updateTag(props.tag, newTag);
  };

  const handleTagClick = () => {
    // Only toggle if the tag is not currently being edited
    // This prevents the spacebar bug where pressing space during rename would toggle the tag
    if (tagRef.value?.isEditing) {
      return; // Don't toggle while editing
    }
    state.value = !state.value;
  };
</script>

<template>
  <div class="tag-control">
    <Tag
      ref="tagRef"
      :tag="tag"
      :active="state"
      :editable="true"
      @click.stop="handleTagClick"
      @rename="renameTag"
    />
    <ContextMenu variant="dots" placement="right-start">
      <ColorPicker :colors="colors" @change="setColor" />
      <ContextMenuItem
        icon="Edit"
        caption="Rename"
        @click="tagRef?.startEditing()"
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
  .tag-control {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: space-between;

    &:focus-within {
      background-color: var(--surface-hover);
    }
  }

  .tag:hover {
    background-color: var(--surface-hover);
  }
</style>
