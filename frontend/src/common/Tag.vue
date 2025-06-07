<script setup>
  import { ref, useTemplateRef } from "vue";
  const props = defineProps({
    tag: { type: Object, required: true },
    active: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    editOnClick: { type: Boolean, default: false },
    clearOnStartRenaming: { type: Boolean, default: false },
  });
  const emit = defineEmits(["rename"]);
  const newName = ref(props.tag.name);
  const editableTextRef = useTemplateRef("editableTextRef");
  defineExpose({
    startEditing: () => {
      props.editable && editableTextRef.value?.startEditing();
    },
  });
</script>

<template>
  <button
    type="button"
    class="tag"
    :class="[active ? 'on' : 'off', tag?.color, editable ? 'editable' : '']"
    role="checkbox"
    :aria-checked="active"
    tabindex="0"
  >
    <EditableText
      v-if="editable"
      ref="editableTextRef"
      v-model="newName"
      :edit-on-click="editOnClick"
      :clear-on-start="clearOnStartRenaming"
      :preserve-width="true"
      @save="(n) => emit('rename', n)"
    />
    <span v-else>{{ tag.name }}</span>
  </button>
</template>

<style scoped>
  .tag {
    /* reset default button styles */
    background: transparent;
    border: none;
    font: inherit;

    display: flex;
    align-items: center;
    border-radius: 16px;
    padding-inline: 8px;
    padding-block: 4px;
    text-wrap: nowrap;
    height: 24px;
    text-align: center;
    border: var(--border-thin) solid transparent;
  }

  .tag.editable {
    cursor: pointer;
  }

  .tag.on {
    &.red {
      background-color: var(--red-300);
      color: var(--white);
    }

    &.purple {
      background-color: var(--purple-300);
      color: var(--white);
    }

    &.green {
      background-color: var(--green-300);
      color: var(--white);
    }

    &.orange {
      background-color: var(--orange-300);
      color: var(--white);
    }
  }

  .tag.off {
    &.red {
      border: var(--border-thin) solid var(--red-400);
      color: var(--red-400);
    }

    &.purple {
      border: var(--border-thin) solid var(--purple-400);
      color: var(--purple-400);
    }

    &.green {
      border: var(--border-thin) solid var(--green-400);
      color: var(--green-400);
    }

    &.orange {
      border: var(--border-thin) solid var(--orange-400);
      color: var(--orange-400);
    }

    &.new-tag-color {
      border: var(--border-thin) solid var(--gray-400);
      color: var(--gray-400);
    }
  }

  .tag:focus-visible {
    outline: var(--border-med) solid var(--border-action);
    outline-offset: var(--border-extrathin);
  }

  .tag:has(> .editable-text > input) {
    padding-inline: 0;
  }

  .tag > .editable-text > :deep(input) {
    padding-block: 0;
    background-color: transparent;
    width: inherit;
  }
</style>
