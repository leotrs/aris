<script setup>
  import { ref, nextTick, useTemplateRef } from "vue";
  import { useKeyboardShortcuts } from "../composables/useKeyboardShortcuts.js";
  const props = defineProps({
    inputClass: { type: [String, Object, Array], default: "" },
    textClass: { type: [String, Object, Array], default: "" },
    editOnClick: { type: Boolean, default: true },
    clearOnStart: { type: Boolean, default: false },
  });
  const text = defineModel({ type: String, default: "" });
  const emit = defineEmits(["save", "cancel"]);
  const isEditing = ref(false);
  const inputRef = useTemplateRef("inputRef");
  const textRef = useTemplateRef("textRef");
  const inputValue = ref("");
  const capturedWidth = ref(0);
  const startEditing = async () => {
    inputValue.value = props.clearOnStart ? "" : text.value;

    // Calculate width based on text content
    if (textRef.value) {
      const computedStyle = window.getComputedStyle(textRef.value);
      capturedWidth.value = Math.max(textRef.value.scrollWidth, textRef.value.offsetWidth);
      console.log("Text scrollWidth:", textRef.value.scrollWidth);
      console.log("Text offsetWidth:", textRef.value.offsetWidth);
      console.log("Using width:", capturedWidth.value);
    }

    isEditing.value = true;
    await nextTick();
    if (!inputRef.value) return;
    inputRef.value.focus();
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
  const saveChanges = async () => {
    if (!isEditing.value) return;
    if (text.value == inputValue.value) {
      isEditing.value = false;
      return;
    }
    text.value = inputValue.value;
    await nextTick();
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
  <span class="editable-text">
    <div
      v-if="!isEditing"
      ref="textRef"
      type="button"
      class="editable"
      :class="textClass"
      role="button"
      tabindex="0"
      @click="() => editOnClick && startEditing()"
      @keydown.enter.prevent="startEditing()"
      @keydown.space.prevent="startEditing()"
    >
      {{ text }}
    </div>
    <input
      v-else
      ref="inputRef"
      v-model="inputValue"
      :class="[inputClass, isEditing ? 'editing' : '']"
      :style="{ width: capturedWidth + 'px' }"
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
    min-width: 50px;
  }
  input.editing {
    border: var(--border-thin) solid var(--border-action);
    border-radius: 16px;
    padding: 8px;
    background: var(--white);
  }
  .editable {
    text-align: left;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 56px;
    line-height: 20px;
    white-space: normal;
  }
  .editable:focus-visible {
    outline: var(--border-med) solid var(--border-action);
    outline-offset: var(--border-extrathin);
  }
</style>
