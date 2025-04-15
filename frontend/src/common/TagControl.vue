<script setup>
  import { useTemplateRef } from "vue";
  import { inject } from "vue";

  const props = defineProps({
    tag: { type: Object, required: true },
  });
  const state = defineModel({ type: Boolean, default: false });
  const { updateUserTag } = inject("userTags");

  const tagRef = useTemplateRef("tagRef");

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
      @doneEditing="(newName) => renameTag(newName)"
    />
    <ContextMenu>
      <div class="colors">
        <span
          v-for="c in ['red', 'green', 'purple', 'orange']"
          :class="['color', c, tag.color == c ? 'active' : '']"
          @click.stop="setColor(c)"
          @dblclick.stop
        >
        </span>
      </div>
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

  .pill:hover {
    background-color: var(--surface-hover);
  }

  .colors {
    display: flex;
    justify-content: space-between;
    padding-inline: 16px;
  }

  .color {
    height: calc(32px);
    width: calc(16px);
    border: var(--border-thin) solid var(--surface-primary);
    border-radius: 8px;
    &:not(.active):hover {
      cursor: pointer;
      &.red {
        background-color: var(--red-100);
      }
      &.green {
        background-color: var(--green-100);
      }
      &.purple {
        background-color: var(--purple-100);
      }
      &.orange {
        background-color: var(--orange-100);
      }
    }

    &.active {
      &.red {
        background-color: var(--red-500);
        border-color: var(--red-500);
      }
      &.green {
        background-color: var(--green-500);
        border-color: var(--green-500);
      }
      &.purple {
        background-color: var(--purple-500);
        border-color: var(--purple-500);
      }
      &.orange {
        background-color: var(--orange-500);
        border-color: var(--orange-500);
      }
    }

    &:not(.active) {
      border-style: solid;
      border-width: var(--border-thin);
      &.red {
        border-color: var(--red-500);
      }
      &.green {
        border-color: var(--green-500);
      }
      &.purple {
        border-color: var(--purple-500);
      }
      &.orange {
        border-color: var(--orange-500);
      }
    }
  }
</style>
