<script setup>
  import { ref, useTemplateRef } from "vue";
  import { IconSearch } from "@tabler/icons-vue";

  const props = defineProps({
    withButtons: { type: Boolean, default: false },
    buttonsDisabled: { type: Boolean, default: true },
  });
  const emit = defineEmits(["submit", "cancel", "next", "prev"]);
  const searchText = ref("");
  const inputRef = useTemplateRef("inputRef");
  const isSearching = ref(false);

  const onEscape = () => {
    if (isSearching.value) {
      isSearching.value = false;
      searchText.value = "";
      emit("cancel");
    } else {
      inputRef.value?.blur();
    }
  };

  const onEnter = (ev) => {
    if (!isSearching.value) {
      isSearching.value = true;
      emit("submit", searchText.value);
      return;
    }

    if (!ev.shiftKey) emit("next", searchText.value);
    else emit("prev", searchText.value);
  };

  const focusInput = () => inputRef.value?.focus();
  defineExpose({ focusInput });
</script>

<template>
  <div class="s-wrapper text-caption" @click.stop="focusInput">
    <IconSearch />
    <input
      ref="inputRef"
      v-model="searchText"
      type="text"
      placeholder="Search..."
      @keyup.enter="onEnter"
      @keyup.escape="onEscape"
      @click.stop
      @dblclick.stop
    />
    <div v-if="withButtons" class="buttons">
      <Button
        kind="tertiary"
        icon="ChevronDown"
        :disabled="buttonsDisabled"
        @click.stop="emit('next')"
      />
      <Button
        kind="tertiary"
        icon="ChevronUp"
        :disabled="buttonsDisabled"
        @click.stop="emit('prev')"
      />
    </div>
  </div>
</template>

<style scoped>
  .s-wrapper {
    color: var(--extra-dark);
    background-color: transparent;
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    height: 48px;
    min-width: 280px;
    display: flex;
    align-items: center;
    padding-inline: 12px;
    gap: 16px;
    transition: var(--transition-bg-color), var(--transition-bd-color);

    &:has(> input:focus) {
      background-color: var(--surface-primary);
      border-color: var(--border-action);
      box-shadow: var(--shadow-strong);
    }

    & > .tabler-icon {
      flex-shrink: 0;
    }

    & > input {
      background-color: transparent;
      border: none;
      padding: 0;
      margin: 0;
      font: inherit;
      color: inherit;
      outline: none;
      width: 100%;
      height: 100%;
    }

    &:hover {
      cursor: text;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;

    :deep(& > button) {
      padding: 0 !important;
      height: fit-content;
    }
  }
</style>
