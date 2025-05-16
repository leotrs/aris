<script setup>
  import { ref, watch, nextTick, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "../composables/useKeyboardShortcuts.js";

  const props = defineProps({
    inputClass: { type: [String, Object, Array], default: "" },
    textClass: { type: [String, Object, Array], default: "" },
    editOnClick: { type: Boolean, default: true },
  });
  const emit = defineEmits(["save", "cancel"]);
  const text = defineModel({ type: String, default: "" });
  const isEditing = ref(false);
  const inputRef = useTemplateRef("inputRef");
  const inputValue = ref("");

  const startEditing = async () => {
    inputValue.value = text.value;
    isEditing.value = true;
    console.log("starting");
    await nextTick();
    if (!inputRef.value) return;
    inputRef.value.focus();
    console.log("activating");
    activate();
    const length = inputRef.value.value.length;
    inputRef.value.setSelectionRange(length, length);
  };

  const cancelEditing = () => {
    deactivate();
    isEditing.value = false;
    inputValue.value = text.value;
    emit("cancel");
  };

  const saveChanges = () => {
    text.value = inputValue.value;
    isEditing.value = false;
    emit("save", text.value);
  };

  const { activate, deactivate } = useKeyboardShortcuts(
    {
      escape: () => cancelEditing(),
      enter: () => saveChanges(),
    },
    false
  );

  defineExpose({ startEditing, cancelEditing });
</script>

<template>
  <span class="file-title">
    <button
      v-if="!isEditing"
      type="button"
      class="editable"
      :class="textClass"
      tabindex="0"
      @click="() => editOnClick && startEditing()"
      @keydown.enter.prevent="startEditing()"
      @keydown.space.prevent="startEditing()"
    >
      {{ text }}
    </button>
    <input
      v-else
      ref="inputRef"
      v-model="inputValue"
      :class="[inputClass, isEditing ? 'editing' : '']"
      @blur="saveChanges"
      @click.stop
      @dblclick.stop
    />
  </span>
</template>

<style scoped>
  input {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    outline: none;
    width: 100%;
  }

  input.editing {
    border: var(--border-thin) solid var(--border-action);
    border-radius: 16px;
    padding: 8px;
    background: var(--white);
  }

  .editable:focus-visible {
    outline: var(--border-med) solid var(--border-action);
    outline-offset: var(--border-extrathin);
  }
</style>
