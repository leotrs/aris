<script setup>
  import { ref, useTemplateRef } from "vue";
  import { IconSearch } from "@tabler/icons-vue";

  const props = defineProps({
    withButtons: { type: Boolean, default: false },
    placeholder: { type: String, default: "Search..." },
    hintText: { type: String, default: "" },
    showIcon: { type: Boolean, default: true },
    buttonClose: { type: Boolean, default: false },
    buttonsDisabled: { type: Boolean, default: false },
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
    <IconSearch v-if="showIcon" />

    <input
      ref="inputRef"
      v-model="searchText"
      type="text"
      :placeholder="placeholder"
      @keyup.enter.stop="onEnter"
      @keyup.escape="onEscape"
      @click.stop
      @dblclick.stop
    />

    <div v-if="withButtons" class="match-buttons">
      <Button
        kind="tertiary"
        icon="ChevronLeft"
        size="sm"
        :disabled="buttonsDisabled"
        @click.stop="emit('prev')"
      />
      <div v-if="hintText" class="hint">
        <span class="text-caption">{{ hintText }}</span>
        <Icon name="ArrowsHorizontal" />
      </div>
      <Button
        kind="tertiary"
        icon="ChevronRight"
        size="sm"
        :disabled="buttonsDisabled"
        @click.stop="emit('next')"
      />
    </div>

    <div v-if="$slots.buttons" class="buttons">
      <slot name="buttons" />
    </div>

    <ButtonClose v-if="buttonClose" />
  </div>
</template>

<style scoped>
  .s-wrapper {
    color: var(--extra-dark);
    background-color: var(--surface-page);
    border: 2px solid var(--border-primary);
    border-radius: 16px;
    height: 48px;
    min-width: 184px;
    display: flex;
    align-items: center;
    padding-inline: 12px 8px;
    gap: 16px;
    transition: var(--transition-bg-color), var(--transition-bd-color);

    &:has(> input:focus) {
      border-color: var(--border-action);
      box-shadow: var(--shadow-strong);
    }

    & > .tabler-icon {
      flex-shrink: 0;
    }

    & > input {
      flex: 1;
      background-color: var(--surface-page);
      border: none;
      padding-inline: 16px;
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

  .tabler-icon {
    height: 100%;
  }

  .hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    font-weight: var(--weight-medium);
    color: var(--blue-900);
    text-align: center;
  }

  .match-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;

    & svg {
      margin-inline: 0;
    }
  }

  .extra-buttons {
    & :deep(svg) {
      color: var(--dark);
    }
    /* & :deep(> button) {
       padding: 0 !important;
       height: fit-content;
       } */
  }
</style>
