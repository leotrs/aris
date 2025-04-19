<script setup>
  import { ref, watch, nextTick, useTemplateRef } from "vue";

  const props = defineProps({
    inputClass: {
      type: [String, Object, Array],
      default: "",
    },
    textClass: {
      type: [String, Object, Array],
      default: "",
    },
    editOnClick: { type: Boolean, default: true },
  });
  const emit = defineEmits(["save", "cancel"]);
  const inputValue = defineModel({ type: String, default: "" });

  const text = ref(inputValue);
  const isEditing = ref(false);
  const inputRef = useTemplateRef("inputRef");

  watch(inputValue, (newValue) => (text.value = newValue));

  const startEditing = () => {
    console.log("starting");
    inputValue.value = text.value;
    isEditing.value = true;
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
        const length = inputRef.value.value.length;
        inputRef.value.setSelectionRange(length, length);
      }
    });
  };

  const cancelEditing = () => {
    isEditing.value = false;
    inputValue.value = text.value;
    emit("cancel");
  };

  const saveChanges = () => {
    text.value = inputValue.value;
    isEditing.value = false;
    emit("save", text.value);
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      cancelEditing();
      event.preventDefault();
    } else if (event.key === "Enter") {
      saveChanges();
      event.preventDefault();
    }
  };

  defineExpose({ startEditing, cancelEditing });
</script>

<template>
  <span>
    <span
      v-if="!isEditing"
      class="editable"
      :class="textClass"
      @click="() => editOnClick && startEditing()"
    >
      {{ text }}
    </span>
    <input
      v-else
      ref="inputRef"
      v-model="inputValue"
      :class="inputClass"
      @keydown="handleKeydown"
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
</style>
