<script setup>
  import { ref, useTemplateRef } from "vue";
  import { IconSearch } from "@tabler/icons-vue";

  const props = defineProps({
    withButtons: { type: Boolean, default: false },
    buttonsDisabled: { type: Boolean, default: true },
  });
  const emit = defineEmits(["submit", "next", "prev"]);
  const searchText = ref("");
  const inputRef = useTemplateRef("inputRef");

  const onEscape = () => {
    if (searchText.value) {
      searchText.value = "";
      emit("submit", "");
    } else {
      inputRef.value?.blur();
    }
  };

  const lastSubmission = ref("");
  const onEnter = (ev) => {
    if (searchText.value !== lastSubmission.value) {
      emit("submit", searchText.value);
      lastSubmission.value = searchText.value;
      return;
    }

    if (!ev.shiftKey) emit("next", searchText.value);
    else emit("prev", searchText.value);
  };

  defineExpose({ focusInput: () => inputRef.value?.focus() });
</script>

<template>
  <div class="s-wrapper text-caption">
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
    background-color: var(--surface-primary);
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    height: 48px;
    min-width: 280px;
    display: flex;
    align-items: center;
    padding-block: 12px;
    padding-inline: 12px;
    gap: 16px;

    &:has(> input:focus) {
      border-color: var(--border-action);
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
