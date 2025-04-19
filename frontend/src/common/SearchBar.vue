<script setup>
import { ref, inject, useTemplateRef } from "vue";
import { IconSearch } from "@tabler/icons-vue";

const props = defineProps({ buttons: { type: Boolean, default: false } });
const emit = defineEmits(["submit"]);
const searchText = ref("");
const inputRef = useTemplateRef("inputRef");

const handleEscape = () => {
  if (searchText.value) {
    searchText.value = "";
    emit('submit', "");
  } else {
    inputRef.value?.blur();
  }
};

defineExpose({ focusInput: () => inputRef.value?.focus() });
</script>

<template>
  <div class="s-wrapper text-caption">
    <IconSearch />
    <input type="text" placeholder="Search..." ref="inputRef" v-model="searchText"
      @keyup.enter="emit('submit', searchText)" @keyup.escape="handleEscape" @click.stop @dblclick.stop />
    <div class="buttons" v-if="buttons">
      <Button kind="tertiary" icon="ChevronDown" />
      <Button kind="tertiary" icon="ChevronUp" />
    </div>
  </div>
</template>

<style scoped>
.s-wrapper {
  color: var(--extra-dark);
  background-color: var(--surface-primary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  height: 48px;
  min-width: 280px;
  display: flex;
  align-items: center;
  padding-block: 12px;
  padding-inline: 16px;
  gap: 16px;

  &:has(> input:focus) {
    border-color: var(--border-action);
  }

  &>.tabler-icon {
    flex-shrink: 0;
  }

  &>input {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    outline: none;
    width: 100%;
  }

  &:hover {
    cursor: text;
  }
}

.buttons {
  display: flex;
  flex-direction: row;

  :deep(&>button) {
    padding: 0 !important;
    height: fit-content;
  }
}
</style>
