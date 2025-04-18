<script setup>
import { ref, useTemplateRef } from "vue";
const props = defineProps({
  tag: { type: Object, required: true },
  active: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
});
const emit = defineEmits(["doneEditing"]);

const shownName = ref(props.tag.name);
const editableTextRef = useTemplateRef("editableTextRef");

defineExpose({
  startEditing: () => {
    props.editable && editableTextRef.value?.startEditing();
  },
});
</script>

<template>
  <span class="pill" :class="[active ? 'on' : 'off', tag.color]">
    <EditableText v-if="editable" ref="editableTextRef" v-model="shownName" :edit-on-click="false"
      @save="(newName) => emit('doneEditing', newName)" />
    <span v-else>{{ tag.name }}</span>
  </span>
</template>

<style scoped>
.pill {
  border-radius: 16px;
  padding-inline: 8px;
  padding-block: 4px;
  text-wrap: nowrap;
}

.pill.on {
  &.red {
    background-color: var(--red-400);
    color: var(--red-50);
  }

  &.purple {
    background-color: var(--purple-400);
    color: var(--purple-50);
  }

  &.green {
    background-color: var(--green-400);
    color: var(--green-50);
  }

  &.orange {
    background-color: var(--orange-400);
    color: var(--orange-50);
  }
}

.pill.off {
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
</style>
