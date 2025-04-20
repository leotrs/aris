<script setup>
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    kind: { type: String, default: "primary" },
    icon: { type: String, default: null },
    text: { type: String, default: "" },
    size: { type: String, default: "md" },
    disabled: { type: Boolean, default: false },
  });
</script>

<template>
  <button class="text-h6" :class="[kind, disabled ? 'disabled' : '']">
    <template v-if="icon">
      <component :is="Icons['Icon' + icon]" class="btn-icon" :class="`btn-${size}`" />
    </template>
    <span v-if="text" class="btn-text">{{ text }}</span>
    <slot v-if="!icon && !text"></slot>
  </button>
</template>

<style scoped>
  button {
    display: flex;
    align-items: center;
    border: unset;
    border-radius: 16px;
    transition: background 0.15s ease-in-out;
    gap: 2px;
    padding-block: 6px;

    &:hover {
      cursor: pointer;
    }
  }

  button.btn-sm {
    border-radius: 8px;
    padding-block: 0px;

    &:has(.btn-icon):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
      padding: 0px;
    }

    &:not(:has(.btn-icon)):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }
  }

  button.btn-md {
    border-radius: 16px;
    padding-inline: 16px;
    padding-block: 6px;

    &:has(.btn-icon):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
      padding: 0px;
    }

    &:not(:has(.btn-icon)):has(.btn-text) {
    }
  }

  button.btn-lg {
    padding-inline: 24px;
    padding-block: 24px;
    border-radius: 24px;

    &:has(.btn-icon):has(.btn-text) {
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
    }

    &:not(:has(.btn-icon)):has(.btn-text) {
    }
  }

  button.primary {
    background-color: var(--surface-action);
    color: var(--primary-50);

    &:hover {
      background-color: var(--surface-action-hover);
    }

    & .btn-icon {
      color: var(--primary-50);
    }
  }

  button.secondary {
    background-color: var(--surface-primary);
    color: var(--primary-600);
    border: var(--border-thin) solid var(--border-action-hover);

    &:hover {
      color: var(--text-action-hover);
      background-color: var(--surface-information);
      border-color: var(--border-action-hover);
    }

    & .btn-icon {
      color: var(--icon-action);
    }
  }

  button.tertiary {
    background-color: transparent;
    color: var(--extra-dark);

    &:hover {
      background-color: var(--surface-hint);
      color: var(--almost-black);

      & > svg {
        color: var(--almost-black);
      }
    }
  }

  button.tertiary.disabled {
    color: var(--medium);

    & > svg {
      color: var(--medium);
    }

    &:hover {
      background-color: unset;
      cursor: unset;

      & > svg {
        color: var(--medium);
      }
    }
  }
</style>
