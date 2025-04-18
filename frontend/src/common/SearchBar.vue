<script setup>
import { ref, inject, useTemplateRef } from "vue";
import { IconSearch } from "@tabler/icons-vue";

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
</script>

<template>
  <div class="s-wrapper text-caption">
    <IconSearch />
    <input type="text" placeholder="Search..." ref="inputRef" v-model="searchText"
      @keyup.enter="emit('submit', searchText)" @keyup.escape="handleEscape" @click.stop @dblclick.stop />
  </div>
</template>

<style scoped>
.s-wrapper {
  color: var(--extra-dark);
  background-color: var(--surface-primary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  height: 48px;
  min-width: 280;
  display: flex;
  align-items: center;
  padding-block: 12px;
  padding-inline: 16px;
  gap: 16px;

  &:has(> input:focus) {
    border-color: var(--border-action);
  }

  &>.tabler-icon {
    margin: unset;
  }

  &>input {
    background: transparent;
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
</style>
